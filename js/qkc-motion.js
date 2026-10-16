/* Arakul Studio — lightweight motion inspired by QKC */
(function(){
  'use strict';
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar=document.createElement('div');
  bar.className='qkc-scroll-progress';
  bar.setAttribute('aria-hidden','true');
  bar.innerHTML='<span></span>';
  document.body.prepend(bar);
  const fill=bar.firstElementChild;
  let ticking=false;
  function updateProgress(){
    const doc=document.documentElement;
    const max=doc.scrollHeight-window.innerHeight;
    const pct=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;
    fill.style.width=pct+'%';
    ticking=false;
  }
  function requestProgress(){if(!ticking){ticking=true;window.requestAnimationFrame(updateProgress)}}
  window.addEventListener('scroll',requestProgress,{passive:true});
  window.addEventListener('resize',requestProgress,{passive:true});
  updateProgress();

  const revealSelector='.page .card,.page .panel,.page .start-here,.page .sectiontitle,.page .head';
  const observePage=(root)=>{
    const nodes=root.querySelectorAll(revealSelector);
    if(reduceMotion||!('IntersectionObserver' in window)){
      nodes.forEach(el=>el.classList.add('qkc-visible'));
      return;
    }
    nodes.forEach((el,i)=>{
      if(el.dataset.qkcObserved)return;
      el.dataset.qkcObserved='1';
      el.classList.add('qkc-reveal');
      el.style.transitionDelay=Math.min(i%5,4)*35+'ms';
      observer.observe(el);
    });
  };
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('qkc-visible');observer.unobserve(entry.target)}
    });
  },{threshold:.08,rootMargin:'0px 0px -24px 0px'}):null;
  document.querySelectorAll('.page').forEach(observePage);
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-page]')){
      requestAnimationFrame(()=>document.querySelectorAll('.page.active').forEach(observePage));
      requestProgress();
    }
  });
  window.addEventListener('hashchange',()=>{document.querySelectorAll('.page.active').forEach(observePage);requestProgress()});
  const brand=document.querySelector('.topbar-brand');
  if(brand)brand.setAttribute('aria-label','Arakul Studio — на главную');
})();