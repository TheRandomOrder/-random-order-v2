// Content stays visible without JavaScript. Only chosen headings receive a brief reveal.
const preference=matchMedia('(prefers-reduced-motion: reduce)');
if(!preference.matches && 'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const node=entry.target as HTMLElement;node.animate([{clipPath:'inset(0 0 100% 0)',transform:'translateY(10px)'},{clipPath:'inset(0 0 0 0)',transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});observer.unobserve(node);}}, {threshold:.3});
 document.querySelectorAll<HTMLElement>('[data-editorial-reveal]').forEach(node=>observer.observe(node));
 preference.addEventListener('change',()=>{if(preference.matches){observer.disconnect();document.getAnimations().forEach(animation=>animation.cancel());}});
}
