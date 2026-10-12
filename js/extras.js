(function(){
'use strict';
const $=s=>document.querySelector(s),editor=$('#editorArea');
const docsKey='arakul.documents.v1',draftKey='arakul.draft.v1';
function readDocs(){try{const x=JSON.parse(localStorage.getItem(docsKey)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function writeDocs(x){try{localStorage.setItem(docsKey,JSON.stringify(x));return true}catch(e){return false}}
function uid(){return 'doc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}
function saveDraft(){try{localStorage.setItem(draftKey,JSON.stringify({html:editor.innerHTML,updated:Date.now()}));$('#editorSaveStatus').textContent='Черновик сохранён локально · '+new Date().toLocaleTimeString()}catch(e){$('#editorSaveStatus').textContent='Не удалось сохранить черновик'}}
function saveCurrentDocument(){
 const title=(prompt('Название документа',editor.querySelector('h1')?.innerText||'Мой документ')||'').trim();if(!title)return;
 const docs=readDocs(),doc={id:uid(),title,html:editor.innerHTML,updated:Date.now()};docs.unshift(doc);
 if(!writeDocs(docs)){alert('Недостаточно места в локальном хранилище. Экспортируй документ файлом.');return}
 $('#editorSaveStatus').textContent='Сохранено в библиотеку';renderLibrary();return doc
}
function renderLibrary(){
 const list=$('#libraryList');if(!list)return;const docs=readDocs();$('#libraryCount').textContent=docs.length+' документов';list.replaceChildren();
 if(!docs.length){const p=document.createElement('p');p.className='muted';p.textContent='Пока нет сохранённых документов. Открой редактор и нажми «Сохранить».';list.appendChild(p);return}
 docs.forEach(doc=>{const row=document.createElement('div');row.className='library-row';const icon=document.createElement('div');icon.className='cardicon';icon.textContent='¶';const info=document.createElement('div');info.className='lib-info';const title=document.createElement('strong');title.textContent=doc.title;const meta=document.createElement('small');meta.textContent='Изменён: '+new Date(doc.updated).toLocaleString();info.append(title,meta);const open=document.createElement('button');open.className='btn small';open.textContent='Открыть';open.addEventListener('click',()=>{editor.innerHTML=doc.html;$('#editorSaveStatus').textContent='Открыт документ: '+doc.title;document.querySelector('[data-page="editor"]').click()});const exp=document.createElement('button');exp.className='btn small';exp.textContent='Экспорт';exp.addEventListener('click',()=>download((doc.title||'document')+'.html','<!doctype html><html><head><meta charset="utf-8"><title>'+esc(doc.title)+'</title></head><body>'+doc.html+'</body></html>','text/html;charset=utf-8'));const del=document.createElement('button');del.className='btn small';del.textContent='Удалить';del.addEventListener('click',()=>{if(confirm('Удалить документ «'+doc.title+'»?')){writeDocs(readDocs().filter(d=>d.id!==doc.id));renderLibrary()}});row.append(icon,info,open,exp,del);list.appendChild(row)})
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function download(name,data,type){const u=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=u;a.download=name.replace(/[\\/:*?"<>|]/g,'-');a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$('#libraryNew').addEventListener('click',()=>{editor.innerHTML='<h1>Новый документ</h1><p></p>';$('#editorSaveStatus').textContent='Новый документ';document.querySelector('[data-page="editor"]').click()});
function mdRender(src){
 let s=String(src).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 s=s.replace(/^###### (.*)$/gm,'<h6>$1</h6>').replace(/^##### (.*)$/gm,'<h5>$1</h5>').replace(/^#### (.*)$/gm,'<h4>$1</h4>').replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>');
 s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/^&gt; (.*)$/gm,'<blockquote>$1</blockquote>').replace(/^- (.*)$/gm,'<li>$1</li>').replace(/(<li>.*<\/li>\n?)+/g,m=>'<ul>'+m+'</ul>').replace(/^---$/gm,'<hr>');
 s=s.split(/\n{2,}/).map(block=>/^<(h[1-6]|ul|blockquote|hr|pre)/.test(block.trim())?block:'<p>'+block.replace(/\n/g,'<br>')+'</p>').join('\n');
 return s
}
const md=$('#mdSource'),preview=$('#mdPreview');
function updateMd(){if(!md)return;preview.innerHTML=mdRender(md.value);$('#mdStats').textContent=md.value.length+' символов';try{localStorage.setItem('arakul.markdown.v1',md.value)}catch(e){}}
md.addEventListener('input',updateMd);try{md.value=localStorage.getItem('arakul.markdown.v1')||md.value}catch(e){}updateMd();
$('#mdCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(md.value);toast('Markdown скопирован')}catch(e){md.select();toast('Нажми Ctrl+C')}})
$('#mdExport').addEventListener('click',()=>download('document.md',md.value,'text/markdown;charset=utf-8'));
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
const cm=$('#commandModal'),search=$('#commandSearch'),results=$('#commandResults');
const commands=[['Обзор','home','Главная панель'],['Документы / Word','editor','Редактор документов'],['Конвертер файлов','convert','TXT, JSON, CSV, HTML'],['Удаление фона','background','Прозрачный PNG'],['Мастер изображений','image','Размер и формат'],['Инструменты текста','texttools','Регистр и очистка'],['Заметки','notes','Локальные заметки'],['Markdown Studio','markdown','README и документация'],['Мини 3D Studio','studio3d','Примитивы и экспорт OBJ'],['Мои документы','library','Локальная библиотека'],['Настройки','settings','Тема, сетка, размер текста']];
function drawCommands(){const q=search.value.trim().toLocaleLowerCase('ru');results.replaceChildren();commands.filter(x=>!q||(x[0]+' '+x[2]).toLocaleLowerCase('ru').includes(q)).forEach(c=>{const b=document.createElement('button');b.className='command-result';const title=document.createElement('span');title.textContent=c[0];const hint=document.createElement('small');hint.textContent=c[2];b.append(title,hint);b.addEventListener('click',()=>{cm.classList.remove('show');cm.setAttribute('aria-hidden','true');if(c[1]==='settings')$('#settingsOpen').click();else document.querySelector('[data-page="'+c[1]+'"]').click()});results.appendChild(b)})}
function openCommand(){cm.classList.add('show');cm.setAttribute('aria-hidden','false');search.value='';drawCommands();search.focus()}
$('#commandOpen').addEventListener('click',openCommand);$('#commandClose').addEventListener('click',()=>{cm.classList.remove('show');cm.setAttribute('aria-hidden','true')});search.addEventListener('input',drawCommands);cm.addEventListener('click',e=>{if(e.target===cm){cm.classList.remove('show');cm.setAttribute('aria-hidden','true')}});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape'&&cm.classList.contains('show')){cm.classList.remove('show');cm.setAttribute('aria-hidden','true')}});
$('#editorArea').addEventListener('input',()=>{clearTimeout(window.__arakulDraftTimer);window.__arakulDraftTimer=setTimeout(saveDraft,500)});
$('#editorNew').addEventListener('click',()=>{try{localStorage.removeItem(draftKey)}catch(e){}});
try{const d=JSON.parse(localStorage.getItem(draftKey)||'null');if(d&&d.html&&editor.innerText.trim()==='Мой документ Добро пожаловать в OuRi Studio. Выдели текст и используй кнопки форматирования выше.')editor.innerHTML=d.html}catch(e){}
renderLibrary();
window.ArakulExtras={renderLibrary,saveCurrentDocument};
})();