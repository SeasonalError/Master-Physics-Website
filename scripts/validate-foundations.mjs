import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {topics} from '../dist/topics.js';
import {resources} from '../dist/resources.js';
import {foundationPapers,existingPracticeFocus} from '../dist/foundation-papers.js';
import {practiceSubtopics,filterPractice,readPracticeFilters,practiceHash} from '../dist/practice-subtopics.js';

const report=JSON.parse(await readFile(new URL('../docs/foundational-practice-2026-09-09.json',import.meta.url),'utf8'));
const fields=['mechanics','electromagnetism','thermal','waves','quantum'];
const reviewed=new Map(report.documents.map(d=>[d.id,d]));
assert.equal(practiceSubtopics.length,38);
for(const field of fields){
 assert.deepEqual(practiceSubtopics.filter(s=>s.field===field).map(s=>s.name),topics.find(t=>t.id===field).units);
}
assert.equal(new Set(report.documents.map(d=>d.sha256)).size,report.documents.length,'Duplicate question PDFs in the review');
for(const r of resources.filter(r=>r.subtopics)){
 const evidence=reviewed.get(r.id);
 assert(evidence,`Missing source review: ${r.id}`);
 assert.equal(evidence.httpStatus,200);
 assert.equal(r.documentHash,evidence.sha256);
 assert.equal(r.documentUrl,evidence.questionUrl);
 assert.match(r.documentHash,/^[a-f0-9]{64}$/);
 assert.deepEqual(r.subtopics,Object.keys(r.focus));
 assert.deepEqual(r.focus,evidence.focus);
 for(const id of r.subtopics){
  const subtopic=practiceSubtopics.find(s=>s.id===id);
  assert(subtopic&&r.topics.includes(subtopic.field),`Misfiled subtopic ${r.id}: ${id}`);
  assert(r.focus[id].length>20,`Missing question guidance: ${r.id}`);
 }
 for(const url of [r.sourceUrl,r.documentUrl])assert.equal(new URL(url).protocol,'https:');
 if(evidence.solution){assert.equal(evidence.solution.httpStatus,200);assert.match(evidence.solution.sha256,/^[a-f0-9]{64}$/);}
}
assert.equal(foundationPapers.length,report.newResources);
assert.equal(Object.keys(existingPracticeFocus).length,report.existingResourcesTagged);
for(const subtopic of practiceSubtopics){
 const filters={field:subtopic.field,subtopic:subtopic.id,level:'all',solutions:false};
 const papers=filterPractice(resources,filters);
 assert(new Set(papers.map(r=>r.documentHash)).size>=5,`Fewer than five distinct papers: ${subtopic.name}`);
 assert.equal(papers.length,report.coverage.find(s=>s.id===subtopic.id).papers);
 assert.deepEqual(readPracticeFilters(new URLSearchParams(practiceHash(filters).split('?')[1])),filters);
 assert.equal(filterPractice(resources,{...filters,field:'all'}).length,papers.length);
 for(const level of ['Foundation','Undergraduate','Advanced','Graduate']){
  const result=filterPractice(resources,{...filters,level,solutions:true});
  assert(result.every(r=>r.level===level&&r.solutionUrl&&['Official solutions','Selected solutions'].includes(r.solutions)));
 }
}
assert.deepEqual(readPracticeFilters(new URLSearchParams('field=missing&subtopic=missing&level=missing&solutions=no')),
 {field:'all',subtopic:'all',level:'all',solutions:false});
assert.equal(readPracticeFilters(new URLSearchParams('field=quantum&subtopic=mechanics-lagrangian-mechanics')).subtopic,'all');
const lagrange=filterPractice(resources,{field:'mechanics',subtopic:'mechanics-lagrangian-mechanics'});
assert(lagrange.some(r=>r.id==='foundation-tongcm-mf1'));
assert(!lagrange.some(r=>r.id==='foundation-qm0618-problem-set-8'));
assert.equal(filterPractice(resources,{field:'mechanics',subtopic:'mechanics-lagrangian-mechanics',level:'Foundation',solutions:true}).length,0);
console.log(`Foundational practice passed: ${practiceSubtopics.length} subtopics, ${report.documents.length} distinct PDFs, minimum five per subtopic; source metadata, filter intersections and bookmark routes checked.`);
