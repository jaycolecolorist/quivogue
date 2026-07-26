#!/usr/bin/env python3
"""
Gash Luxe brand grade — pushes photography toward the blush/lilac palette
without wrecking skin tones.

Node order (as you'd build it):
  1. Green/yellow suppression   — foliage, brick and yellow flowers are the
                                  main clash with a pink palette. Masked by
                                  (G - B) so skin, which also has G>B but far
                                  less, is largely spared.
  2. Global desaturation trim   — takes the edge off before we tint.
  3. Split tone                 — lilac in the shadows, blush in the highlights,
                                  keyed off luma.
  4. Curves                     — lift the blacks for an airy, soft feel;
                                  a touch more lift in blue so shadows go lilac.
  5. Final sat/contrast trim.

Strength is one dial: STRENGTH (0 = untouched, 1 = full).
"""
from PIL import Image, ImageChops, ImageEnhance, ImageOps
import sys, os

BLUSH = (247, 200, 212)   # --blush-200
LILAC = (203, 182, 236)   # --lilac-300


def lut(fn):
    return [max(0, min(255, int(fn(i)))) for i in range(256)]


def grade(im, strength=1.0):
    s = strength
    im = im.convert('RGB')
    gray = ImageOps.grayscale(im).convert('RGB')

    # --- 1. selective green / yellow suppression -------------------------
    r, g, b = im.split()
    greenish = ImageChops.subtract(g, b)          # high on foliage & yellows
    # threshold so skin (small G-B) is spared, foliage (large) is hit hard
    mask = greenish.point(lut(lambda v: 0 if v < 42 else (v - 42) * 4.2))
    im = Image.composite(Image.blend(im, gray, 0.72 * s), im, mask)

    # --- 2. global desaturation trim -------------------------------------
    im = Image.blend(im, gray, 0.13 * s)

    # --- 3. split tone: lilac shadows, blush highlights -------------------
    luma = ImageOps.grayscale(im)
    warm = Image.blend(im, Image.new('RGB', im.size, BLUSH), 0.15 * s)
    cool = Image.blend(im, Image.new('RGB', im.size, LILAC), 0.22 * s)
    # soften the key so the transition isn't a hard line
    key = luma.point(lut(lambda v: 255 / (1 + pow(2.718, -(v - 128) / 46.0))))
    im = Image.composite(warm, cool, key)

    # --- 4. curves --------------------------------------------------------
    # Blacks lift mostly in blue so shadows read lilac, not sepia. Green is
    # pulled back harder than R/B, which walks the midtones toward magenta —
    # that is what makes it read "blush" rather than just "warm".
    lift_r, lift_g, lift_b = 9 * s, 8 * s, 23 * s
    gain_r = 1 - 0.045 * s
    gain_g = 1 - 0.090 * s
    gain_b = 1 - 0.045 * s
    r2, g2, b2 = im.split()
    im = Image.merge('RGB', [
        r2.point(lut(lambda v: lift_r + v * gain_r)),
        g2.point(lut(lambda v: lift_g + v * gain_g)),
        b2.point(lut(lambda v: lift_b + v * gain_b)),
    ])

    # --- 5. final trim ---------------------------------------------------
    im = ImageEnhance.Color(im).enhance(1 - 0.04 * s)
    im = ImageEnhance.Contrast(im).enhance(1 + 0.03 * s)
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
    st = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
    im = Image.open(src)
    im = fit(im, w, h)
    if st > 0:
        im = grade(im, st)
    im.save(dst, quality=86, optimize=True)
