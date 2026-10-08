import assert from 'node:assert/strict';
import {axisKind,fieldToGauss} from './core.js';
import {defaults,render,projectionColor,projectionCsv} from './ui.js';
for(const [name,unit,kind]of [['Power','mW','power'],['Angle','deg','angle'],['Temperature','K','temperature'],['Modulation amplitude','mT','modulation'],['Delay','ns','time'],['Field','mT','field']])assert.equal(axisKind({name,unit}),kind);
assert.equal(fieldToGauss({name:'Modulation amplitude',unit:'G'}),null);
assert.equal(fieldToGauss({name:'Field',unit:'mT'}),10);
const d={name:'PRIVATE_FILE.DSC',x:{name:'Power',unit:'mW',values:[1,2]},y:{name:'Field',unit:'mT',values:[300,310]},real:[[1,2],[3,4]],imag:[[0,0],[0,0]]};
const s=defaults(d);assert.equal(s.swap,true);assert.equal(projectionColor(s,{scheme:'matlab'}),'#0072BD');s.projectionScheme='jacs';assert.equal(projectionColor(s,{scheme:'matlab'}),'#1F5A85');s.scheme='plasma';assert.equal(projectionColor(s,{scheme:'matlab'}),'#1F5A85');
function draw(s,title=''){const texts=[];const ctx=new Proxy({drawImage:undefined,fillText:(...a)=>texts.push(a)},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});const g=render(ctx,d,s,{cellX:0,cellY:0,cellW:1000,cellH:700},'Arial',{text:'#000',axis:'#000'},title,{scheme:'matlab',g:{show:true,decimals:3,label:'g factor',titleDistance:22},frequency:9.85,gTicks:(lo,hi)=>[(lo+hi)/2]});return {texts,g};}
const {texts,g}=draw(s,'My spectrum');assert(!texts.some(a=>a[0]===d.name));assert.equal(texts.find(a=>a[0]==='My spectrum')[1],g.titleCenter);assert(texts.some(a=>a[0]==='g factor'));assert(!draw(s).texts.some(a=>a[0]===d.name));s.swap=false;s.xMin=1;s.xMax=2;s.yMin=300;s.yMax=310;s.projectionXMin=1;s.projectionXMax=2;s.projectionYMin=300;s.projectionYMax=310;assert(draw(s).texts.some(a=>a[0]==='g factor'));assert(projectionCsv(d,s).includes('projectionXRange'));
console.log('Shared palette, title center, both magnetic-axis orientations, units and projection CSV passed');
