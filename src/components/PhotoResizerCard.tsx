/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';
import {
  loadImageFromFile,
  resizeImageToDimensions,
  formatFileSize,
  triggerFileDownload,
  OriginalImageInfo,
  ProcessedImageResult,
} from '../utils/imageProcessors';
import { createSamplePhotoFile } from '../utils/sampleImages';

interface PhotoResizerCardProps {
  onNavigateToTool: (tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport') => void;
  initialFile?: File;
  initialWidth?: number;
  initialHeight?: number;
}

export const PhotoResizerCard: React.FC<PhotoResizerCardProps> = ({
  onNavigateToTool,
  initialFile,
  initialWidth = 350,
  initialHeight = 450,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);
  const [lockRatio, setLockRatio] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Initialize with passed file if any
  React.useEffect(() => {
    if (initialFile && !originalInfo) {
      handleFilePicked(initialFile);
    }
  }, [initialFile]);

  const handleFilePicked = async (file: File) => {
    try {
      setError(null);
      setResult(null);

      if (!file) {
        setError('No file was selected. Please choose an image.');
        return;
      }

      if (file.size === 0) {
        setError('The selected file is empty (0 bytes). Please choose a valid image.');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(file.type.toLowerCase()) && !['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
        setError('Unsupported file type. Please upload a JPG, JPEG, or PNG image.');
        return;
      }

      if (file.size > 30 * 1024 * 1024) {
        setError('File is too large (over 30 MB). Please choose an image under 30 MB.');
        return;
      }

      const { img, info } = await loadImageFromFile(file);
      setOriginalInfo(info);
      setImageEl(img);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Processing failed. Could not read image file. Please ensure it is not corrupted.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilePicked(e.dataTransfer.files[0]);
    } else {
      setError('No file was dropped. Please select an image file.');
    }
  };

  const handleUseSample = async () => {
    if (isProcessing) return;
    try {
      setError(null);
      const sample = await createSamplePhotoFile();
      await handleFilePicked(sample);
    } catch (err) {
      setError('Could not load sample image. Please upload your own photo.');
    }
  };

  const handleWidthChange = (val: number) => {
    const validVal = Math.max(10, Math.min(val, 6000));
    setWidth(validVal);
    if (lockRatio && originalInfo) {
      setHeight(Math.max(10, Math.round(validVal / originalInfo.aspectRatio)));
    }
  };

  const handleHeightChange = (val: number) => {
    const validVal = Math.max(10, Math.min(val, 6000));
    setHeight(validVal);
    if (lockRatio && originalInfo) {
      setWidth(Math.max(10, Math.round(validVal * originalInfo.aspectRatio)));
    }
  };

  const handleResize = async () => {
    if (isProcessing) return;
    if (!imageEl || !originalInfo) {
      setError('No photo selected. Please choose or upload a photo first.');
      return;
    }

    if (width < 20 || height < 20) {
      setError('Dimensions are too small. Width and height must be at least 20 pixels.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const resized = await resizeImageToDimensions(imageEl, width, height, {
        fitMode: 'stretch',
        quality: 0.92,
      });
      setResult(resized);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Photo resize failed. Please check your image and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalInfo) return;
    triggerFileDownload(result.blob, `fixmyfile_photo_${width}x${height}px.jpg`);
  };

  const handleReset = () => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    if (originalInfo?.objectUrl) URL.revokeObjectURL(originalInfo.objectUrl);
    setOriginalInfo(null);
    setImageEl(null);
    setResult(null);
    setError(null);
  };

  const presets = [
    { label: '350 × 450 px', w: 350, h: 450, note: 'Passport Standard' },
    { label: '200 × 230 px', w: 200, h: 230, note: 'SSC & IBPS' },
    { label: '150 × 200 px', w: 150, h: 200, note: 'State PSC' },
    { label: '600 × 600 px', w: 600, h: 600, note: 'Square / Visa / OTR' },
  ];

  return (
    <div className="w-full">
      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Resizing your photo...</h3>
          <p className="text-sm text-slate-500">
            Rendering to {width} × {height} pixels
          </p>
        </div>
      )}

      {/* RESULT STATE */}
      {!isProcessing && result && originalInfo && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-blue-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-blue-700 font-bold text-lg sm:text-xl mb-6">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>Your photo is ready</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
              {/* Preview */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-44 h-52 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={result.blobUrl}
                    alt="Resized photo preview"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2">Exact {result.width} × {result.height} px</span>
              </div>

              {/* Data Card */}
              <div className="md:col-span-2 space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Original dimensions:</span>
                    <span className="font-semibold text-slate-800 line-through text-slate-400">
                      {originalInfo.width} × {originalInfo.height} px
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">New dimensions:</span>
                    <span className="font-bold text-blue-700 text-base sm:text-lg">
                      {result.width} × {result.height} px
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">File size:</span>
                    <span className="font-semibold text-slate-800">
                      {result.sizeKB} KB
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-900 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    ✓ Scaled cleanly to {result.width} × {result.height} px. Ready for upload.
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Resized Photo ({result.width} × {result.height} px)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Resize Another Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTool('photo')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Compress Photo Size (KB)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Next Tool Discovery */}
          <div className="pt-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Need another file ready?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onNavigateToTool('photo')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-2xl">📷</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Compress Photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Reduce to 20 KB or 50 KB</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTool('signature')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-2xl">✍️</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Resize Signature
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">140 × 60 px official format</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTool('pdf')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-2xl">📄</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Compress PDF
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Online document uploads</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INPUT FORM */}
      {!isProcessing && !result && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
              Resize Photo Dimensions
            </h2>
            <p className="text-sm text-slate-600">
              Change width and height in pixels to match your application requirements.
            </p>
          </div>

          {/* Step 1: Upload */}
          <div className="mb-8">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-1">
              Step 1
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Upload your photo
            </h3>

            {!originalInfo ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilePicked(e.target.files[0]);
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">
                    Drop your photo here
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    or{' '}
                    <span className="text-blue-700 font-bold underline underline-offset-4">
                      Choose Photo
                    </span>
                  </p>
                  <span className="text-xs text-slate-400">
                    JPG, JPEG or PNG
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Try with sample photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-24 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 p-1">
                  <img
                    src={originalInfo.objectUrl}
                    alt="Photo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {originalInfo.name}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 mt-1">
                    <span>Current: <strong>{originalInfo.width} × {originalInfo.height} px</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Size: <strong>{formatFileSize(originalInfo.sizeBytes)}</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Dimensions */}
          <div className="mb-8">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-1">
              Step 2
            </span>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                What pixel dimensions do you need?
              </h3>
              <button
                type="button"
                onClick={() => setLockRatio(!lockRatio)}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  lockRatio
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lockRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{lockRatio ? 'Ratio Locked' : 'Free Ratio'}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setLockRatio(false);
                    setWidth(p.w);
                    setHeight(p.h);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    width === p.w && height === p.h
                      ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold">{p.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{p.note}</div>
                </button>
              ))}
            </div>

            {/* Exact Inputs */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Width (Pixels)
                </label>
                <input
                  type="number"
                  min="20"
                  max="4000"
                  value={width}
                  onChange={(e) => handleWidthChange(Math.max(20, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Height (Pixels)
                </label>
                <input
                  type="number"
                  min="20"
                  max="4000"
                  value={height}
                  onChange={(e) => handleHeightChange(Math.max(20, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!originalInfo}
              onClick={handleResize}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-all ${
                originalInfo
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Resize Photo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {!originalInfo && (
              <p className="text-xs text-center text-slate-400 mt-2">
                Please upload a photo in Step 1 to continue
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>🔒 Your files are processed in your browser and are not uploaded.</span>
          </div>
        </div>
      )}
    </div>
  );
};
