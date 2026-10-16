/* Arakul Studio — navigation and interaction polish */
(function(){
'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const toggle=$('#moreTabsToggle'),panel=$('#moreTabsPanel');
if(toggle&&panel){
  toggle.setAttribute('aria-label','Показать все инструменты');
  toggle.setAttribute('title','Все инструменты');
  toggle.addEventListener('click',e=>{e.stopPropagation();const opening=panel.hidden;panel.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));if(opening){const first=panel.querySelector('button');if(first)first.focus()}});
  panel.addEventListener('click',e=>{if(e.target.closest('[data-page]')){panel.hidden=true;toggle.setAttribute('aria-expanded','false')}});
  document.addEventListener('click',e=>{if(!e.target.closest('.more-tabs-wrap')){panel.hidden=true;toggle.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}});
}
const menuItems=[
 ['background','◐','Удаление фона','Изображения'],
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
   menuItems.forEach(([id,icon,label,group])=>{const b=document.createElement('button');b.type='button';b.dataset.page=id;const mark=document.createElement('span');mark.className='tool-menu-icon';mark.textContent=icon;const text=document.createElement('span');text.textContent=label;text.className='tool-menu-label';const meta=document.createElement('small');meta.textContent=group;meta.className='tool-menu-group';b.append(mark,text,meta);grid.appendChild(b)});
 }
}
const pageNames={home:'Обзор',editor:'Документы',convert:'Конвертер',image:'Изображения',background:'Удаление фона',texttools:'Инструменты текста',notes:'Заметки',markdown:'Markdown Studio',studio3d:'3D Studio',library:'Мои документы'};
function syncNav(){
 const id=(location.hash||'#home').slice(1);
 $$('.top-tab').forEach(b=>{const active=b.dataset.page===id;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 const crumb=$('#crumb');if(crumb)crumb.textContent=pageNames[id]||'Обзор';
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b)return;const id=b.dataset.page;$$('.top-tab').forEach(t=>t.classList.toggle('active',t.dataset.page===id));});
window.addEventListener('hashchange',syncNav);syncNav();
const brand=$('.topbar-brand');if(brand){brand.addEventListener('click',e=>{e.preventDefault();const home=document.querySelector('[data-page="home"]');if(home)home.click()})}
const command=$('#commandOpen');if(command){command.setAttribute('aria-label','Быстрый поиск');command.setAttribute('title','Быстрый поиск · Ctrl+K')}
const theme=$('#themeToggle');if(theme){theme.setAttribute('aria-label','Переключить цветовую тему');theme.setAttribute('title','Переключить тему')}
})();