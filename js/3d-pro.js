(function(){
'use strict';
const api=window.Arakul3D;if(!api)return;
const host=document.querySelector('.three-tools .panelhead');
if(host){
 const add=(label,fn)=>{const b=document.createElement('button');b.className='btn small';b.type='button';b.textContent=label;b.addEventListener('click',fn);return b};
 const shapeRow=document.createElement('div');shapeRow.className='three-extra-shapes';
 shapeRow.append(add('＋ Конус',()=>api.add('cone')),add('＋ Тор',()=>api.add('torus')));host.after(shapeRow);
 const actions=document.createElement('div');actions.className='three-project-actions';
 actions.append(add('Сохранить проект JSON',()=>api.exportJson()));
 const label=document.createElement('label');label.className='btn small';label.textContent='Импорт сцены JSON';
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;label.appendChild(input);
 input.addEventListener('change',async()=>{const f=input.files&&input.files[0];if(!f)return;try{const data=JSON.parse(await f.text());const list=Array.isArray(data)?data:data.objects;if(!Array.isArray(list))throw new Error('bad file');api.load(list);alert('Сцена загружена: '+list.length+' объектов.')}catch(e){alert('Не удалось загрузить сцену. Нужен JSON Arakul Scene.')}input.value=''});
 actions.appendChild(label);const reset=document.querySelector('#sceneReset');if(reset)reset.parentNode.insertBefore(actions,reset.nextSibling);else host.after(actions);
}
})();