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
    if (project.mode !== undefined) assert.ok(['case-study','visual-story'].includes(project.mode), `${project.id}: editorial mode`);
    assert.ok(['featured','archive','unlisted'].includes(project.classification), `${project.id}: classification`);
    assert.ok(['draft','ready','published'].includes(project.status), `${project.id}: status`);
    assert.equal(typeof project.routeEnabled, 'boolean', `${project.id}: explicit route decision`);
    assert.ok(Array.isArray(project.disciplines), `${project.id}: disciplines array`);
    assert.ok(Array.isArray(project.blocks), `${project.id}: blocks array`);
    if (project.externalUrl) assert.match(project.externalUrl, /^https:\/\//, `${project.id}: external URL`);
    if (project.routeEnabled) assert.ok(project.blocks.length > 0, `${project.id}: enabled local route needs content`);
    if (project.headerTop !== undefined) assert.ok(Number.isFinite(project.headerTop) && project.headerTop >= 0 && project.headerTop <= 700, `${project.id}: header content offset`);
    if (project.editorialTop !== undefined) assert.ok(Number.isFinite(project.editorialTop) && project.editorialTop >= 0, `${project.id}: editorial spacing`);
    if (project.headerHeight !== undefined) assert.ok(Number.isFinite(project.headerHeight) && project.headerHeight > 0, `${project.id}: header height`);
    if (project.headerTitleScale !== undefined) assert.equal(project.headerTitleScale, 'large', `${project.id}: header title scale`);
    if (project.headerOpacity !== undefined) assert.ok(Number.isFinite(project.headerOpacity) && project.headerOpacity >= 0 && project.headerOpacity <= 1, `${project.id}: header opacity`);
    if (project.headerMonochrome !== undefined) assert.equal(typeof project.headerMonochrome, 'boolean', `${project.id}: header monochrome setting`);
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
  const types = ['text','heading','media','gallery','formula','quote','credits','palette'];
  for (const project of projects) {
    for (const field of ['heroMediaId','headerMediaId','logoMediaId']) if (project[field]) checkMediaReference(project[field], `${project.id}.${field}`);
    const blockIds = new Set();
    for (const [index, block] of project.blocks.entries()) {
      const owner = `${project.id}: block ${index}`;
      assert.ok(types.includes(block.type), `${owner}: unknown block ${block.type}`);
      if (block.id) {assert.ok(!blockIds.has(block.id), `${owner}: duplicate block anchor`); blockIds.add(block.id);}
      if (block.spaceBefore !== undefined) assert.ok(Number.isFinite(block.spaceBefore) && block.spaceBefore >= 0, `${owner}: authored spacing`);
      if (block.type === 'media') {
        checkMediaReference(block.mediaId, owner);
        if (block.width) assert.ok(['full','narrow'].includes(block.width), `${owner}: media width`);
        assert.ok(!(block.fullBleed && block.width === 'narrow'), `${owner}: narrow and full-bleed treatments conflict`);
      }
      if (block.type === 'gallery') {
        assert.ok(block.items?.length > 0, `${owner}: empty gallery`);
        if (block.columns !== undefined) {
          assert.ok(Array.isArray(block.columns) && block.columns.length > 0 && block.columns.length <= 12, `${owner}: authored gallery columns`);
          assert.ok(block.columns.every(value => Number.isFinite(value) && value > 0), `${owner}: positive gallery column proportions`);
          assert.ok(block.columns.length <= block.items.length, `${owner}: gallery has empty authored columns`);
        }
        if (block.columnGap !== undefined) assert.ok(Number.isFinite(block.columnGap) && block.columnGap >= 0, `${owner}: gallery column gap`);
        if (block.maxWidth !== undefined) assert.ok(Number.isFinite(block.maxWidth) && block.maxWidth > 0, `${owner}: gallery maximum width`);
        for (const item of block.items) {
          checkMediaReference(typeof item === 'string' ? item : item.mediaId, owner);
          if (typeof item !== 'string' && item.span !== undefined) assert.ok(Number.isInteger(item.span) && item.span >= 1 && item.span <= 12, `${owner}: grid span`);
        }
      }
      if (block.type === 'palette') {
        assert.ok(typeof block.label === 'string' && block.label.trim(), `${owner}: accessible palette label`);
        assert.ok(Array.isArray(block.colors) && block.colors.length > 0, `${owner}: palette colours`);
        if (block.columns !== undefined) assert.ok(Number.isInteger(block.columns) && block.columns >= 1 && block.columns <= 12 && block.columns <= block.colors.length, `${owner}: palette columns`);
        for (const color of block.colors) {
          assert.match(color.value, /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i, `${owner}: valid hexadecimal colour`);
          assert.ok(typeof color.name === 'string' && color.name.trim(), `${owner}: accessible colour name`);
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

function editorialCopy(project) {
  const text = [project.title, project.category, project.intro, project.description, project.approach,
    ...(project.metadata ?? []).flatMap(item => [item.label, item.value])];
  const referencedMedia = new Set();
  for (const block of project.blocks) {
    text.push(block.label, block.title, block.eyebrow, block.caption, block.quote, block.attribution);
    text.push(...(Array.isArray(block.body) ? block.body : [block.body]));
    if (block.mediaId) referencedMedia.add(block.mediaId);
    for (const item of block.items ?? []) {
      if (typeof item === 'string') referencedMedia.add(item);
      else {if (item.mediaId) referencedMedia.add(item.mediaId); text.push(item.caption);}
    }
    for (const term of block.terms ?? []) {referencedMedia.add(term.mediaId); text.push(term.label);}
  }
  for (const item of media) if (referencedMedia.has(item.id)) text.push(item.alt, item.caption, item.credit);
  return text.filter(value => typeof value === 'string').join('\n');
}

test('Milestone 09 projects have discoverable local routes and retain truthful editorial distinctions', () => {
  const expected = new Map([
    ['cozy', 'case-study'], ['superbalist', 'case-study'], ['adidas', 'visual-story'],
    ['sneaker-lab', 'visual-story'], ['golds-gym', 'visual-story'],
  ]);
  const records = new Map();
  for (const [id, mode] of expected) {
    const project = projects.find(item => item.id === id);
    assert.ok(project, `${id}: missing Milestone 09 project`);
    assert.equal(project.routeEnabled, true, `${id}: project route must be enabled`);
    assert.ok(['featured','archive'].includes(project.classification), `${id}: project must appear in Work`);
    assert.equal(project.mode, mode, `${id}: expected editorial mode`);
    assert.ok(project.heroMediaId, `${id}: Work thumbnail is required`);
    records.set(id, project);
  }
  for (const id of ['cozy','adidas']) {
    assert.doesNotMatch(editorialCopy(records.get(id)), /\b(?:Superbalist|Stitch|UX)\b|\bsix\s+years\b/i, `${id}: unrelated Superbalist placeholder copy`);
  }
  const sneaker = editorialCopy(records.get('sneaker-lab'));
  assert.match(sneaker, /\bpitch\b/i, 'Sneaker LAB: pitch status must remain explicit');
  assert.match(sneaker, /thinking unity/i, 'Sneaker LAB: supplied concept narrative');
  const superbalistLabels = records.get('superbalist').blocks.flatMap(block => [
    block.caption, block.mediaId && media.find(item => item.id === block.mediaId)?.caption,
  ]).filter(Boolean).join('\n');
  assert.match(superbalistLabels, /\b(?:historical|archive)\b/i, 'Superbalist: archive artwork needs a provenance caption');
  assert.match(superbalistLabels, /\bcontemporary\b/i, 'Superbalist: reconstructed artwork needs a contemporary caption');
  assert.match(editorialCopy(records.get('golds-gym')), /\bAI[\s-]*assisted\b|\bgenerative\b/i, 'Gold’s Gym: AI-assisted image-making must remain explicit');
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
