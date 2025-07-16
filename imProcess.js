/* CMPSCI 373 Project 2: Image Processing */

// List of sample input images
let input_image_names = [
  "birmingham-museums-trust.jpg",
  "Lighthouse.jpg",
  "lavendar_field.jpg",
  "amsterdam.jpg",
  "Lego_Dino.jpg",
  "xochimilco.jpg",
];

let input_images = []; // array to store all sample input images
let input = null; // input image
let output = null; // output image
let image_url = "https://images.unsplash.com/"; // Using Unsplash for high-quality images

let mosaic_names = ["musicBig", "musicSmall", "movieBig", "movieSmall"];
let mosaics = []; // array to store mosaic image datasets

/* ===================================================
 *                 Pixel Operations
 * =================================================== */
// Adjust brightness. Provided to you as a starting example.
function brighten(input, output, brightness) {
  let ip = input.pixels; // an alias for input pixels array
  let op = output.pixels; // an alias for output pixels array
  for (let i = 0; i < input.width * input.height; i++) {
    let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha
    for (let c = 0; c < 3; c++) {
      op[idx + c] = pixelClamp(ip[idx + c] * brightness); // red, green, and blue respectively
    }
  }
}

// Adjust contrast.
// If contrast is 0, the output should be a medium gray image (medium gray is [127, 127, 127])
// If contrast is 1, the output should be the original image
// formula for contrast: contrast * input(x,y) + (1-contrast) * 127, where contrast is between 0 and 1.
function adjustContrast(input, output, contrast) {
  // ===YOUR CODE STARTS HERE===
  let ip = input.pixels; // an alias for input pixels array
  let op = output.pixels; // an alias for output pixels array
  for (let i = 0; i < input.width * input.height; i++) {
    let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha
    for (let c = 0; c < 3; c++) {
      op[idx + c] = pixelClamp(contrast * ip[idx + c] + (1 - contrast) * 127); // red
    }
  }
  // ---YOUR CODE ENDS HERE---
}

// Adjust saturation.
// If saturation is 0, the output should be a grayscale version of the image
// If saturation is 1, the output should be the original image
// formula for saturation: L = 0.30 * R + 0.59 * G + 0.11 * B
function adjustSaturation(input, out, saturation) {
  // ===YOUR CODE STARTS HERE===
  let ip = input.pixels; // an alias for input pixels array
  let op = out.pixels; // an alias for output pixels array
  for (let i = 0; i < input.width * input.height; i++) {
    let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha
    let L = 0.3 * ip[idx + 0] + 0.59 * ip[idx + 1] + 0.11 * ip[idx + 2];
    for (let c = 0; c < 3; c++) {
      op[idx + c] = pixelClamp(saturation * ip[idx + c] + (1 - saturation) * L); // red,green, and blue respectively
    }
  }
  // ---YOUR CODE ENDS HERE---
}

/* ===================================================
 *                 Image Convolution
 * =================================================== */
// Box blur.
// This is provided to you as a starting example of image convolution.
function boxBlur(input, output, ksize) {
  // create box kernel of ksize x ksize, each element of value 1/(ksize*ksize)
  let boxkernel = Array(ksize)
    .fill()
    .map(() => Array(ksize).fill(1.0 / ksize / ksize));
  filterImage(input, output, boxkernel);
}

// Gaussian blur.
// This is provided to you as a starting example of image convolution.
function gaussianBlur(input, output, sigma) {
  let gkernel = gaussianKernel(sigma); // compute Gaussian kernel using sigma
  filterImage(input, output, gkernel);
}

// Edge detection.
// This is provided to you as a starting example of image convolution.
function edgeDetect(input, output) {
  let ekernel = [
    [0, -2, 0],
    [-2, 8, -2],
    [0, -2, 0],
  ];
  filterImage(input, output, ekernel);
}

// Sharpen using the 3x3 kernel we covered in lecture.
function sharpen(input, output, sharpness) {
  // ===YOUR CODE STARTS HERE===
  // Create a sharpening kernel
  let skernel = [
    [0, -sharpness, 0],
    [-sharpness, 4 * sharpness + 1, -sharpness],
    [0, -sharpness, 0],
  ];
  filterImage(input, output, skernel);
  // ---YOUR CODE ENDS HERE---
}

/* ===================================================
 *                 Dithering
 * =================================================== */

// Uniform dithering (quantization)
function uniformQuantization(input, output) {
  // ===YOUR CODE STARTS HERE===
  /*The simplest way: anything
	above medium gray (127) is
	white (255), anything below
	is black (0).
	*/
  /**
   * P(i,j) = { 255, I(i,j) > 127; 0, I(i,j) <= 127 }
   */
  let ip = input.pixels;
  let op = output.pixels;
  for (let i = 0; i < input.width * input.height; i++) {
    let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha
    //you must use the grayscale formula on slide
    //25 of lecture 3 to convert a rgb color to its luminance/grayscale value
    let L = 0.3 * ip[idx + 0] + 0.59 * ip[idx + 1] + 0.11 * ip[idx + 2];

    for (let c = 0; c < 3; c++) {
      if (L > 127) {
        op[idx + c] = 255;
      } else {
        op[idx + c] = 0;
      }
    }

    // ---YOUR CODE ENDS HERE---
  }
}

// Random dithering
function randomDither(input, output) {
  // ===YOUR CODE STARTS HERE===
  let ip = input.pixels;
  let op = output.pixels;

  // in black and white
  for (let i = 0; i < input.width * input.height; i++) {
    let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha
    //you must use the grayscale formula on slide
    //25 of lecture 3 to convert a rgb color to its luminance/grayscale value.
    let e = Math.random() * 255;
    let L = 0.3 * ip[idx + 0] + 0.59 * ip[idx + 1] + 0.11 * ip[idx + 2];

    for (let c = 0; c < 3; c++) {
      if (L > e) {
        op[idx + c] = 255;
      } else {
        op[idx + c] = 0;
      }
    }
  }
  // ---YOUR CODE ENDS HERE---
}

// Ordered dithering
function orderedDither(input, output) {
  // Please use the 4x4 ordered dither matrix presented in lecture slides
  /**
   * D4 = 1/16 * [[15, 7, 13, 5],
   * 			   [3, 11, 1, 9],
   * 			   [12, 4, 14, 6],
   * 			   [0, 8, 2, 10]]
   */
  // ===YOUR CODE STARTS HERE===
  let ip = input.pixels;
  let op = output.pixels;
  let D4 = [
    [15, 7, 13, 5],
    [3, 11, 1, 9],
    [12, 4, 14, 6],
    [0, 8, 2, 10],
  ]; // 4x4 dithering matrix
  // Scale D4 by 1/16
  for (let i = 0; i < D4.length; i++) {
    for (let j = 0; j < D4[i].length; j++) {
      D4[i][j] *= 1 / 16;
    }
  }
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      let idx = (y * input.width + x) * 4; // calculate index based on x and y
      let L = 0.3 * ip[idx + 0] + 0.59 * ip[idx + 1] + 0.11 * ip[idx + 2];
      let e = D4[y % 4][x % 4] * 255; // threshold based on dithering matrix
      for (let c = 0; c < 3; c++) {
        if (L > e) {
          op[idx + c] = 255;
        } else {
          op[idx + c] = 0;
        }
      }
    }
  }

  // ---YOUR CODE ENDS HERE---
}

/* ===================================================
 *                 Image Mosaic
 * =================================================== */
// Image Mosaic using a given mosaic image dataset
function imageMosaic(input, output, mosaic_name) {
  let width = input.width;
  let height = input.height;

  let mimages = mosaics[mosaic_name]; // mimages is an array of mosaic images
  let w = params.mosaicSize; // Use dynamic tile size instead of fixed size
  let h = params.mosaicSize;
  let num = mimages.length; // the number of mosaic images

  for (let k = 0; k < num; k++) {
    if (mimages[k] && mimages[k].width > 0) {
      mimages[k].loadPixels(); // load mosaic image pixel values
    } else {
      console.warn(`Mosaic image ${k} failed to load or is invalid`);
    }
  }

  console.log("Computing Image Mosaic...");
  // Below you can do any precomputation necessary (it's optional)
  // to help increase the speed of mosaic computation
  // ===YOUR CODE STARTS HERE===
  let sumMkSquaredArray = new Array(num);
  for (let k = 0; k < num; k++) {
    let sumMkSquared = 0;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        for (let c = 0; c < 3; c++) {
          // loop over R, G, B channels
          let Mk = mimages[k].pixels[4 * (j * w + i) + c];
          sumMkSquared += Mk * Mk;
        }
      }
    }
    sumMkSquaredArray[k] = sumMkSquared;
  }
  // ---YOUR CODE ENDS HERE---

  let y = 0;
  (function chunk() {
    for (let x = 0; x <= width - w; x += w) {
      // x loop
      // ===YOUR CODE STARTS HERE===
      let bestMatchIndex = 0;
      let bestMatchScore = Infinity;
      let bestAlpha = [0, 0, 0];

      for (let k = 0; k < num; k++) {
        // Skip if mosaic image is invalid
        if (
          !mimages[k] ||
          !mimages[k].pixels ||
          mimages[k].pixels.length === 0
        ) {
          continue;
        }

        let sumBMk = [0, 0, 0],
          sumMkSquared = [0, 0, 0];
        for (let j = 0; j < h; j++) {
          for (let i = 0; i < w; i++) {
            let indexInput = 4 * ((y + j) * width + (x + i));
            let indexMosaic = 4 * (j * w + i);
            for (let c = 0; c < 3; c++) {
              // loop over R, G, B channels
              let B = input.pixels[indexInput + c];
              let Mk = mimages[k].pixels[indexMosaic + c];
              sumBMk[c] += B * Mk;
              sumMkSquared[c] += Mk * Mk;
            }
          }
        }
        let d = 0;
        for (let c = 0; c < 3; c++) {
          d += -Math.pow(sumBMk[c], 2) / sumMkSquared[c];
        }
        d *= 1.0 + Math.random(); // Multiply d by a random number between 1.0 and 2.0 third version from lecture
        if (d < bestMatchScore) {
          bestMatchScore = d;
          bestMatchIndex = k;
          for (let c = 0; c < 3; c++) {
            bestAlpha[c] = sumBMk[c] / sumMkSquared[c];
          }
        }
      }

      // Copy the best match to output image block with alpha adjustment
      if (mimages[bestMatchIndex] && mimages[bestMatchIndex].pixels) {
        for (let j = 0; j < h; j++) {
          for (let i = 0; i < w; i++) {
            let index = 4 * ((y + j) * width + (x + i));
            let mosaicIndex = 4 * (j * w + i);
            for (let c = 0; c < 3; c++) {
              // loop over R, G, B channels
              output.pixels[index + c] =
                bestAlpha[c] * mimages[bestMatchIndex].pixels[mosaicIndex + c];
            }
          }
        }
      }
      // ---YOUR CODE ENDS HERE---
    }
    output.updatePixels();
    y += h;
    if (y <= height - h) {
      // y loop in non-blocking version
      setTimeout(chunk, 0);
    } else {
      console.log("Done.");
    }
  })();
}

/* ===================================================
 * ===================================================
 *      The section below are utility functions.
 *      You do NOT need to modify anything below.
 * ===================================================
 * =================================================== */

// Load mosaic datasets from image montages
function loadMosaicImages() {
  console.log("Loading mosaic images with tile size:", params.mosaicSize);

  // Check if Unsplash dataset is available
  if (typeof unsplashFiles !== "undefined" && unsplashFiles.length > 0) {
    loadUnsplashMosaicImages();
  } else {
    loadLocalMosaicImages();
  }
}

function loadUnsplashMosaicImages() {
  console.log("Using Unsplash dataset with", unsplashFiles.length, "images");

  for (let mosaic_id = 0; mosaic_id < mosaic_names.length; mosaic_id++) {
    let mosaic_name = mosaic_names[mosaic_id];
    mosaics[mosaic_name] = [];

    let w = params.mosaicSize;
    let h = params.mosaicSize;

    // Shuffle and distribute images evenly across all datasets
    let shuffled = [...unsplashFiles].sort(() => 0.5 - Math.random());
    let imagesPerDataset = Math.floor(shuffled.length / mosaic_names.length);
    let startIndex = mosaic_id * imagesPerDataset;
    let endIndex =
      mosaic_id === mosaic_names.length - 1
        ? shuffled.length
        : (mosaic_id + 1) * imagesPerDataset;
    let selectedImages = shuffled.slice(startIndex, endIndex);

    console.log(
      `${mosaic_name}: Using ${selectedImages.length} images (${startIndex}-${
        endIndex - 1
      })`
    );

    for (let i = 0; i < selectedImages.length; i++) {
      let imagePath = "unsplash_images/" + selectedImages[i];
      let tileImage = loadImage(imagePath);
      mosaics[mosaic_name].push(tileImage);
    }
  }
}

function loadLocalMosaicImages() {
  console.log("Using local images for mosaic tiles");

  for (let mosaic_id = 0; mosaic_id < mosaic_names.length; mosaic_id++) {
    let mosaic_name = mosaic_names[mosaic_id];
    mosaics[mosaic_name] = [];

    let w = params.mosaicSize;
    let h = params.mosaicSize;
    let nimgs = 100; // Number of tile variations to create

    // Create variations from your local images
    for (let i = 0; i < nimgs; i++) {
      let sourceImageName = input_image_names[i % input_image_names.length]; // Cycle through your images
      let sourceImage = input_images[sourceImageName];

      if (sourceImage) {
        let tileImage = createImage(w, h);

        // Create random crops from the source image for variety
        let cropX = Math.floor(
          Math.random() * Math.max(1, sourceImage.width - w)
        );
        let cropY = Math.floor(
          Math.random() * Math.max(1, sourceImage.height - h)
        );
        let cropW = Math.min(w, sourceImage.width - cropX);
        let cropH = Math.min(h, sourceImage.height - cropY);

        // Copy a random section and scale to fit tile size
        tileImage.copy(sourceImage, cropX, cropY, cropW, cropH, 0, 0, w, h);

        mosaics[mosaic_name].push(tileImage);
      }
    }
  }
}

// Alternative: Load from a downloaded dataset folder
function loadMosaicImagesFromFolder() {
  console.log(
    "Loading mosaic images from dataset folder with tile size:",
    params.mosaicSize
  );

  // List of image files in your mosaic_tiles folder (you would populate this)
  let tileFiles = [
    // Add your downloaded dataset files here, for example:
    // 'mosaic_tiles/img_001.jpg', 'mosaic_tiles/img_002.jpg', etc.
    // You can generate this list automatically or manually
  ];

  for (let mosaic_id = 0; mosaic_id < mosaic_names.length; mosaic_id++) {
    let mosaic_name = mosaic_names[mosaic_id];
    mosaics[mosaic_name] = [];

    let w = params.mosaicSize;
    let h = params.mosaicSize;

    // Load each tile image and resize to current tile size
    for (let i = 0; i < tileFiles.length; i++) {
      let tileImage = loadImage(tileFiles[i]);
      // The loadImage will automatically resize when displayed
      mosaics[mosaic_name].push(tileImage);
    }
  }
}

// Load input images
function loadInputImages() {
  // Load from local Pictures folder
  for (let i = 0; i < input_image_names.length; i++) {
    input_images[input_image_names[i]] = loadImage(
      "Pictures/" + input_image_names[i]
    );
  }
}
// Apply brightness, contrast, saturation adjustments
function applyPixelOperations() {
  brighten(input, output, params.brightness);
  adjustContrast(output, output, params.contrast); // output of the previous operation is fed as input
  adjustSaturation(output, output, params.saturation); // output of the previous operation is fed as input
  output.updatePixels();
}

// Clamp pixel value to be between [0,255]
function pixelClamp(value) {
  return value < 0 ? 0 : value > 255 ? 255 : value >> 0;
}

// Preload all images
function preload() {
  loadInputImages();
}

function loadSelectedInput() {
  let originalImage = input_images[params.Image];

  // Resize image for better performance while maintaining quality
  let maxSize = 800; // Maximum width or height
  let scale = 1;

  if (originalImage.width > maxSize || originalImage.height > maxSize) {
    scale = Math.min(
      maxSize / originalImage.width,
      maxSize / originalImage.height
    );
  }

  let newWidth = Math.floor(originalImage.width * scale);
  let newHeight = Math.floor(originalImage.height * scale);

  // Create resized input image
  input = createImage(newWidth, newHeight);
  input.copy(
    originalImage,
    0,
    0,
    originalImage.width,
    originalImage.height,
    0,
    0,
    newWidth,
    newHeight
  );
  input.loadPixels();

  // Create output image with same dimensions
  output = createImage(input.width, input.height);
  output.copy(
    input,
    0,
    0,
    input.width,
    input.height,
    0,
    0,
    input.width,
    input.height
  );
  output.loadPixels();
  params.Reset(true);
}

let ParameterControl = function () {
  this.Image = "birmingham-museums-trust.jpg";
  this.brightness = 1.0;
  this.contrast = 1.0;
  this.saturation = 1.0;
  this.boxsize = 2;
  this.sigma = 1;
  this.sharpness = 0.3;
  this.mosaicSize = 24; // New parameter for mosaic tile size
  this.Reset = function (partial) {
    this.brightness = 1.0;
    this.contrast = 1.0;
    this.saturation = 1.0;
    if (partial == "undefined" || partial == false) {
      this.boxsize = 2;
      this.sigma = 1;
      this.sharpness = 0.3;
      this.mosaicSize = 24;
    }
    output.copy(
      input,
      0,
      0,
      input.width,
      input.height,
      0,
      0,
      input.width,
      input.height
    );
    output.loadPixels();
  };
  this["Apply Box Blur"] = function () {
    boxBlur(input, output, this.boxsize * 2 + 1);
  };
  this["Apply Gaussian Blur"] = function () {
    gaussianBlur(input, output, this.sigma);
  };
  this["Apply Sharpen"] = function () {
    sharpen(input, output, this.sharpness);
  };
  this["Edge Detect"] = function () {
    edgeDetect(input, output);
    output.updatePixels();
  };
  this.uniform = function () {
    uniformQuantization(input, output);
    output.updatePixels();
  };
  this.random = function () {
    randomDither(input, output);
    output.updatePixels();
  };
  this.ordered = function () {
    orderedDither(input, output);
    output.updatePixels();
  };
  this["Mosaic Dataset"] = "musicBig";
  this["Apply Mosaic"] = function () {
    // Make sure we have loaded mosaic images for current tile size
    if (mosaics[this["Mosaic Dataset"]].length === 0) {
      loadMosaicImages();
    }
    imageMosaic(input, output, this["Mosaic Dataset"]);
  };
  this["Save Image"] = function () {
    output.save("output.png");
  };
};

let params = new ParameterControl();

// Setup function (p5.js callback)
function setup() {
  // Initialize mosaics array
  for (let i = 0; i < mosaic_names.length; i++) {
    mosaics[mosaic_names[i]] = [];
  }

  loadMosaicImages();

  canvas = createCanvas(window.innerWidth, window.innerHeight);

  let gui = new dat.GUI();
  let ctrl = gui.add(params, "Image", input_image_names);
  ctrl.onFinishChange(function (value) {
    loadSelectedInput();
  });

  let panel1 = gui.addFolder("Pixel Operations");
  ctrl = panel1.add(params, "brightness", 0, 4.0).step(0.05).listen();
  ctrl.onFinishChange(function (value) {
    applyPixelOperations();
  });

  ctrl = panel1.add(params, "contrast", 0, 4.0).step(0.05).listen();
  ctrl.onFinishChange(function (value) {
    applyPixelOperations();
  });

  ctrl = panel1.add(params, "saturation", 0, 4.0).step(0.05).listen();
  ctrl.onFinishChange(function (value) {
    applyPixelOperations();
  });

  panel1.add(params, "Reset");
  panel1.open();

  let panel2 = gui.addFolder("Image Convolution");
  panel2.add(params, "boxsize", 1, 7).step(1).listen();
  panel2.add(params, "Apply Box Blur");
  panel2.add(params, "sigma", 0.1, 4.0).step(0.1).listen();
  panel2.add(params, "Apply Gaussian Blur");
  panel2.add(params, "sharpness", 0, 1.0).step(0.05).listen();
  panel2.add(params, "Apply Sharpen");
  panel2.add(params, "Edge Detect");
  panel2.open();

  let panel3 = gui.addFolder("Dither");
  panel3.add(params, "uniform");
  panel3.add(params, "random");
  panel3.add(params, "ordered");
  panel3.open();

  let panel4 = gui.addFolder("Image Mosaic");
  panel4.add(params, "Mosaic Dataset", mosaic_names);
  let mosaicSizeCtrl = panel4
    .add(params, "mosaicSize", 8, 48)
    .step(2)
    .name("Tile Size");
  mosaicSizeCtrl.onFinishChange(function (value) {
    // Clear existing mosaics and reload with new tile size
    for (let i = 0; i < mosaic_names.length; i++) {
      mosaics[mosaic_names[i]] = [];
    }
    loadMosaicImages();
  });
  panel4.add(params, "Apply Mosaic");
  panel4.add(params, "Save Image");
  panel4.open();

  loadSelectedInput();
}

// Rendering loop (p5.js callback)
function draw() {
  clear();

  if (output) {
    // Calculate scale factor to fit image within canvas while maintaining aspect ratio
    let scaleX = width / output.width;
    let scaleY = height / output.height;
    let scale = Math.min(scaleX, scaleY);

    // Calculate new dimensions
    let newWidth = output.width * scale;
    let newHeight = output.height * scale;

    // Center the image on the canvas
    let x = (width - newWidth) / 2;
    let y = (height - newHeight) / 2;

    // Draw the scaled and centered image
    image(output, x, y, newWidth, newHeight);
  }
}

function gaussianKernel(std) {
  // compute Gaussian kernel
  let sigma = std;
  let ksize =
    Math.floor(6.0 * std) % 2
      ? Math.floor(6.0 * std)
      : Math.floor(6.0 * std) + 1;
  if (ksize < 1) ksize = 1;
  let r = 0.0;
  let s = 2.0 * sigma * sigma;
  let sum = 0.0;
  let gkernel = Array(ksize)
    .fill()
    .map(() => Array(ksize)); // create 2D array
  let offset = Math.floor(ksize / 2);

  if (ksize == 1) {
    gkernel[0][0] = 1;
    return gkernel;
  }

  for (let x = -offset; x <= offset; x++) {
    for (let y = -offset; y <= offset; y++) {
      r = Math.sqrt(x * x + y * y);
      gkernel[x + offset][y + offset] = (Math.exp(-(r * r) / s) / Math.PI) * s;
      sum += gkernel[x + offset][y + offset];
    }
  }
  // normalize coefficients
  for (let x = 0; x < ksize; x++) {
    for (let y = 0; y < ksize; y++) {
      gkernel[x][y] /= sum;
    }
  }
  return gkernel;
}

function filterImage(input, output, kernel) {
  console.log("Computing Image Convolution...");
  input.loadPixels();
  output.loadPixels();

  let op = output.pixels;
  let index = 0;
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++, index += 4) {
      op.set(applyKernel(input, x, y, kernel), index);
    }
  }
  output.updatePixels();
  console.log("Done.");
}

function applyKernel(image, x, y, kernel) {
  let ksize = kernel.length;
  let rtotal = 0,
    gtotal = 0,
    btotal = 0;
  let xloc = 0,
    yloc = 0,
    idx = 0,
    coff = 0;
  let offset = (ksize / 2) >> 0;
  let p = image.pixels;

  for (let i = 0; i < ksize; i++) {
    for (let j = 0; j < ksize; j++) {
      xloc = x + i - offset;
      xloc = xloc < 0 ? 0 : xloc > image.width - 1 ? image.width - 1 : xloc; // constant border extension
      yloc = y + j - offset;
      yloc = yloc < 0 ? 0 : yloc > image.height - 1 ? image.height - 1 : yloc;

      idx = (yloc * image.width + xloc) * 4;
      coff = kernel[i][j];
      rtotal += p[idx + 0] * coff;
      gtotal += p[idx + 1] * coff;
      btotal += p[idx + 2] * coff;
    }
  }
  // technically for certain operations like edge detection
  // we should take the absolute value of the result
  // will ignore that for now
  return [pixelClamp(rtotal), pixelClamp(gtotal), pixelClamp(btotal)]; // return resulting color as 3-element array
}
