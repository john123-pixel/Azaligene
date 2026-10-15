# Potenzialtest Gymnasium BW – Vorbereitung 2027 (Übungs-App)

Unabhängige Übungs-App zum Buch. Eine einzige Datei, läuft offline im Browser.

- **`index.html`** – die App (einfach im Browser öffnen oder per GitHub Pages veröffentlichen)
- `original/` – die ursprüngliche Version
- `design/` – Quellen der Premium-Oberfläche

## Oberfläche anpassen

Die Aufgaben, Karteikarten und Abbildungen bleiben in `original/…html`. Das neue Design wird darübergelegt:

| Datei | Inhalt |
| --- | --- |
| `design/style.css` | Farben, Schrift, 3D-Effekte |
| `design/landing.html` | Startseite |
| `design/fx.js` | 3D-Neigung, Parallax, Konfetti, Galerie; `BOOK_COVER` für ein echtes Buchcover |
| `design/photos.js` | Fotos der 3D-Diashow (Unsplash-IDs) |
| `design/extras.js` / `extras.css` | Eule Emma, Töne, Lernreise, Serie und Tagesziel, Blitz-Challenge, Duell, 3D-Würfel, Trophäen-Raum, Level-up, Wochenbericht, Urkunde |

Neu bauen:

```sh
python3 design/build.py original/Potenzialtest_Gymnasium_BW_Vorbereitung_2027_App.html index.html
```

Fotos werden von Unsplash geladen (Unsplash-Lizenz, kommerziell nutzbar). Ohne Internet zeigt die Startseite gezeichnete Illustrationen.
