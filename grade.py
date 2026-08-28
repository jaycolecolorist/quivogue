#!/usr/bin/env python3
"""
QV fits brand grade.

Deliberately much lighter than a colour wash: this brand's own photography is
already cohesive (deep teal, sand, mocha), so the job is to make stock filler
sit alongside it, not to tint everything.

Node order:
  1. Gentle desaturation — pulls loud stock imagery toward the brand's calm.
  2. Split tone — cool teal in the shadows, warm sand in the highlights,
     keyed off a softened luma curve.
  3. Curves — a small black lift for air, with green/blue held slightly above
     red so shadows stay teal rather than going muddy.

NOTE: the previous brand's version of this script suppressed greens and
yellows. That would be actively wrong here — teal IS the brand colour, and
the golf range is shot on grass. There is no hue suppression in this version.

Run:  python3 grade.py <src> <dst> <width> <height> [strength]
Strength 0.35 is what the current photo set uses.
"""
from PIL import Image, ImageEnhance, ImageOps
import sys

SHADOW = (20, 98, 90)     # --brand-500, deep teal
HILITE = (230, 218, 200)  # --sand-200, warm sand


def lut(fn):
    return [max(0, min(255, int(fn(i)))) for i in range(256)]


def grade(im, strength=0.35):
    s = strength
    im = im.convert('RGB')

    # --- 1. desaturate a touch ------------------------------------------
    gray = ImageOps.grayscale(im).convert('RGB')
    im = Image.blend(im, gray, 0.14 * s)

    # --- 2. split tone: teal shadows, sand highlights --------------------
    luma = ImageOps.grayscale(im)
    warm = Image.blend(im, Image.new('RGB', im.size, HILITE), 0.13 * s)
    cool = Image.blend(im, Image.new('RGB', im.size, SHADOW), 0.16 * s)
    key = luma.point(lut(lambda v: 255 / (1 + pow(2.718, -(v - 128) / 48.0))))
    im = Image.composite(warm, cool, key)

    # --- 3. curves: lift blacks, keep the lift teal-leaning --------------
    lift_r, lift_g, lift_b = 7 * s, 11 * s, 12 * s
    gain = 1 - 0.04 * s
    r, g, b = im.split()
    im = Image.merge('RGB', [
        r.point(lut(lambda v: lift_r + v * gain)),
        g.point(lut(lambda v: lift_g + v * gain)),
        b.point(lut(lambda v: lift_b + v * gain)),
    ])

    im = ImageEnhance.Contrast(im).enhance(1 + 0.04 * s)
    return im


def fit(im, w, h):
    """Cover-crop to exactly w x h, biased to the upper third (keeps heads in)."""
    sr, tr = im.width / im.height, w / h
    if sr > tr:
        nw = int(im.height * tr)
        im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
    else:
        nh = int(im.width / tr)
        top = int((im.height - nh) * 0.18)
        im = im.crop((0, top, im.width, top + nh))
    return im.resize((w, h), Image.LANCZOS)


if __name__ == '__main__':
    src, dst, w, h = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    st = float(sys.argv[5]) if len(sys.argv) > 5 else 0.35
    im = fit(Image.open(src), w, h)
    if st > 0:
        im = grade(im, st)
    im.save(dst, quality=86, optimize=True)
