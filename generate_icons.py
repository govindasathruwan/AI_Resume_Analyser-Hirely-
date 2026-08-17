import os
import subprocess
from PIL import Image, ImageDraw, ImagePath

def create_hirely_icon(size=1024):
    # Create RGBA image
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Margins for macOS squircle icon shape (approx 10% padding)
    pad = int(size * 0.08)
    rect = [pad, pad, size - pad, size - pad]
    radius = int(size * 0.22)

    # 1. Shadow background
    shadow_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    shadow_draw.rounded_rectangle([pad, pad+12, size-pad, size-pad+12], radius=radius, fill=(0, 0, 0, 45))
    img = Image.alpha_composite(img, shadow_img)
    draw = ImageDraw.Draw(img)

    # 2. Main Squircle Body (Soft Apple Light Surface with subtle gradient)
    # Background fill: #F5F7FA to #E4E8F0 or Crisp White
    bg_color = (255, 255, 255, 255)
    border_color = (220, 226, 236, 255)
    draw.rounded_rectangle(rect, radius=radius, fill=bg_color, outline=border_color, width=int(size*0.015))

    # 3. Draw the Lightning Bolt Path
    # The SVG path coordinates mapped from 48x46 grid to internal squircle bounds:
    # Path coordinates scaled to fit nicely inside the squircle center
    center_x = size / 2.0
    center_y = size / 2.0
    scale = size * 0.014

    # Lightning Bolt Polygon Points (normalized around center):
    # Base SVG points scaled and centered
    svg_pts = [
        (25.946, 44.938),
        (23.925, 44.240),
        (23.925, 33.937),
        (21.663, 31.675),
        (10.287, 31.675),
        (9.367, 29.887),
        (16.847, 19.416),
        (15.005, 15.838),
        (1.237, 15.838),
        (0.317, 14.050),
        (10.013, 0.474),
        (10.933, 0.0),
        (39.827, 0.0),
        (40.747, 1.788),
        (33.267, 12.259),
        (35.109, 15.838),
        (46.486, 15.838),
        (47.376, 17.670),
        (25.946, 44.938)
    ]

    # Convert SVG points to image pixel coordinates
    # Center of 48x46 SVG is roughly (24, 23)
    pixel_pts = []
    for x, y in svg_pts:
        px = center_x + (x - 24.0) * scale
        py = center_y + (y - 22.5) * scale
        pixel_pts.append((px, py))

    # Fill Lightning Bolt with Vibrant Apple Blue (#0071E3)
    blue_color = (0, 113, 227, 255)
    draw.polygon(pixel_pts, fill=blue_color)

    return img

def main():
    assets_dir = "/Users/govinda/Public/AI resume analyser/electron/assets"
    os.makedirs(assets_dir, exist_ok=True)

    print("Generating Hirely App Icon PNG...")
    icon_img = create_hirely_icon(1024)
    png_path = os.path.join(assets_dir, "icon.png")
    icon_img.save(png_path, "PNG")
    print(f"Saved {png_path}")

    # Generate ICO for Windows
    ico_path = os.path.join(assets_dir, "icon.ico")
    icon_img.save(ico_path, format="ICO", sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
    print(f"Saved {ico_path}")

    # Generate ICNS for macOS using iconutil
    iconset_dir = "/tmp/hirely_icon.iconset"
    os.makedirs(iconset_dir, exist_ok=True)
    sizes = [16, 32, 64, 128, 256, 512]
    for s in sizes:
        resized = icon_img.resize((s, s), Image.LANCZOS)
        resized.save(f"{iconset_dir}/icon_{s}x{s}.png")
        resized2x = icon_img.resize((s*2, s*2), Image.LANCZOS)
        resized2x.save(f"{iconset_dir}/icon_{s}x{s}@2x.png")

    icns_path = os.path.join(assets_dir, "icon.icns")
    subprocess.run(["iconutil", "-c", "icns", iconset_dir, "-o", icns_path], check=False)
    print(f"Saved {icns_path}")

if __name__ == "__main__":
    main()
