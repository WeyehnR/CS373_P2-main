#!/usr/bin/env python3
"""
Generate unsplash_config.js from downloaded Unsplash research dataset
Downloads actual images from URLs in the CSV and generates config
"""

import os
import csv
import requests
import time
from urllib.parse import urlparse

def download_unsplash_images():
    # Path to your downloaded Unsplash research dataset
    dataset_folder = "unsplash-research-dataset-lite-latest"
    photos_csv = os.path.join(dataset_folder, "photos.csv000")
    
    if not os.path.exists(photos_csv):
        print(f"Error: Photos CSV not found at {photos_csv}")
        print("Please make sure you've downloaded the Unsplash research dataset.")
        return
    
    # Create directory for downloaded images
    images_folder = "unsplash_images"
    os.makedirs(images_folder, exist_ok=True)
    
    print(f"Reading photo URLs from {photos_csv}...")
    
    image_urls = []
    downloaded_files = []
    
    # Read CSV and extract image URLs
    try:
        with open(photos_csv, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file, delimiter='\t')  # TSV format
            
            count = 0
            for row in csv_reader:
                if count >= 1000:  # Limit to 1000 images for reasonable download time
                    break
                
                photo_id = row.get('photo_id')
                image_url = row.get('photo_image_url')
                
                if photo_id and image_url:
                    # Add size parameters for mosaic tiles (small images load faster)
                    sized_url = f"{image_url}?w=400&q=80"
                    image_urls.append((photo_id, sized_url))
                    count += 1
                    
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    print(f"Found {len(image_urls)} image URLs. Starting download...")
    
    # Download images
    for i, (photo_id, url) in enumerate(image_urls):
        try:
            filename = f"{photo_id}.jpg"
            filepath = os.path.join(images_folder, filename)
            
            # Skip if already downloaded
            if os.path.exists(filepath):
                downloaded_files.append(filename)
                continue
            
            print(f"Downloading {i+1}/{len(image_urls)}: {filename}")
            
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                downloaded_files.append(filename)
            else:
                print(f"Failed to download {filename}: {response.status_code}")
                
            # Be nice to the server
            time.sleep(0.1)
            
        except Exception as e:
            print(f"Error downloading {photo_id}: {e}")
            continue
    
    print(f"Downloaded {len(downloaded_files)} images to {images_folder}/")
    
    # Generate JavaScript config file
    js_content = f"""// Unsplash Dataset Configuration
// Auto-generated from downloaded Unsplash images
// Generated {len(downloaded_files)} image paths

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
    
    print(f"Generated unsplash_config.js with {len(downloaded_files)} image paths")
    print("You can now use the Unsplash dataset in your mosaic application!")

if __name__ == "__main__":
    download_unsplash_images() 