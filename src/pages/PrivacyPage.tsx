/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, HardDrive } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'Privacy Policy | Fix My File',
      description: 'Read the Fix My File Privacy Policy to understand how information and uploaded files are handled.',
      path: '/privacy-policy',
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono">
            Last updated: October 5, 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              1. What Fix My File Does
            </h2>
            <p>
              Fix My File provides free browser-based tools designed to help individuals prepare photos, signatures, and PDF documents to meet size, format, and dimension requirements for online applications, examinations, admissions, and government forms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              2. What Information Is Collected
            </h2>
            <p>
              Fix My File does not require you to register, sign up, or create an account. You can use all file preparation tools completely anonymously without providing your name, email address, phone number, or any other personally identifiable information.
            </p>
            <p>
              Fix My File does not maintain a user database or store user profiles.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              3. How Uploaded Files Are Handled
            </h2>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <p className="font-semibold text-emerald-950 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Local Browser Processing</span>
              </p>
              <p className="text-xs sm:text-sm text-emerald-900">
                When you select a photo, signature, or PDF file, it is loaded directly into your device&apos;s local web browser memory (RAM) via standard Web APIs (such as HTML5 Canvas and FileReader).
              </p>
            </div>
            <p>
              <strong>Your files are NOT transmitted to or stored on any external server.</strong> Image resizing, JPEG compression, and PDF optimization algorithms run entirely client-side on your computer or mobile phone. Once you close or refresh the browser tab, the files are immediately purged from your browser&apos;s temporary memory.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              4. Cookies and Analytics
            </h2>
            <p>
              Fix My File does not use tracking cookies, tracking pixels, or persistent profiling mechanisms. Basic session state may be temporarily held in your local browser memory solely to maintain your current tool selection during your visit, but this is never transmitted externally.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              5. Third-Party Services
            </h2>
            <p>
              Fix My File does not transmit user files to third-party cloud processing services or commercial image storage APIs. Standard web font resources (such as Google Fonts) may be retrieved by your browser upon page load to display typography correctly.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              6. Advertising and Google AdSense
            </h2>
            <p>
              Fix My File does not currently run Google AdSense or third-party advertising networks. If advertising is introduced in the future to help fund free hosting and infrastructure costs, this Privacy Policy will be transparently updated to disclose any ad-serving practices and cookie usage in accordance with applicable advertising policies.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              7. User Rights and Privacy Choices
            </h2>
            <p>
              Because Fix My File does not collect, record, or retain your personal data or uploaded documents on any server or database, there is no remote data for us to access, rectify, delete, or export on your behalf. You retain complete control over your files at all times on your local device.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              8. Contact Information
            </h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or how Fix My File operates, you can reach out via our{' '}
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-900 cursor-pointer"
              >
                Contact Us
              </button>{' '}
              page.
            </p>
          </section>

          {/* Back link */}
          <div className="pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Fix My File homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
