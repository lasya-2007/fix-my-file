/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProcessedImageResult {
  blob: Blob;
  blobUrl: string;
  sizeBytes: number;
  sizeKB: number;
  width: number;
  height: number;
  quality: number;
}

export interface OriginalImageInfo {
  file: File;
  name: string;
  sizeBytes: number;
  sizeKB: number;
  width: number;
  height: number;
  objectUrl: string;
  aspectRatio: number;
}

/**
 * Loads a File into an HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<{ img: HTMLImageElement; info: OriginalImageInfo }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const info: OriginalImageInfo = {
        file,
        name: file.name,
        sizeBytes: file.size,
        sizeKB: Number((file.size / 1024).toFixed(1)),
        width: img.naturalWidth,
        height: img.naturalHeight,
        objectUrl,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      };
      resolve({ img, info });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image. Please ensure it is a valid JPG, JPEG, or PNG file.'));
    };
    img.src = objectUrl;
  });
}

/**
 * Helper to convert canvas to JPEG Blob with given quality
 */
function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export to JPEG failed'));
        }
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Compresses an image to be strictly <= targetKB (and as close to it as possible)
 * Uses white background for any PNG transparency (crucial for government forms).
 */
export async function compressImageToTargetKB(
  img: HTMLImageElement,
  targetKB: number,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    maintainDimensions?: boolean;
  }
): Promise<ProcessedImageResult> {
  const targetBytes = targetKB * 1024;
  let curWidth = img.naturalWidth;
  let curHeight = img.naturalHeight;

  // If initial max constraints provided
  if (options?.maxWidth && curWidth > options.maxWidth) {
    const ratio = options.maxWidth / curWidth;
    curWidth = Math.round(curWidth * ratio);
    curHeight = Math.round(curHeight * ratio);
  }
  if (options?.maxHeight && curHeight > options.maxHeight) {
    const ratio = options.maxHeight / curHeight;
    curWidth = Math.round(curWidth * ratio);
    curHeight = Math.round(curHeight * ratio);
  }

  // Ensure minimum valid dimensions
  curWidth = Math.max(curWidth, 20);
  curHeight = Math.max(curHeight, 20);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not supported');
  }

  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;
  let bestWidth = curWidth;
  let bestHeight = curHeight;

  // We allow up to 4 dimension reduction iterations if high-res image can't fit even at low quality
  for (let dimStep = 0; dimStep < 4; dimStep++) {
    canvas.width = curWidth;
    canvas.height = curHeight;

    // Fill white background to guarantee transparent PNG signatures/photos don't get black background in JPEG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, curWidth, curHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, curWidth, curHeight);

    // Binary search for JPEG quality
    let lowQ = 0.05;
    let highQ = 0.98;
    let localBestBlob: Blob | null = null;
    let localBestQ = lowQ;

    for (let iter = 0; iter < 7; iter++) {
      const testQ = Number(((lowQ + highQ) / 2).toFixed(2));
      const blob = await canvasToJpegBlob(canvas, testQ);

      if (blob.size <= targetBytes) {
        // Fits under target!
        localBestBlob = blob;
        localBestQ = testQ;
        // Try higher quality to get closer to target
        lowQ = testQ;
      } else {
        // Too large, decrease quality
        highQ = testQ;
      }
    }

    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      bestQuality = localBestQ;
      bestWidth = curWidth;
      bestHeight = curHeight;

      // If we are within 25% of target or quality is already good, we are done
      if (localBestBlob.size >= targetBytes * 0.75 || localBestQ >= 0.85 || options?.maintainDimensions) {
        break;
      }
    }

    if (options?.maintainDimensions) {
      // User strictly wants to preserve dimensions, so stop scaling down
      if (!bestBlob) {
        // Take the lowest quality blob
        bestBlob = await canvasToJpegBlob(canvas, 0.05);
        bestQuality = 0.05;
      }
      break;
    }

    // If even lowest quality exceeded targetBytes, downscale dimensions
    const scaleFactor = Math.max(0.7, Math.sqrt(targetBytes / (localBestBlob ? localBestBlob.size : targetBytes * 1.5)));
    curWidth = Math.max(40, Math.round(curWidth * scaleFactor));
    curHeight = Math.max(40, Math.round(curHeight * scaleFactor));
  }

  // Fallback if none under target: take lowest quality
  if (!bestBlob) {
    canvas.width = Math.min(curWidth, 600);
    canvas.height = Math.min(curHeight, 600);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    bestBlob = await canvasToJpegBlob(canvas, 0.1);
    bestQuality = 0.1;
    bestWidth = canvas.width;
    bestHeight = canvas.height;
  }

  const blobUrl = URL.createObjectURL(bestBlob);
  const sizeBytes = bestBlob.size;
  const sizeKB = Number((sizeBytes / 1024).toFixed(1));

  return {
    blob: bestBlob,
    blobUrl,
    sizeBytes,
    sizeKB,
    width: bestWidth,
    height: bestHeight,
    quality: bestQuality,
  };
}

/**
 * Resizes an image to exact target width and height in pixels.
 * Supports aspect ratio fitting with white padding or stretch/fill.
 */
export async function resizeImageToDimensions(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  options?: {
    fitMode?: 'stretch' | 'contain' | 'cover';
    quality?: number;
    targetMaxKB?: number;
  }
): Promise<ProcessedImageResult> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Fill crisp white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const fitMode = options?.fitMode || 'stretch';

  if (fitMode === 'stretch') {
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  } else if (fitMode === 'contain') {
    const scale = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    const drawW = Math.round(img.naturalWidth * scale);
    const drawH = Math.round(img.naturalHeight * scale);
    const offsetX = Math.round((targetWidth - drawW) / 2);
    const offsetY = Math.round((targetHeight - drawH) / 2);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  } else if (fitMode === 'cover') {
    const scale = Math.max(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    const drawW = Math.round(img.naturalWidth * scale);
    const drawH = Math.round(img.naturalHeight * scale);
    const offsetX = Math.round((targetWidth - drawW) / 2);
    const offsetY = Math.round((targetHeight - drawH) / 2);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  // If a target max KB is also required, optimize quality
  if (options?.targetMaxKB && options.targetMaxKB > 0) {
    const targetBytes = options.targetMaxKB * 1024;
    let lowQ = 0.05;
    let highQ = 0.98;
    let bestBlob: Blob | null = null;
    let bestQ = 0.85;

    for (let iter = 0; iter < 7; iter++) {
      const testQ = Number(((lowQ + highQ) / 2).toFixed(2));
      const blob = await canvasToJpegBlob(canvas, testQ);

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        bestQ = testQ;
        lowQ = testQ;
      } else {
        highQ = testQ;
      }
    }

    if (!bestBlob) {
      bestBlob = await canvasToJpegBlob(canvas, 0.05);
      bestQ = 0.05;
    }

    const blobUrl = URL.createObjectURL(bestBlob);
    return {
      blob: bestBlob,
      blobUrl,
      sizeBytes: bestBlob.size,
      sizeKB: Number((bestBlob.size / 1024).toFixed(1)),
      width: targetWidth,
      height: targetHeight,
      quality: bestQ,
    };
  }

  // Otherwise export at specified quality (default 0.92)
  const chosenQuality = options?.quality ?? 0.92;
  const blob = await canvasToJpegBlob(canvas, chosenQuality);
  const blobUrl = URL.createObjectURL(blob);

  return {
    blob,
    blobUrl,
    sizeBytes: blob.size,
    sizeKB: Number((blob.size / 1024).toFixed(1)),
    width: targetWidth,
    height: targetHeight,
    quality: chosenQuality,
  };
}

/**
 * Specialized signature processor:
 * - Resizes to target width & height
 * - Compresses strictly to target KB (20 KB, 50 KB, custom)
 * - Optional background clarification (threshold/contrast enhance to remove camera paper shadow)
 */
export async function processSignature(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  targetKB: number,
  options?: {
    enhanceContrast?: boolean;
  }
): Promise<ProcessedImageResult> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Clean white canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw image scaled to fit dimensions with proper aspect ratio centered
  const scale = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
  const drawW = Math.round(img.naturalWidth * scale);
  const drawH = Math.round(img.naturalHeight * scale);
  const offsetX = Math.round((targetWidth - drawW) / 2);
  const offsetY = Math.round((targetHeight - drawH) / 2);

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

  // Optional subtle contrast clean-up for signatures photographed in poor room lighting
  if (options?.enhanceContrast) {
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imageData.data;
    // Boost contrast: push near-whites to pure white (255) and dark strokes darker
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (lum > 200) {
        // Push light grayish paper to crisp white
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else if (lum < 150) {
        // Deepen signature ink
        const factor = 0.75;
        data[i] = Math.round(r * factor);
        data[i + 1] = Math.round(g * factor);
        data[i + 2] = Math.round(b * factor);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Binary search quality to hit target KB (strictly <= targetBytes)
  const targetBytes = targetKB * 1024;
  let lowQ = 0.05;
  let highQ = 0.98;
  let bestBlob: Blob | null = null;
  let bestQ = 0.85;

  for (let iter = 0; iter < 7; iter++) {
    const testQ = Number(((lowQ + highQ) / 2).toFixed(2));
    const blob = await canvasToJpegBlob(canvas, testQ);

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      bestQ = testQ;
      lowQ = testQ;
    } else {
      highQ = testQ;
    }
  }

  if (!bestBlob) {
    bestBlob = await canvasToJpegBlob(canvas, 0.05);
    bestQ = 0.05;
  }

  const blobUrl = URL.createObjectURL(bestBlob);
  return {
    blob: bestBlob,
    blobUrl,
    sizeBytes: bestBlob.size,
    sizeKB: Number((bestBlob.size / 1024).toFixed(1)),
    width: targetWidth,
    height: targetHeight,
    quality: bestQ,
  };
}

/**
 * Formats bytes to human-readable string (KB or MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Triggers instant browser download of a blob
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
