# Arakul Studio — OuRi

[![MIT License](https://img.shields.io/badge/license-MIT-white)](LICENSE) · Vanilla JavaScript · no build · PWA-ready

**Arakul Studio** is a free, local-first workspace for writing, file transformations, images, Markdown and lightweight 3D scene blocking. It follows the OuRi family design language used by [OuRi Corp](https://github.com/spaj7468-cell/ouri-corp), [QKC](https://github.com/spaj7468-cell/qkc), [QKC Engine](https://github.com/spaj7468-cell/qkc-engine) and [QKCcode](https://github.com/spaj7468-cell/qkccode).

## Architecture

```text
index.html                 app shell, views, toolbars and dialogs
css/style.css              monochrome design system and responsive UI
js/app.js                  router and text / file / image utilities
js/settings.js             theme, grid, density, motion and preferences
js/extras.js               Markdown renderer, command palette, local document library
js/3d.js                   canvas 3D viewport, primitives, OBJ / JSON export
assets/brand.svg            brand mark and install icon
manifest.webmanifest        PWA metadata
sw.js                       same-origin offline cache
test/smoke.mjs               lightweight repository smoke test
.github/workflows/pages.yml GitHub Pages deployment
```

## Features

- **Word-like document editor:** headings, paragraphs, bold / italic / underline / strike-through, alignment, lists, links, tables, inline images, undo / redo, statistics, browser printing to PDF and HTML/TXT/Markdown/Word-compatible HTML export.
- **Local document library:** explicitly save documents, reopen, export and delete them. A local draft is saved automatically where browser storage is available.
- **Markdown Studio:** live preview, safe basic Markdown formatting, copy and export.
- **Mini 3D Studio:** cube, sphere, cylinder and plane primitives; orbit with mouse or touch; zoom; object list and transform controls; wireframe / grid toggles; OBJ and JSON export.
- **Image tools:** resize / convert PNG, JPEG and WebP, and remove a similar solid-color background into transparent PNG.
- **Text utilities:** case conversion, whitespace cleanup, line sorting, duplicate removal and statistics.
- **File conversion:** text formats including TXT, Markdown, HTML, JSON and CSV.
- **Settings:** dark / light theme, background grid, compact layout, text size, animations and preference persistence.
- **Quick command palette:** press Ctrl+K (or Cmd+K on Mac).
- **PWA cache:** on a supported host such as GitHub Pages, the app shell can open offline after its first successful load.

## Privacy and limitations

Tools run in the browser. Local notes, draft documents and the document library are stored on this device; they do not sync to other devices. Clear browser data only after exporting important work. The 3D editor is a lightweight scene-blocking tool, not a full Blender replacement: it exports OBJ geometry and scene JSON, but does not yet provide sculpting, UV editing, animation timelines or a full material node system. Word-compatible `.doc` export is HTML-based; for PDF use **Print / PDF**. A real modern `.docx` export is not included.

## Run

Open `index.html`, or run:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. PWA offline caching requires a web server / HTTPS; browser storage may be unavailable in private mode.

## Test

```sh
node test/smoke.mjs
```

## License

MIT — see [LICENSE](LICENSE).


## OuRi ecosystem

- [OuRi Corp — project directory](https://spaj7468-cell.github.io/ouri-corp/)
- [QKC — knowledge trainer](https://spaj7468-cell.github.io/qkc/)
- [QKCcode — programming school](https://spaj7468-cell.github.io/qkccode/)
- [QKC Engine — quiz engine](https://spaj7468-cell.github.io/qkc-engine/)
- [All repositories](https://github.com/spaj7468-cell?tab=repositories)

OuRi projects were created at different times and have different scopes and maturity levels. Quality and features can vary; a newer project is not automatically better in every area.

## Авторы

| Роль | Автор | Профиль |
|------|-------|---------|
| Автор | **telrino** | <https://vk.ru/telrino> |
| Соавтор | **Бро** | <https://vk.ru/id920684081> |
