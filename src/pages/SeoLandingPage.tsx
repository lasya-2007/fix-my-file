/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';
import { SeoLandingPageData } from '../data/seoLandingPages';
import { updatePageSeo } from '../utils/seo';

// Import existing FormReady tool components
import { PhotoCompressorCard } from '../components/PhotoCompressorCard';
import { PhotoResizerCard } from '../components/PhotoResizerCard';
import { SignatureToolCard } from '../components/SignatureToolCard';
import { PdfCompressorCard } from '../components/PdfCompressorCard';

interface SeoLandingPageProps {
  pageData: SeoLandingPageData;
  onNavigate: (path: string) => void;
  onNavigateToTool: (tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport', initialImage?: File) => void;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  pageData,
  onNavigate,
  onNavigateToTool,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Set SEO metadata and FAQPage structured data on mount/update
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pageData.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    };

    updatePageSeo({
      title: pageData.title,
      description: pageData.description,
      path: pageData.path,
      structuredData: faqSchema,
    });
  }, [pageData]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Render the existing FormReady tool prominently
  const renderTool = () => {
    switch (pageData.toolType) {
      case 'compressor-20':
        return <PhotoCompressorCard presetTargetKB={20} onNavigateToTool={onNavigateToTool} />;
      case 'compressor-50':
        return <PhotoCompressorCard presetTargetKB={50} onNavigateToTool={onNavigateToTool} />;
      case 'compressor-100':
        return <PhotoCompressorCard presetTargetKB={100} onNavigateToTool={onNavigateToTool} />;
      case 'compressor-200':
        return <PhotoCompressorCard presetTargetKB={200} onNavigateToTool={onNavigateToTool} />;
      case 'resize-photo':
        return <PhotoResizerCard onNavigateToTool={onNavigateToTool} />;
      case 'resize-signature':
        return <SignatureToolCard initialTargetKB={20} onNavigateToTool={onNavigateToTool} />;
      case 'compress-pdf':
        return <PdfCompressorCard onNavigateToTool={onNavigateToTool} />;
      case 'compress-pdf-200':
        return <PdfCompressorCard initialTargetKB={200} onNavigateToTool={onNavigateToTool} />;
      default:
        return <PhotoCompressorCard onNavigateToTool={onNavigateToTool} />;
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fix My File</span>
          </button>
        </div>

        {/* Hero Area */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% In-Browser · No Upload to Server</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3 text-balance">
            {pageData.h1}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pageData.lead}
          </p>
        </div>

        {/* PROMINENT EMBEDDED TOOL */}
        <div id="tool-embed" className="mb-14">
          {renderTool()}
        </div>

        {/* HOW TO USE SECTION */}
        <section className="mb-14 pt-8 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              How to Use This Tool
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Prepare your file in four simple steps without installing any software.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pageData.howToUseSteps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mb-3">
                    STEP {step.num}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY USE FORMREADY SECTION */}
        <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-slate-100/70 border border-slate-200">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Why Use Fix My File?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">Simple and intuitive:</strong>
                No complex image editing knowledge required. Select your file, click compress or resize, and download.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">100% Browser-based processing:</strong>
                All compression and resizing algorithms execute strictly in your local device RAM. Your files are never uploaded to a server.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">No complicated software:</strong>
                Works straight from your phone or computer browser without downloading heavy software or creating an account.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">Designed for online applications:</strong>
                Built specifically around common Indian examination, job portal, and admission guidelines (SSC, UPSC, NEET, IBPS, PSCs).
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="mb-14 pt-8 border-t border-slate-200">
          <div className="max-w-2xl mx-auto mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding file size limits, quality, and portal guidelines.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {pageData.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors bg-white shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-semibold text-sm text-slate-900 flex items-center justify-between gap-4 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 bg-slate-50/40 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      <p className="pt-2">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RELATED FIX MY FILE TOOLS / INTERNAL LINKS */}
        <section className="pt-8 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
              Explore Related Fix My File Tools
            </h2>
            <p className="text-xs text-slate-500">
              Prepare other required files for your application form.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pageData.relatedLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => onNavigate(link.path)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {link.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Disclaimer Notice */}
        <div className="mt-12 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center max-w-2xl mx-auto">
          <strong className="text-slate-700">Disclaimer:</strong> File-size and dimension requirements vary by application. Always check the latest official notification before uploading.
        </div>
      </div>
    </div>
  );
};
