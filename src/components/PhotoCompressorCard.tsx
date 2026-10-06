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
  FileCheck,
  Maximize2,
  PenTool,
  FileText,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import {
  loadImageFromFile,
  compressImageToTargetKB,
  formatFileSize,
  triggerFileDownload,
  OriginalImageInfo,
  ProcessedImageResult,
} from '../utils/imageProcessors';
import { createSamplePhotoFile } from '../utils/sampleImages';

interface PhotoCompressorCardProps {
  onNavigateToTool: (tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport', initialImage?: File) => void;
  presetTargetKB?: number;
}

export const PhotoCompressorCard: React.FC<PhotoCompressorCardProps> = ({
  onNavigateToTool,
  presetTargetKB = 100,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  // Target size choice: 20, 50, 100, 200, or 'custom'
  const [selectedTarget, setSelectedTarget] = useState<number | 'custom'>(presetTargetKB);
  const [customKB, setCustomKB] = useState<number>(75);

  // Flow states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const effectiveTargetKB = selectedTarget === 'custom' ? customKB : selectedTarget;

  const handleFilePicked = async (file: File) => {
    try {
      setError(null);
      setResult(null);

      if (!file) {
        setError('No file was selected. Please choose a photo.');
        return;
      }

      if (file.size === 0) {
        setError('The selected file is empty (0 bytes). Please choose a valid image.');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(file.type.toLowerCase()) && !['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
        setError('Unsupported file type. Please upload a JPG, JPEG, or PNG image.');
        return;
      }

      // Validate file size limit
      if (file.size > 30 * 1024 * 1024) {
        setError('File is too large (over 30 MB). Please choose an image under 30 MB.');
        return;
      }

      const { img, info } = await loadImageFromFile(file);
      setOriginalInfo(info);
      setImageEl(img);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Processing failed. The image could not be read. Please check that the file is not corrupted.');
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

  // Step 3 trigger: "Compress Photo"
  const handleCompress = async () => {
    if (isProcessing) return;
    if (!imageEl || !originalInfo) {
      setError('No photo selected. Please choose or upload a photo first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const compressed = await compressImageToTargetKB(imageEl, effectiveTargetKB);
      setResult(compressed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Compression failed. Please try again or select a different target size.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalInfo) return;
    triggerFileDownload(result.blob, `fixmyfile_photo_${effectiveTargetKB}kb.jpg`);
  };

  const handleReset = () => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    if (originalInfo?.objectUrl) URL.revokeObjectURL(originalInfo.objectUrl);
    setOriginalInfo(null);
    setImageEl(null);
    setResult(null);
    setError(null);
  };

  const handleSwitchToResize = () => {
    if (originalInfo) {
      onNavigateToTool('resize', originalInfo.file);
    } else {
      onNavigateToTool('resize');
    }
  };

  return (
    <div className="w-full">
      {/* PROCESSING STATE */}
      {isProcessing && (
        <div
          role="status"
          aria-live="polite"
          className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
        >
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Preparing your photo...</h3>
          <p className="text-sm text-slate-500">
            Optimizing quality to stay strictly under {effectiveTargetKB} KB
          </p>
        </div>
      )}

      {/* RESULT STATE: Success Card */}
      {!isProcessing && result && originalInfo && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-emerald-200/90 p-6 sm:p-8 shadow-xs">
            {/* Header: ✓ Your photo is ready */}
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-lg sm:text-xl mb-6">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>Your photo is ready</span>
            </div>

            {/* Metrics & Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
              {/* Image Preview */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-44 h-52 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={result.blobUrl}
                    alt="Ready photo preview"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2">JPEG Output</span>
              </div>

              {/* Data Card */}
              <div className="md:col-span-2 space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Original size:</span>
                    <span className="font-semibold text-slate-800 line-through text-slate-400">
                      {formatFileSize(originalInfo.sizeBytes)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">New size:</span>
                    <span className="font-bold text-emerald-700 text-base sm:text-lg">
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

                {result.sizeKB <= effectiveTargetKB ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Successfully compressed to {result.sizeKB} KB (Target: ≤ {effectiveTargetKB} KB).
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Target of {effectiveTargetKB} KB could not be reasonably reached without severe quality loss. The closest achieved size is {result.sizeKB} KB. You can resize the photo dimensions first.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary button: Download Photo */}
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Photo</span>
              </button>

              {/* Secondary buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Compress Another Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleSwitchToResize}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-slate-500" />
                  <span>Resize Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* BELOW THE RESULT: "Need another file ready?" */}
          <div className="pt-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Need another file ready?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => onNavigateToTool('resize', originalInfo.file)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-2xl">📷</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Resize Photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Change pixel width &amp; height</p>
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
                  <p className="text-xs text-slate-500 mt-0.5">140 × 60 px &amp; 20 KB limit</p>
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
                  <p className="text-xs text-slate-500 mt-0.5">Certificates &amp; documents</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTool('passport', originalInfo.file)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-2xl">🪪</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Passport Photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">350 × 450 px standard</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INPUT / STEP FORM: Clean Card "Compress Your Photo" */}
      {!isProcessing && !result && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
              Compress Your Photo
            </h2>
            <p className="text-sm text-slate-600">
              Prepare your photo for government exams, college admissions, and job forms.
            </p>
          </div>

          {/* STEP 1: Upload your photo */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Step 1
              </span>
              {originalInfo && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
                >
                  Change Photo
                </button>
              )}
            </div>

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

                {/* Large drag-and-drop / upload area */}
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
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7" />
                  </div>

                  <p className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
                    Drop your photo here
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    or{' '}
                    <span className="text-emerald-700 font-bold underline underline-offset-4">
                      Choose Photo
                    </span>
                  </p>

                  <span className="inline-block text-xs text-slate-400">
                    Supports JPG, JPEG and PNG
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Try with sample photo</span>
                  </button>
                </div>
              </div>
            ) : (
              /* After upload: show image preview, original file size, image dimensions */
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-28 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 p-1">
                  <img
                    src={originalInfo.objectUrl}
                    alt="Uploaded photo preview"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {originalInfo.name}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 mt-1">
                    <span>
                      Original size: <strong>{formatFileSize(originalInfo.sizeBytes)}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Dimensions: <strong>{originalInfo.width} × {originalInfo.height} px</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shrink-0"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: What size do you need? */}
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Step 2
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              What size do you need?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the maximum file size allowed by your application form.
            </p>

            {/* Large selectable buttons: 20 KB, 50 KB, 100 KB (prominent), 200 KB, Custom */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* 20 KB */}
              <button
                type="button"
                onClick={() => setSelectedTarget(20)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTarget === 20
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-lg font-extrabold">20 KB</div>
                <div className="text-[11px] text-slate-500 mt-0.5">SSC / IBPS</div>
              </button>

              {/* 50 KB */}
              <button
                type="button"
                onClick={() => setSelectedTarget(50)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTarget === 50
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-lg font-extrabold">50 KB</div>
                <div className="text-[11px] text-slate-500 mt-0.5">UPSC / State PSC</div>
              </button>

              {/* 100 KB: Prominent common use case */}
              <button
                type="button"
                onClick={() => setSelectedTarget(100)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedTarget === 100
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 text-slate-900'
                }`}
              >
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-bold rounded-sm uppercase tracking-wider">
                  Popular
                </span>
                <div className="text-lg font-extrabold text-emerald-950">100 KB</div>
                <div className="text-[11px] text-emerald-800 mt-0.5 font-medium">Most Common</div>
              </button>

              {/* 200 KB */}
              <button
                type="button"
                onClick={() => setSelectedTarget(200)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTarget === 200
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-lg font-extrabold">200 KB</div>
                <div className="text-[11px] text-slate-500 mt-0.5">NTA NEET / JEE</div>
              </button>

              {/* Custom */}
              <button
                type="button"
                onClick={() => setSelectedTarget('custom')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedTarget === 'custom'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-lg font-extrabold">Custom</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Enter limit</div>
              </button>
            </div>

            {/* Custom KB Input */}
            {selectedTarget === 'custom' && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Target Size</span>
                    <strong className="text-slate-900">{customKB} KB</strong>
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
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={customKB}
                    onChange={(e) => setCustomKB(Math.max(5, Number(e.target.value)))}
                    className="w-20 px-2.5 py-1 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="text-xs font-semibold text-slate-500">KB</span>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Primary Button "Compress Photo" */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!originalInfo || isProcessing}
              onClick={handleCompress}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-all ${
                originalInfo && !isProcessing
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{isProcessing ? 'Compressing Photo...' : 'Compress Photo'}</span>
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

          {/* TRUST / PRIVACY NEAR UPLOAD */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>🔒 Your files are processed in your browser and are not uploaded.</span>
            </div>

            <div className="text-[11px] text-slate-400">
              Works offline · No account needed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
