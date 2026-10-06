/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, HardDrive, EyeOff, WifiOff } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="py-14 sm:py-20 border-t border-slate-200/80 bg-slate-50/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-6 sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-md mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Privacy First</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Your images are processed in your browser and are not uploaded.
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
              When applying for competitive examinations, admissions, or government jobs, photos and signatures are sensitive identity documents. Unlike other websites that transfer your photos to remote web servers, Fix My File uses modern HTML5 Web Canvas technology inside your browser memory.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-emerald-200/70">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-1">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>No Server Storage</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Your files never leave your device. There is no remote database or cloud storage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200/70">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-1">
                  <EyeOff className="w-4 h-4 text-emerald-600" />
                  <span>No Tracking or Account</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  No login required, no email collected, no registration. Completely anonymous.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200/70">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-1">
                  <WifiOff className="w-4 h-4 text-emerald-600" />
                  <span>Works In Your Browser</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Compression calculations happen locally using your computer or phone CPU.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
