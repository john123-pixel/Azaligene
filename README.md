# Deltaprüfung · Lern-App Mannheim 2027

Digitaler Prüfungssimulator zum Buch „Deltaprüfung Mannheim Vorbereitung 2027“.
Die fertige App ist **eine einzige Datei**: `Deltapruefung-Lern-App.html` (online oder lokal über https/localhost öffnen).

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `src/shell.html` | Markup und komplettes Design-System (CSS, hell/dunkel) |
| `src/app.js` | App-Logik: Anmeldung, Zigi, Übungen, Simulation, Lernkarten, Downloads |
| `build.py` | Fügt Oberfläche, Logik und den verschlüsselten Aufgabenbestand zusammen |

Der Aufgabenbestand (1.500 Aufgaben, 200 Karten, Bilder) bleibt unverändert AES-GCM-verschlüsselt
und wird erst nach Eingabe des Zugangsworts im Browser entschlüsselt.

```bash
python3 build.py
```

## Was neu ist

- Neues Design-System: Navy/Champagner-Gold, Fraunces + Inter, einheitliche Linien-Icons, Dark Mode
- Zigi als professioneller Lerncoach: neue Figur mit Posen, Sprechblase, Tipps auf Klick
- Lernkarten mit sechs wählbaren 3D-Effekten (Schwung, Klassisch, Vertikal, Würfel, Buchseite, Wirbel),
  Parallaxe und Glanz, Wiederholungsintervalle auf den Bewertungsknöpfen
- Prüfungsmodus: fixierte Kopfzeile mit Uhr, Aufgaben markieren, Aufgabenübersicht mit Legende
- Tastatur: `A`–`H` antworten, `←`/`→` blättern, `Enter` weiter, `Leertaste` Karte drehen, `1`–`3` bewerten
- Auswertung mit Ergebnisring, Übersicht mit Empfehlung, mobile Tab-Leiste
- Fehlerbehebungen: doppeltes Rendern je Seitenwechsel, Antwortzeit je Aufgabe, TeX-Symbole wie `\cdot`
