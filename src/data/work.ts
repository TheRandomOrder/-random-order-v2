import {getProject,projectHref} from './projects';
import {getMedia} from './media';
const originalSections = [
  {heading:'Storytelling', intro:'Stories take shape through hand-illustrated worlds and generative image experiments. Early explorations for Gold’s Gym tested the possibilities of AI and prompting. As the novelty fades and the visual bar rises, the craft lies in giving each image a clear point of view.', cards:[
    {id:'metalab', title:'Metalab', category:'Storytelling · Illustration', description:'An illustrated landscape of sculpted islands, quiet water and warm colour.', image:'/assets/work-a/time-illustration.jpg'},
    {id:'golds-gym', title:'Gold’s Gym', category:'Art Direction · AI Exploration', description:'Early generative image experiments exploring movement, strength and a warm, graphic palette.', image:'/assets/work-v2/golds-gym.png'}
  ]},
  {heading:'Brands', cards:[
    {id:'bagme', title:'BAGME', category:'Identity · Packaging', description:'A geometric bag symbol and understated wordmark, brought together on circular tags.', image:'/assets/work-a/bagme-tags.jpg'},
    {id:'hallys', title:'Hally’s London', category:'Identity · Illustration · Website', description:'A neighbourhood café rebrand built around a tangle of everyday moments.', image:'/assets/hallys-poster.webp'},
    {id:'earnt', title:'EARNT', category:'Identity · Illustration', description:'A bold tiger illustration and graphic wordmark give Team EARNT a distinctive presence.', image:'/assets/work-a/earnt-tiger.png'},
    {id:'sussex', title:'Sussex', category:'Identity · Typography', description:'A wordmark built from a county flag, for the Gladwin Brothers’ flagship restaurant.', image:'/assets/work-a/sussex-exterior.jpg'},
    {id:'superbalist', title:'Superbalist', category:'Product Design · Visual Systems', description:'A mobile shopping experience bringing fashion, beauty and a flexible brand language together.', image:'/assets/work-v2/superbalist.png'}
  ]},
  {heading:'Art Direction', cards:[
    {id:'hotel-atelier', title:'Hotel Atelier', category:'Art Direction · Image Experiments', description:'Editorial image experiments pairing expressive styling with richly textured interiors.', image:'/assets/work-a/hotel-atelier-editorial.jpg'},
    {id:'adidas', title:'Adidas', category:'Art Direction · Graphic Design', description:'Johannesburg imagery and graphic typography brought together on a wearable canvas.', image:'/assets/work-a/adidas-editorial.jpg'},
    {id:'publicis-machine', title:'Publicis Machine', category:'Art Direction · Image Making', description:'Sunlit colour, overhead composition and everyday detail shape a playful visual story.', image:'/assets/work-a/publicis-machine-editorial.jpg'},
    {id:'flora-co', title:'Flora&Co', category:'Art Direction · Campaign Imagery', description:'A red shoulder bag set against a cosmic backdrop, with bold type and orbiting lines.', image:'/assets/work-a/flora-co.jpg'},
    {id:'cozy', title:'Cozy Heaven', category:'Creative Direction · Image Making', description:'An intimate monochrome scene exploring character, comfort and the rituals of home.', image:'/assets/cozy-heaven.webp'},
    {id:'sneaker-lab', title:'Sneaker LAB × BSTN', category:'Art Direction · Packaging', description:'Court-side imagery connects basketball culture, graphic apparel and a collaborative brand world.', image:'/assets/work-a/sneaker-lab-bstn.jpg'}
  ]}
];

export const categories = [
  {id:'brand', label:'Brand', ids:['bagme','cozy']},
  {id:'product', label:'Product', ids:['superbalist','ssuperlative']},
  {id:'art-direction', label:'Art Direction', ids:['golds-gym','hotel-atelier','adidas','flora-co','sneaker-lab']},
  {id:'identity', label:'Identity', ids:['hallys','earnt','muso']},
  {id:'marks', label:'Marks', ids:['brandmarks']},
  {id:'typography', label:'Typography', ids:['sussex','publicis-machine']},
  {id:'illustration', label:'Illustration', ids:['metalab','scottusa','gadventures']}
];
const additions = ['ssuperlative','muso','brandmarks','scottusa','gadventures'].map(id=>{
  const project=getProject(id)!;
  const mediaId=project.heroMediaId ?? project.blocks.find(block=>block.type==='media')?.mediaId;
  const media=mediaId?getMedia(mediaId):undefined;
  return {id,title:project.title,category:project.disciplines.join(' · '),description:project.intro ?? '',image:media?.type==='video'?media.poster!:media?.src ?? ''};
});
export const workCards=[...originalSections.flatMap(section=>section.cards),...additions].map(card=>({
  ...card, href:projectHref(getProject(card.id)!)!
}));
export const workSections=categories.map(category=>({...category,cards:category.ids.map(id=>workCards.find(card=>card.id===id)!)}));
