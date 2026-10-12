(function(){
'use strict';
const $=s=>document.querySelector(s),canvas=$('#sceneCanvas');if(!canvas)return;
const ctx=canvas.getContext('2d');let objects=[],selected=0,nextId=1,yaw=.72,pitch=.48,zoom=5.2,showGrid=true,wire=false,drag=null,lastPinch=0;
const transformGrid=document.querySelector('.transform-grid');
function addControl(id,label,type,value){if(document.getElementById(id)||!transformGrid)return;const wrap=document.createElement('label');wrap.className='field';const cap=document.createElement('span');cap.textContent=label;const input=document.createElement('input');input.className='input';input.id=id;input.type=type;input.value=value;if(type==='number')input.step='5';if(type==='color')input.value='#bfc2c7';wrap.append(cap,input);transformGrid.appendChild(wrap)}
addControl('objRX','Вращение X°','number','0');addControl('objRY','Вращение Y°','number','0');addControl('objRZ','Вращение Z°','number','0');addControl('objColor','Цвет объекта','color','#bfc2c7');
if(!document.getElementById('objDuplicate')){const b=document.createElement('button');b.className='btn';b.id='objDuplicate';b.textContent='Дублировать объект';const del=document.getElementById('objDelete');if(del&&del.parentNode)del.parentNode.insertBefore(b,del)}

const storeKey='ar akul-scene-v1'.replace(/ /g,'');
function safeLoad(){try{const x=JSON.parse(localStorage.getItem(storeKey)||'null');if(Array.isArray(x)&&x.length)objects=x}catch(e){}}
function persist(){try{localStorage.setItem(storeKey,JSON.stringify(objects))}catch(e){}}
function add(type){const n={id:nextId++,type,name:({cube:'Cube',sphere:'Sphere',cylinder:'Cylinder',plane:'Plane'})[type]+' '+nextId,x:(objects.length%3-1)*1.4,y:0,z:Math.floor(objects.length/3)*1.2,scale:1,rx:0,ry:0,rz:0,color:'#bfc2c7'};objects.push(n);selected=objects.length-1;persist();list();fields();render()}
function geo(o){
 const v=[],f=[];
 if(o.type==='cube'){v.push([-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]);f.push([0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5])}
 else if(o.type==='plane'){v.push([-2,0,-2],[2,0,-2],[2,0,2],[-2,0,2]);f.push([0,1,2,3])}
 else if(o.type==='sphere'){const lat=10,lon=16;for(let i=0;i<=lat;i++){const p=Math.PI*i/lat;for(let j=0;j<=lon;j++){const t=2*Math.PI*j/lon;v.push([Math.sin(p)*Math.cos(t),Math.cos(p),Math.sin(p)*Math.sin(t)])}}for(let i=0;i<lat;i++)for(let j=0;j<lon;j++){const a=i*(lon+1)+j,b=a+lon+1;f.push([a,b,b+1,a+1])}}
 else {const n=20;for(let j=0;j<n;j++){const t=2*Math.PI*j/n;v.push([Math.cos(t),-1,Math.sin(t)])}for(let j=0;j<n;j++){const t=2*Math.PI*j/n;v.push([Math.cos(t),1,Math.sin(t)])}const bottom=v.length;v.push([0,-1,0]);const top=v.length;v.push([0,1,0]);for(let j=0;j<n;j++){const k=(j+1)%n;f.push([j,k,n+k,n+j],[bottom,k,j],[top,n+j,n+k])}}
 return {v,f}
}
function world(p,o){let [x,y,z]=p.map(n=>n*o.scale);let c=Math.cos,s=Math.sin;
 let a=y*0+o.rx*Math.PI/180,b=o.ry*Math.PI/180,d=o.rz*Math.PI/180;
 let y1=y*c(a)-z*s(a),z1=y*s(a)+z*c(a);let x2=x*c(b)+z1*s(b),z2=-x*s(b)+z1*c(b);let x3=x2*c(d)-y1*s(d),y3=x2*s(d)+y1*c(d);
 return [x3+o.x,y3+o.y,z2+o.z]
}
function project(p,w,h){let c=Math.cos,s=Math.sin;let x=p[0],y=p[1],z=p[2];let x1=x*c(yaw)-z*s(yaw),z1=x*s(yaw)+z*c(yaw);let y1=y*c(pitch)-z1*s(pitch),z2=y*s(pitch)+z1*c(pitch);let focal=Math.min(w,h)*.9;let d=zoom+z2;let k=focal/Math.max(.5,d);return [w/2+x1*k,h*.51-y1*k,z2]}
function line(a,b){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}
function render(){
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const w=rect.width,h=rect.height;
 ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--line').trim()||'#333';
 if(showGrid){for(let i=-10;i<=10;i++){let a=project([i*.5,-1.05,-5],w,h),b=project([i*.5,-1.05,5],w,h),c=project([-5,-1.05,i*.5],w,h),d=project([5,-1.05,i*.5],w,h);ctx.beginPath();line(a,b);line(c,d);ctx.stroke()}}
 // world axes
 const origin=project([0,-1.04,0],w,h);ctx.lineWidth=1.5;ctx.strokeStyle='#777';ctx.beginPath();line(origin,project([1.7,-1.04,0],w,h));line(origin,project([0,.8,0],w,h));line(origin,project([0,-1.04,1.7],w,h));ctx.stroke();
 const faces=[];
 objects.forEach((o,oi)=>{const g=geo(o),v=g.v.map(p=>project(world(p,o),w,h));g.f.forEach(face=>{const pts=face.map(i=>v[i]);faces.push({pts,depth:pts.reduce((s,p)=>s+p[2],0)/pts.length,oi,face})})});
 faces.sort((a,b)=>b.depth-a.depth);
 faces.forEach(f=>{ctx.beginPath();f.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(!wire){const tint=f.oi===selected?245:174;const hex=objects[f.oi].color||'#bfc2c7',rgb=[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];const shade=f.oi===selected?1:.7;ctx.fillStyle='rgba('+rgb.map(v=>Math.round(v*shade)).join(',')+','+(f.oi===selected?.42:.22)+')';ctx.fill()}ctx.strokeStyle=f.oi===selected?'#f5f5f5':'#81858d';ctx.lineWidth=f.oi===selected?1.5:.8;ctx.stroke()});
 ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim()||'#999';ctx.font='10px ui-monospace,monospace';ctx.fillText('ARAKUL 3D / '+objects.length+' OBJECTS',12,18);
}
function list(){const box=$('#objectList');box.replaceChildren();objects.forEach((o,i)=>{const b=document.createElement('button');b.className='object-item'+(i===selected?' active':'');b.innerHTML='<span>◇</span><span></span>';b.lastElementChild.textContent=o.name+' · '+o.type;b.addEventListener('click',()=>{selected=i;list();fields();render()});box.appendChild(b)});$('#sceneStatus').textContent=objects.length+' объектов · '+(objects[selected]?.name||'нет выбора')}
function fields(){const o=objects[selected];['objName','objX','objY','objZ','objScale','objRX','objRY','objRZ','objColor'].forEach(id=>$('#'+id).disabled=!o);if(!o)return;$('#objName').value=o.name;$('#objX').value=o.x;$('#objY').value=o.y;$('#objZ').value=o.z;$('#objScale').value=o.scale;$('#objRX').value=o.rx||0;$('#objRY').value=o.ry||0;$('#objRZ').value=o.rz||0;$('#objColor').value=o.color||'#bfc2c7'}
function edit(){const o=objects[selected];if(!o)return;o.name=$('#objName').value||'Object';o.x=+$('#objX').value||0;o.y=+$('#objY').value||0;o.z=+$('#objZ').value||0;o.scale=Math.max(.1,Math.min(5,+$('#objScale').value||1));o.rx=+$('#objRX').value||0;o.ry=+$('#objRY').value||0;o.rz=+$('#objRZ').value||0;o.color=$('#objColor').value||'#bfc2c7';persist();list();render()}
document.querySelectorAll('[data-add3d]').forEach(b=>b.addEventListener('click',()=>add(b.dataset.add3d)));
['objName','objX','objY','objZ','objScale','objRX','objRY','objRZ','objColor'].forEach(id=>$('#'+id).addEventListener('input',edit));
$('#objDuplicate').addEventListener('click',()=>{const o=objects[selected];if(!o)return;const n={...o,id:nextId++,name:o.name+' copy',x:o.x+.5,z:o.z+.5};objects.push(n);selected=objects.length-1;persist();list();fields();render()});
$('#objDelete').addEventListener('click',()=>{if(!objects.length)return;objects.splice(selected,1);selected=Math.max(0,selected-1);persist();list();fields();render()});
$('#sceneReset').addEventListener('click',()=>{objects=[];nextId=1;add('cube');add('plane');selected=0;persist();list();fields();render()});
$('#viewHome').addEventListener('click',()=>{yaw=.72;pitch=.48;zoom=5.2;render()});
$('#gridToggle').addEventListener('click',()=>{showGrid=!showGrid;$('#gridToggle').textContent=showGrid?'Сетка ✓':'Сетка';render()});
$('#wireToggle').addEventListener('click',()=>{wire=!wire;$('#wireToggle').textContent=wire?'Заливка':'Каркас';render()});
function download(name,data,type){const u=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function exportObj(){let out='# Arakul Studio OBJ export\n',offset=1;objects.forEach(o=>{const g=geo(o);out+='o '+o.name.replace(/\s+/g,'_')+'\n';g.v.forEach(p=>{const q=world(p,o);out+='v '+q.map(n=>n.toFixed(5)).join(' ')+'\n'});g.f.forEach(f=>out+='f '+f.map(i=>i+offset).join(' ')+'\n');offset+=g.v.length});download('arakul-scene.obj',out,'text/plain;charset=utf-8')}
function exportJson(){download('arakul-scene.json',JSON.stringify({format:'Arakul Scene v1',objects},null,2),'application/json')}
$('#sceneExport').addEventListener('click',exportObj);$('#sceneExportJson').addEventListener('click',exportJson);
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw,pitch,id:e.pointerId};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw=drag.yaw+(e.clientX-drag.x)*.009;pitch=Math.max(-1.25,Math.min(1.25,drag.pitch-(e.clientY-drag.y)*.009));render()});
canvas.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<5){const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height;let best=-1,dist=48;objects.forEach((o,i)=>{const p=project([o.x,o.y,o.z],w,h),d=Math.hypot(p[0]-(e.clientX-rect.left),p[1]-(e.clientY-rect.top));if(d<dist){dist=d;best=i}});if(best>=0){selected=best;list();fields();render()}}drag=null});canvas.addEventListener('pointercancel',()=>{drag=null});
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(2.5,Math.min(12,zoom+Math.sign(e.deltaY)*.35));render()},{passive:false});
function resize(){render()}window.addEventListener('resize',resize);
safeLoad();if(!objects.length){objects=[{id:nextId++,type:'cube',name:'Cube',x:0,y:0,z:0,scale:1,rx:0,ry:0,rz:0,color:'#bfc2c7'},{id:nextId++,type:'plane',name:'Ground',x:0,y:-1,z:0,scale:1,rx:0,ry:0,rz:0,color:'#bfc2c7'}]}nextId=Math.max(1,...objects.map(o=>o.id+1));selected=0;list();fields();render();
window.Arakul3D={resize,exportJson,exportObj};
})();