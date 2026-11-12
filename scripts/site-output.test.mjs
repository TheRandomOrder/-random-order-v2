import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Run after `npm run build`. Absolute website URLs deliberately remain external:
// some project records link to the published site rather than a local route.
const output = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://random-order-output.test';

function filesUnder(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : [file];
  });
}

function decodeEntities(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
    const name = entity.slice(1, -1).toLowerCase();
    const named = {amp:'&', quot:'"', apos:"'", lt:'<', gt:'>'};
    if (name in named) return named[name];
    return String.fromCodePoint(name.startsWith('#x') ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10));
  });
}

function attributes(source) {
  const result = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  return result;
}

function parseDocument(file) {
  const relative = path.relative(output, file).split(path.sep).join('/');
  const route = relative === 'index.html' ? '/' : relative.endsWith('/index.html') ? `/${relative.slice(0, -10)}` : `/${relative}`;
  const html = fs.readFileSync(file, 'utf8');
  const source = html.replace(/<!--[\s\S]*?-->/g, '').replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, '$1</script>').replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
  const tags = [...source.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'"<>])*)>/gi)].map(match => ({tag:match[1].toLowerCase(), attrs:attributes(match[2])}));
  const ids = tags.flatMap(({tag, attrs}) => attrs.id ? [attrs.id] : tag === 'a' && attrs.name ? [attrs.name] : []);
  return {file, relative, route, html, tags, ids:new Set(ids), duplicateIds:ids.filter((id, index) => ids.indexOf(id) !== index)};
}

const outputFiles = filesUnder(output);
const documents = outputFiles.filter(file => file.endsWith('.html')).map(parseDocument);
const documentsByFile = new Map(documents.map(document => [document.file, document]));

function localURL(value, route) {
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return undefined;
  return new URL(value, `${origin}${route}`);
}

function fileFor(url) {
  const pathname = decodeURIComponent(url.pathname);
  const relative = pathname.replace(/^\//, '');
  return path.resolve(output, pathname.endsWith('/') ? `${relative}index.html` : relative);
}

function pageFileFor(url) {
  if (!path.posix.extname(url.pathname) && !url.pathname.endsWith('/')) {
    return path.resolve(output, decodeURIComponent(url.pathname).replace(/^\//, ''), 'index.html');
  }
  return fileFor(url);
}

function existingFile(file) {
  return file.startsWith(output) && fs.existsSync(file) && fs.statSync(file).isFile() && fs.statSync(file).size > 0;
}

test('built pages exist and canonical URLs match their slash-terminated routes', () => {
  assert.ok(documents.length > 0, 'No built HTML found. Run npm run build before this test.');
  const failures = [];
  for (const document of documents) {
    const canonical = document.tags.find(({tag, attrs}) => tag === 'link' && attrs.rel === 'canonical')?.attrs.href;
    if (!canonical) {failures.push(`${document.relative}: missing canonical`); continue;}
    const actual = new URL(canonical).pathname;
    if (document.relative === '404.html') {
      const robots = document.tags.find(({tag, attrs}) => tag === 'meta' && attrs.name === 'robots')?.attrs.content ?? '';
      if (!robots.includes('noindex')) failures.push('404.html: fallback page must remain noindex');
    } else if (actual !== document.route) failures.push(`${document.relative}: canonical ${actual} differs from route ${document.route}`);
    if (document.duplicateIds.length) failures.push(`${document.relative}: duplicate fragment IDs ${[...new Set(document.duplicateIds)].join(', ')}`);
  }
  assert.deepEqual(failures, []);
});

test('internal navigation resolves to built routes and existing document fragments', () => {
  const failures = [];
  for (const document of documents) {
    for (const {tag, attrs} of document.tags.filter(item => ['a','area'].includes(item.tag))) {
      const url = localURL(attrs.href, document.route);
      if (!url) continue;
      const page = !path.posix.extname(url.pathname) || url.pathname.endsWith('.html');
      if (page && !url.pathname.endsWith('/') && !url.pathname.endsWith('.html')) failures.push(`${document.relative}: ${attrs.href} needs a trailing slash`);
      const targetFile = page ? pageFileFor(url) : fileFor(url);
      if (!existingFile(targetFile)) {failures.push(`${document.relative}: missing ${tag} target ${attrs.href}`); continue;}
      if (page && url.hash && url.hash !== '#') {
        const id = decodeURIComponent(url.hash.slice(1));
        const target = documentsByFile.get(targetFile);
        if (!target?.ids.has(id)) failures.push(`${document.relative}: fragment ${attrs.href} does not exist`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('rendered media, lazy video sources, responsive candidates and linked assets exist', () => {
  const failures = [];
  function check(value, document, context) {
    const url = localURL(value, document.route);
    if (!url) return;
    if (!existingFile(fileFor(url))) failures.push(`${document.relative}: missing ${context} ${value}`);
  }
  for (const document of documents) {
    for (const {tag, attrs} of document.tags) {
      for (const attribute of ['src','poster','data-src']) if (attrs[attribute]) check(attrs[attribute], document, `${tag}[${attribute}]`);
      if (attrs.srcset && !attrs.srcset.trim().startsWith('data:')) {
        for (const candidate of attrs.srcset.split(',')) {
          const source = candidate.trim().split(/\s+/)[0];
          if (source) check(source, document, `${tag}[srcset]`);
        }
      }
      if (tag === 'link' && /^(?:stylesheet|icon|preload|modulepreload)$/.test(attrs.rel ?? '') && attrs.href) check(attrs.href, document, `link[${attrs.rel}]`);
    }
  }
  for (const file of outputFiles.filter(file => file.endsWith('.css'))) {
    const relative = path.relative(output, file).split(path.sep).join('/');
    const document = {route:`/${relative}`, relative};
    for (const match of fs.readFileSync(file, 'utf8').matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/g)) {
      const source = match[1] ?? match[2] ?? match[3];
      if (source && !source.startsWith('#')) check(source, document, 'CSS url');
    }
  }
  assert.deepEqual(failures, []);
});
