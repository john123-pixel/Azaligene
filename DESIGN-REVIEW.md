# Logik-Lern-App: design review and premium refresh

Source: `john123-pixel/mensa-iq-test-2027-2028` → `Logik-Lern-App.html`.
The refreshed file is `Logik-Lern-App.html` in this repository. It is still one self-contained HTML file that works offline. The encrypted question data (`<script id="blob">`), the password check and all learning logic are unchanged.

## 1. What held the landing page back

| Area | Before | Why it read as "not premium" |
|---|---|---|
| Background | Four hand-drawn SVG scenes (number boxes, a 3×3 shape grid, word pills, isometric cubes) on a blueprint grid | The scenes looked like diagrams, not photography. They competed with the headline, and the "3 · 6 · 12" boxes overlapped the text column at common widths. |
| Title | "Denkaufgaben üben, *Schritt für Schritt* sicherer werden" in system Georgia/Palatino | The headline promised gradual improvement, not a high standard. The system serif changes from device to device and looks generic at 58 px. |
| Brand mark | Rounded gold square with an "L" | Read as an app-icon placeholder, not a seal or crest. |
| Form order | Password first, then name ("optional") | This is backwards from how every professional exam portal works: identify the candidate, then authenticate. It also made the name feel like an afterthought. |
| Coach | Cartoon SVG faces. They could only be chosen in Settings, after login, and the card subtitle repeated the name ("Lena / Coach Lena") | The cartoon style clashed with the serious tone, and candidates never saw the choice on first visit. |
| Numbers | Stats in system serif | Fine, but they did not match the new display face. |

## 2. Principles applied

1. **Photography sets the mood; text carries the message.** Real, slightly desaturated study and exam imagery sits behind a strong navy veil (cream in light mode), so the headline and form always keep their contrast. Scenes cross-fade slowly with a subtle zoom, which is turned off under `prefers-reduced-motion`.
2. **One display face, one UI face.** *Cormorant Garamond* (600 + italic) is used for headlines, page titles and the wordmark, the high-contrast serif look of academic and luxury brands. *Inter* is used for all interface text. Both fonts are embedded as Latin subsets (about 95 KB in total), so the look is the same offline and on every device. Question text keeps the original reading serif, because Cormorant is too delicate at 16–17 px.
3. **Gold is used sparingly.** It appears only on the emphasised words, the seal, the active coach and the main button.
4. **Identity before authentication.** Name, then coach, then access word, then "remember me", then the button.
5. **Make the choice visible.** The coach is chosen on the landing page, with real portraits and gendered German role labels ("Ihre Trainerin" / "Ihr Trainer"), and the choice carries into the app.

## 3. What changed

- **Background:** the SVG scenes are replaced by four Unsplash photographs, matched to the existing captions. Each is WebP at 1920×1200, 42–66 KB.
- **Headline:** the eyebrow now reads "IQ-Test-Vorbereitung · Ausgabe 2026–2027" and the headline reads "Logisches Denken auf *höchstem Niveau* trainieren". It uses Cormorant at up to 76 px, with gold-gradient italic emphasis and lining numerals for the stats.
- **Wordmark:** a circular gold seal with a serif "L", the name "Logik-Lern-App" in Cormorant and a tracked small-caps subline. The same wordmark appears in the app sidebar.
- **Login form:** fields now run Name, Ihr Coach, Zugangswort. The name field uses `autocomplete="name"`, and the coach picker is an accessible radio group. The selected coach updates the welcome bubble live and is saved to the profile on login.
- **Coach avatars:** portrait photos replace the drawn faces everywhere: the landing card, the floating coach and the Settings picker. The avatar has a gold ring and fixed `display:block` sizing.
- **App pages:** `h1`/`h2` use the display face, so the whole app shares the landing page's typography.
- **Mobile:** the header pill and slide captions are hidden below 600 px and the seal no longer gets squashed. There is no horizontal scroll at 390 px.

File size grew from 10.21 MB to about 10.64 MB.

## 4. Recommendations not yet implemented

- **Naming:** the repository is called "mensa-iq-test", but the app correctly calls itself unofficial. Do not put "Mensa" in the title or logo. It is a registered trademark of Mensa International, and using it would contradict the page's own "Kein offizieller Test" notice. A distinctive own name would carry more value, for example "Logik-Lern-App · IQ-Training", or a new brand name.
- **Edition year:** the page says "2026–2027", but the repository name says "2027–2028". Decide which is correct and update the eyebrow and wordmark subline (`renderGate`).
- **Mobile flow:** consider placing the login card directly under the headline on phones (hide or shorten the stats), so candidates can sign in without scrolling.
- **Trust strip:** a short row of real proof under the stats would add credibility, such as the book cover, the author's name and credentials, or a reader quote.

## 5. Image credits (Unsplash License: free for commercial use, no attribution required)

| Use | Unsplash photo ID |
|---|---|
| Scene 1, numbers (answer sheet) | `photo-1606326608606-aa0b62935f2b` |
| Scene 2, figures (chess) | `photo-1529699211952-734e80c4d42b` |
| Scene 3, language (library) | `photo-1481627834876-b7833e8f5570` |
| Scene 4, memory (open books) | `photo-1456513080510-7bf3a84b82f8` |
| Coach Lena | `photo-1508214751196-bcfd4ca60f91` |
| Coach Jonas | `photo-1560250097-0b93528c311a` |

Fonts: Cormorant Garamond and Inter, both under the SIL Open Font License 1.1 via Google Fonts.

## 6. Screenshots

`docs/screenshots/`: `before-landing.jpg`, `after-landing-dark.jpg`, `after-landing-light.jpg`, `after-mobile.jpg`, `coach-picker-before-after.jpg`.
