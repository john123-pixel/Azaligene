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
- **Headline:** the eyebrow now reads "Training für die Top 2 %" and the headline reads "Logisches Denken auf *höchstem Niveau* trainieren". It uses Cormorant at up to 76 px, with gold-gradient italic emphasis and lining numerals for the stats.
- **Wordmark:** a circular gold seal with a serif "L", the name "Logik-Lern-App" in Cormorant and a tracked small-caps subline. The same wordmark appears in the app sidebar.
- **Login form:** fields now run Name, Ihr Coach, Zugangswort. The name field uses `autocomplete="name"`, and the coach picker is an accessible radio group. The selected coach updates the welcome bubble live and is saved to the profile on login.
- **Coach avatars:** portrait photos replace the drawn faces everywhere: the landing card, the floating coach and the Settings picker. The avatar has a gold ring and fixed `display:block` sizing.
- **App pages:** `h1`/`h2` use the display face, so the whole app shares the landing page's typography.
- **Mobile:** the header pill and slide captions are hidden below 600 px and the seal no longer gets squashed. There is no horizontal scroll at 390 px.

File size grew from 10.21 MB to about 10.64 MB.

## 4. Recommendations not yet implemented

- **Naming (done):** "Mensa" is a registered trademark of Mensa International, so it stays out of the app name, logo and title. Instead the eyebrow carries the value ("Training für die Top 2 %"), and Mensa is mentioned once, descriptively, in the lead text ("z. B. den Aufnahmetest von Mensa"). A trademark and independence disclaimer sits under the login button and in its own card on "Prüfung & Hinweise". Have a trademark lawyer confirm the final wording, because the book's own title also contains "Mensa".
- **Edition year (done):** set to 2027–2028 in the wordmark subline and in the book title on "Prüfung & Hinweise".
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

## 6. App interior redesign: "sun yellow and ink"

**Palette.** Navy and brass are replaced by a bold yellow on near-black, with warm white surfaces:

| Token | Light | Dark | Use |
|---|---|---|---|
| `--sun` | `#ffc72c` | `#ffc72c` | Main buttons, active menu item, progress, chart bars |
| `--sun2` | `#ffb800` | `#ffb800` | Hover, focus rings |
| `--sunink` | `#9a6a00` | `#ffc72c` | Yellow *text* (eyebrows, question IDs). Dark gold on light backgrounds for legibility |
| ink | `#15171c` | `#f2f1ee` | Text; secondary buttons in light mode |
| sidebar / hero | `#111318` | `#111318` / `#16181d` | Sidebar and dashboard hero |
| `--bg` / `--card` | `#f6f5f1` / `#fff` | `#0c0d10` / `#16181d` | Page and cards |

The five area colors (Zahlen blue, Sprache green, Figural yellow, Gedächtnis violet, Transfer coral) were run through a colorblind-safety validator for both light and dark mode. They always appear next to their text label. The yellow is our own and does not copy Mensa's logo or trade dress.

**Dashboard (Übersicht).** Replaces the single row of numbers and the floating "Guten Tag" bubble:
- A dark hero card with the date, a time-of-day greeting ("Guten Morgen/Tag/Abend, *Max*"), the coach's message inline with their portrait, and a "Nächster Schritt" panel with a yellow Start button.
- A progress ring: how much of the question bank has been worked through.
- Four stat tiles with icons: answered, accuracy, streak, open mistakes. The tiles link to Fortschritt or the Fehlerheft.
- An activity chart for the last 7 days, plus a yellow Experten-Benchmark card.
- Clickable area cards: each opens "Nach Bereich üben" with that area preselected.
- Quick-start tiles: 10 or 20 mixed questions, exam simulation, downloads.

**Shell.** The sidebar is near-black with line icons in place of Unicode symbols, and the active item is a yellow pill. The top bar shows a streak chip and the user's initials, which link to Settings.

**Controls.** Segmented controls, chips and inputs share a yellow focus ring. Answer options lift on hover, the chosen letter turns yellow and the correct answer gets a green halo. The timer is a dark pill with yellow digits. The solution box and the question's highlighted line use a soft yellow tint. Numbers now use lining figures everywhere.

**Speed and feel.** Pages slide in over about 0.3 s with a short stagger, and buttons react within 0.12 s. All of this is switched off under "Bewegung reduzieren" or the system's reduced-motion setting.

**How it was checked.** The access word wasn't available, so the inside of the app was rendered with a dummy question set shaped like the real data. This was done in light and dark mode and at 390 px phone width, and showed no script errors. The real questions, images and all learning logic are untouched.

## 7. Screenshots

`docs/screenshots/`: landing page (`before-landing.jpg`, `after-landing-dark.jpg`, `after-landing-light.jpg`, `after-mobile.jpg`), coach picker (`coach-picker-before-after.jpg`), app interior (`app-dashboard-before.jpg`, `app-dashboard-light.jpg`, `app-dashboard-dark.jpg`, `app-dashboard-mobile.jpg`, `app-question-light.jpg`). `after-landing-light.jpg`, `after-mobile.jpg` and `coach-picker-before-after.jpg` predate the yellow palette.

## 8. Added features (logout and the recommended five)

- **Logout:** an "Abmelden" item in the profile menu (initials, top right) and a button at the bottom of the sidebar, both with a confirmation. Progress stays on the device; only the remembered access word is removed.
- **Daily goal:** set to Aus/10/20/30/50 in Settings (default 20). The dashboard ring shows today's progress, the activity chart draws a dashed goal line, and a toast appears when the goal is reached.
- **Test-day countdown:** taken from the Lernplan test date ("Noch 42 Tage bis zum Test"). It turns yellow in the final week. Without a plan it shows a "Testtermin festlegen" link.
- **Aufgaben des Tages:** five questions per day, one per area, the same for every reader (chosen from the date). The dashboard card shows a status box per area, then the result and a solutions view once all five are done.
- **Merkliste and notes:** star a question ("Merken") or add a note from the question screen or the question preview. The new "Merkliste" page in the menu lists them, with "Alle üben". Saving a note also stars the question.
- **Keyboard and focus mode:** A–F to choose, Enter to confirm or go on, H for a hint, S to star, N for a note, ←/→ to move between questions in exams, and Shift+F for focus mode, which hides the menu and coach during a session. A shortcut line is shown under the options on desktop.
