/* Arakul Studio — navigation polish, without duplicate menu toggles */
(function(){
'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const toggle=$('#moreTabsToggle'),panel=$('#moreTabsPanel');
const menuItems=[
 ['background','◐','Удаление фона','Изображения'],
 ['video','▶','Видеомонтаж','Видео'],
 ['photo','▧','Фото-редактор','Изображения'],
 ['texttools','T','Инструменты текста','Текст'],
 ['notes','▤','Заметки','Текст'],
 ['markdown','M','Markdown Studio','Создание'],
 ['studio3d','◇','3D Studio','Создание'],
 ['library','□','Мои документы','Рабочее пространство']
];
if(panel){
 const grid=panel.querySelector('.more-tabs-grid');
 if(grid){
  grid.replaceChildren();
  menuItems.forEach(([id,icon,label,group])=>{
   const b=document.createElement('button');b.type='button';b.dataset.page=id;
   const mark=document.createElement('span');mark.className='tool-menu-icon';mark.textContent=icon;
   const text=document.createElement('span');text.className='tool-menu-label';text.textContent=label;
   const meta=document.createElement('small');meta.className='tool-menu-group';meta.textContent=group;
   b.append(mark,text,meta);grid.appendChild(b);
  });
 }
 const close=()=>{panel.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false')};
 document.addEventListener('click',e=>{if(!e.target.closest('.more-tabs-wrap'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();toggle&&toggle.focus()}});
}
const pageNames={home:'Обзор',editor:'Документы',convert:'Конвертер',image:'Изображения',video:'Видеомонтаж',photo:'Фото-редактор',background:'Удаление фона',texttools:'Инструменты текста',notes:'Заметки',markdown:'Markdown Studio',studio3d:'3D Studio',library:'Мои документы'};
function syncNav(){
 const id=(location.hash||'#home').slice(1);
 $$('.top-tab').forEach(b=>{const active=b.dataset.page===id;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 const crumb=$('#crumb');if(crumb)crumb.textContent=pageNames[id]||'Обзор';
}
window.addEventListener('hashchange',syncNav);syncNav();
const command=$('#commandOpen');if(command){command.setAttribute('aria-label','Быстрый поиск');command.setAttribute('title','Быстрый поиск · Ctrl+K')}
const theme=$('#themeToggle');if(theme){theme.setAttribute('aria-label','Переключить цветовую тему');theme.setAttribute('title','Переключить тему')}
})();