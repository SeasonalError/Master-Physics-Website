import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {topics} from '../dist/topics.js';
import {resources} from '../dist/resources.js';
import {exercises} from '../dist/exercises.js';
import {semesters,particlePath} from '../dist/pathways.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ids=new Set(topics.map(t=>t.id));
function unique(items,label){assert.equal(new Set(items.map(x=>x.id)).size,items.length,`Duplicate ${label} IDs`);}
unique(topics,'topic');unique(resources,'resource');unique(exercises,'exercise');
for(const t of topics){
 assert(t.name&&t.description&&t.units.length&&t.prerequisites.length,`Incomplete topic ${t.id}`);
 for(const n of t.next)assert(ids.has(n),`Unknown next field ${n}`);
 assert(resources.some(r=>r.topics.includes(t.id)),`No resources for ${t.id}`);
 assert(exercises.some(e=>e.topic===t.id),`No worked practice for ${t.id}`);
 assert(resources.some(r=>r.type==='Book'&&r.topics.includes(t.id)),`No book for ${t.id}`);
}
for(const r of resources){
 assert(r.title&&r.author&&r.description&&r.provider,`Incomplete resource ${r.id}`);
 assert(['Book','Course','Notes','Problems','Exams','Data'].includes(r.type));
 assert(['Free','Paid','Preview'].includes(r.access));
 for(const id of r.topics)assert(ids.has(id),`Unknown resource topic ${id}`);
 for(const url of [r.url,r.solutionUrl].filter(Boolean))assert.equal(new URL(url).protocol,'https:',`Non-HTTPS link in ${r.id}`);
 if(r.solutionUrl)assert(!['Not supplied','Not publicly supplied'].includes(r.solutions),`Contradictory solution label: ${r.id}`);
 if(['Official solutions','Selected solutions','Answer keys','Hints only'].includes(r.solutions))assert(r.solutionUrl,`Missing answer link: ${r.id}`);
}
for(const e of exercises){assert(ids.has(e.topic));assert(e.question&&e.hint&&e.steps.length>=3&&e.answer,`Incomplete exercise ${e.id}`);}
for(const s of semesters)for(const item of s.items)assert(ids.has(item.topic));
for(const step of particlePath)assert(ids.has(step.topic));
for(const name of ['app.js','topics.js','resources.js','exercises.js','pathways.js','foundation-papers.js','practice-subtopics.js'])execFileSync(process.execPath,['--check',resolve(root,'dist',name)]);
for(const entrypoint of ['index.html','dist/index.html']){
 const html=await readFile(resolve(root,entrypoint),'utf8');
 for(const [,path] of html.matchAll(/(?:href|src)="\.\/([^"]+)"/g))await access(resolve(root,dirname(entrypoint),path));
 assert(html.includes('type="module"'),`Missing module entrypoint in ${entrypoint}`);
 assert(html.includes('name="viewport"'),`Missing responsive viewport in ${entrypoint}`);
}
await access(resolve(root,'.nojekyll'));
await import('./validate-foundations.mjs');
const app=await readFile(resolve(root,'dist/app.js'),'utf8');
for(const [,id] of app.matchAll(/href="#topic\/([a-z-]+)(?:[?"#])/g))assert(ids.has(id),`Broken literal topic route ${id}`);
console.log(JSON.stringify({status:'passed',fields:topics.length,resources:resources.length,books:resources.filter(r=>r.type==='Book').length,paperCollections:resources.filter(r=>['Problems','Exams'].includes(r.type)).length,workedExercises:exercises.length,semesters:semesters.length,checks:['module syntax','asset references','catalogue schema','topic links','book and exercise coverage','solution-link consistency']},null,2));
