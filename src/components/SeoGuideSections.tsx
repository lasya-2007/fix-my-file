/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SeoGuideSectionsProps {
  onSelectGuidePreset: (
    tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport',
    targetKB?: number,
    width?: number,
    height?: number
  ) => void;
  onNavigate?: (path: string) => void;
}

export const SeoGuideSections: React.FC<SeoGuideSectionsProps> = ({
  onSelectGuidePreset,
  onNavigate,
}) => {
  const guides = [
    {
      title: 'Compress Image to 20KB',
      path: '/compress-image-to-20kb',
      badge: '20 KB Limit',
      examExamples: 'SSC (CGL/CHSL), IBPS PO & Clerk, State Police Bharti',
      desc: 'Many banking and staff selection portals mandate photos between 10 KB and 20 KB. Fix My File reduces file size while preserving facial features and contrast.',
      actionLabel: 'Use 20 KB Preset',
      tool: 'photo' as const,
      kb: 20,
    },
    {
      title: 'Compress Image to 50KB',
      path: '/compress-image-to-50kb',
      badge: '50 KB Limit',
      examExamples: 'UPSC Civil Services, NDA, CDS, OTR, State PSCs (UPPSC, BPSC)',
      desc: 'The most frequent upper ceiling across Central and State Public Service Commissions. Compresses multi-megabyte camera photos into crisp, accepted JPG files.',
      actionLabel: 'Use 50 KB Preset',
      tool: 'photo' as const,
      kb: 50,
    },
    {
      title: 'Compress Image to 100KB',
      path: '/compress-image-to-100kb',
      badge: '100 KB Limit',
      examExamples: 'NTA (NEET, JEE Main, CUET), Gate, University Admissions',
      desc: 'Required for national entrance examinations and degree admissions. Balances sharp visual resolution with fast portal upload speeds.',
      actionLabel: 'Use 100 KB Preset',
      tool: 'photo' as const,
      kb: 100,
    },
    {
      title: 'Compress Image to 200KB',
      path: '/compress-image-to-200kb',
      badge: '200 KB Limit',
      examExamples: 'Scholarship Portals, State Recruitment, Passport Seva',
      desc: 'Suitable for high-resolution document scans, identity proofs, and portal uploads that allow up to 200 KB file sizes.',
      actionLabel: 'Use 200 KB Preset',
      tool: 'photo' as const,
      kb: 200,
    },
    {
      title: 'Resize Signature',
      path: '/resize-signature',
      badge: '140 × 60 px',
      examExamples: 'All Indian Exams (UPSC, SSC, IBPS, Railways RRB)',
      desc: 'Online forms reject signatures that lack exact dimensions or have transparent backgrounds. Fix My File crops, resizes to 140 × 60 px, and ensures a clean white paper base.',
      actionLabel: 'Use Signature Tool',
      tool: 'signature' as const,
      kb: 20,
    },
    {
      title: 'Resize Photo',
      path: '/resize-photo',
      badge: '350 × 450 px',
      examExamples: 'Passport Seva, Driving License (Sarathi), Visa Applications',
      desc: 'Formats photos to standard 3.5 cm × 4.5 cm (350 × 450 px) or 2 × 2 inch square (600 × 600 px) with clean lighting compliance.',
      actionLabel: 'Use Photo Resizer',
      tool: 'resize' as const,
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-slate-200/80 bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Popular Application Requirements
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Quick guides and one-click presets for specific exam limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {guides.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  {onNavigate ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(item.path)}
                      className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors text-left cursor-pointer"
                    >
                      {item.title}
                    </button>
                  ) : (
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  )}

                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.desc}
                </p>

                <div className="text-[11px] text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-slate-700">Common for:</strong> {item.examExamples}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectGuidePreset(item.tool, item.kb)}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-800 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="w-full text-center text-[11px] font-medium text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    View dedicated page →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
