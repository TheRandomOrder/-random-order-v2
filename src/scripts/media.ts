const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
[...document.querySelectorAll<HTMLElement>('[data-media]')].flatMap(container => {
 const video=container.querySelector<HTMLVideoElement>('video');
 const button=container.querySelector<HTMLButtonElement>('.media-toggle');
 if(!video || !button) return [];
 let visible=false, manuallyPaused=false;
 const label=button.getAttribute('aria-label')?.replace(/^Play /,'') || 'film';
 function update(){const playing=!video!.paused;video!.toggleAttribute('data-playing',playing || (video!.currentTime>0 && !reducedMotion.matches));button!.textContent=playing?'Pause film':'Play film';button!.setAttribute('aria-label',`${playing?'Pause':'Play'} ${label}`);button!.setAttribute('aria-pressed',String(playing));}
 async function play(){if(!video!.src)video!.src=video!.dataset.src!;video!.muted=true;try{await video!.play();}catch{update();}}
 function sync(){if(visible && !manuallyPaused && !reducedMotion.matches && !document.hidden)void play();else video!.pause();}
 button.hidden=false;
 button.addEventListener('click',()=>{if(video.paused){manuallyPaused=false;void play();}else{manuallyPaused=true;video.pause();}});
 video.addEventListener('play',update);video.addEventListener('pause',update);video.addEventListener('error',()=>{button.hidden=true;video.removeAttribute('data-playing');});
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15});observer.observe(container);
 reducedMotion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 return [{video,sync}];
});
