/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

interface FAQItem {
  q: string;
  a: string;
  toolLink?: {
    name: string;
    action: string;
  };
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const faqList: FAQItem[] = [
    {
      q: 'What is Fix My File?',
      a: 'Fix My File is a free, web-based utility designed to help applicants, students, and professionals prepare photos, signatures, and PDF documents for online application forms. It provides dedicated tools for compressing photos to target KB limits, adjusting pixel dimensions, formatting signatures with white backgrounds, and compressing PDF files directly inside your browser.',
    },
    {
      q: 'Is Fix My File free to use?',
      a: 'Yes. Fix My File is completely free. There are no fees, subscriptions, premium tiers, or hidden paywalls. You do not need to register, create an account, or provide personal information to use any of the tools.',
    },
    {
      q: 'How do I compress a photo?',
      a: 'On the Fix My File homepage, select the Photo tool. Drop or choose your JPG, JPEG, or PNG image in Step 1. In Step 2, click your desired target file size (such as 20 KB, 50 KB, 100 KB, 200 KB, or enter a Custom KB value). Then click "Compress Photo" in Step 3. The optimized photo will be ready for immediate download.',
      toolLink: {
        name: 'Open Photo Compressor',
        action: 'photo',
      },
    },
    {
      q: 'Can I compress an image to 20 KB, 50 KB, 100 KB or 200 KB?',
      a: 'Yes. Fix My File has built-in one-tap presets for 20 KB, 50 KB, 100 KB, and 200 KB, as well as a custom size slider and numeric input. The in-browser compression engine runs iterative binary-search quality optimization to bring your image strictly under or as close as possible to the chosen limit.',
      toolLink: {
        name: 'Try Photo Compressor Presets',
        action: 'photo',
      },
    },
    {
      q: 'Can I resize a photo?',
      a: 'Yes. You can use the Photo Resizer tool to set exact width and height values in pixels (e.g. 350 × 450 px for passport standards or 200 × 230 px for SSC/IBPS). You can also toggle aspect ratio locking or choose from popular form presets.',
      toolLink: {
        name: 'Open Photo Resizer',
        action: 'resize',
      },
    },
    {
      q: 'Can I resize a signature?',
      a: 'Yes. The Signature Resizer allows you to set official dimensions (such as 140 × 60 px) and compress file sizes under 20 KB or 50 KB. It also automatically cleans transparent backgrounds by converting them onto pure white canvas paper so the signature does not turn into a black box when uploaded as a JPG.',
      toolLink: {
        name: 'Open Signature Resizer',
        action: 'signature',
      },
    },
    {
      q: 'Can I compress a PDF?',
      a: 'Yes. Fix My File includes an in-browser PDF compressor that strips unneeded document metadata and reorganizes internal stream structures to help your PDF certificates and mark sheets fit under upload limits.',
      toolLink: {
        name: 'Open PDF Compressor',
        action: 'pdf',
      },
    },
    {
      q: 'Are my files uploaded to a server?',
      a: 'No. Fix My File processes your files 100% locally in your web browser memory using HTML5 Canvas and client-side JavaScript. No images, signatures, or PDF documents are ever transmitted over the network to external servers or stored in any database.',
    },
    {
      q: 'What file formats are supported?',
      a: 'For photos and signatures, Fix My File accepts JPG, JPEG, and PNG files, and exports universally accepted JPG / JPEG output. For documents, standard PDF files are supported.',
    },
    {
      q: 'Why is my output file slightly different from the target size?',
      a: 'Standard JPEG compression operates in discrete 8×8 pixel blocks and mathematical quantization steps rather than continuous single-byte increments. Fix My File prioritizes safety: it optimizes quality so that your output remains strictly under or very close to your chosen limit (for instance, 48 KB or 49 KB for a 50 KB target), ensuring government portal automated filters do not reject your upload.',
    },
    {
      q: 'Can I use Fix My File for exam and job applications?',
      a: 'Yes. Fix My File was built specifically around the common requirements of competitive examinations (such as UPSC, SSC, Banking, NEET, JEE, State PSCs), recruitment portals, driving license applications, and university admissions.',
    },
    {
      q: 'Does Fix My File guarantee that a file will be accepted by a particular application?',
      a: 'No. File-size and dimension guidelines vary widely across thousands of recruitment boards, entrance examinations, government portals, and universities. Furthermore, requirements are subject to periodic changes in official notification brochures. Fix My File provides tools to help you meet specified criteria, but it cannot guarantee acceptance by any specific third-party portal. Always review your official notification before uploading.',
    },
  ];

  useEffect(() => {
    // Generate Schema.org FAQPage structured data
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    updatePageSeo({
      title: 'Fix My File FAQ | Photo, Signature & PDF Tools',
      description: 'Find answers about Fix My File photo compression, resizing, signature resizing and PDF compression tools.',
      path: '/faq',
      structuredData: faqSchema,
    });
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

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
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Find answers about Fix My File photo compression, resizing, signature resizing, and PDF compression tools.
          </p>
        </div>

        {/* Quick Internal Jump Links to Main Tools */}
        <div className="mb-8 p-4 rounded-xl bg-slate-100/70 border border-slate-200">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Quick Jump to Tools:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('/#tools')}
              className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Photo Compressor</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/#tools')}
              className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Photo Resizer</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/#tools')}
              className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:border-indigo-500 hover:text-indigo-700 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Signature Resizer</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/#tools')}
              className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:border-amber-500 hover:text-amber-700 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>PDF Compressor</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {faqList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors bg-white shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 bg-slate-50/40 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{item.a}</p>
                    {item.toolLink && (
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={() => onNavigate('/#tools')}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                        >
                          <span>{item.toolLink.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-12 p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Ready to prepare your files?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              No software to install. Start compressing and resizing in seconds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/#tools')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer shrink-0"
          >
            Open File Tools
          </button>
        </div>
      </div>
    </div>
  );
};
