# Unsplash Dataset Setup Guide

This guide will help you set up the Unsplash Lite dataset for much better mosaic variety (25,000 images vs. your current 6).

## Step 1: Download Unsplash Lite Dataset

1. Go to https://unsplash.com/data
2. Click **"Download"** on the **Lite** package (1.5 GB, 25,000 images)
3. Extract the downloaded file to your project directory
4. Rename the extracted folder to `unsplash_lite`

Your folder structure should look like:

```
your-project/
├── Pictures/                 (your current images)
├── unsplash_lite/           (new Unsplash dataset)
│   ├── photo-123456.jpg
│   ├── photo-123457.jpg
│   └── ... (24,998 more images)
├── imProcess.js
├── index.html
└── generate_unsplash_config.py
```

## Step 2: Generate Configuration File

Run the Python script to automatically create the image list:

```bash
python generate_unsplash_config.py
```

This will:

- Scan your `unsplash_lite` folder
- Find all image files
- Generate `unsplash_config.js` with the complete file list

## Step 3: Test Your Setup

1. Open your project in the browser
2. Check the browser console - you should see:
   ```
   Unsplash config loaded. Available images: 25000
   Using Unsplash dataset with 25000 images
   ```

## How It Works

- **Automatic detection**: Code automatically uses Unsplash dataset if available
- **Fallback**: If Unsplash isn't found, uses your local images
- **Different subsets**: Each mosaic dataset (musicBig, musicSmall, etc.) uses different random subsets
- **Huge variety**: 25,000 professional photos instead of 6 local crops

## Benefits

✅ **25,000 unique images** instead of 6 local crops  
✅ **Professional quality** Unsplash photography  
✅ **True variety** - every mosaic tile is different  
✅ **Better results** - much more interesting mosaics  
✅ **No network issues** - all images are local

## Troubleshooting

**Problem**: "Dataset folder not found"

- Make sure the folder is named exactly `unsplash_lite`
- Check that it's in the same directory as your HTML file

**Problem**: "No images found"

- Verify the images extracted correctly
- Check that image files have extensions: .jpg, .jpeg, .png, .webp

**Problem**: Console shows "Using local images"

- The `unsplash_config.js` file wasn't generated or loaded
- Run the Python script again
- Refresh your browser

## File Sizes

- **Original**: 6 local images
- **Unsplash Lite**: 25,000 images (1.5 GB)
- **Result**: 4000x more variety for mosaics!


