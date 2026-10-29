import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/scripts/media.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
function setup(reduce=false){
 const events={},attrs={};
 const video={paused:true,currentTime:0,src:'',muted:false,dataset:{src:'/film.mp4'},plays:0,addEventListener:(k,f)=>{events[k]=f;},toggleAttribute:(k,v)=>{attrs[k]=v;},removeAttribute:k=>delete attrs[k],play(){this.plays++;this.paused=false;this.currentTime=1;events.play?.();return Promise.resolve();},pause(){this.paused=true;events.pause?.();}};
 const button={hidden:true,textContent:'',getAttribute:()=> 'Play test film',setAttribute:(k,v)=>{attrs[k]=v;},addEventListener:(k,f)=>{events['button-'+k]=f;}};
 const container={querySelector:s=>s==='video'?video:button};
 const preference={matches:reduce,addEventListener:(_k,f)=>{events.preference=f;}};
 const document={hidden:false,querySelectorAll:()=>[container],addEventListener:(k,f)=>{events[k]=f;}};
 let intersection;
 const context={matchMedia:()=>preference,document,IntersectionObserver:class{constructor(f){intersection=f;}observe(){}}};
 vm.runInNewContext(code,context);
 return {video,button,attrs,events,document,preference,intersect:v=>intersection([{isIntersecting:v}])};
}
test('reduced motion uses the poster without fetching or autoplaying the film',()=>{const p=setup(true);p.intersect(true);assert.equal(p.video.src,'');assert.equal(p.video.plays,0);assert.equal(p.video.paused,true);});
test('visible media plays muted and pauses when offscreen or the document is hidden',()=>{const p=setup();p.intersect(true);assert.equal(p.video.src,'/film.mp4');assert.equal(p.video.muted,true);assert.equal(p.video.paused,false);p.intersect(false);assert.equal(p.video.paused,true);p.intersect(true);p.document.hidden=true;p.events.visibilitychange();assert.equal(p.video.paused,true);});
test('manual pause survives re-entry and play remains available with reduced motion',()=>{const p=setup();p.intersect(true);p.events['button-click']();p.intersect(false);p.intersect(true);assert.equal(p.video.paused,true);const r=setup(true);r.intersect(true);r.events['button-click']();assert.equal(r.video.paused,false);assert.equal(r.attrs['aria-pressed'],'true');});
test('preference changes and media failures restore a safe static state',()=>{const p=setup();p.intersect(true);p.preference.matches=true;p.events.preference();assert.equal(p.video.paused,true);assert.equal(p.attrs['data-playing'],false);p.events.error();assert.equal(p.button.hidden,true);assert.equal(p.attrs['data-playing'],undefined);});
