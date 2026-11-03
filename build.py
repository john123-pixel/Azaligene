#!/usr/bin/env python3
"""Baut die Lern-App als eine einzige HTML-Datei.

    python3 build.py                     # nimmt den verschlüsselten Inhalt aus der vorhandenen App-Datei
    python3 build.py --blob inhalt.txt   # oder aus einer eigenen Blob-Datei (Base64, AES-GCM)
    python3 build.py --out test.html     # anderes Ziel

Der Aufgabenbestand bleibt unverändert verschlüsselt; nur Oberfläche und Logik
kommen aus src/shell.html und src/app.js.
"""
import argparse, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent
APP = ROOT / "Deltapruefung-Lern-App.html"
BLOB_RE = re.compile(r'<script id="blob" type="application/octet-stream">([^<]*)</script>')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--blob", help="Datei mit dem Base64-Blob")
    ap.add_argument("--from-html", default=str(APP), help="HTML-Datei, aus der der Blob gelesen wird")
    ap.add_argument("--out", default=str(APP))
    a = ap.parse_args()

    if a.blob:
        blob = pathlib.Path(a.blob).read_text().strip()
    else:
        m = BLOB_RE.search(pathlib.Path(a.from_html).read_text(encoding="utf-8"))
        if not m:
            sys.exit("Kein verschlüsselter Inhalt gefunden in " + a.from_html)
        blob = m.group(1).strip()

    shell = (ROOT / "src" / "shell.html").read_text(encoding="utf-8")
    js = (ROOT / "src" / "app.js").read_text(encoding="utf-8")
    if "</script" in js.lower():
        sys.exit("app.js darf kein </script> enthalten")
    out = shell.replace("__BLOB__", blob, 1).replace("/*__APP_JS__*/", js, 1)
    pathlib.Path(a.out).write_text(out, encoding="utf-8")
    print(f"{a.out}: {len(out)/1e6:.2f} MB")


if __name__ == "__main__":
    main()
