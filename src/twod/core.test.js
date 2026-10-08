import assert from 'node:assert/strict';
import {parseCIQ,orient,projections,parseBES,binary,validate,reduce} from './core.js';
const raw={type:'Transient EPR/2D Tr-EPR',setting:{lineEdit_2DTrEPR_StartField:3000,lineEdit_2DTrEPR_StopField:3100},dataStore:{lineDataList:[{ReData:[[0,1],[10,3]],ImData:[[0,2],[10,4]]},{ReData:[[0,2],[10,4]],ImData:[[0,3],[10,5]]}]}};
const d=parseCIQ(raw,'test'),v=orient(d,'real',true);assert.deepEqual(v.z,[[1,2],[3,4]]);const p=projections(v,[3000,3100],[0,10]);assert.deepEqual(p.x,[2,3]);assert.equal(p.y[0],Math.sqrt(2.5));assert.deepEqual(projections(v,[3000,3000],[10,10]).x,[3,4]);assert.throws(()=>projections(v,[0,1],[0,10]));assert.throws(()=>validate({...d,x:{values:[0,0]}}));
const buffer=new ArrayBuffer(32);[1,2,3,4].forEach((x,i)=>new DataView(buffer).setFloat64(i*8,x,false));assert.deepEqual(binary(buffer,'D',false,4),[1,2,3,4]);
const files=[{name:'sample.DTA',arrayBuffer:async()=>buffer}],dsc={name:'sample.DSC',text:async()=>"XPTS 2\nYPTS 2\nXMIN 0\nXWID 10\nYMIN 3000\nYWID 100\nXNAM 'Time'\nXUNI 'ns'\nYNAM 'Field'\nYUNI 'G'\nIRFMT D\nBSEQ BIG"};assert.deepEqual((await parseBES(dsc,files)).real,[[1,2],[3,4]]);assert.throws(()=>binary(new ArrayBuffer(3),'D',true,1));console.log('2D parsing, transpose, range selection, mean/RMS and validation passed');

// Signed extrema, selected subranges, and missing samples on both axes.
const pv={x:{values:[0,1,2]},y:{values:[0,1,2]},z:[[-5,2,NaN],[3,-4,7],[1,8,NaN]]};
for(const [mode,x,y]of [['max',[3,8,7],[2,7,8]],['min',[-5,-4,7],[-5,-4,1]],['mean',[-1/3,2,7],[-1.5,2,4.5]],['ptp',[8,12,0],[7,11,7]]]){const p=projections(pv,[0,2],[0,2],mode,mode);assert.deepEqual(p.x,x);assert.deepEqual(p.y,y);}
assert.deepEqual(projections(pv,[0,1],[0,1],'ptp','max').x,[8,6,0]);
for(const mode of ['max','min','mean','ptp','rms','sum'])assert(Number.isNaN(reduce([NaN,Infinity],mode)));
console.log('Maximum/minimum/mean/peak-to-peak projections passed on both axes');
