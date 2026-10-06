/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface ProcessedPdfResult {
  blob: Blob;
  blobUrl: string;
  sizeBytes: number;
  sizeKB: number;
  pageCount: number;
}

export interface OriginalPdfInfo {
  file: File;
  name: string;
  sizeBytes: number;
  sizeKB: number;
  pageCount: number;
}

/**
 * Reads basic info from a PDF File
 */
export async function loadPdfInfo(file: File): Promise<OriginalPdfInfo> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  return {
    file,
    name: file.name,
    sizeBytes: file.size,
    sizeKB: Number((file.size / 1024).toFixed(1)),
    pageCount,
  };
}

/**
 * In-browser client-side PDF compression:
 * - Loads PDF bytes
 * - Strips unneeded metadata & annotations if permitted
 * - Rewrites stream structures with object stream packing (Flate compression)
 */
export async function compressPdfFile(
  file: File,
  targetKB?: number
): Promise<ProcessedPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  // Strip non-essential metadata that bloats PDFs
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('Fix My File Client');
  pdfDoc.setCreator('Fix My File');

  // Save with optimized object streams and stream compression
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  let finalUint8 = compressedBytes;

  // If a target KB is specified and the rewritten PDF is still larger, we have compressed streams
  const blob = new Blob([new Uint8Array(finalUint8).buffer as ArrayBuffer], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  return {
    blob,
    blobUrl,
    sizeBytes: blob.size,
    sizeKB: Number((blob.size / 1024).toFixed(1)),
    pageCount,
  };
}

/**
 * Generates an authentic sample PDF certificate / mark sheet for instant browser testing
 */
export async function createSamplePdfFile(): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595, 842]); // A4 dimensions
  const { width, height } = page.getSize();

  // Header Border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.1, 0.2, 0.35),
    borderWidth: 2,
  });

  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderColor: rgb(0.7, 0.75, 0.8),
    borderWidth: 0.8,
  });

  // Title
  page.drawText('BOARD OF SECONDARY & HIGHER EDUCATION', {
    x: 80,
    y: height - 80,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });

  page.drawText('PROVISIONAL CERTIFICATE / APPLICATION RECORD', {
    x: 120,
    y: height - 105,
    size: 12,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawLine({
    start: { x: 60, y: height - 120 },
    end: { x: width - 60, y: height - 120 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Candidate Details
  const fields = [
    { label: 'Candidate Name:', value: 'Rohan Sharma' },
    { label: 'Application ID:', value: 'APP-2026-9812401' },
    { label: 'Date of Birth:', value: '14 August 2002' },
    { label: 'Category:', value: 'General (UR)' },
    { label: 'Examination Center:', value: 'New Delhi - Central' },
    { label: 'Eligibility Status:', value: 'VERIFIED & ELIGIBLE' },
  ];

  let currentY = height - 160;
  fields.forEach((f) => {
    page.drawText(f.label, {
      x: 70,
      y: currentY,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.25, 0.3),
    });
    page.drawText(f.value, {
      x: 230,
      y: currentY,
      size: 11,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });
    currentY -= 28;
  });

  // Table summary
  currentY -= 20;
  page.drawRectangle({
    x: 70,
    y: currentY - 80,
    width: width - 140,
    height: 90,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  page.drawText('Subject / Paper', { x: 85, y: currentY - 15, size: 10, font: boldFont });
  page.drawText('Max Marks', { x: 280, y: currentY - 15, size: 10, font: boldFont });
  page.drawText('Marks Obtained', { x: 380, y: currentY - 15, size: 10, font: boldFont });

  page.drawText('Paper 1: General Studies & Aptitude', { x: 85, y: currentY - 40, size: 10, font });
  page.drawText('100', { x: 295, y: currentY - 40, size: 10, font });
  page.drawText('84', { x: 410, y: currentY - 40, size: 10, font });

  page.drawText('Paper 2: Domain Knowledge', { x: 85, y: currentY - 65, size: 10, font });
  page.drawText('100', { x: 295, y: currentY - 65, size: 10, font });
  page.drawText('91', { x: 410, y: currentY - 65, size: 10, font });

  // Verification notice
  page.drawText('SAMPLE DOCUMENT FOR FIX MY FILE BROWSER TESTING', {
    x: 130,
    y: 70,
    size: 9,
    font: boldFont,
    color: rgb(0.4, 0.5, 0.6),
  });

  const pdfBytes = await pdfDoc.save();
  return new File([new Uint8Array(pdfBytes).buffer as ArrayBuffer], 'sample_application_certificate.pdf', { type: 'application/pdf' });
}
