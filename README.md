# Azaligene – Digitales Lernheft (redesign)

Redesigned companion app for the book **IHK Kaufmann/Kauffrau im Gesundheitswesen 2027**,
based on `Digitales_Lernheft.html` from `john123-pixel/kaufman-`.

Open `Digitales_Lernheft.html` in a browser (or `index.html`, which redirects to it).
It is a single self-contained file: all 1,200 questions, 40 case studies and the PDF writer are inside.

## What changed
- **Brand:** colours taken from the printed cover (evergreen, burnt orange, gold); fonts Fraunces + Plus Jakarta Sans
  (loaded from Google Fonts, with system fallbacks when offline).
- **Landing page:** headline, key figures and Frieda's name card on a full-screen photo backdrop.
- **Home:** personal greeting with the real book cover, progress ring, quick actions with icons, numbered topic cards, a daily tip from Frieda.
- **Notebook:** running page headers, ribbon bookmark, animated check/cross marks, feedback card with Frieda
  (confetti and a "richtig in Folge" streak for correct answers), lined notes field.
- **PDF sets:** quick picks 20 / 30 / 40 / 50 / Alle plus a custom number, with a live preview of the title page.
  PDFs are now **A4**, with a title page that follows the cover design, round answer bubbles, an answer key grid and a score line.
- Dark mode, mobile layout, exam mode and results restyled; exam timer format fixed (`29:59` instead of `029:59`).

Question data and the saved-progress format (`localStorage` key `lh27`) are unchanged, so existing learners keep their progress.
