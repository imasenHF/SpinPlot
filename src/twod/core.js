// Signal storage: rows are Y, columns are X; X varies fastest in BES3T.
export function validate(d){
 if(d.x.values.length<2||d.y.values.length<2||d.real.length!==d.y.values.length||d.real.some(r=>r.length!==d.x.values.length))throw Error('Invalid 2D matrix dimensions');
 for(const a of [d.x,d.y]){if(a.values.some(v=>!Number.isFinite(v)))throw Error('Invalid axis coordinates');let sign=0;for(let i=1;i<a.values.length;i++){const s=Math.sign(a.values[i]-a.values[i-1]);if(!s||sign&&s!==sign)throw Error('Axes must be strictly monotonic (no duplicates)');sign=s;}}
 return d;
}
const num=v=>v===null||v===undefined||v===''?NaN:Number(v);
const lin=(a,b,n)=>Array.from({length:n},(_,i)=>a+(b-a)*i/(n-1));
export function parseCIQ(raw,name){
 const lines=raw.dataStore?.lineDataList,s=raw.setting||{};if(!lines?.length)throw Error('Missing lineDataList');
 const tr=raw.type==='Transient EPR/2D Tr-EPR',cw=raw.type==='CW EPR/2D Field-Power Sweep';if(!tr&&!cw)throw Error('Not a supported CIQTEK 2D experiment');
 const values=lines[0].ReData.map(p=>num(p[0]));
 for(const l of lines){if(l.ReData.length!==values.length||l.ReData.some((p,i)=>Math.abs(num(p[0])-values[i])>1e-8))throw Error('Trace axes differ');if(l.ImData?.length&& (l.ImData.length!==values.length||l.ImData.some((p,i)=>Math.abs(num(p[0])-values[i])>1e-8)))throw Error('Imaginary trace axes differ');}
 const y=tr?{name:'Field',unit:'G',values:lin(num(s.lineEdit_2DTrEPR_StartField),num(s.lineEdit_2DTrEPR_StopField),lines.length)}:{name:'Microwave attenuation',unit:'dB',values:lines.map(l=>num(l.params?.power))};
 return validate({name,x:{name:tr?'Time':'Field',unit:tr?'ns':'G',values},y,real:lines.map(l=>l.ReData.map(p=>num(p[1]))),imag:lines.map(l=>l.ImData?.length?l.ImData.map(p=>num(p[1])):values.map(()=>0)),metadata:{type:raw.type,setting:s,frequencies:lines.map(l=>l.freq??s.frequency)}});
}
export function parseDescriptor(text){const p={};for(const line of text.split(/\r?\n/)){const m=line.trim().match(/^([A-Za-z][\w]*)\s+(.+)$/);if(m)p[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}return p;}
export function binary(buffer,fmt,little,count){const types={D:[8,'getFloat64'],F:[4,'getFloat32'],I:[4,'getInt32'],S:[2,'getInt16'],C:[1,'getInt8']},t=types[fmt];if(!t)throw Error('Unsupported binary format '+fmt);if(buffer.byteLength!==count*t[0])throw Error('Binary length mismatch');const v=new DataView(buffer);return Array.from({length:count},(_,i)=>v[t[1]](i*t[0],little));}
export async function parseBES(dsc,files){
 const p=parseDescriptor(await dsc.text()),nx=num(p.XPTS),ny=num(p.YPTS),nz=num(p.ZPTS??1);if(!Number.isInteger(nx)||!Number.isInteger(ny)||nx<2||ny<2||nz!==1)throw Error('Requires a 2D BES3T dataset (ZPTS=1)');
 const base=dsc.name.replace(/\.dsc$/i,'').toLowerCase(),get=ext=>{const f=files.find(f=>f.name.toLowerCase()===base+'.'+ext.toLowerCase());if(!f)throw Error('Missing '+base+'.'+ext);return f;};
 if(!['BIG','LIT'].includes(p.BSEQ??'BIG'))throw Error('Unsupported byte order');const le=p.BSEQ==='LIT',complex=p.IKKF==='CPLX';if(!['REAL','CPLX'].includes(p.IKKF??'REAL'))throw Error('Unsupported signal channels');if(p.IIFMT&&p.IIFMT!==p.IRFMT)throw Error('Real/imaginary formats differ');
 async function axis(k,n){const typ=p[k+'TYP']??'IDX';let values;if(typ==='IDX'){if(!Number.isFinite(num(p[k+'MIN']))||!Number.isFinite(num(p[k+'WID'])))throw Error('Missing '+k+' axis bounds');values=lin(num(p[k+'MIN']),num(p[k+'MIN'])+num(p[k+'WID']),n);}else if(typ==='IGD')values=binary(await get(k+'GF').arrayBuffer(),p[k+'FMT']??'D',le,n);else throw Error('Unsupported axis '+typ);return {name:p[k+'NAM']??k,unit:p[k+'UNI']??'',values};}
 const a=binary(await get('DTA').arrayBuffer(),p.IRFMT,le,nx*ny*(complex?2:1));const real=[],imag=[];for(let j=0;j<ny;j++){real.push(Array.from({length:nx},(_,i)=>a[(j*nx+i)*(complex?2:1)]));imag.push(Array.from({length:nx},(_,i)=>complex?a[(j*nx+i)*2+1]:0));}
 return validate({name:dsc.name,x:await axis('X',nx),y:await axis('Y',ny),real,imag,metadata:p});
}
export function orient(d,component='real',swap=false){let z=d.real.map((r,j)=>r.map((v,i)=>component==='imag'?d.imag[j][i]:component==='magnitude'?Math.hypot(v,d.imag[j][i]):v));return swap?{x:d.y,y:d.x,z:d.x.values.map((_,i)=>z.map(r=>r[i]))}:{x:d.x,y:d.y,z};}
export function reduce(values,mode){let sum=0,n=0;for(const v of values)if(Number.isFinite(v)){sum+=mode==='rms'?v*v:v;n++;}return n?(mode==='rms'?Math.sqrt(sum/n):mode==='sum'?sum:sum/n):NaN;}
export function projections(v,xRange,yRange,xMode='mean',yMode='rms'){
 const xi=v.x.values.map((x,i)=>x>=xRange[0]&&x<=xRange[1]?i:-1).filter(i=>i>=0),yi=v.y.values.map((y,i)=>y>=yRange[0]&&y<=yRange[1]?i:-1).filter(i=>i>=0);if(!xi.length||!yi.length)throw Error('Projection range contains no samples');
 return {xi,yi,x:v.x.values.map((_,i)=>reduce(yi.map(j=>v.z[j][i]),xMode)),y:v.y.values.map((_,j)=>reduce(xi.map(i=>v.z[j][i]),yMode))};
}
