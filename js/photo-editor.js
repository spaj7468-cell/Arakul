(function(){
'use strict';
const $=id=>document.getElementById(id),canvas=$('photoCanvas'),ctx=canvas&&canvas.getContext('2d');
if(!canvas||!ctx)return;
let image=null,rotation=0,flip=false,caption='',undo=[];
const controls=['photoBrightness','photoContrast','photoSaturation','photoBlur','photoPreset'];
const v=id=>$(id).value;
function snapshot(){return {rotation,flip,caption,values:Object.fromEntries(controls.map(id=>[id,v(id)])),src:image?image.src:null}}
function remember(){undo.push(snapshot());if(undo.length>20)undo.shift();$('photoUndo').disabled=!undo.length}
function filter(){let b=+v('photoBrightness'),c=+v('photoContrast'),s=+v('photoSaturation'),blur=+v('photoBlur');const preset=v('photoPreset');if(preset==='mono')s=0;if(preset==='warm'){b*=1.02;s*=1.12}if(preset==='cool'){b*=.99;s*=.92}return 'brightness('+b+'%) contrast('+c+'%) saturate('+s+'%) blur('+blur+'px)'}
function render(){
 if(!image)return;
 const swap=Math.abs(rotation)%180===90,iw=swap?image.naturalHeight:image.naturalWidth,ih=swap?image.naturalWidth:image.naturalHeight;
 const scale=Math.min(1200/iw,800/ih,1);canvas.width=Math.max(1,Math.round(iw*scale));canvas.height=Math.max(1,Math.round(ih*scale));
 const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w/2,h/2);ctx.rotate(rotation*Math.PI/180);ctx.scale(flip?-1:1,1);ctx.filter=filter();
 const drawW=rotation%180===0?w:h,drawH=rotation%180===0?h:w;ctx.drawImage(image,-drawW/2,-drawH/2,drawW,drawH);ctx.filter='none';
 const preset=v('photoPreset');if(preset==='vintage'){ctx.fillStyle='rgba(190,135,70,.16)';ctx.fillRect(-w,-h,w*2,h*2);ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(-w,-h,w*2,h*2)}
 if(caption){const fs=Math.max(18,Math.round(w*.045));ctx.font='700 '+fs+'px Inter,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.lineWidth=fs*.16;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(caption,w/2,h-fs*.55,w*.88);ctx.fillStyle='#fff';ctx.fillText(caption,w/2,h-fs*.55,w*.88)}
 ctx.restore();$('photoDimensions').textContent=image.naturalWidth+' × '+image.naturalHeight+' px';$('photoEmpty').hidden=true;
}
$('photoFile').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>{remember();image=img;rotation=0;flip=false;caption='';$('photoName').textContent=f.name;$('photoCaption').value='';render()};img.onerror=()=>alert('Не удалось открыть изображение.');img.src=URL.createObjectURL(f)});
controls.forEach(id=>$(id).addEventListener('input',()=>{const suffix=id==='photoBlur'?' px':'%';$(id+'Val').textContent=v(id)+suffix;render()}));
$('photoRotateLeft').addEventListener('click',()=>{remember();rotation=(rotation-90+360)%360;render()});
$('photoRotateRight').addEventListener('click',()=>{remember();rotation=(rotation+90)%360;render()});
$('photoFlipH').addEventListener('click',()=>{remember();flip=!flip;render()});
$('photoAddCaption').addEventListener('click',()=>{remember();caption=$('photoCaption').value.trim();render()});
$('photoReset').addEventListener('click',()=>{if(!image)return;remember();rotation=0;flip=false;caption='';$('photoCaption').value='';$('photoBrightness').value=100;$('photoContrast').value=100;$('photoSaturation').value=100;$('photoBlur').value=0;$('photoPreset').value='none';['photoBrightness','photoContrast','photoSaturation'].forEach(id=>$(id+'Val').textContent='100%');$('photoBlurVal').textContent='0 px';render()});
$('photoCrop').addEventListener('click',()=>{
 if(!image)return;remember();
 let w=image.naturalWidth,h=image.naturalHeight,ratio=v('photoCropRatio');
 if(ratio!=='free'){const [rw,rh]=ratio.split(':').map(Number),r=rw/rh;if(w/h>r)w=h*r;else h=w/r}
 const sx=(image.naturalWidth-w)/2,sy=(image.naturalHeight-h)/2,c=document.createElement('canvas');c.width=Math.round(w);c.height=Math.round(h);c.getContext('2d').drawImage(image,sx,sy,w,h,0,0,c.width,c.height);
 const img=new Image();img.onload=()=>{image=img;rotation=0;flip=false;render()};img.src=c.toDataURL('image/png');$('photoCropRatio').value='free';
});
$('photoUndo').addEventListener('click',()=>{const s=undo.pop();if(!s)return;rotation=s.rotation;flip=s.flip;caption=s.caption;$('photoCaption').value=caption;controls.forEach(id=>$(id).value=s.values[id]);if(s.src){const im=new Image();im.onload=()=>{image=im;render()};im.src=s.src}render();$('photoUndo').disabled=!undo.length});
$('photoExport').addEventListener('click',()=>{if(!image){alert('Сначала открой фото.');return}const type=v('photoFormat'),a=document.createElement('a');a.download='arakul-photo.'+(type==='image/jpeg'?'jpg':type==='image/webp'?'webp':'png');a.href=canvas.toDataURL(type,type==='image/jpeg'?.92:.95);a.click()});
})();