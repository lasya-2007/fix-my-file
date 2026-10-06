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
  CreditCard,
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

interface PassportPhotoCardProps {
  onNavigateToTool: (tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport') => void;
  initialFile?: File;
}

export const PassportPhotoCard: React.FC<PassportPhotoCardProps> = ({
  onNavigateToTool,
  initialFile,
}) => {
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  // Passport presets
  const [formatType, setFormatType] = useState<'indian' | 'visa' | 'custom'>('indian');
  const [width, setWidth] = useState<number>(350);
  const [height, setHeight] = useState<number>(450);
  const [targetMaxKB, setTargetMaxKB] = useState<number>(100);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
        setError('No file was selected. Please choose a photo.');
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
      setError(err instanceof Error ? err.message : 'Processing failed. Could not read image file. Please check that the file is not corrupted.');
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

  const selectFormat = (type: 'indian' | 'visa' | 'custom') => {
    setFormatType(type);
    if (type === 'indian') {
      setWidth(350);
      setHeight(450);
      setTargetMaxKB(100);
    } else if (type === 'visa') {
      setWidth(600);
      setHeight(600);
      setTargetMaxKB(200);
    }
  };

  const handleProcess = async () => {
    if (isProcessing) return;
    if (!imageEl || !originalInfo) {
      setError('No photo selected. Please choose or upload a photo first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const processed = await resizeImageToDimensions(imageEl, width, height, {
        fitMode: 'stretch',
        targetMaxKB,
      });
      setResult(processed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Passport formatting failed. Please check your image and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalInfo) return;
    triggerFileDownload(result.blob, `fixmyfile_passport_photo_${width}x${height}px.jpg`);
  };

  const handleReset = () => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    if (originalInfo?.objectUrl) URL.revokeObjectURL(originalInfo.objectUrl);
    setOriginalInfo(null);
    setImageEl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Creating passport photo...</h3>
          <p className="text-sm text-slate-500">
            Applying {width} × {height} px format and optimizing under {targetMaxKB} KB
          </p>
        </div>
      )}

      {/* RESULT STATE */}
      {!isProcessing && result && originalInfo && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-emerald-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-lg sm:text-xl mb-6">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>Your passport photo is ready</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-40 h-50 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={result.blobUrl}
                    alt="Passport photo ready"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2">Official Ratio {result.width} × {result.height} px</span>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">Standard:</span>
                    <span className="font-semibold text-slate-800">
                      {formatType === 'indian' ? 'Indian Passport (3.5 × 4.5 cm)' : 'Visa / 2×2 Inch Square'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">New dimensions:</span>
                    <span className="font-bold text-emerald-700 text-base">
                      {result.width} × {result.height} px
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">File size:</span>
                    <span className="font-semibold text-slate-800">
                      {result.sizeKB} KB (Target: ≤ {targetMaxKB} KB)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    ✓ Converted to JPG with standard passport dimensions and clean file size.
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Passport Photo ({result.sizeKB} KB)</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Format Another Photo</span>
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
              Passport Photo Resizer
            </h2>
            <p className="text-sm text-slate-600">
              Format your photo to standard 350 × 450 px or 600 × 600 px passport requirements.
            </p>
          </div>

          {/* Step 1 */}
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
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
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">
                    Drop your photo here
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    or{' '}
                    <span className="text-emerald-700 font-bold underline underline-offset-4">
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Try with sample photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={originalInfo.objectUrl}
                    alt="Photo preview"
                    className="w-16 h-20 object-contain rounded border border-slate-200 bg-white"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {originalInfo.name}
                    </p>
                    <span className="text-xs text-slate-500">
                      {originalInfo.width} × {originalInfo.height} px · {formatFileSize(originalInfo.sizeBytes)}
                    </span>
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

          {/* Step 2 */}
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Step 2
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Choose passport standard
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => selectFormat('indian')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formatType === 'indian'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-base font-bold">Indian Passport (350 × 450 px)</div>
                <div className="text-xs text-slate-500 mt-1">
                  Standard 3.5 cm × 4.5 cm portrait, max 100 KB
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectFormat('visa')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formatType === 'visa'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-base font-bold">Square 2 × 2 Inch (600 × 600 px)</div>
                <div className="text-xs text-slate-500 mt-1">
                  US / Visa / Passport Seva OTR format, max 200 KB
                </div>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!originalInfo}
              onClick={handleProcess}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-all ${
                originalInfo
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Make Passport Photo Ready</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

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
