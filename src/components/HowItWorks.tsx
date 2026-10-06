/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UploadCloud, Sliders, Cpu, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Choose your file',
      desc: 'Upload your photo, signature image, or PDF document from your phone or computer.',
      icon: UploadCloud,
    },
    {
      num: '2',
      title: 'Select the required size',
      desc: 'Pick your target file size (e.g. 20 KB, 50 KB, 100 KB) or pixel dimensions.',
      icon: Sliders,
    },
    {
      num: '3',
      title: 'We prepare it',
      desc: 'Fast client-side algorithms optimize quality and dimensions right inside your browser.',
      icon: Cpu,
    },
    {
      num: '4',
      title: 'Download your ready-to-use file',
      desc: 'Save the optimized file instantly and upload it directly to your application portal.',
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 border-t border-slate-200/80 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Get your files compliant with online application rules in 4 quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      STEP {item.num}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                    {item.num}. {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
