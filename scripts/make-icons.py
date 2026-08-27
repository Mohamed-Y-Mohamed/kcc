"""
Generate the full favicon set from the KCC logo.

The existing PNGs were fine but there was no favicon.ico and no manifest, so
older browsers and Android home-screen installs got nothing.

The source logo has a lot of fine detail and a white background. At 16px the
detail turns to mush, so the small sizes are cropped in slightly to the cup —
the recognisable part — rather than shrinking the whole ring.
"""
from PIL import Image
import os

PUB = r"D:\robotics\kcc\public"
src = Image.open(os.path.join(PUB, "logo.jpeg")).convert("RGB")
w, h = src.size
print(f"source logo: {w}x{h}")

# The logo sits inside a white margin. Trim it so the mark fills the icon.
def trimmed(fraction):
    """fraction 0.0 = full image, 0.10 = crop 10% off each edge."""
    dx, dy = int(w * fraction), int(h * fraction)
    return src.crop((dx, dy, w - dx, h - dy))

def square(img, size, pad_fraction=0.0):
    im = img.copy()
    if pad_fraction:
        s = int(size * (1 - pad_fraction * 2))
        im = im.resize((s, s), Image.LANCZOS)
        canvas = Image.new("RGB", (size, size), (255, 255, 255))
        canvas.paste(im, ((size - s) // 2, (size - s) // 2))
        return canvas
    return im.resize((size, size), Image.LANCZOS)

# Small sizes crop in harder so the cup is still readable at 16px.
tight = trimmed(0.06)
full = trimmed(0.02)

targets = [
    ("favicon-16x16.png", 16, tight),
    ("favicon-32x32.png", 32, tight),
    ("favicon-48x48.png", 48, tight),
    ("favicon-96x96.png", 96, full),
    ("favicon-180x180.png", 180, full),
    ("apple-touch-icon.png", 180, full),
    ("android-chrome-192x192.png", 192, full),
    ("android-chrome-512x512.png", 512, full),
]

for name, size, source in targets:
    square(source, size).save(os.path.join(PUB, name), "PNG", optimize=True)
    print(f"  wrote {name} ({size}x{size})")

# Multi-resolution .ico — this is the file browsers request from /favicon.ico
# automatically, without any <link> tag.
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
square(tight, 256).save(
    os.path.join(PUB, "favicon.ico"), format="ICO", sizes=ico_sizes
)
print(f"  wrote favicon.ico ({', '.join(f'{a}x{b}' for a, b in ico_sizes)})")

# Maskable icon for Android: Android crops icons to a circle/squircle, so the
# mark needs a safe margin or the edges of the ring get sliced off.
square(full, 512, pad_fraction=0.12).save(
    os.path.join(PUB, "maskable-512x512.png"), "PNG", optimize=True
)
print("  wrote maskable-512x512.png (with safe-zone padding)")

print("\ndone")
