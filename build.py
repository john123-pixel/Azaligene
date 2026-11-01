#!/usr/bin/env python3
"""Build the single-file companion app (index.html) from src/.

    python3 build.py

Inlines src/styles.css, src/data.json and src/app.js into src/template.html.
The output is one self-contained HTML file that works offline (fonts load
from Google Fonts when online and fall back to system serif/sans otherwise).
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"

def main():
    tpl = (SRC / "template.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    js = (SRC / "app.js").read_text(encoding="utf-8")
    data = json.loads((SRC / "data.json").read_text(encoding="utf-8"))
    # sanity checks so a broken data file never ships
    assert len(data["FC"]) == 200, "expected 200 flashcards"
    assert len(data["Q"]) == 300, "expected 300 questions"
    assert [q["n"] for q in data["Q"]] == list(range(1, 301)), "questions must be numbered 1..300 in order"
    for q in data["Q"]:
        assert len(q["o"]) == 4 and 0 <= q["c"] < 4, f"question {q['n']} malformed"
    data_js = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    for name, val in (("/*{{CSS}}*/", css), ("/*{{DATA}}*/", data_js), ("/*{{JS}}*/", js)):
        assert tpl.count(name) == 1, f"placeholder {name} missing"
        tpl = tpl.replace(name, val)
    out = ROOT / "index.html"
    out.write_text(tpl, encoding="utf-8")
    print(f"wrote {out.name} ({out.stat().st_size/1024:.0f} KB)")

if __name__ == "__main__":
    main()
