import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

def create_icon():
    os.makedirs('electron/assets', exist_ok=True)
    size = (512, 512)
    image = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Draw rounded rectangle background (gradient dark blue to purple)
    # Background rectangle
    for y in range(512):
        r = int(30 + (120 - 30) * (y / 512.0))
        g = int(27 + (50 - 27) * (y / 512.0))
        b = int(75 + (200 - 75) * (y / 512.0))
        draw.line([(0, y), (512, y)], fill=(r, g, b, 255))

    # Mask for rounded corners (radius 90)
    mask = Image.new('L', size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, 512, 512], radius=90, fill=255)
    
    final_bg = Image.new('RGBA', size, (0,0,0,0))
    final_bg.paste(image, (0,0), mask=mask)
    draw = ImageDraw.Draw(final_bg)

    # Draw Document / Resume Outline
    draw.rounded_rectangle([130, 100, 382, 412], radius=24, fill=(255, 255, 255, 230))
    
    # Draw header lines / AI sparks inside document
    draw.rounded_rectangle([170, 150, 342, 175], radius=6, fill=(99, 102, 241, 255))
    draw.rounded_rectangle([170, 200, 310, 215], radius=4, fill=(148, 163, 184, 255))
    draw.rounded_rectangle([170, 235, 342, 250], radius=4, fill=(148, 163, 184, 255))
    draw.rounded_rectangle([170, 270, 280, 285], radius=4, fill=(148, 163, 184, 255))

    # Draw AI Glowing Spark / Badge
    badge_box = [290, 290, 410, 410]
    draw.ellipse(badge_box, fill=(79, 70, 229, 255), outline=(255, 255, 255, 255), width=6)
    
    # Draw checkmark or star in badge
    draw.line([(325, 350), (345, 370)], fill=(255, 255, 255, 255), width=8)
    draw.line([(345, 370), (378, 332)], fill=(255, 255, 255, 255), width=8)

    # Save PNG
    png_path = 'electron/assets/icon.png'
    final_bg.save(png_path, 'PNG')
    print(f"Generated {png_path}")

    # Generate ICO for Windows
    ico_path = 'electron/assets/icon.ico'
    final_bg.save(ico_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
    print(f"Generated {ico_path}")

    # Generate ICNS for macOS using iconutil if on macOS
    iconset_dir = 'electron/assets/icon.iconset'
    os.makedirs(iconset_dir, exist_ok=True)
    sizes = [16, 32, 64, 128, 256, 512]
    for s in sizes:
        resized = final_bg.resize((s, s), Image.LANCZOS)
        resized.save(f"{iconset_dir}/icon_{s}x{s}.png")
        if s * 2 <= 512:
            resized_2x = final_bg.resize((s * 2, s * 2), Image.LANCZOS)
            resized_2x.save(f"{iconset_dir}/icon_{s}x{s}@2x.png")
            
    try:
        subprocess.run(['iconutil', '-c', 'icns', iconset_dir, '-o', 'electron/assets/icon.icns'], check=True)
        print("Generated electron/assets/icon.icns")
    except Exception as e:
        print(f"iconutil warning: {e}")

if __name__ == '__main__':
    create_icon()
