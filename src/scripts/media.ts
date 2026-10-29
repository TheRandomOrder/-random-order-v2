const reducedMotion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
const canObserve=typeof IntersectionObserver!=='undefined';
interface Player {
 container:HTMLElement;
 video:HTMLVideoElement;
 button:HTMLButtonElement;
 autoplay:boolean;
 visible:boolean;
 ratio:number;
 manuallyPaused:boolean;
 blocked:boolean;
 failed:boolean;
 pending:boolean;
 update:()=>void;
}
let activeVideo:HTMLVideoElement|null=null;
let manualOwner:Player|null=null;
const players:Player[]=[];

function pauseOthers(except:HTMLVideoElement|null){
 document.querySelectorAll<HTMLVideoElement>('video').forEach(video=>{
  if(video!==except && !video.paused)video.pause();
 });
}

async function requestPlay(player:Player,explicit=false){
 if(player.failed || player.pending)return;
 if(!player.video.src){
  const source=player.video.dataset.src;
  if(!source)return;
  player.video.src=source;
 }
 pauseOthers(player.video);
 activeVideo=player.video;
 if(explicit){manualOwner=player;player.blocked=false;}
 player.video.muted=true;
 player.pending=true;
 try{await player.video.play();}catch(error){
  // An autoplay refusal leaves the poster and explicit Play control available.
  player.blocked=!explicit && (error as {name?:string})?.name!=='AbortError';
  if(activeVideo===player.video)activeVideo=null;
  if(manualOwner===player)manualOwner=null;
  player.update();
 }finally{player.pending=false;}
}

function reconcile(){
 if(document.hidden){
  manualOwner=null;
  pauseOthers(null);
  activeVideo=null;
  return;
 }
 if(manualOwner){
  if(manualOwner.visible && !manualOwner.failed && (!manualOwner.video.paused || manualOwner.pending))return;
  manualOwner=null;
 }
 // A native or lab player has the same exclusive playback priority.
 if(activeVideo && !players.some(player=>player.video===activeVideo) && !activeVideo.paused){
  players.forEach(player=>{if(!player.video.paused)player.video.pause();});
  return;
 }
 const eligible=reducedMotion?.matches?[]:players.filter(player=>player.autoplay && player.visible && !player.manuallyPaused && !player.blocked && !player.failed);
 eligible.sort((a,b)=>b.ratio-a.ratio || (a.video===activeVideo?-1:b.video===activeVideo?1:0));
 const next=eligible[0];
 if(next && activeVideo===next.video && (!next.video.paused || next.pending))return;
 pauseOthers(next?.video??null);
 if(next)void requestPlay(next);
 else activeVideo=null;
}

document.querySelectorAll<HTMLElement>('[data-media]').forEach(container=>{
 const video=container.querySelector<HTMLVideoElement>('video');
 const button=container.querySelector<HTMLButtonElement>('.media-toggle');
 if(!video || !button)return;
 const label=button.getAttribute('aria-label')?.replace(/^Play /,'') || 'film';
 const player:Player={container,video,button,autoplay:canObserve && container.dataset.mediaAutoplay!=='manual',visible:!canObserve,ratio:0,manuallyPaused:false,blocked:false,failed:false,pending:false,update(){
  const playing=!video.paused;
  video.toggleAttribute('data-playing',!player.failed && (playing || (video.currentTime>0 && !reducedMotion?.matches)));
  button.textContent=playing?'Pause film':'Play film';
  button.setAttribute('aria-label',`${playing?'Pause':'Play'} ${label}`);
  button.setAttribute('aria-pressed',String(playing));
 }};
 players.push(player);
 button.hidden=false;
 button.addEventListener('click',()=>{
  if(video.paused){player.manuallyPaused=false;void requestPlay(player,true);}
  else{
   player.manuallyPaused=true;
   if(manualOwner===player)manualOwner=null;
   video.pause();
   reconcile();
  }
 });
 video.addEventListener('play',player.update);
 video.addEventListener('pause',player.update);
 video.addEventListener('error',()=>{
  player.failed=true;
  player.pending=false;
  if(manualOwner===player)manualOwner=null;
  video.pause();
  button.hidden=true;
  video.removeAttribute('data-playing');
  if(activeVideo===video)activeVideo=null;
  reconcile();
 });
});

// Capture also covers manually played lab videos and native video controls.
document.addEventListener('play',event=>{
 const video=event.target as HTMLVideoElement|null;
 if(video?.tagName!=='VIDEO')return;
 if(document.hidden){video.pause();activeVideo=null;manualOwner=null;return;}
 const expected=activeVideo===video;
 const player=players.find(item=>item.video===video);
 if(player && (!expected || !player.autoplay))manualOwner=player;
 else if(manualOwner?.video!==video)manualOwner=null;
 activeVideo=video;
 pauseOthers(video);
},true);
document.addEventListener('pause',event=>{
 const video=event.target as HTMLVideoElement|null;
 if(activeVideo===video)activeVideo=null;
 if(manualOwner?.video===video)manualOwner=null;
},true);

if(canObserve){
 const byContainer=new Map(players.map(player=>[player.container,player]));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   const player=byContainer.get(entry.target as HTMLElement);
   if(!player)return;
   player.ratio=entry.intersectionRatio;
   player.visible=entry.isIntersecting && entry.intersectionRatio>=.15;
   if(!player.visible){
    if(manualOwner===player)manualOwner=null;
    if(!player.video.paused)player.video.pause();
   }
  });
  reconcile();
 },{threshold:[0,.15,.5,.75,1]});
 players.forEach(player=>observer.observe(player.container));
}else{
 // Older browsers keep posters until explicit Play; no eager video downloads.
 document.addEventListener('scroll',()=>{
  players.forEach(player=>{
   const rect=player.container.getBoundingClientRect();
   if(rect.bottom<=0 || rect.top>=window.innerHeight)player.video.pause();
  });
 },{passive:true,capture:true});
}
function preferenceChanged(){
 manualOwner=null;
 pauseOthers(null);
 players.forEach(player=>player.update());
 reconcile();
}
if(typeof reducedMotion?.addEventListener==='function')reducedMotion.addEventListener('change',preferenceChanged);
else reducedMotion?.addListener?.(preferenceChanged);
document.addEventListener('visibilitychange',reconcile);
