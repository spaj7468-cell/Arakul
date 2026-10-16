/* Arakul Studio — single delegated navigation handler */
(function(){
  'use strict';
  const labels={home:'Обзор',editor:'Документы',convert:'Конвертер файлов',background:'Удаление фона',image:'Изображения',video:'Видеомонтаж',photo:'Фото-редактор',texttools:'Инструменты текста',notes:'Заметки',markdown:'Markdown Studio',studio3d:'3D Studio',library:'Мои документы'};
  function activate(id){
    if(!labels[id]||!document.getElementById('page-'+id)) id='home';
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+id));
    document.querySelectorAll('[data-page]').forEach(b=>{
      const active=b.dataset.page===id;
      b.classList.toggle('active',active);
      if(b.classList.contains('top-tab')) { if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current'); }
    });
    const crumb=document.getElementById('crumb'); if(crumb)crumb.textContent=labels[id];
    const sidebar=document.getElementById('sidebar'); if(sidebar)sidebar.classList.remove('open');
    const overlay=document.getElementById('overlay'); if(overlay)overlay.classList.remove('show');
    const panel=document.getElementById('moreTabsPanel'); if(panel)panel.hidden=true;
    const toggle=document.getElementById('moreTabsToggle'); if(toggle)toggle.setAttribute('aria-expanded','false');
    if(id==='studio3d'&&window.Arakul3D&&typeof window.Arakul3D.resize==='function')window.Arakul3D.resize();
    if(id==='library'&&window.ArakulExtras&&typeof window.ArakulExtras.renderLibrary==='function')window.ArakulExtras.renderLibrary();
    if(location.hash!=='#'+id) history.replaceState(null,'','#'+id);
  }
  document.addEventListener('click',function(e){
    const button=e.target instanceof Element ? e.target.closest('[data-page],[data-open]') : null;
    if(!button)return;
    const id=button.dataset.page||button.dataset.open;
    if(!labels[id])return;
    e.preventDefault();
    e.stopImmediatePropagation();
    activate(id);
  },true);
  window.addEventListener('hashchange',()=>activate(location.hash.slice(1)||'home'));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>activate(location.hash.slice(1)||'home'),{once:true});
  else activate(location.hash.slice(1)||'home');
})();