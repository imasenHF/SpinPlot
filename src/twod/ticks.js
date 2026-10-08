// One formatter per axis keeps notation consistent across all ticks.
export function tickFormatter(values,{digits='',notation='auto'}={}){
 const finite=values.filter(Number.isFinite),peak=Math.max(0,...finite.map(Math.abs)),sorted=[...new Set(finite)].sort((a,b)=>a-b),step=sorted.slice(1).reduce((m,v,i)=>Math.min(m,v-sorted[i]),Infinity);
 const scientific=notation==='scientific'||notation==='auto'&&peak>0&&(peak<.01||peak>=1e5),exponent=scientific&&peak?Math.floor(Math.log10(peak)):0,scale=10**exponent;
 const manual=digits!==''&&Number.isFinite(Number(digits)),precision=manual?Math.max(1,Math.min(12,Math.round(Number(digits)))):Math.max(3,Math.min(12,Number.isFinite(step)&&peak?Math.ceil(Math.log10(peak/step))+1:3));
 const format=v=>{if(!Number.isFinite(v))return '';if(v===0||Math.abs(v)<(Number.isFinite(step)?step*1e-10:0))return '0';const n=Number((v/scale).toPrecision(precision));if(n===0)return '0';const decimals=Math.max(0,Math.min(20,precision-1-Math.floor(Math.log10(Math.abs(n)))));return n.toFixed(decimals).replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'');};
 return {format,exponent,multiplier:exponent?'×10'+String(exponent).split('').map(c=>({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c])).join(''):''};
}
