import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const id of ['page-home','page-editor','page-markdown','page-studio3d','page-library','settingsModal','commandModal'])assert.ok(html.includes('id="'+id+'"'),'Missing page/modal: '+id);
for(const file of ['css/style.css','js/app.js','js/settings.js','js/3d.js','js/extras.js','manifest.webmanifest','sw.js','LICENSE','assets/brand.svg'])assert.ok(existsSync(new URL('../'+file,import.meta.url)),'Missing file: '+file);
assert.ok(html.includes('id="sceneCanvas"'),'3D canvas missing');
assert.ok(html.includes('id="editorArea"'),'Document editor missing');
console.log('Arakul smoke tests passed.');
