#!/usr/bin/env python3
"""
Generate final unsplash_config.js from already downloaded images
"""

import os

def finalize_unsplash_config():
    images_folder = "unsplash_images"
    
    if not os.path.exists(images_folder):
        print(f"Error: {images_folder} folder not found.")
        return
    
    # Get all JPG files from the folder
    image_files = []
    for file in os.listdir(images_folder):
        if file.lower().endswith('.jpg'):
            image_files.append(file)
    
    image_files.sort()  # Sort for consistent ordering
    
    print(f"Found {len(image_files)} downloaded images")
    
    # Generate JavaScript config file
    js_content = f"""// Unsplash Dataset Configuration
// Generated from {len(image_files)} downloaded images

let unsplashFiles = [
"""
    
    # Add file paths
    for i, filename in enumerate(image_files):
        js_content += f'  "{filename}"'
        if i < len(image_files) - 1:
            js_content += ","
        js_content += "\n"
    
    js_content += """];

console.log("Unsplash config loaded. Available images:", unsplashFiles.length);
"""
    
    # Write to file
    with open('unsplash_config.js', 'w') as f:
        f.write(js_content)
    
    print(f"Generated unsplash_config.js with {len(image_files)} image paths")
    print("Your mosaic application is ready to use!")
    print(f"You now have {len(image_files)} unique images for mosaics!")

if __name__ == "__main__":
    finalize_unsplash_config() 