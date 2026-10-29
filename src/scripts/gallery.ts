const dialog=document.querySelector<HTMLDialogElement>('[data-gallery-viewer]');
const triggers=[...document.querySelectorAll<HTMLAnchorElement>('[data-gallery-trigger]')];
if(dialog && typeof dialog.showModal==='function' && triggers.length){
 const surface=dialog.querySelector<HTMLElement>('[data-gallery-image]')!;
 const caption=dialog.querySelector<HTMLElement>('[data-gallery-caption]')!;
 const count=dialog.querySelector<HTMLElement>('[data-gallery-count]')!;
 const close=dialog.querySelector<HTMLButtonElement>('[data-gallery-close]')!;
 const previous=dialog.querySelector<HTMLButtonElement>('[data-gallery-previous]')!;
 const next=dialog.querySelector<HTMLButtonElement>('[data-gallery-next]')!;
 const zoom=dialog.querySelector<HTMLButtonElement>('[data-gallery-zoom]')!;
 const original=dialog.querySelector<HTMLAnchorElement>('[data-gallery-original]')!;
 let active=0,opener:HTMLAnchorElement|undefined;
 const available=()=>triggers.filter(t=>!t.closest('[hidden]'));
 function show(index:number){
  const list=available();if(!list.length)return;active=(index+list.length)%list.length;const trigger=list[active];
  const image=new Image();image.src=trigger.href;image.alt=trigger.dataset.alt??'';image.decoding='async';image.width=Number(trigger.dataset.width);image.height=Number(trigger.dataset.height);
  surface.replaceChildren(image);surface.classList.remove('is-zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='Zoom in';original.href=trigger.href;caption.textContent=trigger.dataset.caption??image.alt;count.textContent=`${active+1} / ${list.length}`;previous.disabled=next.disabled=list.length<2;
 }
 triggers.forEach(trigger=>{trigger.setAttribute('aria-haspopup','dialog');trigger.addEventListener('click',event=>{event.preventDefault();opener=trigger;document.querySelectorAll('video').forEach(v=>v.pause());show(available().indexOf(trigger));dialog!.showModal();close.focus();});});
 close.addEventListener('click',()=>dialog.close());previous.addEventListener('click',()=>show(active-1));next.addEventListener('click',()=>show(active+1));
 zoom.addEventListener('click',()=>{const enlarged=surface.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(enlarged));zoom.textContent=enlarged?'Fit image':'Zoom in';});
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(active+(event.key==='ArrowLeft'?-1:1));}});
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{surface.replaceChildren();opener?.focus({preventScroll:true});});
}
