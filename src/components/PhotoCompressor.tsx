/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Maximize2,
  Sliders,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import {
  loadImageFromFile,
  compressImageToTargetKB,
  formatFileSize,
  triggerFileDownload,
  OriginalImageInfo,
  ProcessedImageResult,
} from '../utils/imageProcessors';
import { createSamplePhotoFile } from '../utils/sampleImages';

interface PhotoCompressorProps {
  initialTargetKB?: number;
}

export const PhotoCompressor: React.FC<PhotoCompressorProps> = ({ initialTargetKB = 50 }) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | 'custom'>(initialTargetKB);
  const [customKB, setCustomKB] = useState<number>(45);
  const [maintainDimensions, setMaintainDimensions] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effectiveTargetKB = selectedTarget === 'custom' ? customKB : selectedTarget;

  // Load and process when file is chosen
  const handleFileSelected = async (file: File) => {
    try {
      setError(null);
      setIsProcessing(true);
      const { img, info } = await loadImageFromFile(file);
      setOriginalInfo(info);
      setImageEl(img);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error reading image file');
      setIsProcessing(false);
    }
  };

  const handleUseSample = async () => {
    try {
      setError(null);
      const sampleFile = await createSamplePhotoFile();
      await handleFileSelected(sampleFile);
    } catch (err) {
      console.error(err);
    }
  };

  // Run compression when image or target changes
  useEffect(() => {
    if (!imageEl || !originalInfo) return;

    let isCancelled = false;
    const runCompression = async () => {
      setIsProcessing(true);
      setError(null);
      try {
        const compressed = await compressImageToTargetKB(imageEl, effectiveTargetKB, {
          maintainDimensions,
        });
        if (!isCancelled) {
          setResult(compressed);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Compression failed');
        }
      } finally {
        if (!isCancelled) {
          setIsProcessing(false);
        }
      }
    };

    const timer = setTimeout(runCompression, 50);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [imageEl, effectiveTargetKB, maintainDimensions]);

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
    const filename = `fixmyfile_photo_${effectiveTargetKB}kb.jpg`;
    triggerFileDownload(result.blob, filename);
  };

  const presetOptions = [
    { kb: 20, note: 'SSC / IBPS standard' },
    { kb: 50, note: 'UPSC / State PSC' },
    { kb: 100, note: 'NEET / Passport' },
    { kb: 200, note: 'NTA JEE / University' },
  ];

  return (
    <div className="w-full">
      {!originalInfo ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Compress Photo to Exact KB Limit
            </h2>
            <p className="text-sm text-slate-600">
              Upload your photo and select your target file size (20 KB, 50 KB, 100 KB, 200 KB, or custom).
              Compressed strictly to meet official application guidelines.
            </p>
          </div>

          <FileDropzone
            label="Upload photo to compress"
            helperText="Supports JPG, JPEG, or PNG from camera or computer"
            onFileSelected={handleFileSelected}
            onUseSample={handleUseSample}
            sampleLabel="Try sample passport photo"
          />

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Common portal requirements:</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">SSC &amp; IBPS: ≤ 50 KB</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">UPSC: 20 KB – 50 KB</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">NEET/JEE: 10 KB – 200 KB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top action bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {originalInfo.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Original: {formatFileSize(originalInfo.sizeBytes)}</span>
                <span aria-hidden="true">·</span>
                <span>{originalInfo.width} × {originalInfo.height} px</span>
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
            {/* Target KB Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Choose Target File Size
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Select your required maximum size. The output will be compressed to remain strictly under or equal to this limit.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {presetOptions.map((opt) => (
                  <button
                    key={opt.kb}
                    type="button"
                    onClick={() => setSelectedTarget(opt.kb)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      selectedTarget === opt.kb
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-base font-bold">{opt.kb} KB</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{opt.note}</div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedTarget('custom')}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    selectedTarget === 'custom'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-bold">Custom KB</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">Enter exact KB</div>
                </button>
              </div>

              {/* Custom KB Input */}
              {selectedTarget === 'custom' && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Target File Size</span>
                      <span className="font-bold text-slate-900">{customKB} KB</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={customKB}
                      onChange={(e) => setCustomKB(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={customKB}
                      onChange={(e) => setCustomKB(Math.max(5, Number(e.target.value)))}
                      className="w-24 px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-semibold text-slate-600">KB</span>
                  </div>
                </div>
              )}

              {/* Maintain dimensions checkbox */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="maintain-dims"
                  type="checkbox"
                  checked={maintainDimensions}
                  onChange={(e) => setMaintainDimensions(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="maintain-dims" className="text-xs text-slate-600 cursor-pointer">
                  Strictly preserve original pixel dimensions ({originalInfo.width} × {originalInfo.height} px)
                </label>
              </div>
            </div>

            {/* Comparison / Result View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Original Preview */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
                  <span>Original Photo</span>
                  <span className="font-mono text-slate-500">{formatFileSize(originalInfo.sizeBytes)}</span>
                </div>
                <div className="h-64 sm:h-72 w-full rounded-lg bg-slate-200/60 overflow-hidden flex items-center justify-center border border-slate-200">
                  <img
                    src={originalInfo.objectUrl}
                    alt="Original Uploaded Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-500 flex justify-between">
                  <span>Dimensions: {originalInfo.width} × {originalInfo.height} px</span>
                  <span>Type: {originalInfo.file.type.replace('image/', '').toUpperCase()}</span>
                </div>
              </div>

              {/* Compressed Output Preview */}
              <div className="rounded-xl border border-emerald-200/90 p-4 bg-emerald-50/20">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ready for Application</span>
                  </span>
                  {result && (
                    <span className="font-mono font-bold text-emerald-800 text-sm">
                      {result.sizeKB} KB
                    </span>
                  )}
                </div>

                <div className="h-64 sm:h-72 w-full rounded-lg bg-white overflow-hidden flex items-center justify-center border border-slate-200 relative">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium">Optimizing image...</span>
                    </div>
                  ) : result ? (
                    <img
                      src={result.blobUrl}
                      alt="Compressed Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Processing...</span>
                  )}
                </div>

                {result && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Dimensions: {result.width} × {result.height} px</span>
                      <span>Format: JPEG / JPG</span>
                    </div>

                    {/* Final size indicator */}
                    <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-bold">Final Size: {result.sizeKB} KB</span>
                        <span className="text-emerald-800 ml-1">
                          ({result.sizeKB <= effectiveTargetKB ? '✓ Within target' : 'Near target'})
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-800">
                        -{Math.max(0, Math.round((1 - result.sizeBytes / originalInfo.sizeBytes) * 100))}% reduction
                      </div>
                    </div>

                    {/* Download CTA */}
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full mt-3 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Compressed JPG ({result.sizeKB} KB)</span>
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
