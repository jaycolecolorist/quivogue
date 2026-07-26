#!/usr/bin/env python3
"""
Re-frame the four photos that have Instagram's own price stickers burned in.

We can't paint the stickers out cleanly without content-aware fill, so each
photo is re-cropped to a region that excludes the sticker while keeping the
product. ig-22 is a collage, so the product is lifted out and set on its own
white background instead.

Crop boxes are in pixels against the ORIGINAL file in scratchpad/ig/.
"""
from PIL import Image
import sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from grade import grade

SP = os.path.dirname(os.path.abspath(__file__))
IG = os.path.join(SP, 'ig')
DST = '/Volumes/JAY COLE/gashluxe/photos'
OUT = (750, 1000)          # product card is 3:4
S = 0.7                    # brand grade strength, same as the rest of the set


def cover(im, size):
    sr, tr = im.width / im.height, size[0] / size[1]
    if sr > tr:
        nw = int(im.height * tr)
        im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
    else:
        nh = int(im.width / tr)
        im = im.crop((0, 0, im.width, nh))
    return im.resize(size, Image.LANCZOS)


def crop_to(src, box, dst):
    """Straight crop, then scale to the card size."""
    im = Image.open(os.path.join(IG, src)).convert('RGB').crop(box)
    im = cover(im, OUT)
    grade(im, S).save(os.path.join(DST, dst), quality=88, optimize=True)
    return box[2] - box[0], box[3] - box[1]


def crop_onto_card(src, box, dst, pad=0.04, bg=(252, 250, 248)):
    """Lift the product out of a collage and centre it on a clean card."""
    im = Image.open(os.path.join(IG, src)).convert('RGB').crop(box)
    canvas = Image.new('RGB', OUT, bg)
    maxw = int(OUT[0] * (1 - pad * 2))
    maxh = int(OUT[1] * (1 - pad * 2))
    im.thumbnail((maxw, maxh), Image.LANCZOS)
    canvas.paste(im, ((OUT[0] - im.width) // 2, (OUT[1] - im.height) // 2))
    grade(canvas, S).save(os.path.join(DST, dst), quality=88, optimize=True)
    return im.size


JOBS = [
    # jumpsuit — sticker top edge is at ~y860; stop well clear of it
    ('crop',  'ig-27.jpg', (132, 0, 732, 800),    'cream-lace-jumpsuit.jpg'),
    # leggings — sticker crosses the legs at mid-frame; keep the top half
    ('crop',  'ig-29.jpg', (304, 0, 776, 630),    'leopard-print-leggings.jpg'),
    # coral sandal — sticker top edge lands ~y905; stop clear of it
    ('crop',  'ig-28.jpg', (190, 30, 827, 880),   'coral-bloom-heeled-sandal.jpg'),
    # tortoise sandal — collage; lift the hero shoe onto a clean card,
    # stopping short of the sticker's top edge (~y675)
    ('card',  'ig-22.jpg', (120, 215, 985, 585),  'tortoise-block-heel-sandal.jpg'),
]

if __name__ == '__main__':
    for kind, src, box, dst in JOBS:
        got = crop_to(src, box, dst) if kind == 'crop' else crop_onto_card(src, box, dst)
        print(f'{dst:38s} <- {src} {kind:5s} {got}')
