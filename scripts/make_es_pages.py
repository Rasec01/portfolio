"""Rebuild the Spanish pages after editing index.html or glez.html.

Each Spanish page is a copy of its English page with two differences:
the block between <!-- seo:start --> and <!-- seo:end --> (Spanish title,
description, canonical, hreflang and share-card tags) and <html lang="es">.
The script keeps each Spanish SEO block and copies everything else from the
English page.  Run from the repo root:  python scripts/make_es_pages.py
"""
from pathlib import Path

START, END = "<!-- seo:start -->", "<!-- seo:end -->"
PAGES = [("index.html", "es/index.html"), ("glez.html", "es/glez.html")]

for en_path, es_path in PAGES:
    en = Path(en_path).read_text(encoding="utf-8")
    es = Path(es_path).read_text(encoding="utf-8")
    es_block = es[es.index(START):es.index(END)]
    out = en[:en.index(START)] + es_block + en[en.index(END):]
    out = out.replace('<html lang="en">', '<html lang="es">', 1)
    Path(es_path).write_text(out, encoding="utf-8")
    print(f"{es_path} rebuilt from {en_path}")
