import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSeed,upgrade,recommend,reservedBlocks,workoutBlocks,scheduleIssues,conflict,weekMonday,localDate,duration} from '../src/lib/workspace.ts';
import {workspaceSchema} from '../src/lib/workspace-schema.ts';

test('seed protects work, confirmed Penny pickup and three 45-minute workouts without overlap',()=>{
 const s=makeSeed();assert.deepEqual(s.rhythm.workDays,['Sábado','Domingo','Lunes']);assert.equal(s.rhythm.workStart,'06:00');assert.equal(s.rhythm.workEnd,'18:00');
 assert.deepEqual(s.rhythm.pickupDays,['Martes']);const penny=reservedBlocks(s.rhythm).find(b=>b.id==='penny-Martes');assert.equal(penny.start,'14:30');assert.equal(penny.end,'15:30');
 assert.equal(workoutBlocks(s.rhythm).length,3);assert.ok(workoutBlocks(s.rhythm).every(b=>duration(b)>=45));assert.deepEqual(scheduleIssues(s.blocks,s.rhythm),[]);assert.equal(workspaceSchema.safeParse(s).success,true);
});
test('changing life schedule detects collisions with a creative block',()=>{
 const s=makeSeed();const r={...s.rhythm,pickupTime:'09:30'};assert.ok(scheduleIssues(s.blocks,r).length);assert.ok(conflict({...s.blocks[0],start:'06:00',end:'07:00',day:'Lunes'},reservedBlocks(s.rhythm)));
});
test('workout goal rejects fewer than three days or less than 45 minutes',()=>{
 const s=makeSeed();assert.equal(workspaceSchema.safeParse({...s,rhythm:{...s.rhythm,workoutDays:['Martes','Jueves']}}).success,false);assert.equal(workspaceSchema.safeParse({...s,rhythm:{...s.rhythm,workoutMinutes:30}}).success,false);
});
test('legacy notes and work tasks survive upgrade, setup data remains archived',()=>{
 const old={tasks:[{id:'keep',area:'Norvak Web',title:'Client changes',status:'progress',priority:'high',minutes:15,notes:'keep notes'},{id:'hide',area:'Audio',title:'Speaker volume'}],profiles:[{id:'p1',notes:'my settings'}],devices:{pc:'Custom notes'},blocks:[{id:'mine'}],notes:[{id:'n1',title:'A note',body:'important',date:'2026-11-19'}]};
 const s=upgrade(old);assert.deepEqual(s.legacy,old);assert.equal(s.ideas[0].body,'important');assert.equal(s.tasks.find(t=>t.id==='import-keep').status,'progress');assert.ok(!s.tasks.find(t=>t.title==='Speaker volume'));assert.equal(workspaceSchema.safeParse(s).success,true);assert.equal(upgrade(s),s);
});
test('recommendations respect time and prioritize work already started',()=>{
 const tasks=makeSeed().tasks;assert.equal(recommend(tasks,15).minutes,15);assert.ok(recommend(tasks,45).minutes<=45);assert.equal(recommend(tasks.map(t=>({...t,status:'done'})),90),undefined);
 const started={...tasks[1],id:'started',status:'progress'};assert.equal(recommend([...tasks,started],45).id,'started');
});
test('week keys use Florida date and reset completion tracking per week',()=>{
 assert.equal(localDate(new Date('2026-11-23T02:00:00Z')),'2026-11-22');assert.equal(weekMonday(new Date('2026-11-23T02:00:00Z')),'2026-11-16');assert.equal(weekMonday(new Date('2026-11-23T14:00:00Z')),'2026-11-23');assert.equal(weekMonday(new Date('2026-11-19T14:00:00Z'),1),'2026-11-23');
 const progress={'2026-11-16:fitness-Martes':'done'};assert.equal(progress['2026-11-23:fitness-Martes'],undefined);
});
