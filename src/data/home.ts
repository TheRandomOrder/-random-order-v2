import {projects as projectCollection,projectHref} from './projects';
import {getMedia} from './media';
export const navigation = [{label:'Work',href:'/work/'},{label:'Marks',href:'/logos/'},{label:'About',href:'/about/'},{label:'Contact',href:'/contact/'},{label:'Magazine',href:null}];
export const projects = projectCollection.filter(p=>p.homeOrder!==undefined).sort((a,b)=>a.homeOrder!-b.homeOrder!).map(p=>{const media=getMedia(p.heroMediaId!);return {id:p.id,number:p.cardNumber??'',title:p.title,tags:p.disciplines.join(' · '),summary:p.intro??'',image:media.type==='video'?media.poster!:media.src,video:media.type==='video'?media.src:undefined,href:projectHref(p)??null,alt:media.alt};});
export const capabilities = [
 ['Visual Identity','Logo, mark, typography, and color systems built to hold up across packaging, product, and screen alike.'],
 ['Brand Strategy','Positioning, naming, and tone of voice: the thinking that makes every design decision after it obvious instead of arbitrary.'],
 ['Brand Systems','Guidelines, templates, and documentation, so the identity survives contact with a real team and grows without drifting.'],
 ['Art Direction','Photography, packaging, and campaign direction that keep every touchpoint feeling like the same brand said it.']
];
export const process = [
 ['Discovery',`We start with questions, not templates: who you're for, what you're up against, and what "done well" actually looks like for your business.`],
 ['Strategy','Positioning and voice, defined clearly enough that design decisions stop being a matter of taste.'],
 ['Design','Identity and system, built out across every surface that actually matters to your business, not just the ones that look good in a deck.'],
 ['Handoff',`Documentation and support, so the brand holds up long after the project ends and the team using it isn't us.`]
];
