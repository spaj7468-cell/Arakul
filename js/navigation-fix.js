/* Arakul Studio — resilient tab navigation fallback */
(function(){
  'use strict';
  const labels={home:'Обзор',editor:'Документы',convert:'Конвертер файлов',background:'Удаление фона',image:'Изображения',video:'Видеомонтаж',photo:'Фото-редактор',texttools:'Инструменты текста',notes:'Заметки',markdown:'Markdown Studio',studio3d:'3D Studio',library:'Мои документы'};
  function activate(id,updateHash){
    if(!labels[id]||!document.getElementById('page-'+id)) id='home';
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+id));
    document.querySelectorAll('[data-page]').forEach(b=>{
      const active=b.dataset.page===id;
      b.classList.toggle('active',active);
      if(b.classList.contains('top-tab')){if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');}
    });
    const crumb=document.getElementById('crumb'); if(crumb) crumb.textContent=labels[id];
    const sidebar=document.getElementById('sidebar'); if(sidebar) sidebar.classList.remove('open');
    const overlay=document.getElementById('overlay'); if(overlay) overlay.classList.remove('show');
    const panel=document.getElementById('moreTabsPanel'); if(panel) panel.hidden=true;
    const toggle=document.getElementById('moreTabsToggle'); if(toggle) toggle.setAttribute('aria-expanded','false');
    if(updateHash && location.hash!=='#'+id) history.replaceState(null,'','#'+id);
    if(id==='studio3d'&&window.Arakul3D&&typeof window.Arakul3D.resize==='function') window.Arakul3D.resize();
  }
  document.addEventListener('click',function(e){
    const button=e.target.closest('[data-page]');
    if(button){const id=button.dataset.page;if(labels[id]){e.preventDefault();activate(id,true);return;}}
    const opener=e.target.closest('[data-open]');
    if(opener){const id=opener.dataset.open;if(labels[id]){e.preventDefault();activate(id,true);}}
  },true);
  window.addEventListener('hashchange',()=>activate(location.hash.slice(1)||'home',false));
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>activate(location.hash.slice(1)||'home',false),{once:true});
  else activate(location.hash.slice(1)||'home',false);
})();