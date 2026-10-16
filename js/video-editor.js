(function(){
'use strict';
const $=id=>document.getElementById(id);
const video=$('videoSource'),canvas=$('videoCanvas'),ctx=canvas&&canvas.getContext('2d');
if(!video||!canvas||!ctx)return;
let url='',duration=0,raf=0,recorder=null,chunks=[],exporting=false;
const controls=['videoTitle','videoTitlePosition','videoSpeed','videoBrightness','videoContrast','videoSaturation','videoMute','videoAspect'];
const val=id=>$(id).value;
function fmt(t){t=Math.max(0,Number(t)||0);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')}
function settings(){return {title:val('videoTitle'),position:val('videoTitlePosition'),brightness:+val('videoBrightness'),contrast:+val('videoContrast'),saturation:+val('videoSaturation'),aspect:val('videoAspect')}}
function draw(){
 if(!video.videoWidth||!video.videoHeight)return;
 const s=settings(),w=canvas.width,h=canvas.height;
 let ratio=video.videoWidth/video.videoHeight;
 if(s.aspect==='16:9')ratio=16/9;if(s.aspect==='9:16')ratio=9/16;if(s.aspect==='1:1')ratio=1;
 if(Math.abs(w/h-ratio)>.01){canvas.width=Math.round(720*ratio);canvas.height=720}
 const cw=canvas.width,ch=canvas.height,srcRatio=video.videoWidth/video.videoHeight;
 let sx=0,sy=0,sw=video.videoWidth,sh=video.videoHeight;
 if(srcRatio>ratio){sw=video.videoHeight*ratio;sx=(video.videoWidth-sw)/2}else{sh=video.videoWidth/ratio;sy=(video.videoHeight-sh)/2}
 ctx.clearRect(0,0,cw,ch);ctx.fillStyle='#08080a';ctx.fillRect(0,0,cw,ch);
 ctx.filter='brightness('+s.brightness+'%) contrast('+s.contrast+'%) saturate('+s.saturation+'%)';
 ctx.drawImage(video,sx,sy,sw,sh,0,0,cw,ch);ctx.filter='none';
 if(s.title.trim()){
  const fs=Math.max(22,Math.round(cw*.047)),y=s.position==='top'?fs*1.8:s.position==='center'?ch/2:ch-fs*1.7;
  ctx.font='700 '+fs+'px Inter,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  const max=cw*.86,words=s.title.trim().split(/\s+/),lines=[];let line='';
  words.forEach(word=>{const test=line?line+' '+word:word;if(ctx.measureText(test).width>max&&line){lines.push(line);line=word}else line=test});if(line)lines.push(line);
  const lineH=fs*1.2,startY=y-(lines.length-1)*lineH/2;
  lines.forEach((l,i)=>{const yy=startY+i*lineH;ctx.lineWidth=Math.max(3,fs*.18);ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(l,cw/2,yy,max);ctx.fillStyle='#fff';ctx.fillText(l,cw/2,yy,max)});
 }
 $('videoClock').textContent=fmt(video.currentTime)+' / '+fmt(duration);
 const start=duration?Math.min(100,Math.max(0,+val('videoTrimStart')/duration*100)):0;
 const end=duration?Math.min(100,Math.max(start,+val('videoTrimEnd')/duration*100)):100;
 $('videoTrimVisual').style.left=start+'%';$('videoTrimVisual').style.width=(end-start)+'%';
}
function loop(){draw();raf=requestAnimationFrame(loop)}
function loaded(){
 duration=Number.isFinite(video.duration)?video.duration:0;
 $('videoTrimStart').max=duration;$('videoTrimEnd').max=duration;$('videoTrimEnd').value=duration.toFixed(1);
 $('videoSeek').disabled=false;$('videoPlay').disabled=false;$('videoFrame').disabled=false;$('videoExport').disabled=false;
 $('videoStatus').textContent=video.videoWidth+' × '+video.videoHeight+' · '+fmt(duration);
 $('videoEmpty').hidden=true;draw();
 if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
$('videoFile').addEventListener('change',e=>{
 const file=e.target.files&&e.target.files[0];if(!file)return;
 if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);video.pause();video.src=url;video.load();
 $('videoStatus').textContent='Загружаю '+file.name;$('videoEmpty').hidden=false;$('videoEmpty').querySelector('strong').textContent=file.name;
 video.addEventListener('loadedmetadata',loaded,{once:true});
 video.addEventListener('error',()=>{$('videoStatus').textContent='Этот формат не поддерживается браузером';$('videoEmpty').hidden=false},{once:true});
});
$('videoPlay').addEventListener('click',async()=>{
 if(video.paused){const end=+$('videoTrimEnd').value||duration;if(video.currentTime<+$('videoTrimStart').value||video.currentTime>=end)video.currentTime=+$('videoTrimStart').value;try{await video.play();$('videoPlay').textContent='Ⅱ Пауза'}catch(e){$('videoStatus').textContent='Не удалось запустить видео'}}
 else{video.pause();$('videoPlay').textContent='▶ Воспроизвести'}
});
video.addEventListener('pause',()=>{$('videoPlay').textContent='▶ Воспроизвести'});
video.addEventListener('timeupdate',()=>{if(duration&&!$('videoSeek').matches(':active'))$('videoSeek').value=Math.round(video.currentTime/duration*1000);const end=+$('videoTrimEnd').value||duration;if(!exporting&&video.currentTime>=end&& !video.paused)video.pause();draw()});
$('videoSeek').addEventListener('input',()=>{if(duration)video.currentTime=+$('videoSeek').value/1000*duration});
$('videoFrame').addEventListener('click',()=>{video.pause();$('videoPlay').textContent='▶ Воспроизвести';draw()});
controls.forEach(id=>$(id).addEventListener('input',()=>{const pairs={videoSpeed:'×',videoBrightness:'%',videoContrast:'%',videoSaturation:'%'};if(pairs[id])$(id+'Val').textContent=val(id)+pairs[id];if(id==='videoSpeed')video.playbackRate=+val(id);if(id==='videoMute')video.muted=$(id).checked;draw()}));
['videoTrimStart','videoTrimEnd'].forEach(id=>$(id).addEventListener('change',()=>{let a=Math.max(0,Math.min(duration,+$('videoTrimStart').value||0)),b=Math.max(0,Math.min(duration,+$('videoTrimEnd').value||duration));if(b<=a)b=Math.min(duration,a+.1);$('videoTrimStart').value=a.toFixed(1);$('videoTrimEnd').value=b.toFixed(1);draw()}));
$('videoReset').addEventListener('click',()=>{ $('videoTitle').value='';$('videoTitlePosition').value='bottom';$('videoSpeed').value=1;$('videoBrightness').value=100;$('videoContrast').value=100;$('videoSaturation').value=100;$('videoMute').checked=false;$('videoAspect').value='source';video.playbackRate=1;video.muted=false;['videoSpeed','videoBrightness','videoContrast','videoSaturation'].forEach(id=>$(id+'Val').textContent=val(id)+(id==='videoSpeed'?'×':'%'));draw()});
function exportFinished(blob){
 exporting=false;$('videoExport').disabled=false;$('videoExport').textContent='Экспорт WebM ↓';
 if(!blob||!blob.size){$('videoExportNote').textContent='Экспорт не удался: браузер не создал видеофайл.';return}
 const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='arakul-edit.webm';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);
 $('videoExportNote').textContent='Готово: arakul-edit.webm · '+(blob.size/1024/1024).toFixed(1)+' МБ';
}
$('videoExport').addEventListener('click',async()=>{
 if(!video.videoWidth||exporting)return;
 if(!('MediaRecorder'in window)||!canvas.captureStream){$('videoExportNote').textContent='Экспорт WebM не поддерживается этим браузером. Попробуй актуальный Chrome или Edge.';return}
 const start=Math.max(0,+$('videoTrimStart').value||0),end=Math.min(duration,+$('videoTrimEnd').value||duration);
 if(end<=start){$('videoExportNote').textContent='Укажи корректные начало и конец фрагмента.';return}
 exporting=true;$('videoExport').disabled=true;$('videoExport').textContent='Экспорт…';$('videoExportNote').textContent='Идёт воспроизведение и запись выбранного участка. Не закрывай вкладку.';
 const oldRate=video.playbackRate,oldMute=video.muted;video.playbackRate=+val('videoSpeed');video.muted=$('videoMute').checked;
 try{
  await new Promise(resolve=>{if(video.readyState>=2)resolve();else video.addEventListener('loadeddata',resolve,{once:true})});
  video.currentTime=start;await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));
  const stream=canvas.captureStream(30),tracks=[...stream.getVideoTracks()];
  if(!$('videoMute').checked&&video.captureStream){const vs=video.captureStream();vs.getAudioTracks().forEach(t=>tracks.push(t))}
  const merged=new MediaStream(tracks),mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||'';
  chunks=[];recorder=new MediaRecorder(merged,mime?{mimeType:mime}:undefined);
  recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  recorder.onerror=()=>{video.pause();video.playbackRate=oldRate;video.muted=oldMute;exportFinished(null)};
  recorder.onstop=()=>{merged.getTracks().forEach(t=>t.stop());video.pause();video.playbackRate=oldRate;video.muted=oldMute;exportFinished(new Blob(chunks,{type:recorder.mimeType||'video/webm'}))};
  video.ontimeupdate=()=>{if(video.currentTime>=end){video.pause();if(recorder&&recorder.state!=='inactive')recorder.stop()}};
  recorder.start(250);await video.play();
 }catch(err){exporting=false;$('videoExport').disabled=false;$('videoExport').textContent='Экспорт WebM ↓';$('videoExportNote').textContent='Не удалось начать экспорт. Проверь поддержку формата браузером.';video.playbackRate=oldRate;video.muted=oldMute}
});
})();