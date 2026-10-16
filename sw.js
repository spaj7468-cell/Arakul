const CACHE='arakul-studio-v5';
const FILES=[
 './','./index.html','./manifest.webmanifest',
 './css/style.css','./css/core.css','./css/theme.css','./css/components.css','./css/responsive.css','./css/top-nav.css','./css/studio-redesign.css','./css/qkc-inspired.css','./css/media-studio.css','./css/3d-pro.css',
 './js/app.js','./js/settings.js','./js/3d.js','./js/extras.js','./js/studio-redesign.js','./js/qkc-motion.js','./js/video-editor.js','./js/photo-editor.js','./js/document-pro.js','./js/3d-pro.js','./js/navigation-fix.js',
 './assets/brand.svg'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return response}).catch(()=>caches.match('./index.html'))))});
