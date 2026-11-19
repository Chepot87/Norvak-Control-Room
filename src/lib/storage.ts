import {makeSeed,upgrade,scheduleIssues,minutes,type Workspace} from './workspace.ts';
import {workspaceSchema} from './workspace-schema.ts';
export const STORAGE_KEY='norvak-control-room:workspace:v1';
export type StorageLike=Pick<Storage,'getItem'|'setItem'>;
export type StoredWorkspace={revision:number;state:Workspace;savedAt:string};
export function parseWorkspaceJson(raw:string):Workspace{
 if(raw.length>3_000_000)throw Error('Esta copia es demasiado grande. Usa un archivo de menos de 3 MB.');
 let input:any;try{input=JSON.parse(raw)}catch{throw Error('El archivo no contiene una copia JSON válida.')}
 const original=input?.state??input;
 if(!original||typeof original!=='object'||Array.isArray(original)||!(original.workspaceVersion===2||(Array.isArray(original.tasks)&&Array.isArray(original.notes))))throw Error('Este archivo no es una copia de Norvak Control Room.');
 const parsed=workspaceSchema.safeParse(upgrade(original));
 if(!parsed.success)throw Error('La copia tiene campos incompletos o valores no compatibles.');
 const s=parsed.data,r=s.rhythm;
 if(minutes(r.workEnd)<=minutes(r.workStart)||minutes(r.pickupTime)-r.pickupBefore<0||minutes(r.pickupTime)+r.pickupAfter>=1440||minutes(r.workoutStart)+r.workoutMinutes>=1440||s.blocks.some(b=>minutes(b.end)<=minutes(b.start))||scheduleIssues(s.blocks,r).length)throw Error('La copia tiene bloques de horario superpuestos o fuera de rango.');
 return s;
}
export function loadWorkspace(storage:StorageLike):StoredWorkspace{
 const raw=storage.getItem(STORAGE_KEY);
 if(!raw)return {revision:0,state:makeSeed(),savedAt:''};
 const record=JSON.parse(raw);if(!Number.isInteger(record.revision)||record.revision<1)throw Error('No se pudo leer la versión guardada. Conserva una copia antes de restablecerla.');
 return {revision:record.revision,state:parseWorkspaceJson(raw),savedAt:record.savedAt||''};
}
export function saveWorkspace(storage:StorageLike,state:Workspace,expectedRevision:number):StoredWorkspace{
 const previous=loadWorkspace(storage);
 if(previous.revision!==expectedRevision)throw Error('Hay cambios más recientes en otra pestaña. Descarga una copia y recarga antes de continuar.');
 const validated=parseWorkspaceJson(JSON.stringify(state));
 const next={revision:expectedRevision+1,state:validated,savedAt:new Date().toISOString()};
 storage.setItem(STORAGE_KEY,JSON.stringify(next));return next;
}
