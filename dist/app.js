import {topics, families} from './topics.js';
import {resources, reviewedAt} from './resources.js';
import {exercises} from './exercises.js';
import {semesters, particlePath} from './pathways.js';

const $ = (s, root=document) => root.querySelector(s);
const main = $('#main');
const esc = v => String(v ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topic = id => topics.find(t=>t.id===id);
const byTopic = id => resources.filter(r=>r.topics.includes(id));
const number = n => String(n).padStart(2,'0');
const isPaper = r => ['Problems','Exams'].includes(r.type);
const bookCount = resources.filter(r=>r.type==='Book').length;
const paperCount = resources.filter(isPaper).length;
const ext = (url,label,cls='') => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="${cls}" aria-label="${esc(label)} (opens in a new tab)">${label}<span aria-hidden="true">↗</span></a>`;
const paths = {
 Book:'<path d="M4 3h6a3 3 0 0 1 3 3v15a4 4 0 0 0-4-2H4z"/><path d="M20 3h-4a3 3 0 0 0-3 3v15a4 4 0 0 1 4-2h3z"/>',
 Course:'<rect x="3" y="4" width="18" height="15" rx="2"/><path d="m10 8 5 4-5 4z"/>',
 Notes:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h6"/>',
 Problems:'<path d="M5 3h14v18H5zM8 8h8M8 12h3M8 16h5"/>',
 Exams:'<path d="M9 4H5v17h14V4h-4M9 3h6v4H9zM8 12h8M8 16h5"/>',
 Data:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>'
};
const icon = type => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">${paths[type]||paths.Notes}</svg>`;
let wheelIndex=0, wheelFamily='All fields', visibleTopics=topics;
let paperFilters={field:'all',level:'all',solutions:false,q:''};
let libraryFilters={field:'all',type:'all',access:'all',q:'',personal:false};
let libraryLimit=24;
let currentExercise=null, exerciseField='all';
const workings=new Map();

function routeParts(){const [path,q='']=(location.hash.slice(1)||'explore').split('?');return {parts:path.split('/'),query:new URLSearchParams(q)};}
function navActive(id){document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===id);a.toggleAttribute('aria-current',a.dataset.nav===id);if(a.dataset.nav===id)a.setAttribute('aria-current','page');});}
function page(inner,cls=''){main.innerHTML=`<div class="page route-enter ${cls}">${inner}</div>`;}
function goFocus(){requestAnimationFrame(()=>main.focus({preventScroll:true}));}
function route(){
 const {parts,query}=routeParts();
 const routeName=parts[0];
 navActive(routeName==='topic'?'explore':routeName);
 if(routeName==='explore') renderExplore();
 else if(routeName==='topic') renderTopic(parts[1],query.get('tab')||'reading');
 else if(routeName==='library'){libraryFilters.q=query.get('q')||'';libraryFilters.personal=query.get('shelf')==='mine';libraryFilters.field=query.get('field')||'all';libraryLimit=24;renderLibrary();}
 else if(routeName==='practice'){exerciseField=query.get('field')||'all';paperFilters.field=exerciseField;renderPractice(query.get('mode')||'papers');}
 else if(routeName==='pathways')renderPathways();
 else if(routeName==='sources')renderSources();
 else {page(`<div class="empty-state"><h1>Outside the atlas</h1><p>This page could not be found.</p><a class="button" href="#explore">Return to the explorer</a></div>`);}
 document.title=routeName==='topic'&&topic(parts[1])?`${topic(parts[1]).name} | Physics Atlas`:`${({explore:'Explore',library:'Library',practice:'Practice',pathways:'Study paths',sources:'Sources & about'})[routeName]||'Physics Atlas'} | Physics Atlas`;
 window.scrollTo({top:0,behavior:'instant'});
}

function renderExplore(){
 page(`<div class="intro-row"><div><div class="eyebrow">THE PHYSICS COLLECTION</div><h1>A universe of understanding.</h1><p>Pick a field. Find your next book. Put the ideas to the test.</p></div><div class="edition"><div><strong>${topics.length}</strong><span>fields to explore</span></div><div><strong>${resources.length}</strong><span>curated resources</span></div></div></div>
 <div class="filter-row" aria-label="Filter topics by field family">${families.map(f=>`<button class="chip ${f===wheelFamily?'active':''}" data-action="family" data-value="${esc(f)}" aria-pressed="${f===wheelFamily}">${f}</button>`).join('')}</div>
 <section class="orbit-section" aria-label="Rotating topic explorer"><div class="orbit-frame"><div class="orbit-topline"><span class="micro">SELECT YOUR FIELD</span><span>THE ORBITAL INDEX &nbsp; / &nbsp; 01</span></div><div class="orbit-stage" id="orbit-stage" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Physics topics. Use left and right arrows to rotate, Enter to open."></div><div class="orbit-control"><span class="orbit-help">Scroll, drag, or use ← →</span><div class="orbit-arrows"><button class="icon-button" data-action="rotate" data-value="-1" aria-label="Previous topic">←</button><span class="orbit-count" id="orbit-count"></span><button class="icon-button" data-action="rotate" data-value="1" aria-label="Next topic">→</button></div><div class="orbit-progress" id="orbit-progress" aria-hidden="true"></div></div></div><div id="selected-summary" class="selected-summary" aria-live="polite" aria-atomic="true"></div></section>
 <div class="section-heading"><div><h2>A place to begin.</h2><p>Pick up your current studies, or look further ahead.</p></div><a href="#pathways" class="text-link">All study paths <span aria-hidden="true">↗</span></a></div>
 <div class="current-grid"><a class="mini-path" href="#pathways?semester=3"><div class="micro"><span>YOUR CURRENT SEMESTER</span><span>03</span></div><h3>Build the foundations</h3><p>Mechanics, electromagnetism, atoms, and the mathematics that connects them.</p><div class="path-tags"><span class="tag">Taylor</span><span class="tag">Griffiths</span><span class="tag">Artin</span></div></a><a class="mini-path" href="#pathways?path=particle"><div class="micro"><span>THE LONGER ROUTE</span><span>→</span></div><h3>From quantum to particles</h3><p>Relativity, second quantization, particle physics, and eventually quantum fields.</p><div class="path-tags"><span class="tag">6 steps</span><span class="tag">Prerequisites included</span></div></a><a class="mini-path" href="#practice?mode=papers"><div class="micro"><span>LEARN BY DOING</span><span>↗</span></div><h3>Meet the problem sheet</h3><p>University exams, problem collections, and original exercises with worked solutions.</p><div class="path-tags"><span class="tag">MIT OCW</span><span class="tag">Cambridge</span><span class="tag">HBCSE</span></div></a></div>
 <div class="section-heading"><h2>The complete index</h2><span class="micro">${topics.length} FIELDS</span></div><div class="topic-directory">${topics.map(t=>`<a class="directory-item" href="#topic/${t.id}" style="--topic-color:${t.color}"><span class="dir-symbol" aria-hidden="true">${t.symbol}</span><span>${t.name}</span><span aria-hidden="true">↗</span></a>`).join('')}</div>`);
 initWheel();
}
function initWheel(){
 visibleTopics=wheelFamily==='All fields'?topics:topics.filter(t=>t.family===wheelFamily);
 wheelIndex=((wheelIndex%visibleTopics.length)+visibleTopics.length)%visibleTopics.length;
 const stage=$('#orbit-stage');
 stage.innerHTML=visibleTopics.map((t,i)=>`<button class="topic-orbit-card" data-action="orbit-card" data-value="${i}" style="--topic-color:${t.color}" aria-label="Select ${t.name}"><span class="card-top"><span>${number(topics.indexOf(t)+1)} / ${t.family.toUpperCase()}</span><span aria-hidden="true">↗</span></span><span class="topic-symbol" aria-hidden="true">${t.symbol}</span><div><h3>${t.name}</h3><span class="card-bottom"><span>${byTopic(t.id).length} resources &nbsp; / &nbsp; ${t.level}</span><i aria-hidden="true">→</i></span></div></button>`).join('');
 drawWheel();
 let accumulation=0,lastWheel=0,startX=null,startY=null,dragged=false;
 stage.addEventListener('wheel',e=>{e.preventDefault();const now=Date.now();if(now-lastWheel<340)return;accumulation+=e.deltaMode===1?e.deltaY*16:(e.deltaX||e.deltaY);if(Math.abs(accumulation)>28){rotate(Math.sign(accumulation));lastWheel=now;accumulation=0;}},{passive:false});
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rotate(e.key==='ArrowRight'?1:-1);stage.focus({preventScroll:true});}else if(e.key==='Enter'&&e.target===stage){location.hash=`topic/${visibleTopics[wheelIndex].id}`;}});
 stage.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;dragged=false;});
 stage.addEventListener('pointermove',e=>{if(startX!==null&&Math.abs(e.clientX-startX)>15&&Math.abs(e.clientX-startX)>Math.abs(e.clientY-startY))dragged=true;});
 stage.addEventListener('pointerup',e=>{if(startX!==null&&dragged){rotate(e.clientX<startX?1:-1);stage.dataset.dragged='true';setTimeout(()=>delete stage.dataset.dragged,100);}startX=null;});
 stage.addEventListener('pointercancel',()=>{startX=null;});
 stage.addEventListener('pointerleave',()=>{startX=null;});
}
function rotate(step){wheelIndex=(wheelIndex+step+visibleTopics.length)%visibleTopics.length;drawWheel();}
function drawWheel(){
 const n=visibleTopics.length, mobile=window.innerWidth<760, spread=mobile?175:270;
 document.querySelectorAll('.topic-orbit-card').forEach((card,i)=>{
  let d=(i-wheelIndex+n)%n;if(d>n/2)d-=n;
  const visible=Math.abs(d)<=3;
  card.style.transform=`translateX(${d*spread}px) translateZ(${-Math.abs(d)*(mobile?170:160)}px) rotateY(${-d*14}deg) translateY(${Math.abs(d)*11}px)`;
  card.style.opacity=visible?String(Math.max(.18,1-Math.abs(d)*.26)):'0';card.style.zIndex=String(10-Math.abs(d));card.style.pointerEvents=visible?'auto':'none';
  card.classList.toggle('is-selected',d===0);card.tabIndex=d===0?0:-1;card.setAttribute('aria-hidden',String(!visible));card.setAttribute('aria-label',`${d===0?'Open':'Select'} ${visibleTopics[i].name}`);
 });
 const t=visibleTopics[wheelIndex];
 $('#orbit-count').innerHTML=`<strong>${number(wheelIndex+1)}</strong> / ${number(n)}`;
 $('#orbit-progress').innerHTML=visibleTopics.map((_,i)=>`<span class="orbit-dot ${i===wheelIndex?'active':''}"></span>`).join('');
 $('#selected-summary').innerHTML=`<div><div class="micro">${t.family} &nbsp; / &nbsp; ${t.level}</div><h2>${t.name}</h2></div><p>${t.description}</p><a class="button" href="#topic/${t.id}">Explore this field <span aria-hidden="true">↗</span></a>`;
}
window.addEventListener('resize',()=>{if($('#orbit-stage'))drawWheel();});

function resourceCard(r){
 const t=topic(r.topics[0]);
 const label=r.type==='Book'?(r.access==='Free'?'Read book':'View book'):isPaper(r)?'Open questions':r.type==='Course'?'Open course':r.type==='Data'?'Explore resource':'Read notes';
 return `<article class="resource-card" style="--topic-color:${t?.color||'#d8fb76'}"><div class="resource-meta"><span class="resource-kind">${icon(r.type)}${esc(r.type.toUpperCase())}</span><span>${esc(r.provider)}</span></div>${r.personal?`<div class="reading-label">${esc(r.personal)}</div>`:''}<h3>${esc(r.title)}</h3><p class="author">${esc(r.author)}</p><p class="description">${esc(r.description)}</p><div class="resource-tags"><span class="tag ${r.access==='Free'?'lime':''}">${esc(r.access==='Paid'?'Buy / borrow':r.access)}</span><span class="tag">${esc(r.level)}</span>${r.solutions?`<span class="tag ${r.solutionUrl?'purple':''}">${esc(r.solutions)}</span>`:''}</div>${r.note?`<p class="resource-note">${esc(r.note)}</p>`:''}<div class="resource-actions">${ext(r.url,label)}${r.solutionUrl?ext(r.solutionUrl,r.solutions==='Answer keys'?'Answer keys':r.solutions==='Hints only'?'Open hints':'View solutions','solution-link'):''}</div></article>`;
}
function renderTopic(id,tab='reading'){
 const t=topic(id);if(!t){page(`<div class="empty-state"><h1>Field not found</h1><a class="button" href="#explore">Explore the atlas</a></div>`);return;}
 const all=byTopic(id),books=all.filter(r=>r.type==='Book'),papers=all.filter(isPaper),learn=all.filter(r=>!isPaper(r));
 const topicExercises=exercises.filter(e=>e.topic===id);
 page(`<div class="breadcrumb"><a href="#explore">Explore</a><span>/</span><span>${t.family}</span></div><section class="topic-heading"><div><div class="eyebrow">FIELD ${number(topics.indexOf(t)+1)} &nbsp; / &nbsp; ${t.level}</div><h1>${t.name}</h1><p>${t.description}</p><div class="prereqs"><span>START WITH</span>${t.prerequisites.map(p=>`<span class="tag">${p}</span>`).join('')}</div><div class="topic-stats"><span><strong>${books.length}</strong>books</span><span><strong>${all.length}</strong>resources</span><span><strong>${papers.length}</strong>paper collections</span></div></div><div class="equation-panel" style="--topic-color:${t.color}"><span class="equation-index">${number(topics.indexOf(t)+1)} / PHYSICS ATLAS</span><span class="equation">${t.formula}</span><span class="micro">${t.short}</span></div></section>
 <nav class="tabs" aria-label="Field sections"><a class="tab ${tab==='reading'?'active':''}" href="#topic/${id}?tab=reading" ${tab==='reading'?'aria-current="page"':''}>Books &amp; learning <span>${learn.length}</span></a><a class="tab ${tab==='practice'?'active':''}" href="#topic/${id}?tab=practice" ${tab==='practice'?'aria-current="page"':''}>Problems &amp; answers <span>${papers.length+topicExercises.length}</span></a><a class="tab ${tab==='concepts'?'active':''}" href="#topic/${id}?tab=concepts" ${tab==='concepts'?'aria-current="page"':''}>Topic map <span>${t.units.length}</span></a></nav>
 ${tab==='practice'?`${topicExercises.length?`<div class="note-strip"><strong>Start with a focused exercise.</strong> Work through a question here, reveal a hint, then compare with a full solution. <a href="#practice?mode=exercises&field=${id}">Open ${topicExercises.length===1?'the exercise':topicExercises.length+' exercises'} →</a></div>`:''}<div class="resource-grid">${papers.length?papers.map(resourceCard).join(''):`<div class="empty-state"><h3>Start with the worked exercise</h3><p>The reading resources also contain exercises. A dedicated external paper collection has not yet been added for this field.</p><a class="button" href="#practice?mode=exercises&field=${id}">Open worked practice</a></div>`}</div>`:tab==='concepts'?`<div class="note-strip">Use this as a study checklist. The order is a suggested learning sequence; the linked books and courses supply the lessons.</div><div class="topic-units">${t.units.map((u,i)=>`<div class="unit-row"><span>${number(i+1)}</span><h3>${u}</h3></div>`).join('')}</div><div class="section-heading"><h2>Where this can take you</h2></div><div class="path-next">${t.next.map(id=>`<a class="button secondary" href="#topic/${id}">${topic(id).name} ↗</a>`).join('')}</div>`:`<div class="resource-grid">${learn.map(resourceCard).join('')}</div>`}`);
}

function fieldOptions(selected){return `<option value="all">All fields</option>${topics.map(t=>`<option value="${t.id}" ${t.id===selected?'selected':''}>${t.name}</option>`).join('')}`;}
function selectOptions(options,selected){return options.map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('');}
function matchesQuery(r,q){return `${r.title} ${r.author} ${r.provider} ${r.description} ${r.topics.map(id=>topic(id)?.name).join(' ')} ${r.tags?.join(' ')||''}`.toLowerCase().includes(q.toLowerCase().trim());}
function renderLibrary(){
 page(`<div class="intro-row"><div><div class="eyebrow">THE READING ROOM</div><h1>The physics library.</h1><p>${bookCount} books, open courses, lecture notes, and collections to keep coming back to.</p></div><span class="micro">CURATED SEPTEMBER 2026</span></div><div class="search-box"><span aria-hidden="true">⌕</span><input id="library-search" type="search" placeholder="Try “Griffiths”, “scattering”, or “MIT”…" aria-label="Search resources" value="${esc(libraryFilters.q)}"></div><div class="filter-bar"><label>Field<select data-filter="library-field">${fieldOptions(libraryFilters.field)}</select></label><label>Resource<select data-filter="library-type">${selectOptions([['all','All resources'],...Object.keys(paths).map(k=>[k,k])],libraryFilters.type)}</select></label><label>Access<select data-filter="library-access">${selectOptions([['all','Any access'],['Free','Free to access'],['Paid','Buy / borrow'],['Preview','Preview available']],libraryFilters.access)}</select></label><label class="check-filter"><input type="checkbox" data-filter="personal" ${libraryFilters.personal?'checked':''}>My used &amp; planned books</label></div><p class="results-line" id="library-count" aria-live="polite"></p><div class="resource-grid" id="library-results"></div><div id="library-more"></div>`);
 updateLibrary();
 $('#library-search').addEventListener('input',e=>{libraryFilters.q=e.target.value;libraryLimit=24;updateLibrary();});
}
function updateLibrary(){
 const f=libraryFilters;
 const list=resources.filter(r=>(f.field==='all'||r.topics.includes(f.field))&&(f.type==='all'||r.type===f.type)&&(f.access==='all'||r.access===f.access)&&(!f.personal||r.personal)&&matchesQuery(r,f.q));
 $('#library-count').innerHTML=`<strong>${list.length}</strong> ${list.length===1?'resource':'resources'}${f.personal?' in your reading list':''}${list.length>libraryLimit?` · showing ${libraryLimit}`:''}`;
 $('#library-results').innerHTML=list.length?list.slice(0,libraryLimit).map(resourceCard).join(''):`<div class="empty-state"><h3>No resources found</h3><p>Try a broader search or clear the filters.</p><button class="button secondary" data-action="reset-library">Clear filters</button></div>`;
 $('#library-more').innerHTML=list.length>libraryLimit?`<button class="button secondary load-more" data-action="load-more">Show more resources <span aria-hidden="true">↓</span></button>`:'';
}
function renderPractice(mode){
 page(`<div class="intro-row"><div><div class="eyebrow">THE PROBLEM ROOM</div><h1>Understanding takes practice.</h1><p>Make an attempt. Follow the reasoning. Come back to what challenged you.</p></div></div><nav class="tabs practice-tabs" aria-label="Practice formats"><a class="tab ${mode==='papers'?'active':''}" href="#practice?mode=papers${exerciseField!=='all'?'&field='+exerciseField:''}" ${mode==='papers'?'aria-current="page"':''}>University papers <span>${paperCount}</span></a><a class="tab ${mode==='exercises'?'active':''}" href="#practice?mode=exercises${exerciseField!=='all'?'&field='+exerciseField:''}" ${mode==='exercises'?'aria-current="page"':''}>Worked practice <span>${exercises.length}</span></a></nav><div id="practice-content"></div>`);
 if(mode==='exercises')renderExercises();else renderPapers();
}
function renderPapers(){
 $('#practice-content').innerHTML=`<div class="note-strip">Question papers and answers open on their original source. <strong>“Official solutions”</strong> means the source supplies worked answers. Answer keys, selected solutions, hints, and unavailable solutions are labeled separately.</div><div class="filter-bar"><label>Field<select data-filter="paper-field">${fieldOptions(paperFilters.field)}</select></label><label>Level<select data-filter="paper-level">${selectOptions([['all','All levels'],['Foundation','Foundation'],['Undergraduate','Undergraduate'],['Advanced','Advanced'],['Graduate','Graduate']],paperFilters.level)}</select></label><label class="check-filter"><input type="checkbox" data-filter="paper-solutions" ${paperFilters.solutions?'checked':''}>Worked solutions available</label></div><p class="results-line" id="paper-count" aria-live="polite"></p><div class="resource-grid" id="paper-results"></div>`;
 updatePapers();
}
function updatePapers(){
 const f=paperFilters,list=resources.filter(r=>isPaper(r)&&(f.field==='all'||r.topics.includes(f.field))&&(f.level==='all'||r.level===f.level)&&(!f.solutions||['Official solutions','Selected solutions'].includes(r.solutions)));
 $('#paper-count').innerHTML=`<strong>${list.length}</strong> paper and problem collections`;
 $('#paper-results').innerHTML=list.length?list.map(resourceCard).join(''):`<div class="empty-state"><h3>No paper collections match these filters</h3><p>Try all levels, or use the worked practice exercises for this field.</p><button class="button secondary" data-action="reset-papers">Clear filters</button></div>`;
}
function renderExercises(){
 const list=exerciseField==='all'?exercises:exercises.filter(e=>e.topic===exerciseField);
 if(!list.some(e=>e.id===currentExercise))currentExercise=list[0]?.id;
 $('#practice-content').innerHTML=`<div class="note-strip">${exercises.length} original Atlas exercises with hints and worked reasoning. These are self-study exercises, independently written for this site. For university-authored questions, open the University papers tab.</div><div class="filter-bar"><label>Field<select data-filter="exercise-field">${fieldOptions(exerciseField)}</select></label></div><div class="practice-layout"><aside class="exercise-list" aria-label="Choose an exercise">${list.map((e,i)=>`<button class="exercise-pick ${e.id===currentExercise?'active':''}" data-action="exercise" data-value="${e.id}" ${e.id===currentExercise?'aria-current="true"':''}><span class="ex-num">${number(i+1)}</span><span><strong>${esc(e.title)}</strong><small>${topic(e.topic).short} · ${e.level}</small></span></button>`).join('')}</aside><article class="exercise-work" id="exercise-work"></article></div>`;
 drawExercise();
}
function drawExercise(){
 const e=exercises.find(e=>e.id===currentExercise);if(!e){$('#exercise-work').innerHTML='<h2>No exercises found</h2>';return;}
 const list=exerciseField==='all'?exercises:exercises.filter(e=>e.topic===exerciseField),i=list.indexOf(e);
 document.querySelectorAll('.exercise-pick').forEach(b=>{b.classList.toggle('active',b.dataset.value===e.id);if(b.dataset.value===e.id)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
 $('#exercise-work').innerHTML=`<div class="work-meta"><span class="tag lime">${topic(e.topic).name}</span><span class="tag">${e.level}</span><span class="tag">Original Atlas exercise</span></div><h2>${esc(e.title)}</h2><p class="exercise-question">${esc(e.question)}</p><label class="work-label" for="scratchpad">Your working</label><textarea id="scratchpad" class="scratchpad" placeholder="State your assumptions. Sketch an approach. Work it through…">${esc(workings.get(e.id)||'')}</textarea><p class="smallprint">Kept in this tab while you explore. Reloading clears your working.</p><details class="disclosure"><summary>Need a hint?</summary><div class="disclosure-content">${esc(e.hint)}</div></details><details class="disclosure"><summary>Reveal the worked solution</summary><div class="disclosure-content"><ol>${e.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="answer">${esc(e.answer)}</p>${e.check?`<p><strong>Check the idea:</strong> ${esc(e.check)}</p>`:''}</div></details><div class="concept-link"><span class="smallprint">Related reading and university practice</span><a href="#topic/${e.topic}">${topic(e.topic).name} ↗</a></div><div class="practice-stepper"><button class="button secondary" data-action="exercise-step" data-value="-1" ${i===0?'disabled':''}>← Previous</button><button class="button secondary" data-action="exercise-step" data-value="1" ${i===list.length-1?'disabled':''}>Next exercise →</button></div>`;
 $('#scratchpad').addEventListener('input',event=>workings.set(e.id,event.target.value));
}

function renderPathways(){
 const {query}=routeParts();
 page(`<div class="intro-row"><div><div class="eyebrow">THE LONG VIEW</div><h1>Build your own momentum.</h1><p>A route through the coming semesters, with a separate thread leading toward particle physics.</p></div><a class="button secondary" href="#library?shelf=mine">Your reading list ↗</a></div><section class="pathway-feature" id="particle-path"><div><div class="eyebrow">YOUR READING PROJECT</div><h2>Quantum mechanics.<br>Then, the particles.</h2><p>Continue from identical particles. Relativity and second quantization provide the next tools; particle phenomenology gives them a physical destination.</p><p class="smallprint" style="margin-top:18px">Suggested sequence. QFT is a later framework, not a prerequisite for starting an introductory particle physics book.</p></div><div class="step-chain">${particlePath.map((s,i)=>`<a class="chain-step" href="#topic/${s.topic}"><span class="step-number">${number(i+1)}</span><div><h3>${s.title}</h3><p>${s.description}</p></div><span aria-hidden="true">↗</span></a>`).join('')}</div></section><div class="section-heading"><div><h2>Your semester map</h2><p>Physics and supporting mathematics from your planned semesters 3–8.</p></div><span class="tag lime">Semester 3 · current plan</span></div><div class="note-strip">A study companion based on your course plan, not an official syllabus. Later modules and book suggestions can change as your university timetable develops.</div><div class="semester-grid">${semesters.map(s=>`<section class="semester ${s.n===3?'current':''}" id="semester-${s.n}"><div class="semester-heading"><h3>Semester ${s.n}</h3><span class="micro">${s.label}</span></div>${s.items.map(x=>`<a class="semester-row" href="#topic/${x.topic}"><span>${x.name}</span><span aria-hidden="true">↗</span></a>`).join('')}<p>${s.note}</p></section>`).join('')}</div><div class="section-heading"><h2>Starting from the beginning?</h2></div><div class="current-grid"><a class="mini-path" href="#topic/mathematics"><div class="micro">01 / MATHEMATICS</div><h3>Learn the language</h3><p>Calculus, vectors, linear algebra, and differential equations. Return to these alongside your physics.</p></a><a class="mini-path" href="#topic/mechanics"><div class="micro">02 / FIRST PRINCIPLES</div><h3>Work through mechanics</h3><p>Start with OpenStax or MIT 8.01SC. Build toward Taylor, then Lagrangians and Hamiltonians.</p></a><a class="mini-path" href="#practice?mode=exercises"><div class="micro">03 / MAKE IT YOURS</div><h3>Practice as you go</h3><p>Attempt a problem before opening the hint. Use university papers after each substantial topic.</p></a></div>`);
 if(query.get('semester'))requestAnimationFrame(()=>document.getElementById('semester-'+query.get('semester'))?.scrollIntoView({block:'start'}));
}
function renderSources(){
 page(`<div class="eyebrow">BEHIND THE COLLECTION</div><h1>Sources, clearly marked.</h1><div class="source-section"><h2>A map, not the whole territory.</h2><p>Physics Atlas brings together ${resources.length} curated resources across ${topics.length} fields, plus ${exercises.length} original worked exercises. It is a starting collection spanning undergraduate foundations and selected graduate subjects. It does not claim to contain every topic, text, or examination.</p><p>The books and course materials stay on their publishers’, authors’, or institutions’ websites. This site organizes links and adds its own descriptions, study paths, and exercises.</p></div><section class="source-section"><h2>How to read the labels</h2><table class="source-table"><thead><tr><th>Label</th><th>What you can expect</th></tr></thead><tbody><tr><td>Free</td><td>The linked learning material is openly accessible. Its original copyright and reuse terms still apply.</td></tr><tr><td>Buy / borrow</td><td>A publisher or catalogue record for a commercial book. Check your university library for access.</td></tr><tr><td>Preview</td><td>Sample chapters or a partial preview, not a free complete textbook.</td></tr><tr><td>Official solutions</td><td>The institution publishes worked solutions for the linked collection.</td></tr><tr><td>Selected solutions</td><td>Only part of the linked collection has worked answers.</td></tr><tr><td>Answer keys</td><td>Correct choices or final answers; full reasoning may not be provided.</td></tr><tr><td>Hints only</td><td>The source offers partial guidance rather than complete worked solutions.</td></tr><tr><td>Not supplied</td><td>No public solution set is listed on the linked page.</td></tr></tbody></table></section><section class="source-section"><h2>The source collection</h2><ul><li>${ext('https://ocw.mit.edu/','MIT OpenCourseWare')}: courses, lecture notes, problem sets, and examinations.</li><li>${ext('https://davidtong.org/teaching/','David Tong, University of Cambridge')}: lecture notes and example sheets across theoretical physics.</li><li>${ext('https://openstax.org/','OpenStax, Rice University')}: open introductory textbooks.</li><li>${ext('https://www.feynmanlectures.caltech.edu/','The Feynman Lectures, Caltech')}: authorized online reading.</li><li>${ext('https://www.maths.cam.ac.uk/undergrad/pastpapers/past-ia-ib-and-ii-examination-papers','Cambridge Mathematical Tripos')}, ${ext('https://mmathphys.physics.ox.ac.uk/past-papers','Oxford mathematical and theoretical physics')}: past examinations with source-specific access limits.</li><li>${ext('https://olympiads.hbcse.tifr.res.in/how-to-prepare/past-papers/','HBCSE olympiad archives')} and ${ext('https://www.tifr.res.in/academics/past_question_papers.php','TIFR graduate school papers')}: challenging practice and available official answers.</li><li>${ext('https://opendata.cern.ch/','CERN Open Data')} and ${ext('https://gwosc.org/tutorials/','GWOSC')}: authentic experimental data and analysis tutorials.</li><li>Cambridge University Press, Oxford University Press, MIT Press / University Science Books, Wiley, Springer, Pearson, Dover, and author websites: textbook and reference information.</li></ul></section><section class="source-section"><h2>Your books and future studies</h2><p>The personal reading filter includes Taylor’s Classical Mechanics, Griffiths’ Introduction to Electrodynamics, Schiff’s Quantum Mechanics, Boas’ Mathematical Methods, Artin’s Algebra, Susskind and Friedman’s Quantum Mechanics, and the planned Szabo–Ostlund text. Other books are additional options for future study, not claims about books you already own.</p><p>Semester paths follow your physics and supporting mathematics plan. Descriptions and difficulty labels are Atlas editorial guidance; they are not endorsements from the linked institutions.</p></section><section class="source-section"><h2>Provenance and freshness</h2><p>Collection curated ${reviewedAt}. Source availability and editions may change. Links identified through official pages or source search results are recorded in the catalogue; no claim is made that every downloadable file was individually checked. Solution labels refer to the specific course year or collection shown, not every offering of a course.</p><p>The in-site exercises and worked solutions were written for Atlas with AI assistance. They are introductory checks, independent of the linked institutions. For assessed coursework, follow your course’s conventions and compare with your lecturer’s material.</p><p>No account is required. Scratchpad working is held only in the current tab and is cleared on reload. External resources open in a new tab and apply their own access and privacy rules.</p></section>`, 'source-layout');
}

main.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;
 const {action,value}=button.dataset;
 if(action==='family'){wheelFamily=value;wheelIndex=0;renderExplore();document.querySelectorAll('[data-action="family"]').forEach(b=>{if(b.dataset.value===value)b.focus({preventScroll:true});});}
 if(action==='rotate')rotate(Number(value));
 if(action==='orbit-card'){if($('#orbit-stage').dataset.dragged)return;if(Number(value)===wheelIndex)location.hash=`topic/${visibleTopics[wheelIndex].id}`;else{wheelIndex=Number(value);drawWheel();}}
 if(action==='reset-library'){libraryFilters={field:'all',type:'all',access:'all',q:'',personal:false};libraryLimit=24;renderLibrary();$('#library-search').focus();}
 if(action==='load-more'){const previous=libraryLimit;libraryLimit+=24;updateLibrary();$('#library-results').children[previous]?.querySelector('a')?.focus({preventScroll:true});}
 if(action==='reset-papers'){paperFilters={field:'all',level:'all',solutions:false,q:''};renderPapers();}
 if(action==='exercise'){currentExercise=value;drawExercise();}
 if(action==='exercise-step'){const list=exerciseField==='all'?exercises:exercises.filter(e=>e.topic===exerciseField),i=list.findIndex(e=>e.id===currentExercise);currentExercise=list[i+Number(value)]?.id||currentExercise;drawExercise();$('#exercise-work').scrollIntoView({block:'start',behavior:'smooth'});}
});
main.addEventListener('change',event=>{
 const key=event.target.dataset.filter,v=event.target.value;if(!key)return;
 if(key.startsWith('library-')){libraryFilters[key.slice(8)]=v;libraryLimit=24;updateLibrary();}
 if(key==='personal'){libraryFilters.personal=event.target.checked;libraryLimit=24;updateLibrary();}
 if(key==='paper-field'){paperFilters.field=v;updatePapers();}
 if(key==='paper-level'){paperFilters.level=v;updatePapers();}
 if(key==='paper-solutions'){paperFilters.solutions=event.target.checked;updatePapers();}
 if(key==='exercise-field'){exerciseField=v;currentExercise=null;renderExercises();}
});
function launchSearch(){if(routeParts().parts[0]!=='library')location.hash='library';setTimeout(()=>$('#library-search')?.focus(),50);}
$('#search-launch').addEventListener('click',launchSearch);
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();launchSearch();}});
window.addEventListener('hashchange',()=>{route();goFocus();});
route();
