/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import {
  loadImageFromFile,
  processSignature,
  formatFileSize,
  triggerFileDownload,
  OriginalImageInfo,
  ProcessedImageResult,
} from '../utils/imageProcessors';
import { createSampleSignatureFile } from '../utils/sampleImages';

interface SignatureResizerProps {
  initialWidth?: number;
  initialHeight?: number;
  initialTargetKB?: number;
}

export const SignatureResizer: React.FC<SignatureResizerProps> = ({
  initialWidth = 140,
  initialHeight = 60,
  initialTargetKB = 20,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  // Target KB: 20 KB, 50 KB, Custom KB
  const [selectedTargetKB, setSelectedTargetKB] = useState<number | 'custom'>(initialTargetKB);
  const [customKB, setCustomKB] = useState<number>(20);

  // Width and height in pixels
  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);

  // Ink contrast enhancement
  const [enhanceContrast, setEnhanceContrast] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effectiveTargetKB = selectedTargetKB === 'custom' ? customKB : selectedTargetKB;

  const handleFileSelected = async (file: File) => {
    try {
      setError(null);
      setIsProcessing(true);
      const { img, info } = await loadImageFromFile(file);
      setOriginalInfo(info);
      setImageEl(img);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error reading signature file');
      setIsProcessing(false);
    }
  };

  const handleUseSample = async () => {
    try {
      const sample = await createSampleSignatureFile();
      await handleFileSelected(sample);
    } catch (err) {
      console.error(err);
    }
  };

  // Run signature processing whenever dimensions, target KB, or enhancement changes
  useEffect(() => {
    if (!imageEl || !originalInfo || width <= 0 || height <= 0) return;

    let isCancelled = false;
    const runProcessing = async () => {
      setIsProcessing(true);
      setError(null);
      try {
        const processed = await processSignature(
          imageEl,
          width,
          height,
          effectiveTargetKB,
          { enhanceContrast }
        );
        if (!isCancelled) {
          setResult(processed);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Signature processing failed');
        }
      } finally {
        if (!isCancelled) {
          setIsProcessing(false);
        }
      }
    };

    const timer = setTimeout(runProcessing, 60);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [imageEl, width, height, effectiveTargetKB, enhanceContrast]);

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
    const filename = `fixmyfile_signature.jpg`;
    triggerFileDownload(result.blob, filename);
  };

  const signatureDimensionPresets = [
    { label: '140 × 60 px', w: 140, h: 60, note: 'UPSC, SSC, IBPS (Most Popular)' },
    { label: '200 × 50 px', w: 200, h: 50, note: 'State PSC Standard' },
    { label: '200 × 100 px', w: 200, h: 100, note: 'Passport & NTA Standard' },
    { label: '256 × 64 px', w: 256, h: 64, note: '4:1 Aspect Ratio Standard' },
  ];

  return (
    <div className="w-full">
      {!originalInfo ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Signature Resizer &amp; Compressor
            </h2>
            <p className="text-sm text-slate-600">
              Resize your signature to official pixel dimensions (e.g. 140 × 60 px) and compress to 20 KB or 50 KB.
              Automatically removes transparent backgrounds so your signature never turns into a black box.
            </p>
          </div>

          <FileDropzone
            label="Upload signature image"
            helperText="JPG, JPEG, or PNG (photo of your signature on white paper)"
            onFileSelected={handleFileSelected}
            onUseSample={handleUseSample}
            sampleLabel="Try sample cursive signature"
          />

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Most exam guidelines require:</span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Size: 10 KB to 20 KB</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Dimensions: 140 × 60 px</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Black or blue ink on white paper</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Bar */}
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
              <span>Change Signature</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls Column */}
              <div className="space-y-6">
                {/* 1. Target Size (KB) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    1. Select Target File Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTargetKB(20)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        selectedTargetKB === 20
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold">20 KB</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">UPSC / SSC / IBPS</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTargetKB(50)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        selectedTargetKB === 50
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold">50 KB</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">NEET / State PSC</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTargetKB('custom')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        selectedTargetKB === 'custom'
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold">Custom KB</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Enter limit</div>
                    </button>
                  </div>

                  {selectedTargetKB === 'custom' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="5"
                          value={customKB}
                          onChange={(e) => setCustomKB(Number(e.target.value))}
                          className="w-full accent-emerald-600"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="5"
                          max="200"
                          value={customKB}
                          onChange={(e) => setCustomKB(Math.max(5, Number(e.target.value)))}
                          className="w-20 px-2.5 py-1 text-sm font-semibold border border-slate-300 rounded-md bg-white"
                        />
                        <span className="text-xs font-semibold text-slate-500">KB</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Width & Height (Pixels) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    2. Select Width &amp; Height (Pixels)
                  </label>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {signatureDimensionPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
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
                        <div className="text-[10px] text-slate-500 mt-0.5">{preset.note}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="2000"
                        value={width}
                        onChange={(e) => setWidth(Math.max(20, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="2000"
                        value={height}
                        onChange={(e) => setHeight(Math.max(20, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Paper enhancement */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Clear Phone Shadows &amp; Paper Grey</p>
                    <p className="text-[11px] text-slate-500">Brightens background paper to clean white</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enhanceContrast}
                    onChange={(e) => setEnhanceContrast(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview & Download Column */}
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-200/90 p-4 bg-emerald-50/20">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready Signature Output</span>
                    </span>
                    {result && (
                      <span className="font-mono font-bold text-emerald-800 text-sm">
                        {result.sizeKB} KB
                      </span>
                    )}
                  </div>

                  {/* Clean signature paper presentation frame */}
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                    <p className="text-[11px] font-medium text-slate-500 text-center mb-2">
                      Exact scale preview ({width} × {height} px):
                    </p>
                    <div className="min-h-[160px] w-full rounded-lg bg-white border border-slate-300 shadow-inner flex items-center justify-center p-3 relative overflow-hidden">
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-medium">Processing signature...</span>
                        </div>
                      ) : result ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={result.blobUrl}
                            alt="Resized Signature Preview"
                            style={{
                              width: `${Math.min(width, 320)}px`,
                              height: 'auto',
                              maxHeight: '120px',
                            }}
                            className="border border-dashed border-slate-300 shadow-xs object-contain bg-white"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Loading...</span>
                      )}
                    </div>
                  </div>

                  {result && (
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">Dimensions</span>
                          <span className="font-semibold text-slate-800">{result.width} × {result.height} px</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">File Size</span>
                          <span className="font-semibold text-emerald-700">
                            {result.sizeKB} KB (≤ {effectiveTargetKB} KB)
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-emerald-950 text-xs">
                        <span className="font-bold">✓ Form Safe:</span> Formatted as JPG with white background. Meets the {effectiveTargetKB} KB size restriction.
                      </div>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Signature JPG ({result.sizeKB} KB)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Original Thumbnail Info */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                  <span>Original: {originalInfo.width} × {originalInfo.height} px</span>
                  <span>{formatFileSize(originalInfo.sizeBytes)}</span>
                </div>
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
