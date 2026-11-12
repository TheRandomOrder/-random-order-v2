import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse,parseFragment} from 'parse5';
const records=JSON.parse(fs.readFileSync(new URL('../src/data/content/projects.json',import.meta.url),'utf8'));
const media=JSON.parse(fs.readFileSync(new URL('../src/data/content/media.json',import.meta.url),'utf8'));
const plans=JSON.parse(fs.readFileSync(new URL('../docs/migration/asset-plan.json',import.meta.url),'utf8'));
const attr=(n,k)=>(n.attrs??[]).find(a=>a.name===k)?.value;
const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,p))];
const has=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
const text=n=>(n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join(' ')).replace(/\s+/g,' ').trim();
for(const record of records.filter(r=>r.legacyLayout))test(`${record.id}: preserves published image order, gallery structure and editorial copy`,()=>{
 const source=parse(fs.readFileSync(new URL(`../docs/migration/source/${record.id}.html`,import.meta.url),'utf8'));
 const original=all(source,n=>has(n,'case-full'))[0];
 const migrated=parseFragment(fs.readFileSync(new URL(`../src/components/project/legacy/${record.id}.html`,import.meta.url),'utf8'));
 const sourceImages=all(original,n=>n.tagName==='img');
 const localImages=all(migrated,n=>n.tagName==='img');
 assert.equal(localImages.length,sourceImages.length);
 sourceImages.forEach((image,i)=>{
  const url=new URL(attr(image,'src'),`https://therandomorder.com/work/${record.id}`).href;
  const plan=plans.find(p=>p.slug===record.id&&p.url===url);
  assert.ok(plan,`unmapped original ${url}`);
  assert.equal(attr(localImages[i],'src'),media.find(m=>m.id===plan.id)?.src);
 });
 for(const group of ['case-gallery','case-rationale','case-logo-grid','case-illustrations']){
  assert.deepEqual(all(migrated,n=>has(n,group)).map(n=>attr(n,'class')),all(original,n=>has(n,group)).map(n=>attr(n,'class')));
 }
 const copy=n=>all(n,x=>['p','h2','h3','h4','figcaption'].includes(x.tagName)).map(text);
 assert.deepEqual(copy(migrated),copy(original));
 assert.equal(all(migrated,n=>['script','iframe','object','embed'].includes(n.tagName)).length,0);
 assert.equal(all(migrated,n=>(n.attrs??[]).some(a=>a.name.startsWith('on'))).length,0);
 for(const video of all(migrated,n=>n.tagName==='video')){
  assert.equal(attr(video,'autoplay'),undefined);
  assert.notEqual(attr(video,'controls'),undefined);
 }
});
