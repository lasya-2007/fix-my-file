/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  label: string;
  helperText?: string;
  onFileSelected: (file: File) => void;
  accept?: string;
  onUseSample?: () => void;
  sampleLabel?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  helperText = 'Supports JPG, JPEG, and PNG files up to 25 MB',
  onFileSelected,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  onUseSample,
  sampleLabel = 'Try with sample',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndPassFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (JPG, JPEG, or PNG).');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('File size is very large (> 30 MB). Please choose an image under 30 MB.');
      return;
    }
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60 scale-[1.005]'
            : 'border-slate-300 hover:border-slate-400 bg-white/70 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 text-slate-700" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
            {label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
            Drag and drop your file here, or{' '}
            <span className="text-emerald-700 font-semibold underline underline-offset-2">
              browse from your device
            </span>
          </p>

          <p className="text-xs text-slate-400">{helperText}</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {onUseSample && (
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            onClick={onUseSample}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{sampleLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
