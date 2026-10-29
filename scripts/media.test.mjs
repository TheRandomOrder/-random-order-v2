import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/scripts/media.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;

function setup({reduce=false,modes=['viewport'],observe=true}={}){
 const documentEvents=new Map(),preferenceEvents=[];
 const preference={matches:reduce,addEventListener:(_type,listener)=>preferenceEvents.push(listener)};
 const allVideos=[];
 function emitDocument(type,target){for(const fn of documentEvents.get(type)||[])fn({target});}
 function makeVideo(){
  const listeners=new Map(),attrs={};
  const video={tagName:'VIDEO',paused:true,currentTime:0,src:'',muted:false,dataset:{src:'/film.mp4'},plays:0,reject:false,attrs,
   addEventListener(type,listener){const list=listeners.get(type)||[];list.push(listener);listeners.set(type,list);},
   toggleAttribute:(name,value)=>{if(value)attrs[name]='';else delete attrs[name];},removeAttribute:name=>delete attrs[name],
   emit(type){emitDocument(type,this);for(const fn of listeners.get(type)||[])fn();},
   play(){this.plays++;if(this.reject)return Promise.reject(new Error('Autoplay denied'));const changed=this.paused;this.paused=false;this.currentTime=1;if(changed)this.emit('play');return Promise.resolve();},
   pause(){const changed=!this.paused;this.paused=true;if(changed)this.emit('pause');}
  };
  allVideos.push(video);return video;
 }
 const entries=modes.map((mode,index)=>{
  const video=makeVideo(),attrs={},listeners={};
  const button={hidden:true,textContent:'',attrs,getAttribute:()=>`Play film ${index}`,setAttribute:(key,value)=>attrs[key]=value,addEventListener:(type,listener)=>listeners[type]=listener};
  const container={dataset:mode?{mediaAutoplay:mode}:{},querySelector:selector=>selector==='video'?video:button,getBoundingClientRect:()=>({top:10,bottom:100})};
  return{video,button,container,click:()=>listeners.click()};
 });
 const document={hidden:false,querySelectorAll:selector=>selector==='video'?allVideos:entries.map(entry=>entry.container),addEventListener(type,listener){const list=documentEvents.get(type)||[];list.push(listener);documentEvents.set(type,list);}};
 let intersection;
 const context={matchMedia:()=>preference,document,window:{innerHeight:800}};
 if(observe)context.IntersectionObserver=class{constructor(listener){intersection=listener;}observe(){}};
 vm.runInNewContext(code,context);
 return{entries,document,preference,
  intersect:(index,visible,ratio=visible?1:0)=>intersection([{target:entries[index].container,isIntersecting:visible,intersectionRatio:ratio}]),
  intersectMany:values=>intersection(values.map(([index,ratio])=>({target:entries[index].container,isIntersecting:ratio>0,intersectionRatio:ratio}))),
  preferenceChange(value){preference.matches=value;preferenceEvents.forEach(fn=>fn());},
  visibility(hidden){document.hidden=hidden;emitDocument('visibilitychange',document);},
  makeNativeVideo:makeVideo
 };
}

test('reduced motion keeps the poster without loading video; explicit play remains available',()=>{
 const page=setup({reduce:true});const item=page.entries[0];page.intersect(0,true);
 assert.equal(item.video.src,'');assert.equal(item.video.plays,0);
 item.click();assert.equal(item.video.paused,false);assert.equal(item.video.muted,true);assert.equal(item.button.attrs['aria-pressed'],'true');
 page.intersect(0,false);assert.equal(item.video.paused,true);
});
test('viewport video plays muted, pauses offscreen, and pauses in a hidden document',()=>{
 const page=setup(),item=page.entries[0];page.intersect(0,true);
 assert.equal(item.video.src,'/film.mp4');assert.equal(item.video.muted,true);assert.equal(item.video.paused,false);
 page.intersect(0,false);assert.equal(item.video.paused,true);
 page.intersect(0,true);page.visibility(true);assert.equal(item.video.paused,true);
});
test('manual-mode project media never autoloads or autoplays, but its Play control works',()=>{
 const page=setup({modes:['manual']}),item=page.entries[0];page.intersect(0,true);
 assert.equal(item.video.src,'');assert.equal(item.video.plays,0);
 item.click();assert.equal(item.video.paused,false);
 page.visibility(true);assert.equal(item.video.paused,true);
 page.visibility(false);assert.equal(item.video.paused,true);
});
test('only the most visible viewport video plays and equal visibility keeps the current owner',()=>{
 const page=setup({modes:['viewport','viewport']});page.intersectMany([[0,.75],[1,.5]]);
 assert.equal(page.entries[0].video.paused,false);assert.equal(page.entries[1].video.src,'');
 page.intersectMany([[0,.5],[1,.75]]);
 assert.equal(page.entries[0].video.paused,true);assert.equal(page.entries[1].video.paused,false);
 page.intersectMany([[0,.75],[1,.75]]);
 assert.equal(page.entries[0].video.paused,true);assert.equal(page.entries[1].video.paused,false);
});
test('manual pause survives re-entry and another visible candidate can take over',()=>{
 const page=setup({modes:['viewport','viewport']});page.intersectMany([[0,1],[1,.5]]);
 page.entries[0].click();assert.equal(page.entries[0].video.paused,true);assert.equal(page.entries[1].video.paused,false);
 page.intersect(0,false);page.intersect(0,true);
 assert.equal(page.entries[0].video.paused,true);
});
test('explicit playback takes priority over autoplay until it leaves the viewport',()=>{
 const page=setup({modes:['viewport','manual']});page.intersectMany([[0,1],[1,.5]]);
 page.entries[1].click();assert.equal(page.entries[0].video.paused,true);assert.equal(page.entries[1].video.paused,false);
 page.intersect(0,true);assert.equal(page.entries[0].video.paused,true);
 page.intersect(1,false);assert.equal(page.entries[1].video.paused,true);
});
test('native and lab play events also pause every other video',()=>{
 const page=setup();page.intersect(0,true);const native=page.makeNativeVideo();void native.play();
 assert.equal(page.entries[0].video.paused,true);assert.equal(native.paused,false);
 page.intersect(0,true);assert.equal(page.entries[0].video.paused,true);
 page.visibility(true);assert.equal(native.paused,true);
});
test('preference changes and errors restore a static poster',()=>{
 const page=setup(),item=page.entries[0];page.intersect(0,true);page.preferenceChange(true);
 assert.equal(item.video.paused,true);assert.equal(item.video.attrs['data-playing'],undefined);
 item.click();item.video.emit('error');assert.equal(item.button.hidden,true);assert.equal(item.video.attrs['data-playing'],undefined);
});
test('autoplay refusal leaves explicit playback available without repeated automatic attempts',async()=>{
 const page=setup(),item=page.entries[0];item.video.reject=true;page.intersect(0,true);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(item.video.paused,true);assert.equal(item.button.hidden,false);const attempts=item.video.plays;
 page.intersect(0,true);assert.equal(item.video.plays,attempts);
 item.video.reject=false;item.click();assert.equal(item.video.paused,false);
});
test('without IntersectionObserver the fallback is poster-first manual playback',()=>{
 const page=setup({observe:false}),item=page.entries[0];assert.equal(item.video.src,'');
 item.click();assert.equal(item.video.paused,false);page.visibility(true);assert.equal(item.video.paused,true);
});
