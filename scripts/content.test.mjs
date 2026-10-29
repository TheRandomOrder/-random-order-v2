import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const projects = JSON.parse(fs.readFileSync(path.join(root, 'src/data/content/projects.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(root, 'src/data/content/media.json'), 'utf8'));
const mediaIds = new Set(media.map(item => item.id));
const projectIds = new Set(projects.map(item => item.id));

function localAssetExists(src, owner) {
  assert.equal(typeof src, 'string', `${owner}: source must be a string`);
  if (/^https:\/\//.test(src)) return;
  assert.ok(src.startsWith('/'), `${owner}: expected a public asset path or https URL`);
  const publicRoot = path.join(root, 'public');
  const resolved = path.resolve(publicRoot, decodeURIComponent(src.split(/[?#]/)[0]).replace(/^\//, ''));
  assert.ok(resolved.startsWith(publicRoot + path.sep), `${owner}: public path escapes its directory`);
  assert.ok(fs.existsSync(resolved), `${owner}: missing ${src}`);
  assert.ok(fs.statSync(resolved).size > 0, `${owner}: empty ${src}`);
}

function checkMediaReference(id, owner) {
  assert.ok(mediaIds.has(id), `${owner}: unknown media ID ${id}`);
}

test('canonical records have stable, unique identities and valid route configuration', () => {
  assert.equal(projectIds.size, projects.length, 'duplicate project IDs');
  assert.equal(mediaIds.size, media.length, 'duplicate media IDs');
  const slugs = new Set();
  for (const project of projects) {
    assert.match(project.id, /^[a-z0-9][a-z0-9-]*$/, 'project ID');
    assert.match(project.slug, /^[a-z0-9][a-z0-9-]*$/, `${project.id}: slug`);
    assert.ok(!slugs.has(project.slug), `${project.id}: duplicate slug`); slugs.add(project.slug);
    assert.ok(project.title?.trim(), `${project.id}: title`);
    assert.ok(['narrative','gallery','extended','archive'].includes(project.presentation), `${project.id}: presentation`);
    assert.ok(['featured','archive','unlisted'].includes(project.classification), `${project.id}: classification`);
    assert.ok(['draft','ready','published'].includes(project.status), `${project.id}: status`);
    assert.equal(typeof project.routeEnabled, 'boolean', `${project.id}: explicit route decision`);
    assert.ok(Array.isArray(project.disciplines), `${project.id}: disciplines array`);
    assert.ok(Array.isArray(project.blocks), `${project.id}: blocks array`);
    if (project.externalUrl) assert.match(project.externalUrl, /^https:\/\//, `${project.id}: external URL`);
    if (project.routeEnabled) assert.ok(project.blocks.length > 0, `${project.id}: enabled local route needs content`);
  }
});

test('media has intrinsic dimensions, existing files, valid variants and video posters', () => {
  for (const item of media) {
    assert.match(item.id, /^[a-z0-9][a-z0-9-]*$/, 'media ID');
    assert.ok(['image','video'].includes(item.type), `${item.id}: type`);
    assert.ok(Number.isFinite(item.width) && item.width > 0, `${item.id}: width`);
    assert.ok(Number.isFinite(item.height) && item.height > 0, `${item.id}: height`);
    assert.ok(typeof item.alt === 'string' && item.alt.trim(), `${item.id}: useful alternative text`);
    localAssetExists(item.src, item.id);
    if (item.type === 'video') localAssetExists(item.poster, `${item.id}: poster`);
    if (item.fit) assert.ok(['cover','contain'].includes(item.fit), `${item.id}: fit`);
    if (item.motion?.autoplay) assert.ok(['viewport','manual'].includes(item.motion.autoplay), `${item.id}: playback policy`);
    const widths = new Set();
    for (const variant of item.variants ?? []) {
      assert.ok(Number.isFinite(variant.width) && variant.width > 0 && variant.width < item.width, `${item.id}: responsive variant width`);
      assert.ok(!widths.has(variant.width), `${item.id}: duplicate variant width`); widths.add(variant.width);
      localAssetExists(variant.src, `${item.id}: variant`);
    }
  }
});

test('editorial order references real media and known block types', () => {
  const types = ['text','heading','media','gallery','formula','quote','credits'];
  for (const project of projects) {
    for (const field of ['heroMediaId','headerMediaId','logoMediaId']) if (project[field]) checkMediaReference(project[field], `${project.id}.${field}`);
    const blockIds = new Set();
    for (const [index, block] of project.blocks.entries()) {
      const owner = `${project.id}: block ${index}`;
      assert.ok(types.includes(block.type), `${owner}: unknown block ${block.type}`);
      if (block.id) {assert.ok(!blockIds.has(block.id), `${owner}: duplicate block anchor`); blockIds.add(block.id);}
      if (block.type === 'media') {
        checkMediaReference(block.mediaId, owner);
        if (block.width) assert.ok(['full','narrow'].includes(block.width), `${owner}: media width`);
        assert.ok(!(block.fullBleed && block.width === 'narrow'), `${owner}: narrow and full-bleed treatments conflict`);
      }
      if (block.type === 'gallery') {
        assert.ok(block.items?.length > 0, `${owner}: empty gallery`);
        for (const item of block.items) {
          checkMediaReference(typeof item === 'string' ? item : item.mediaId, owner);
          if (typeof item !== 'string' && item.span !== undefined) assert.ok(Number.isInteger(item.span) && item.span >= 1 && item.span <= 12, `${owner}: grid span`);
        }
      }
      if (block.type === 'formula') {
        assert.ok(block.terms?.length > 0, `${owner}: empty formula`);
        for (const term of block.terms) {checkMediaReference(term.mediaId, owner); assert.ok(term.label?.trim(), `${owner}: term label`);}
      }
      if (block.type === 'text') assert.ok((Array.isArray(block.body) ? block.body : [block.body]).every(text => typeof text === 'string' && text.trim()), `${owner}: text content`);
      if (block.type === 'heading') {
        assert.ok(block.title?.trim(), `${owner}: heading`);
        if (block.divider) localAssetExists(block.divider, `${owner}: divider`);
      }
      if (block.type === 'quote') assert.ok(block.quote?.trim(), `${owner}: quote`);
    }
  }
});

test('related projects resolve without self-links or repeated recommendations', () => {
  for (const project of projects) {
    const ids = project.relatedIds ?? [];
    assert.equal(new Set(ids).size, ids.length, `${project.id}: duplicate related project`);
    for (const id of ids) {
      assert.ok(projectIds.has(id), `${project.id}: unknown related project ${id}`);
      assert.notEqual(id, project.id, `${project.id}: self recommendation`);
    }
  }
});

test('declared raster dimensions match the actual image files and responsive variants', async () => {
  for (const item of media.filter(asset => asset.type === 'image' && asset.src.startsWith('/'))) {
    const intrinsic = await sharp(path.join(root, 'public', item.src)).metadata();
    assert.equal(intrinsic.width, item.width, `${item.id}: intrinsic width`);
    assert.equal(intrinsic.height, item.height, `${item.id}: intrinsic height`);
    for (const variant of item.variants ?? []) {
      if (!variant.src.startsWith('/')) continue;
      const actual = await sharp(path.join(root, 'public', variant.src)).metadata();
      assert.equal(actual.width, variant.width, `${item.id}: responsive width`);
      assert.ok(Math.abs((actual.height / actual.width) - (item.height / item.width)) < 0.005, `${item.id}: responsive variant changes the source proportions`);
    }
  }
});
