# Image Processing & Mosaic Generator

## About This Project

This project is a refactored version of an assignment from my Introduction to 3D Programming class at UMass, completed 2 years ago. After graduation, I revisited this project to enhance it by replacing the original UMass-restricted dataset with a publicly available dataset from Unsplash, making it more accessible and providing significantly more variety for mosaic generation.

## What It Does

This web-based application creates artistic photo mosaics using image processing techniques. It takes an input image and recreates it using thousands of smaller images as "tiles," creating a mosaic effect where the overall image is visible from a distance while individual photos are visible up close.

### Key Features

- **Interactive Web Interface**: Built with p5.js for real-time image processing
- **Multiple Datasets**: Support for both local images and Unsplash's research dataset
- **Real-time Processing**: Live preview and adjustment of mosaic parameters
- **Large Image Library**: Access to 25,000+ professional photos from Unsplash
- **Automatic Fallback**: Uses local images if Unsplash dataset isn't available

## Dataset Migration

**Original (Class Version)**: Used a restricted UMass dataset with limited images
**Current (Refactored)**: Uses Unsplash's publicly available research dataset containing 25,000+ high-quality images

This change dramatically improves:

- **Variety**: 4000x more unique images for mosaic tiles
- **Quality**: Professional photography from Unsplash contributors
- **Accessibility**: Anyone can download and use the dataset
- **Legal Clarity**: Clear licensing terms for research and educational use

## Getting Started

1. **Clone the repository**
2. **Set up the Unsplash dataset** (optional but recommended):
   - Follow instructions in `UNSPLASH_SETUP.md`
   - Download the Unsplash Lite dataset (1.5GB, 25,000 images)
   - Run `python generate_unsplash_config.py` to set up image paths
3. **Open `index.html`** in a web browser
4. **Load an image** and watch it transform into a mosaic!

## Technical Implementation

### Image Processing Algorithms

#### Contrast Adjustment

The formula for adjusting contrast in an image is: `contrast * input(x,y) + (1-contrast) * 127`, where `contrast` is a value between 0 and 1, and `input(x,y)` is the pixel intensity at location `(x, y)` in the original image.

The `contrast` value is used as a weight in a linear interpolation between the original image pixel value and the middle gray value (127).

- If the contrast is 1, the formula becomes `input(x,y) + 0`, which means the original image is unchanged.
- If the contrast is 0, the formula becomes `0 + 127`, which means all pixels become a middle gray, effectively removing all contrast from the image.

#### RGB to Grayscale Conversion

The formula `L = 0.30 * R + 0.59 * G + 0.11 * B` is used to convert an RGB image to grayscale.

The coefficients 0.30, 0.59, and 0.11 are the relative luminance values for red, green, and blue, respectively. These values are based on the way humans perceive color. Our eyes are more sensitive to green light, and less sensitive to blue light. Therefore, when converting to grayscale, a larger portion of the green value is used, and a smaller portion of the blue value is used.

This method ensures that the grayscale image maintains as much of the perceived brightness and contrast from the original color image as possible.

```javascript
L = 0.3 * R + 0.59 * G + 0.11 * B;
```

## Project Structure

- `imProcess.js` - Main image processing and mosaic generation logic
- `index.html` - Web interface
- `generate_unsplash_config.py` - Downloads and configures Unsplash dataset
- `finalize_unsplash_config.py` - Generates config from existing downloads
- `Pictures/` - Local fallback images
- `unsplash_images/` - Downloaded Unsplash images (auto-generated)

## Technologies Used

- **p5.js** - Creative coding library for interactive graphics
- **JavaScript** - Core application logic
- **Python** - Dataset management and configuration
- **HTML5 Canvas** - Image rendering and manipulation
- **Unsplash Research Dataset** - Source images for mosaic tiles

## Educational Context

This project demonstrates practical applications of:

- Image processing algorithms
- Color space conversions
- Large dataset management
- Web-based graphics programming
- API integration and data processing

---

_Originally developed for CS373 (Introduction to 3D Programming) at UMass. Refactored post-graduation to use open datasets and improve accessibility._
