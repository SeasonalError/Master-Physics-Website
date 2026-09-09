import {topics} from './topics.js';

// One practice category for every unit already listed in the five foundational fields.
const unitSlugs = {
 mechanics:['newtonian-dynamics','energy-momentum','oscillations','central-forces','lagrangian-mechanics','hamiltonian-mechanics','rigid-bodies','chaos'],
 electromagnetism:['electrostatics','gauss-law','potential-boundaries','dielectrics','magnetostatics','induction','maxwell-equations','radiation'],
 thermal:['laws','equations-of-state','entropy','potentials','maxwell-relations','heat-engines','phase-equilibrium'],
 waves:['harmonic-motion','damping-resonance','normal-modes','wave-equation','superposition','fourier-analysis','dispersion'],
 quantum:['wavefunctions','operators-measurement','bound-states','angular-momentum','spin','perturbation-theory','identical-particles','scattering']
};
export const practiceSubtopics = Object.entries(unitSlugs).flatMap(([field,slugs]) =>
 slugs.map((slug,index) => ({id:`${field}-${slug}`,field,name:topics.find(t=>t.id===field).units[index]}))
);
export const subtopicsFor = field => practiceSubtopics.filter(s=>field==='all'||s.field===field);
export const validSubtopic = (field,id) => subtopicsFor(field).some(s=>s.id===id)?id:'all';
export const isPracticeResource = r => ['Problems','Exams'].includes(r.type);
export function filterPractice(resources,filters={}){
 const {field='all',level='all',solutions=false}=filters;
 const subtopic=validSubtopic(field,filters.subtopic);
 return resources.filter(r=>isPracticeResource(r)
  &&(field==='all'||r.topics.includes(field))
  &&(subtopic==='all'||r.subtopics?.includes(subtopic))
  &&(level==='all'||r.level===level)
  &&(!solutions||['Official solutions','Selected solutions'].includes(r.solutions)));
}
export function readPracticeFilters(query){
 const requestedField=query.get('field');
 const field=topics.some(t=>t.id===requestedField)?requestedField:'all';
 const requestedLevel=query.get('level');
 return {field,subtopic:validSubtopic(field,query.get('subtopic')),
  level:['Foundation','Undergraduate','Advanced','Graduate'].includes(requestedLevel)?requestedLevel:'all',
  solutions:query.get('solutions')==='yes'};
}
export function practiceHash(filters){
 const query=new URLSearchParams();
 if(filters.field!=='all')query.set('field',filters.field);
 const subtopic=validSubtopic(filters.field,filters.subtopic);
 if(subtopic!=='all')query.set('subtopic',subtopic);
 if(filters.level!=='all')query.set('level',filters.level);
 if(filters.solutions)query.set('solutions','yes');
 return '#practice'+(query.size?'?'+query:'');
}
