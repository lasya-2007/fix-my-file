/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How do I reduce a photo to 100KB?',
      answer:
        'Upload your image in the Photo Compressor tool above, select the "100 KB" button in Step 2, and click "Compress Photo". Fix My File automatically performs an in-browser binary search quality optimization to bring your image file size under 100 KB while preserving sharpness and clarity.',
    },
    {
      question: 'Can I compress a photo without losing too much quality?',
      answer:
        'Yes. Fix My File applies high-quality bicubic downsampling and precise JPEG compression mathematics. Rather than crudely degrading image quality, it fine-tunes compression levels specifically to maintain crisp facial features and clear facial contours required by portal automated image checkers.',
    },
    {
      question: 'Is my photo uploaded to a server?',
      answer:
        'No. Never. Fix My File executes 100% inside your device\'s local web browser using the HTML5 Canvas API. Your photos, signatures, and PDFs are never transferred across the network to any server, cloud storage, or database. Your private identity documents remain completely private on your device.',
    },
    {
      question: 'What photo size should I use for an application?',
      answer:
        'Requirements vary by portal: SSC and IBPS typically require 20 KB – 50 KB; UPSC requires 20 KB – 50 KB (or under 300 KB in OTR); NTA NEET and JEE Main permit 10 KB – 200 KB; and State PSCs usually mandate 20 KB – 50 KB. When in doubt, check your official recruitment notification PDF before submitting.',
    },
    {
      question: 'Can I compress a signature?',
      answer:
        'Yes. Click on the "Signature" card above. You can upload a photo of your pen-and-paper signature. Fix My File will resize it to official dimensions (such as 140 × 60 pixels) and compress it strictly under 20 KB or 50 KB, while ensuring the background is pure white so it doesn\'t turn black upon upload.',
    },
    {
      question: 'Can I use this on my phone?',
      answer:
        'Yes. Fix My File is fully responsive and optimized for mobile touchscreens. You can take a photo with your phone camera, upload it directly from your gallery, compress or resize it, and download the finished JPG directly to your device storage.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 border-t border-slate-200/80 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Clear answers to help you prepare your application files smoothly.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 bg-slate-50/40 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
