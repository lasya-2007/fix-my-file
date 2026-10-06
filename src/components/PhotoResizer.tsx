/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import {
  loadImageFromFile,
  resizeImageToDimensions,
  formatFileSize,
  triggerFileDownload,
  OriginalImageInfo,
  ProcessedImageResult,
} from '../utils/imageProcessors';
import { createSamplePhotoFile } from '../utils/sampleImages';

interface PhotoResizerProps {
  initialWidth?: number;
  initialHeight?: number;
}

export const PhotoResizer: React.FC<PhotoResizerProps> = ({
  initialWidth = 350,
  initialHeight = 450,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'stretch' | 'contain' | 'cover'>('stretch');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    try {
      setError(null);
      setIsProcessing(true);
      const { img, info } = await loadImageFromFile(file);
      setOriginalInfo(info);
      setImageEl(img);
      // Auto-set initial dimensions based on default or image
      if (width === 0 || height === 0) {
        setWidth(info.width);
        setHeight(info.height);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error reading image file');
      setIsProcessing(false);
    }
  };

  const handleUseSample = async () => {
    try {
      const sample = await createSamplePhotoFile();
      await handleFileSelected(sample);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWidthChange = (newW: number) => {
    const validW = Math.max(10, newW);
    setWidth(validW);
    if (lockAspectRatio && originalInfo) {
      const newH = Math.round(validW / originalInfo.aspectRatio);
      setHeight(Math.max(10, newH));
    }
  };

  const handleHeightChange = (newH: number) => {
    const validH = Math.max(10, newH);
    setHeight(validH);
    if (lockAspectRatio && originalInfo) {
      const newW = Math.round(validH * originalInfo.aspectRatio);
      setWidth(Math.max(10, newW));
    }
  };

  // Perform resize
  useEffect(() => {
    if (!imageEl || !originalInfo || width <= 0 || height <= 0) return;

    let isCancelled = false;
    const runResize = async () => {
      setIsProcessing(true);
      setError(null);
      try {
        const resized = await resizeImageToDimensions(imageEl, width, height, {
          fitMode,
          quality: 0.92,
        });
        if (!isCancelled) {
          setResult(resized);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Resize failed');
        }
      } finally {
        if (!isCancelled) {
          setIsProcessing(false);
        }
      }
    };

    const timer = setTimeout(runResize, 60);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [imageEl, width, height, fitMode]);

  const handleReset = () => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    if (originalInfo?.objectUrl) URL.revokeObjectURL(originalInfo.objectUrl);
    setOriginalInfo(null);
    setImageEl(null);
    setResult(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!result || !originalInfo) return;
    const filename = `fixmyfile_photo_${width}x${height}px.jpg`;
    triggerFileDownload(result.blob, filename);
  };

  const dimensionPresets = [
    { label: '350 × 450 px', w: 350, h: 450, note: 'Passport / NEET Standard' },
    { label: '200 × 230 px', w: 200, h: 230, note: 'SSC / IBPS / SBI Standard' },
    { label: '150 × 200 px', w: 150, h: 200, note: 'State PSC Standard' },
    { label: '600 × 600 px', w: 600, h: 600, note: 'Square / Visa / OTR' },
  ];

  return (
    <div className="w-full">
      {!originalInfo ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Resize Photo to Required Pixel Dimensions
            </h2>
            <p className="text-sm text-slate-600">
              Set the exact width and height in pixels as mandated by your exam portal.
              Maintains high clarity and exports directly to JPEG.
            </p>
          </div>

          <FileDropzone
            label="Upload photo to resize"
            helperText="Supports JPG, JPEG, or PNG files"
            onFileSelected={handleFileSelected}
            onUseSample={handleUseSample}
            sampleLabel="Try sample passport photo"
          />

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Standard form dimensions:</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Passport: 350 × 450 px</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">SSC &amp; IBPS: 200 × 230 px</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">State PSC: 150 × 200 px</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Info Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {originalInfo.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Original Dimensions: {originalInfo.width} × {originalInfo.height} px</span>
                <span aria-hidden="true">·</span>
                <span>{formatFileSize(originalInfo.sizeBytes)}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Dimensions Control Area */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-900">
                  Enter Width and Height (Pixels)
                </label>
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    lockAspectRatio
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{lockAspectRatio ? 'Ratio Locked' : 'Free Ratio'}</span>
                </button>
              </div>

              {/* Dimension Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {dimensionPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setLockAspectRatio(false);
                      setWidth(preset.w);
                      setHeight(preset.h);
                    }}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      width === preset.w && height === preset.h
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">{preset.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{preset.note}</div>
                  </button>
                ))}
              </div>

              {/* Exact Inputs */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Width (Pixels)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="4000"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 pr-10"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Height (Pixels)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="4000"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 pr-10"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fit Method
                  </label>
                  <select
                    value={fitMode}
                    onChange={(e) => setFitMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="stretch">Exact Fit (Portal Standard)</option>
                    <option value="contain">Fit with White Margins</option>
                    <option value="cover">Crop to Fill Frame</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Original Preview */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
                  <span>Before Resizing</span>
                  <span className="font-mono text-slate-500">{originalInfo.width} × {originalInfo.height} px</span>
                </div>
                <div className="h-64 sm:h-72 w-full rounded-lg bg-slate-200/60 overflow-hidden flex items-center justify-center border border-slate-200">
                  <img
                    src={originalInfo.objectUrl}
                    alt="Original Uploaded Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-500 flex justify-between">
                  <span>Aspect: {originalInfo.aspectRatio.toFixed(2)}</span>
                  <span>Size: {formatFileSize(originalInfo.sizeBytes)}</span>
                </div>
              </div>

              {/* Resized Output Preview */}
              <div className="rounded-xl border border-emerald-200/90 p-4 bg-emerald-50/20">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resized Preview</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {width} × {height} px
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full rounded-lg bg-white overflow-hidden flex items-center justify-center border border-slate-200 relative">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium">Resizing image...</span>
                    </div>
                  ) : result ? (
                    <img
                      src={result.blobUrl}
                      alt="Resized Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Processing...</span>
                  )}
                </div>

                {result && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Dimensions: <strong>{result.width} × {result.height} px</strong></span>
                      <span>Estimated Size: <strong>{result.sizeKB} KB</strong></span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full mt-3 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resized JPG ({result.width} × {result.height} px)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
