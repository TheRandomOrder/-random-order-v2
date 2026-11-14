import {projects as projectCollection,projectHref} from './projects';
import {getMedia,imageSourceSet} from './media';
export const navigation = [{label:'Work',href:'/work/'},{label:'Marks',href:'/logos/'},{label:'About',href:'/about/'},{label:'Contact',href:'/contact/'},{label:'Magazine',href:null}];
// Homepage artwork follows Figma 1017:678 independently of case-study covers.
const homeArtwork: Record<string, {image:string; video?:string; alt:string}> = {
 'superbalist':{image:'/assets/home-v2/superbalist.png',alt:'Superbalist identity displayed on three mobile screens'},
 'publicis-machine':{image:'/assets/home-v2/machine.png',alt:'Publicis Machine tennis-court campaign composition'},
 'golds-gym':{image:'/assets/home-v2/golds.png',alt:'Gold’s Gym SoCal golden fitness campaign'},
 'sussex':{image:'/assets/home-v2/sussex.png',alt:'Sussex restaurant exterior and identity'},
 'ssuperlative':{image:'/assets/home-v2/ssuperlative-poster.png',alt:'SSUPERLATIVE blue-lit portrait'},
 'earnt':{image:'/assets/home-v2/earnt.png',video:'/assets/earnt.mp4',alt:'Team EARNT illustrated campaign artwork'}
};
const homepageOrder = ['hallys','superbalist','publicis-machine','golds-gym','sussex','ssuperlative','earnt'];
export const projects = homepageOrder.map((id,index)=>{
 const p=projectCollection.find(project=>project.id===id)!;
 const artwork=homeArtwork[id];
 const media=p.heroMediaId ? getMedia(p.heroMediaId) : undefined;
 return {id:p.id,number:String(index+1).padStart(2,'0'),title:p.title,tags:p.disciplines.join(' · '),summary:p.intro??'',image:media?(media.type==='video'?media.poster!:media.src):undefined,sourceSet:media?.type==='image'?imageSourceSet(media):undefined,video:media?.type==='video'?media.src:undefined,href:projectHref(p)??null,alt:media?.alt??'',...(artwork ? {...artwork,sourceSet:undefined,video:artwork.video} : {})};
});
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
