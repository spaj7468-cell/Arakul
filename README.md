# Arakul — OuRi Studio

**OuRi Studio** is a lightweight, monochrome collection of browser-based tools by OuRi. The initial release uses plain HTML, CSS and JavaScript: no build step, no package manager, and no required third-party dependencies.

## Features

- **Text editor:** basic rich-text formatting, word/character statistics, export to TXT, Markdown and HTML.
- **File converter:** read local text files and convert text content to TXT, Markdown, HTML, JSON or CSV.
- **Background tool:** remove a selected solid-like color from an image and export a transparent PNG. This is color-distance processing, not AI object segmentation.
- **Image tool:** resize images and export PNG, JPEG or WebP.
- **Text utilities:** change case, normalize whitespace, sort lines, remove duplicate lines and reverse line order.
- **Quick notes:** autosave in the current browser's local storage.
- Responsive left navigation and light/dark theme.

## Run locally

1. Download or clone this repository.
2. Open \`index.html\` in a modern browser.

No installation or build step is required.

## Privacy

Files selected in the tools are processed in the browser; this version does not upload them to a server. Notes and theme preference use browser local storage. Clearing browser data may remove saved notes.

## Limitations

- The converter handles text-based formats; it is not a full PDF/DOCX office conversion engine.
- Background removal is based on color similarity. It is most effective with plain, contrasting backgrounds and may affect similarly colored parts of the subject.
- The editor's Markdown export is a lightweight conversion, not a complete Markdown parser.
- This repository does not yet include a real generative AI model. Arakul can be connected to a model/API in a later iteration.

## Project

- OuRi: https://github.com/spaj7468-cell/ouri-corp
- Arakul: https://github.com/spaj7468-cell/Arakul

## License

MIT
