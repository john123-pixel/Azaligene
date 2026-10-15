"""Baut die Premium-Version aus der Original-HTML-Datei.

Aufruf: python3 build.py ORIGINAL.html AUSGABE.html
Daten (Aufgaben, Karten, Abbildungen, Schriften) bleiben unverändert.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
src, out = Path(sys.argv[1]), Path(sys.argv[2])
html = src.read_text(encoding="utf-8")


def sub_once(old, new, text, label):
    n = text.count(old)
    if n != 1:
        sys.exit(f"[{label}] erwartet 1 Treffer, gefunden {n}")
    return text.replace(old, new)


# 1) CSS: alles nach den @font-face-Regeln bis </style> ersetzen
css_start = html.index(":root{\n  --desk:")
css_end = html.index("</style>")
html = html[:css_start] + (HERE / "style.css").read_text(encoding="utf-8") + "\n" + (HERE / "extras.css").read_text(encoding="utf-8") + "\n" + html[css_end:]

# 2) Startseite ersetzen
l_start = html.index("<!-- ============ Startseite ============ -->")
l_end = html.index("<!-- ============ App ============ -->")
html = html[:l_start] + (HERE / "landing.html").read_text(encoding="utf-8") + html[l_end:]

# 3) Kopfzeile: Logo + Hintergrund-Ebene
html = sub_once(
    '<button class="brand" data-act="home" aria-label="Zur Startübersicht">Potenzialtest Gymnasium BW<br>Vorbereitung 2027<small id="whoLine"></small></button>',
    '<button class="brand" data-act="home" aria-label="Zur Startübersicht"><span class="logo" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/><path class="g" d="M7 8h1.5M15.5 8H17"/></svg></span><span class="bt">Potenzialtest Gymnasium BW<br>Vorbereitung 2027<small id="whoLine"></small></span></button>',
    html, "brand")
html = sub_once(
    '<main class="wrap" id="main"',
    '<div class="appbg" aria-hidden="true"><i></i><i></i><i></i><div class="cube"><b>A</b><b>7</b><b>÷</b><b>Ä</b><b>+</b><b>?</b></div><div class="cube"><b>×</b><b>B</b><b>3</b><b>ß</b><b>=</b><b>!</b></div></div>\n<main class="wrap" id="main"',
    html, "appbg")

# 4) Fotos der 3D-Diashow
photos = (HERE / "photos.js").read_text(encoding="utf-8").strip()
html, n = re.subn(r"const PHOTOS=\[.*?\n\];", lambda m: photos, html, count=1, flags=re.S)
if n != 1:
    sys.exit("[photos] nicht gefunden")
html = sub_once(
    "$('#credit').textContent=by?('Foto: '+by+' / Unsplash'):'Illustration';",
    "$('#credit').textContent=isSvg?'Illustration':'Foto: '+(by?by+' / ':'')+'Unsplash';",
    html, "credit")

# 5) Begrüßung auf der Startübersicht als Banner
html = sub_once(
    "let h='<h2>'+gr+', '+esc(U.name)+'!</h2><div class=\"countdown\"",
    "let h='<div class=\"hello\"><div><span class=\"lv\">'+esc(lv.name)+' · '+U.xp+' Punkte</span><h2>'+gr+', '+esc(U.name)+'!</h2><div class=\"countdown\"",
    html, "hello-open")
html = sub_once(
    "Bitte beim Anmeldetermin der Schule nachfragen.</div>';",
    "Bitte beim Anmeldetermin der Schule nachfragen.</div></div><div class=\"art\" aria-hidden=\"true\"><div class=\"cube\"><b>A</b><b>7</b><b>÷</b><b>Ä</b><b>+</b><b>?</b></div></div></div>';",
    html, "hello-close")

# 6) Effekte vor dem Start-Block einfügen
html = sub_once("/* ===== Start ===== */",
                (HERE / "fx.js").read_text(encoding="utf-8") + (HERE / "extras.js").read_text(encoding="utf-8") + "/* ===== Start ===== */", html, "fx")

# 7) Kopfdaten
html = sub_once('<meta name="color-scheme" content="light dark">',
                '<meta name="color-scheme" content="light dark">\n<meta name="theme-color" content="#0a1028">', html, "meta")
html = html.replace("fill='%2317305a'", "fill='%234353e0'").replace("stroke='%23f4d95e'", "stroke='%23ffc23d'")

out.write_text(html, encoding="utf-8")
print("ok", out, len(html))
