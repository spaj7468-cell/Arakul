(function(){
'use strict';
const $=s=>document.querySelector(s);
const root=document.documentElement,body=document.body,modal=$('#settingsModal');
const keys={theme:'ouri-theme',grid:'ouri-grid',compact:'ouri-compact',font:'ouri-font',motion:'ouri-motion',remember:'ouri-remember'};
function read(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:v}catch(e){return fallback}}
function write(key,value){try{if($('#settingRemember').checked)localStorage.setItem(key,value);else localStorage.removeItem(key)}catch(e){}}
function apply(){
 const theme=$('#settingTheme').value,grid=$('#settingGrid').checked,compact=$('#settingCompact').checked,font=$('#settingFont').value,motion=$('#settingMotion').checked;
 root.dataset.theme=theme;root.dataset.font=font;body.classList.toggle('no-grid',!grid);body.classList.toggle('compact',compact);body.classList.toggle('no-motion',!motion);
 write(keys.theme,theme);write(keys.grid,String(grid));write(keys.compact,String(compact));write(keys.font,font);write(keys.motion,String(motion));write(keys.remember,String($('#settingRemember').checked));
 const t=$('#themeToggle');if(t)t.setAttribute('aria-label',theme==='dark'?'Переключить на светлую тему':'Переключить на тёмную тему');
}
function load(){
 $('#settingTheme').value=read(keys.theme,'dark');
 $('#settingGrid').checked=read(keys.grid,'true')!=='false';
 $('#settingCompact').checked=read(keys.compact,'false')==='true';
 $('#settingFont').value=read(keys.font,'normal');
 $('#settingMotion').checked=read(keys.motion,'true')!=='false';
 $('#settingRemember').checked=read(keys.remember,'true')!=='false';
 apply();
}
function open(){modal.classList.add('show');modal.setAttribute('aria-hidden','false');$('#settingsClose').focus()}
function close(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');$('#settingsOpen').focus()}
$('#settingsOpen').addEventListener('click',open);
$('#settingsClose').addEventListener('click',close);
$('#settingsDone').addEventListener('click',()=>{apply();close();const t=$('#toast');t.textContent='Настройки сохранены';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)});
modal.addEventListener('click',e=>{if(e.target===modal)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('show'))close();if((e.ctrlKey||e.metaKey)&&e.key===','){e.preventDefault();open()}});
['settingTheme','settingGrid','settingCompact','settingFont','settingMotion'].forEach(id=>$('#'+id).addEventListener('change',apply));
$('#settingRemember').addEventListener('change',apply);
$('#settingsReset').addEventListener('click',()=>{Object.values(keys).forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});load();const t=$('#toast');t.textContent='Настройки сброшены';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)});
load();
})();