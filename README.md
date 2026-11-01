# The Canadian Guide to End-of-Life Planning — Companion App

A redesign of the flashcard and practice-question companion for *The Canadian Guide to End-of-Life Planning*. The 200 flashcards and 300 practice questions come unchanged from the original `canada-flashcards` app.

**Open `index.html` in any modern browser.** It is one self-contained file with no server or install. Progress is saved in the browser's local storage on that device.

## What's inside

- **Landing page.** A northern-lights night sky with drifting gold light, a 3D book that tilts with the mouse and opens its cover on hover, and floating flashcards. Below that: a feature section with a working flip demo and a mini page-turning book, the twelve chapters, province coverage, privacy, and a "What should Maple call you?" form to get started.
- **Maple, the companion.** An animated guide whose eyes follow your pointer. Maple waves, blinks and falls asleep when you're idle. Maple runs a guided tour, gives study tips, cheers milestones, and encourages you after a wrong answer. You can turn Maple off in Settings.
- **Flashcards.** Four 3D flip motions (Flip, Tumble, Cube, Spin), a deck stack, a hover tilt with a light glare, swipe-to-grade on phones, and Again / Good / Easy grading with smart review order. Also: star, read aloud, and filters by chapter, province and mode.
- **Question book.** A leather-bound 3D book with a cover that swings open, page stacks that grow as you read, colour tabs for the six tests, and a ribbon bookmark. Three page-turn effects:
  - *Soft curl*: the page bends like real paper.
  - *Classic*: a stiff page.
  - *Flutter*: a lifted page.
  Choose an answer and the solution is "written" on the facing page with a Correct / Not quite stamp. **Sit a test** mode gives you a 50-question timed answer sheet and a results page.
- **Quick exam.** A self-graded exam drawn from the flashcards, with an optional timer.
- **Extras.** Search across every card and question (press <kbd>/</kbd>), a daily goal ring, streaks, a study calendar, 12 badges, confetti, soft page and card sounds, dark mode, larger text, export and import of progress, keyboard shortcuts, reduced-motion support, and a phone layout with a bottom tab bar.

Progress saved by the previous app (`eolp_flash_v1`) is picked up automatically, and its export files can be imported.

## Editing

The source lives in `src/`:

| File | Purpose |
| --- | --- |
| `src/template.html` | Page structure and the landing page |
| `src/styles.css` | Design system and all styles |
| `src/app.js` | App logic: views, flip and page-turn effects, Maple, search, tour |
| `src/data.json` | Chapters, 200 flashcards (`FC`) and 300 questions (`Q`) |

After editing, rebuild `index.html`:

```bash
python3 build.py
```

The build checks the data (200 cards; 300 questions numbered 1–300, each with 4 options) before writing the file.

*General education only — not legal, financial or medical advice.*
