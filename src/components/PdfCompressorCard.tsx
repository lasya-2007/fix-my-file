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
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  loadPdfInfo,
  compressPdfFile,
  createSamplePdfFile,
  OriginalPdfInfo,
  ProcessedPdfResult,
} from '../utils/pdfCompressor';
import { formatFileSize, triggerFileDownload } from '../utils/imageProcessors';

interface PdfCompressorCardProps {
  onNavigateToTool: (tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport') => void;
  initialTargetKB?: number;
}

export const PdfCompressorCard: React.FC<PdfCompressorCardProps> = ({
  onNavigateToTool,
  initialTargetKB = 200,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalPdfInfo | null>(null);
  const [selectedKB, setSelectedKB] = useState<number | 'custom'>(initialTargetKB);
  const [customKB, setCustomKB] = useState<number>(300);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedPdfResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const effectiveKB = selectedKB === 'custom' ? customKB : selectedKB;

  const handleFilePicked = async (file: File) => {
    try {
      setError(null);
      setResult(null);

      if (!file) {
        setError('No file was selected. Please choose a PDF file.');
        return;
      }

      if (file.size === 0) {
        setError('The selected file is empty (0 bytes). Please choose a valid PDF document.');
        return;
      }

      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setError('Unsupported file type. Please upload a valid PDF document (.pdf).');
        return;
      }

      if (file.size > 35 * 1024 * 1024) {
        setError('File is too large (over 35 MB). Please choose a PDF document under 35 MB.');
        return;
      }

      const info = await loadPdfInfo(file);
      setOriginalInfo(info);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Processing failed. Could not read PDF. Please check if the document is password-protected or corrupted.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilePicked(e.dataTransfer.files[0]);
    } else {
      setError('No file was dropped. Please select a PDF file.');
    }
  };

  const handleUseSample = async () => {
    if (isProcessing) return;
    try {
      setError(null);
      const sample = await createSamplePdfFile();
      await handleFilePicked(sample);
    } catch (err) {
      setError('Could not load sample PDF. Please upload your own document.');
    }
  };

  const handleCompress = async () => {
    if (isProcessing) return;
    if (!originalInfo) {
      setError('No PDF selected. Please choose or upload a PDF document first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const compressed = await compressPdfFile(originalInfo.file, effectiveKB);
      setResult(compressed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'PDF compression failed. The document could not be processed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalInfo) return;
    triggerFileDownload(result.blob, `fixmyfile_document.pdf`);
  };

  const handleReset = () => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    setOriginalInfo(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Compressing your PDF...</h3>
          <p className="text-sm text-slate-500">
            Stream-optimizing objects &amp; removing unneeded document overhead
          </p>
        </div>
      )}

      {/* RESULT STATE */}
      {!isProcessing && result && originalInfo && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-amber-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-lg sm:text-xl mb-6">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>Your PDF is ready</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-36 h-48 rounded-xl bg-slate-50 border border-slate-300 flex flex-col items-center justify-center p-4 text-center shadow-inner">
                  <FileText className="w-12 h-12 text-amber-600 mb-2" />
                  <span className="text-xs font-bold text-slate-800 line-clamp-2">
                    {originalInfo.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {result.pageCount} {result.pageCount === 1 ? 'Page' : 'Pages'}
                  </span>
                </div>
              </div>

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
                    <span className="font-bold text-amber-700 text-base sm:text-lg">
                      {result.sizeKB} KB
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Pages:</span>
                    <span className="font-semibold text-slate-800">{result.pageCount}</span>
                  </div>
                </div>

                {result.sizeKB <= effectiveKB ? (
                  <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      ✓ Document optimized in browser memory. Fits ≤ {effectiveKB} KB portal requirement.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Note: This PDF was compressed to {result.sizeKB} KB. Embedded objects and vector elements are already optimized.
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
                className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Compressed PDF ({result.sizeKB} KB)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Compress Another PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTool('photo')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Compress Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Discovery */}
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
                  <p className="text-xs text-slate-500 mt-0.5">20 KB, 50 KB, 100 KB</p>
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
                onClick={() => onNavigateToTool('passport')}
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

      {/* INPUT FORM */}
      {!isProcessing && !result && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
              Compress Your PDF
            </h2>
            <p className="text-sm text-slate-600">
              Reduce PDF file size for online exams, certificate verification, and KYC uploads.
            </p>
          </div>

          {/* Step 1: Upload */}
          <div className="mb-8">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Step 1
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Upload your PDF document
            </h3>

            {!originalInfo ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
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
                      ? 'border-amber-600 bg-amber-50/60'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">
                    Drop your PDF here
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    or{' '}
                    <span className="text-amber-700 font-bold underline underline-offset-4">
                      Choose PDF File
                    </span>
                  </p>
                  <span className="text-xs text-slate-400">
                    Supports certificates, marksheets &amp; forms up to 25 MB
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Try with sample certificate PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {originalInfo.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Size: <strong>{formatFileSize(originalInfo.sizeBytes)}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{originalInfo.pageCount} {originalInfo.pageCount === 1 ? 'Page' : 'Pages'}</span>
                    </div>
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

          {/* Step 2: Target Size */}
          <div className="mb-8">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Step 2
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Select target PDF size
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {[100, 200, 500, 1000].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => setSelectedKB(kb)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedKB === kb
                      ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-bold">{kb >= 1000 ? '1 MB' : `${kb} KB`}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {kb === 100 ? 'Strict Form Limit' : kb === 200 ? 'Common Exam Limit' : 'Standard Upload'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!originalInfo}
              onClick={handleCompress}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-all ${
                originalInfo
                  ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Compress PDF</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {!originalInfo && (
              <p className="text-xs text-center text-slate-400 mt-2">
                Please upload a PDF in Step 1 to continue
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
