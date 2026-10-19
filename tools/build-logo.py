"""Derive the site's logo assets from the real JICO Ranch artwork.

The source is a flat tan square. Background sits at L~199 and every stroke of
the mark is under L~100, with an empty valley between, so alpha can be keyed
off luminance with a soft ramp without punching holes in the bevel.
"""
from PIL import Image, ImageDraw
import numpy as np, os

SRC = r"C:\Users\Chris\AppData\Local\Temp\claude\C--Users-Chris-OneDrive-Desktop-New-folder\0ce25a79-bd8b-4cb9-bb4a-49835e10e2c9\images\1.webp"
OUT = r"C:\Users\Chris\OneDrive\Desktop\New folder\jico-ranch\assets\img"

HI, LO = 185.0, 150.0          # alpha ramp: >=HI transparent, <=LO opaque
CREAM  = (246, 240, 230)
INK    = (26, 23, 20)
TAN    = (211, 198, 182)

src = Image.open(SRC).convert("RGB")
rgb = np.array(src).astype(np.float32)
lum = np.array(src.convert("L")).astype(np.float32)
alpha = np.clip((HI - lum) / (HI - LO), 0, 1)

def cut(box, pad=6):
    """Crop a region to RGBA, original texture kept, background keyed out."""
    x0, y0, x1, y1 = box
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(src.width, x1 + pad), min(src.height, y1 + pad)
    a = (alpha[y0:y1, x0:x1] * 255).astype(np.uint8)
    c = rgb[y0:y1, x0:x1].astype(np.uint8)
    return Image.fromarray(np.dstack([c, a]), "RGBA")

def tint(img, color):
    """Same silhouette, flat colour — for dark backgrounds."""
    a = np.array(img)[:, :, 3]
    flat = np.zeros((*a.shape, 4), np.uint8)
    flat[:, :, 0], flat[:, :, 1], flat[:, :, 2] = color
    flat[:, :, 3] = a
    return Image.fromarray(flat, "RGBA")

def fit(img, h):
    return img.resize((max(1, round(img.width * h / img.height)), h), Image.LANCZOS)

# measured bands
MARK  = (387, 274, 850, 673)
JICO  = (213, 726, 1033, 860)
RANCH = (425, 913, 811, 957)

mark, jico, ranch = cut(MARK), cut(JICO, 4), cut(RANCH, 4)

def lockup_h(m, j, r, H=132):
    """Horizontal lockup: mark left, JICO over RANCH right, from the real art."""
    m2 = fit(m, H)
    j2 = fit(j, 56)
    r2 = fit(r, 19)
    gap, stack_gap = 40, 16
    wm_h = j2.height + stack_gap + r2.height
    W = m2.width + gap + j2.width
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(m2, (0, 0))
    y = (H - wm_h) // 2
    out.alpha_composite(j2, (m2.width + gap, y))
    # RANCH sits centred under JICO, as in the original
    out.alpha_composite(r2, (m2.width + gap + (j2.width - r2.width) // 2,
                             y + j2.height + stack_gap))
    return out

def lockup_v(m, j, r, W=900):
    m2 = fit(m, round(W * 0.46))
    j2 = fit(j, round(W * 0.105))
    r2 = fit(r, round(W * 0.034))
    gap1, gap2 = round(W * 0.055), round(W * 0.040)
    H = m2.height + gap1 + j2.height + gap2 + r2.height
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = 0
    for im in (m2, j2, r2):
        out.alpha_composite(im, ((W - im.width) // 2, y))
        y += im.height + (gap1 if im is m2 else gap2)
    return out

os.makedirs(OUT, exist_ok=True)
assets = {}

assets["logo-mark.png"]            = fit(mark, 420)
assets["logo-mark-cream.png"]      = tint(fit(mark, 420), CREAM)
assets["logo-lockup-h.png"]        = lockup_h(mark, jico, ranch)
assets["logo-lockup-h-cream.png"]  = tint(lockup_h(mark, jico, ranch), CREAM)
assets["logo-lockup.png"]          = lockup_v(mark, jico, ranch)
assets["logo-lockup-cream.png"]    = tint(lockup_v(mark, jico, ranch), CREAM)

# favicon: cream mark on a rounded ink tile
fav = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
d = ImageDraw.Draw(fav)
d.rounded_rectangle([0, 0, 511, 511], radius=96, fill=INK + (255,))
fm = fit(tint(mark, CREAM), 300)
fav.alpha_composite(fm, ((512 - fm.width) // 2, (512 - fm.height) // 2))
assets["favicon.png"] = fav

# social card: og:image must be a raster — SVG does not render on most platforms
og = Image.new("RGB", (1200, 630), TAN)
lv = lockup_v(mark, jico, ranch, W=620)
og.paste(lv, ((1200 - lv.width) // 2, (630 - lv.height) // 2), lv)
assets["og-card.png"] = og

for name, img in assets.items():
    p = os.path.join(OUT, name)
    img.save(p, "PNG", optimize=True)
    print(f"{name:26s} {img.size[0]:4d}x{img.size[1]:4d}  {os.path.getsize(p)//1024:4d} KB")
