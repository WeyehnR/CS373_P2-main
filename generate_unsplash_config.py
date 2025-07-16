#!/usr/bin/env python3
"""
Interactive Unsplash Dataset Setup
Generate unsplash_config.js from downloaded Unsplash research dataset
Downloads actual images from URLs in the CSV and generates config with user-friendly options
"""

import os
import csv
import requests
import time
import sys
from urllib.parse import urlparse

def get_user_choice():
    """Get user's preferred number of images to download"""
    print("🖼️  Interactive Unsplash Dataset Setup")
    print("=" * 50)
    print()
    print("Choose how many images you'd like to download:")
    print()
    print("1. Quick Setup    - 100 images   (~30MB, ~2 minutes)")
    print("2. Small Dataset  - 500 images   (~150MB, ~8 minutes)")
    print("3. Medium Dataset - 1000 images  (~300MB, ~15 minutes)")
    print("4. Large Dataset  - 2500 images  (~750MB, ~35 minutes)")
    print("5. Maximum        - 5000 images  (~1.5GB, ~60 minutes)")
    print("6. Custom amount")
    print()
    
    while True:
        try:
            choice = input("Enter your choice (1-6): ").strip()
            
            if choice == "1":
                return 100
            elif choice == "2":
                return 500
            elif choice == "3":
                return 1000
            elif choice == "4":
                return 2500
            elif choice == "5":
                return 5000
            elif choice == "6":
                while True:
                    try:
                        custom = int(input("Enter custom number of images (1-25000): "))
                        if 1 <= custom <= 25000:
                            return custom
                        else:
                            print("Please enter a number between 1 and 25000")
                    except ValueError:
                        print("Please enter a valid number")
            else:
                print("Please enter a number between 1 and 6")
                
        except KeyboardInterrupt:
            print("\n\nSetup cancelled by user.")
            sys.exit(0)

def estimate_time_and_size(num_images):
    """Estimate download time and size"""
    # Rough estimates based on 400px images at 80% quality
    avg_size_kb = 300  # Average size per image in KB
    avg_time_seconds = 0.7  # Average time per image including network delay
    
    total_size_mb = (num_images * avg_size_kb) / 1024
    total_time_minutes = (num_images * avg_time_seconds) / 60
    
    return total_size_mb, total_time_minutes

def confirm_download(num_images):
    """Confirm the download with user"""
    size_mb, time_minutes = estimate_time_and_size(num_images)
    
    print(f"\n📊 Download Summary:")
    print(f"   Images to download: {num_images:,}")
    print(f"   Estimated size: {size_mb:.1f} MB")
    print(f"   Estimated time: {time_minutes:.1f} minutes")
    print()
    
    confirm = input("Continue with download? (y/n): ").strip().lower()
    return confirm in ['y', 'yes', '']

def download_unsplash_images():
    """Main function with interactive setup"""
    
    # Check if dataset exists
    dataset_folder = "unsplash-research-dataset-lite-latest"
    photos_csv = os.path.join(dataset_folder, "photos.csv000")
    
    if not os.path.exists(photos_csv):
        print(f"❌ Error: Photos CSV not found at {photos_csv}")
        print("Please make sure you've downloaded the Unsplash research dataset.")
        print("Follow the instructions in UNSPLASH_SETUP.md")
        return
    
    # Get user preferences
    num_images = get_user_choice()
    
    if not confirm_download(num_images):
        print("Setup cancelled by user.")
        return
    
    # Create directory for downloaded images
    images_folder = "unsplash_images"
    os.makedirs(images_folder, exist_ok=True)
    
    print(f"\n🔍 Reading photo URLs from {photos_csv}...")
    
    image_urls = []
    downloaded_files = []
    
    # Read CSV and extract image URLs
    try:
        with open(photos_csv, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file, delimiter='\t')  # TSV format
            
            count = 0
            for row in csv_reader:
                if count >= num_images:  # User-specified limit
                    break
                
                photo_id = row.get('photo_id')
                image_url = row.get('photo_image_url')
                
                if photo_id and image_url:
                    # Add size parameters for mosaic tiles (small images load faster)
                    sized_url = f"{image_url}?w=400&q=80"
                    image_urls.append((photo_id, sized_url))
                    count += 1
                    
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return
    
    print(f"📥 Found {len(image_urls)} image URLs. Starting download...")
    print()
    
    # Download images with progress
    start_time = time.time()
    for i, (photo_id, url) in enumerate(image_urls):
        try:
            filename = f"{photo_id}.jpg"
            filepath = os.path.join(images_folder, filename)
            
            # Skip if already downloaded
            if os.path.exists(filepath):
                downloaded_files.append(filename)
                continue
            
            # Progress indicator
            progress = (i + 1) / len(image_urls) * 100
            elapsed = time.time() - start_time
            if i > 0:
                eta = (elapsed / i) * (len(image_urls) - i)
                eta_str = f" (ETA: {eta/60:.1f}m)"
            else:
                eta_str = ""
            
            print(f"\r📥 Progress: {progress:.1f}% - Downloading: {filename}{eta_str}", end="", flush=True)
            
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                downloaded_files.append(filename)
            else:
                print(f"\n⚠️  Failed to download {filename}: {response.status_code}")
                
            # Be nice to the server
            time.sleep(0.1)
            
        except Exception as e:
            print(f"\n❌ Error downloading {photo_id}: {e}")
            continue
    
    print(f"\n\n✅ Downloaded {len(downloaded_files)} images to {images_folder}/")
    
    # Generate JavaScript config file
    print("📝 Generating configuration file...")
    
    js_content = f"""// Unsplash Dataset Configuration
// Auto-generated from {len(downloaded_files)} downloaded Unsplash images
// Generated on {time.strftime('%Y-%m-%d %H:%M:%S')}

let unsplashFiles = [
"""
    
    # Add file paths
    for i, filename in enumerate(downloaded_files):
        js_content += f'  "{filename}"'
        if i < len(downloaded_files) - 1:
            js_content += ","
        js_content += "\n"
    
    js_content += """];

console.log("Unsplash config loaded. Available images:", unsplashFiles.length);
"""
    
    # Write to file
    with open('unsplash_config.js', 'w') as f:
        f.write(js_content)
    
    # Success summary
    total_time = time.time() - start_time
    print(f"📄 Generated unsplash_config.js with {len(downloaded_files)} image paths")
    print()
    print("🎉 Setup Complete!")
    print(f"   Total time: {total_time/60:.1f} minutes")
    print(f"   Images ready: {len(downloaded_files):,}")
    print("   Your mosaic application is ready to use!")
    print()
    print("💡 Next steps:")
    print("   1. Open index.html in your web browser")
    print("   2. Load an image and create amazing mosaics!")

if __name__ == "__main__":
    try:
        download_unsplash_images()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user.")
        sys.exit(0) 