/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Laptop, FileCheck, ArrowRight } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'About Fix My File | File Preparation Tools',
      description: 'Learn about Fix My File and its free tools for preparing photos, signatures and PDFs for online applications.',
      path: '/about',
    });
  }, []);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fix My File</span>
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            About Fix My File
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Fix My File is a free online utility website designed to help people prepare photos, signatures, and PDF files for online applications.
          </p>
        </div>

        {/* Main Content Body */}
        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
              Our Purpose
            </h2>
            <p>
              When applying for competitive examinations, college admissions, recruitment drives, and government services, applicants are frequently required to meet strict file-size limits (such as 20 KB, 50 KB, or 100 KB) and precise pixel dimensions. Most mobile phone cameras produce photos and document scans that are several megabytes in size, resulting in repeated upload rejections.
            </p>
            <p>
              Fix My File was built to solve this problem simply, cleanly, and without forcing users to register or install complex photo editing software.
            </p>
          </section>

          {/* Tools Provided with Internal Links */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              What Tools Fix My File Provides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-base">
                    <span className="text-xl">📷</span>
                    <span>Compressing Photos</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Reduce photo file sizes to exact target limits such as 20 KB, 50 KB, 100 KB, or 200 KB while keeping facial details clear.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/#tools')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span>Open Photo Compressor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-base">
                    <span className="text-xl">📐</span>
                    <span>Resizing Photos</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Adjust image width and height to exact pixel specifications (e.g. 350 × 450 px passport or 200 × 230 px exam standard).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/#tools')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <span>Open Photo Resizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-base">
                    <span className="text-xl">✍️</span>
                    <span>Resizing Signatures</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Resize and compress signatures to standard 140 × 60 px and under 20 KB with crisp white paper backgrounds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/#tools')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <span>Open Signature Resizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-base">
                    <span className="text-xl">📄</span>
                    <span>Compressing PDFs</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Streamline and compress PDF certificates, mark sheets, and documents to fit under strict online portal upload limits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/#tools')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  <span>Open PDF Compressor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* Who It Is Designed For */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
              Designed for Common Application Requirements
            </h2>
            <p>
              The website is designed to make file preparation easier for students, job applicants, exam applicants, admissions, government forms, and other online applications. Whether you are applying for UPSC, SSC, Banking (IBPS/SBI), NTA (NEET/JEE), State PSCs, driving licenses, or college admissions, Fix My File helps you format your documents quickly.
            </p>
          </section>

          {/* Section: Why Fix My File? */}
          <section className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Why Fix My File?
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">Simple and easy to use:</strong> No technical jargon, no unnecessary configuration. Complete your task in 3 quick steps.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">No complicated software required:</strong> Everything runs directly inside your web browser on mobile phones, tablets, or desktop computers.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">Designed for common application-file requirements:</strong> Includes exact presets for 20 KB, 50 KB, 100 KB, 200 KB, and official pixel dimensions.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">Fast browser-based tools:</strong> Images and documents are processed locally inside your browser memory using HTML5 Canvas and Web APIs. Your files are not uploaded to an external server.
                </div>
              </li>
            </ul>
          </section>

          {/* Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Free to use · No account or login required
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Start Preparing Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
