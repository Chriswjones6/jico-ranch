"""Bundle the site into ONE self-contained HTML file for sharing a preview.

Fonts are inlined as @font-face data URIs (the Artifact CSP blocks font CDNs),
CSS and JS are inlined, and every image becomes a data URI. Output is pure
ASCII, because the host supplies its own <head> and so the file cannot declare
a charset of its own.

    python tools/build-preview.py [out.html]
"""
import base64, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "preview.html")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
FONT_CSS = ("https://fonts.googleapis.com/css2?"
            "family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600"
            "&family=Jost:wght@400;500;600&display=swap")
MIME = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".webp": "image/webp"}
BS = chr(92)


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        d = r.read()
    return d if binary else d.decode("utf-8")


def build_fonts():
    css, kept, cache = get(FONT_CSS), [], {}
    for block, subset in re.findall(r"(/\*\s*([\w\-\[\]]+)\s*\*/\s*@font-face\s*\{.*?\})", css, re.S):
        if subset != "latin":
            continue
        m = re.search(r"url\((https://[^)]+\.woff2)\)", block)
        if not m:
            continue
        url = m.group(1)
        if url not in cache:
            cache[url] = base64.b64encode(get(url, binary=True)).decode("ascii")
        kept.append(re.sub(r"^/\*.*?\*/\s*", "", block.replace(url, "data:font/woff2;base64," + cache[url]), flags=re.S))
    return "\n".join(kept)


def data_uri(path):
    raw = open(path, "rb").read()
    return f"data:{MIME[os.path.splitext(path)[1].lower()]};base64," + base64.b64encode(raw).decode("ascii")


def main():
    img_dir = os.path.join(ROOT, "assets", "img")
    imgs = {f: data_uri(os.path.join(img_dir, f))
            for f in os.listdir(img_dir) if os.path.splitext(f)[1].lower() in MIME}
    print("inlined", len(imgs), "images")

    fonts = build_fonts()
    if not fonts:
        sys.exit("font fetch failed")

    css = open(os.path.join(ROOT, "assets/css/styles.css"), encoding="utf-8").read()
    js = open(os.path.join(ROOT, "assets/js/main.js"), encoding="utf-8").read()
    html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

    assert 'src="assets/img/${esc(a.img)}"' in js
    js = js.replace('src="assets/img/${esc(a.img)}"', 'src="${IMG[a.img] || \'\'}"')
    js = js.replace('src="assets/img/${esc(latest.img)}"', 'src="${IMG[latest.img] || \'\'}"')
    js = "const IMG = " + repr(imgs).replace("'", '"') + ";\n\n" + js

    body = html[html.index("<body>") + 6: html.index("</body>")]
    body = re.sub(r'<script src="assets/js/main\.js" defer></script>', "", body)

    missing = set()

    def swap(m):
        if m.group(1) in imgs:
            return imgs[m.group(1)]
        missing.add(m.group(1))
        return m.group(0)

    body = re.sub(r"assets/img/([\w.\-]+)", swap, body)
    if missing:
        print("!! unresolved:", missing)

    ent = lambda s: "".join(c if ord(c) < 128 else "&#x%X;" % ord(c) for c in s)
    uesc = lambda s: "".join(c if ord(c) < 128 else BS + "u%04x" % ord(c) for c in s)

    page = ("<title>JICO Ranch</title>\n<style>\n" + fonts + "\n\n" + ent(css)
            + "\n</style>\n" + ent(body) + "\n<script>\n" + uesc(js) + "\n</script>\n")
    assert all(ord(c) < 128 for c in page)

    open(OUT, "w", encoding="utf-8").write(page)
    print("wrote", OUT, round(len(page.encode()) / 1048576, 2), "MB")


main()
