#!/usr/bin/env python3
"""
Downloads and re-encodes the stand-in photography in assets/img/.

    python tools/fetch-photos.py            # only what is missing
    python tools/fetch-photos.py --force    # re-fetch everything

Every photo is from Unsplash and carries the Unsplash License: free to use
for commercial work, no permission and no attribution required. We record the
photo id and the photographer anyway in assets/img/PHOTO-CREDITS.md, so that
when a real JICO Ranch photo replaces one of these there is no doubt about
what came from where.

Only ids beginning "photo-" are used. Unsplash+ (the paid library) serves ids
beginning "premium_photo-" and those are NOT free to use -- if you add to the
manifest below, check the id prefix.

Each entry is  (filename, unsplash id, width, height, alt text).
The width/height are the final file size; Unsplash crops to that ratio on
their side and PIL re-encodes locally so nothing ships with camera metadata
or a 4MB payload attached. Replacing any of these with a real photo means
dropping a file of the same name in assets/img/ -- no markup change.
"""

import argparse, io, os, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets", "img")

# Full-bleed bands: wide, and dark enough at the bottom to carry cream text.
BANDS = [
    ("hero-ranch.jpg",   "photo-1783267152430-858da5c62a9d", 2000, 1125,
     "Horses grazing in a golden pasture at sunset"),
    ("pillar-animals.jpg", "photo-1787157365530-b4d506d98bfe", 2000, 1125,
     "Horses grazing in a grassy pasture beside a barn"),
    ("pillar-garden.jpg", "photo-1702995878564-17fef6fa4e57", 2000, 1125,
     "Rows of vegetables in the market garden"),
]

# Hero montage stills. Same photos as elsewhere on the page but cut wide for
# full-bleed, because the hero crossfades through them: horses, then the
# goats, then something coming out of the garden.
HERO_STILLS = [
    ("hero-2-goats.jpg", "photo-1758391634501-3030c658d143", 2000, 1125,
     "A goat looking over the pasture fence"),
    ("hero-3-picking.jpg", "photo-1755353545133-9a8956d1b0ea", 2000, 1125,
     "Cutting greens straight off the row"),
    ("hero-4-donkey.jpg", "photo-1789314957667-26c9a6275a08", 2000, 1125,
     "A donkey grazing in a sunlit field"),
]

# The three-up land strip.
RIBBON = [
    ("scene-horses-fence.jpg", "photo-1769022633296-f6b1ab2f850e", 1400, 933,
     "A horse looking out over the wooden pasture fence"),
    ("scene-orchard.jpg", "photo-1635778528589-b5df9e10d7cd", 1400, 933,
     "Rows of fruit trees running away down the orchard"),
    ("scene-garden-wide.jpg", "photo-1516906561371-53f48df1254d", 1400, 933,
     "Garden rows running out toward the treeline"),
]

# 3:2 cards -- the growing grid, the animal roster, experiences, the stand.
CARDS = [
    ("garden-rows.jpg", "photo-1744726010540-bf318d4a691f", 1200, 800,
     "Leafy greens growing in long rows"),
    ("garden-orchard.jpg", "photo-1762189493245-e673499defde", 1200, 800,
     "Fruit trees heavy with ripe fruit in the orchard"),
    ("garden-flowers.jpg", "photo-1632051160600-8a56f11cb322", 1200, 800,
     "A field of orange and yellow cutting flowers"),
    ("garden-greenhouse.jpg", "photo-1708796705570-33fd29ef67d0", 1200, 800,
     "Inside the greenhouse, rows of young plants"),
    ("garden-beehives.jpg", "photo-1775644674443-ed02a8bdb6c2", 1200, 800,
     "Beehives lined up along a grassy field"),
    ("garden-harvest.jpg", "photo-1785631829649-facc191f7f96", 1200, 800,
     "Freshly pulled vegetables in wooden crates"),

    ("animal-goats.jpg", "photo-1758391634501-3030c658d143", 1200, 800,
     "A goat looking over a wooden fence"),
    ("animal-cattle.jpg", "photo-1620123357390-86c161acbb7e", 1200, 800,
     "Cattle grazing in a green pasture"),
    ("animal-chickens.jpg", "photo-1794434342243-a398c68f69ee", 1200, 800,
     "Laying hens outside the coop"),
    ("animal-horses.jpg", "photo-1731012375571-2e3d0934777a", 1200, 800,
     "Horses in a fenced paddock under the trees"),
    ("animal-pigs.jpg", "photo-1785523310511-2f666dcfd6d3", 1200, 800,
     "A pasture-raised hog rooting in the grass"),
    ("animal-sheep.jpg", "photo-1703291543301-a3104982a163", 1200, 800,
     "Sheep grazing on green pasture"),
    ("animal-rabbits.jpg", "photo-1767016627558-3f41c7432e2e", 1200, 800,
     "Rabbits resting on a hay bale"),
    ("animal-donkey.jpg", "photo-1789314957667-26c9a6275a08", 1200, 800,
     "A donkey grazing in a sunlit field"),

    ("exp-tour.jpg", "photo-1791395387912-39418aa99a65", 1200, 800,
     "A small group walking the yard beside the barn"),
    ("exp-upick.jpg", "photo-1755353545133-9a8956d1b0ea", 1200, 800,
     "Cutting fresh greens straight off the row"),
    ("exp-fieldtrip.jpg", "photo-1730485192112-654ec197f9eb", 1200, 800,
     "Two children meeting a goat through the fence"),
    ("exp-workshop.jpg", "photo-1659930087003-2d64e33181f7", 1200, 800,
     "Hands marking out a cut at the workbench"),
    ("exp-birthday.jpg", "photo-1753373096615-2916803d301c", 1200, 800,
     "A child petting a goat at the fence line"),
    ("exp-events.jpg", "photo-1780728953985-0914c8132793", 1200, 800,
     "A barn strung with lights set up for an event"),

    ("store-produce.jpg", "photo-1632776350300-11016768b521", 1200, 800,
     "Vegetables laid out in wooden crates at the stand"),
    ("store-eggs.jpg", "photo-1701252776710-d81bfd7a5806", 1200, 800,
     "A basket of fresh brown eggs"),
    ("store-honey.jpg", "photo-1645871317023-00ca188755de", 1200, 800,
     "Jars of honey on a wooden table"),
    ("store-meat.jpg", "photo-1795061845825-e744fba494f6", 1200, 800,
     "Cattle on grass on the hillside"),
    ("store-flowers.jpg", "photo-1617417715887-d51297ecdbca", 1200, 800,
     "A cut flower bouquet in a jar"),
    ("store-preserves.jpg", "photo-1695136219547-1fd5c21a1e71", 1200, 800,
     "Shelves of put-up preserves in jars"),

    ("story-family.jpg", "photo-1791395533950-7e07f40cb224", 1200, 800,
     "Leaning on the fence line at sunrise"),
]

# Square gallery tiles.
GALLERY = [
    ("gallery-1.jpg", "photo-1794191991285-9db002156f34", 900, 900,
     "A horse behind the pasture fence at golden hour"),
    ("gallery-2.jpg", "photo-1789585803622-e8938a1e123a", 900, 900,
     "Dappled light down a row of orchard trees"),
    ("gallery-3.jpg", "photo-1529313780224-1a12b68bed16", 900, 900,
     "Rows of leafy greens in the garden"),
    ("gallery-4.jpg", "photo-1619492154797-2c2a6ddcd504", 900, 900,
     "A red barn under an open sky"),
    ("gallery-5.jpg", "photo-1775681150189-0c76d017d869", 900, 900,
     "Seedlings coming on in the greenhouse"),
    ("gallery-6.jpg", "photo-1664306635579-1ca18c7fbf70", 900, 900,
     "A field of mixed cutting flowers"),
    ("gallery-7.jpg", "photo-1775716215749-f2e0543ebf6e", 900, 900,
     "The fence line and the trees along the drive"),
    ("gallery-8.jpg", "photo-1776188075741-6687d4b4e018", 900, 900,
     "Beehives out at the edge of the field"),
]

MANIFEST = BANDS + HERO_STILLS + RIBBON + CARDS + GALLERY

SRC = "https://images.unsplash.com/%s?w=%d&h=%d&fit=crop&crop=entropy&q=85&fm=jpg"
# A plain client name. Never send anything identifying the user.
UA = {"User-Agent": "jico-ranch-site-build/1.0"}


def fetch(pid, w, h):
    req = urllib.request.Request(SRC % (pid, w, h), headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    try:
        from PIL import Image
    except ImportError:
        sys.exit("Pillow is required:  python -m pip install pillow")

    bad = [m for m in MANIFEST if not m[1].startswith("photo-")]
    if bad:
        sys.exit("not free to use (Unsplash+): %s" % ", ".join(m[1] for m in bad))

    total = 0
    rows = []
    for name, pid, w, h, alt in MANIFEST:
        dest = os.path.join(OUT, name)
        if os.path.exists(dest) and not args.force:
            total += os.path.getsize(dest)
            rows.append((name, pid, alt))
            print("  skip  %-26s (exists)" % name)
            continue
        raw = fetch(pid, w, h)
        im = Image.open(io.BytesIO(raw))
        im = im.convert("RGB")
        if im.size != (w, h):
            im = im.resize((w, h), Image.LANCZOS)
        # progressive + no metadata: smaller files and nothing hitchhiking
        im.save(dest, "JPEG", quality=78, optimize=True, progressive=True)
        size = os.path.getsize(dest)
        total += size
        rows.append((name, pid, alt))
        print("  got   %-26s %7.1f KB" % (name, size / 1024.0))
        time.sleep(0.15)

    credits = [
        "# Photo credits",
        "",
        "Every photo in `assets/img/` that is not the logo is a stand-in from",
        "[Unsplash](https://unsplash.com), used under the",
        "[Unsplash License](https://unsplash.com/license): free for commercial use,",
        "no permission needed and no attribution required. They are listed here anyway.",
        "",
        "These are **not photos of JICO Ranch.** Each one is a placeholder for the real",
        "thing. To replace one, drop a photo with the same filename into `assets/img/`",
        "-- nothing in the markup has to change. Regenerate the whole set with",
        "`python tools/fetch-photos.py --force`.",
        "",
        "| File | Shows | Unsplash photo |",
        "| --- | --- | --- |",
    ]
    for name, pid, alt in rows:
        credits.append("| `%s` | %s | [%s](https://unsplash.com/photos/%s) |"
                       % (name, alt, pid, pid.replace("photo-", "")))
    credits.append("")
    with open(os.path.join(OUT, "PHOTO-CREDITS.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(credits))

    print("\n%d photos, %.1f MB on disk" % (len(MANIFEST), total / 1048576.0))
    print("wrote assets/img/PHOTO-CREDITS.md")


if __name__ == "__main__":
    main()
