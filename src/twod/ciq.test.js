import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseCIQ,ciq1DCurves,coordinateScale,orient,projections} from './core.js';
const trace=(param,value,offset=0)=>({params:{[param]:String(value)},freq:9.79,ReData:[[3000,1+offset],[3100,2+offset]],ImData:[[3000,-1-offset],[3100,-2-offset]]});
for(const [type,key,y,unit] of [['Field-Power','power','Microwave attenuation','dB'],['Field-Delay','delay','Delay',''],['Field-Modul.Amp.','modulamp','Modulation amplitude','G']]){
 const raw={type:'CW EPR/2D '+type+' Sweep',dataStore:{xAxisName:'Field[G]',lineDataList:[trace(key,2,10),trace(key,1)]}};
 const d=parseCIQ(raw,'test.epr');assert.equal(d.y.name,y);assert.equal(d.y.unit,unit);assert.deepEqual(d.y.values,[1,2]);assert.deepEqual(d.real,[[1,2],[11,12]]);assert.deepEqual(d.imag,[[-1,-2],[-11,-12]]);
 const broken=structuredClone(raw);delete broken.dataStore.lineDataList[0].params[key];assert.throws(()=>parseCIQ(broken,'missing'),/second-axis/);
 const duplicate=structuredClone(raw);duplicate.dataStore.lineDataList[0].params[key]='1';assert.throws(()=>parseCIQ(duplicate,'duplicate'));
}
const time={type:'CW EPR/1D Time Sweep',dataStore:{xAxisName:'Time[ms]',lineDataList:[{freq:9.79,ReData:[[0,1],[60000,2]]}]}};const c=ciq1DCurves(parseCIQ(time,'time.epr'))[0];assert.equal(c.xAxis.unit,'ms');assert.equal(coordinateScale(c,9.85),1);assert.deepEqual(c.B,[0,60000]);assert.equal(coordinateScale({...c,xAxis:{name:'Field',unit:'G'}},9.85),9.85/9.79);
const unknown=structuredClone(time);unknown.type='CW EPR/2D Unknown Sweep';assert.throws(()=>parseCIQ(unknown,'unknown'),/Unsupported/);
if(process.argv[2]){
 const expected={'1DFieldSweep.epr':[1200,1,'Field','G','Trace','',null],'1DTimeSweep.epr':[2000,1,'Time','ms','Trace','',null],'DelaySweep.epr':[1200,4,'Field','G','Delay','',[0,10,20,30]],'2DField-ModulAmpSweep.epr':[1200,9,'Field','G','Modulation amplitude','G',[0,.5,1,1.5,2,2.5,3,3.5,4]],'2DField-PowerSweep.epr':[1200,10,'Field','G','Microwave attenuation','dB',[20,21,22,23,24,25,26,27,28,29]],'2DTime-FieldSweep.epr':[1000,5,'Time','ms','Field','G',[3200,3275,3350,3425,3500]]};
 for(const [name,e]of Object.entries(expected)){
  const raw=JSON.parse(fs.readFileSync(process.argv[2]+'/'+name,'utf8')),d=parseCIQ(raw,name);assert.deepEqual([d.x.values.length,d.y.values.length,d.x.name,d.x.unit,d.y.name,d.y.unit],e.slice(0,6));if(e[6])assert.deepEqual(d.y.values,e[6]);
  for(let j=0;j<d.real.length;j++)for(let i=0;i<d.x.values.length;i++){assert.equal(d.real[j][i],raw.dataStore.lineDataList[j].ReData[i][1]);assert.equal(d.imag[j][i],raw.dataStore.lineDataList[j].ImData[i][1]);assert.equal(d.x.values[i],raw.dataStore.lineDataList[j].ReData[i][0]);}
  if(d.metadata.dimensions===2){const v=orient(d,'real',false),p=projections(v,[d.x.values[0],d.x.values.at(-1)],[d.y.values[0],d.y.values.at(-1)],'mean','mean');for(let i=0;i<d.x.values.length;i++)assert(Math.abs(p.x[i]-d.real.reduce((a,row)=>a+row[i],0)/d.real.length)<1e-10);assert.equal(JSON.parse(JSON.stringify(d)).real.length,d.real.length);}
  console.log(name+': '+d.x.values.length+' × '+d.y.values.length+'; coordinates and both channels exact');
 }
}
console.log('CIQTEK experiment types, coordinate semantics, row sorting, validation and time-axis scaling passed');
