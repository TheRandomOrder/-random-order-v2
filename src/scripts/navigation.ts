const toggle=document.querySelector<HTMLButtonElement>('.nav-toggle');
const menu=document.querySelector<HTMLElement>('.mobile-menu');
const main=document.querySelector<HTMLElement>('main');
const footer=document.querySelector<HTMLElement>('footer');
let previousOverflow='';
function setOpen(open:boolean) {
  if(!toggle || !menu)return;
  if(open)previousOverflow=document.body.style.overflow;
  toggle.textContent=open?'CLOSE −':'MENU +'; toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
  menu.classList.toggle('is-open',open); menu.inert=!open; menu.setAttribute('aria-hidden',String(!open));
  if(main)main.inert=open; if(footer)footer.inert=open;
  document.body.style.overflow=open?'hidden':previousOverflow;
  if(open)menu.querySelector<HTMLAnchorElement>('a')?.focus(); else toggle.focus();
}
toggle?.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
document.addEventListener('keydown',e=>{
 if(toggle?.getAttribute('aria-expanded')!=='true')return;
 if(e.key==='Escape'){ e.preventDefault();setOpen(false); }
 if(e.key==='Tab'&&menu){ const items=[toggle,...menu.querySelectorAll<HTMLAnchorElement>('a')]; const i=items.indexOf(document.activeElement as HTMLButtonElement); e.preventDefault();items[(i+(e.shiftKey?-1:1)+items.length)%items.length].focus(); }
});
matchMedia('(min-width:48rem)').addEventListener('change',e=>{if(e.matches&&toggle?.getAttribute('aria-expanded')==='true')setOpen(false)});

// Keep the current in-page destination visible in both navigation layouts.
function updateActiveNavigation() {
 document.querySelectorAll<HTMLAnchorElement>('.nav-primary a,.mobile-menu a').forEach(link=>{
  const active=link.getAttribute('href')===location.hash;
  if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
 });
}
window.addEventListener('hashchange',updateActiveNavigation);
updateActiveNavigation();
