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
  AlertCircle,
} from 'lucide-react';
import {
  loadImageFromFile,
  processSignature,
  formatFileSize,
  triggerFileDownload,
  OriginalImageInfo,
  ProcessedImageResult,
} from '../utils/imageProcessors';
import { createSampleSignatureFile } from '../utils/sampleImages';

interface SignatureToolCardProps {
  onNavigateToTool: (tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport') => void;
  initialTargetKB?: number;
}

export const SignatureToolCard: React.FC<SignatureToolCardProps> = ({
  onNavigateToTool,
  initialTargetKB = 20,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [selectedKB, setSelectedKB] = useState<number | 'custom'>(initialTargetKB);
  const [customKB, setCustomKB] = useState<number>(20);

  // Dimensions
  const [width, setWidth] = useState<number>(140);
  const [height, setHeight] = useState<number>(60);

  const [enhanceContrast, setEnhanceContrast] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const effectiveKB = selectedKB === 'custom' ? customKB : selectedKB;

  const handleFilePicked = async (file: File) => {
    try {
      setError(null);
      setResult(null);

      if (!file) {
        setError('No file was selected. Please choose a signature image.');
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
      setError(err instanceof Error ? err.message : 'Processing failed. Could not read signature file. Please check that the file is not corrupted.');
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
      const sample = await createSampleSignatureFile();
      await handleFilePicked(sample);
    } catch (err) {
      setError('Could not load sample signature. Please upload your own file.');
    }
  };

  const handleProcess = async () => {
    if (isProcessing) return;
    if (!imageEl || !originalInfo) {
      setError('No signature selected. Please choose or upload a signature image first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const processed = await processSignature(imageEl, width, height, effectiveKB, {
        enhanceContrast,
      });
      setResult(processed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signature processing failed. Please check your image and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalInfo) return;
    triggerFileDownload(result.blob, `fixmyfile_signature.jpg`);
  };

  const handleReset = () => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    if (originalInfo?.objectUrl) URL.revokeObjectURL(originalInfo.objectUrl);
    setOriginalInfo(null);
    setImageEl(null);
    setResult(null);
    setError(null);
  };

  const signaturePresets = [
    { label: '140 × 60 px', w: 140, h: 60, note: 'UPSC / SSC / IBPS Standard' },
    { label: '200 × 50 px', w: 200, h: 50, note: 'State PSC Standard' },
    { label: '200 × 100 px', w: 200, h: 100, note: 'Passport & NTA Standard' },
  ];

  return (
    <div className="w-full">
      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Preparing your signature...</h3>
          <p className="text-sm text-slate-500">
            Resizing to {width} × {height} px and optimizing under {effectiveKB} KB
          </p>
        </div>
      )}

      {/* RESULT STATE */}
      {!isProcessing && result && originalInfo && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-indigo-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-indigo-700 font-bold text-lg sm:text-xl mb-6">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>Your signature is ready</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
              {/* Preview */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-full max-w-[240px] h-32 rounded-xl bg-white border border-slate-300 overflow-hidden flex items-center justify-center p-3 shadow-inner">
                  <img
                    src={result.blobUrl}
                    alt="Ready signature"
                    style={{ width: `${Math.min(width, 200)}px`, maxHeight: '80px' }}
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2">JPEG on Pure White Background</span>
              </div>

              {/* Data Card */}
              <div className="md:col-span-2 space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Original file size:</span>
                    <span className="font-semibold text-slate-800 line-through text-slate-400">
                      {formatFileSize(originalInfo.sizeBytes)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">New size:</span>
                    <span className="font-bold text-indigo-700 text-base sm:text-lg">
                      {result.sizeKB} KB
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-semibold text-slate-800">
                      {result.width} × {result.height} px
                    </span>
                  </div>
                </div>

                {result.sizeKB <= effectiveKB ? (
                  <div className="flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      ✓ Form Safe: White paper background preserved. Fits {effectiveKB} KB portal requirement.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Target of {effectiveKB} KB could not be reasonably reached (achieved: {result.sizeKB} KB). Consider using standard dimensions like 140 × 60 px to stay under the limit.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Signature ({result.sizeKB} KB)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Resize Another Signature</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTool('photo')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Compress Photo Now</span>
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
                  <p className="text-xs text-slate-500 mt-0.5">20 KB, 50 KB, 100 KB limits</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTool('resize')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-2xl">📐</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Resize Photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Custom pixel width &amp; height</p>
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
                  <p className="text-xs text-slate-500 mt-0.5">Application certificates &amp; KYC</p>
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
              Resize Your Signature
            </h2>
            <p className="text-sm text-slate-600">
              Set pixel dimensions and compress to 20 KB or 50 KB with clean white paper background.
            </p>
          </div>

          {/* Step 1: Upload */}
          <div className="mb-8">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block mb-1">
              Step 1
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Upload your signature image
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
                      ? 'border-indigo-600 bg-indigo-50/60'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">
                    Drop your signature here
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    or{' '}
                    <span className="text-indigo-700 font-bold underline underline-offset-4">
                      Choose Signature Image
                    </span>
                  </p>
                  <span className="text-xs text-slate-400">
                    JPG or PNG photo of signature on white paper
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Try with sample signature</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 p-1">
                  <img
                    src={originalInfo.objectUrl}
                    alt="Signature preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {originalInfo.name}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 mt-1">
                    <span>Size: <strong>{formatFileSize(originalInfo.sizeBytes)}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Dimensions: <strong>{originalInfo.width} × {originalInfo.height} px</strong></span>
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

          {/* Step 2: Size & Dimensions */}
          <div className="mb-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                Step 2
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                What size and dimensions do you need?
              </h3>

              {/* Target KB */}
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Target File Size
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedKB(20)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedKB === 20
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-extrabold">20 KB</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">UPSC / SSC Standard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedKB(50)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedKB === 50
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-extrabold">50 KB</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">NTA / State PSC</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedKB('custom')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedKB === 'custom'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-extrabold">Custom KB</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Enter limit</div>
                </button>
              </div>

              {selectedKB === 'custom' && (
                <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={customKB}
                    onChange={(e) => setCustomKB(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      max="200"
                      value={customKB}
                      onChange={(e) => setCustomKB(Math.max(5, Number(e.target.value)))}
                      className="w-16 px-2 py-1 text-sm font-bold border border-slate-300 rounded bg-white"
                    />
                    <span className="text-xs font-semibold text-slate-500">KB</span>
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Pixel Dimensions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                {signaturePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setWidth(preset.w);
                      setHeight(preset.h);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      width === preset.w && height === preset.h
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-600 font-bold'
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
                    className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg bg-white"
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
                    className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!originalInfo}
              onClick={handleProcess}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-all ${
                originalInfo
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Resize &amp; Compress Signature</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {!originalInfo && (
              <p className="text-xs text-center text-slate-400 mt-2">
                Please upload a signature in Step 1 to continue
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
