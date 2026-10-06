/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowLeft, Scale, AlertTriangle, FileText } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'Terms & Conditions | Fix My File',
      description: 'Read the Fix My File Terms & Conditions for information about using our online file preparation tools.',
      path: '/terms',
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono">
            Last updated: October 5, 2026
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Fix My File website (the &quot;Service&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use the website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              2. Use of Fix My File
            </h2>
            <p>
              Fix My File provides free, client-side digital utility tools for compressing images, resizing photos, preparing signatures, and optimizing PDF files. The service is provided &quot;as is&quot; and &quot;as available&quot; for lawful personal, educational, and professional preparation purposes.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              3. Acceptable Use
            </h2>
            <p>
              You agree not to use Fix My File to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
              <li>Process content that violates applicable local, national, or international laws.</li>
              <li>Attempt to reverse-engineer, disrupt, overload, or impair the accessibility or functionality of the website.</li>
              <li>Deploy automated bots, spiders, or scrapers in a manner that degrades service performance for other users.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              4. User Responsibility for Uploaded Files
            </h2>
            <p>
              Because all file conversions and compression algorithms execute entirely within your local browser, you retain complete ownership and responsibility for the photos, signatures, and documents you process. You warrant that you have the right to process any image or file you select, and that your use complies with the requirements of the specific portal, institution, or agency to which you intend to submit your files.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              5. Intellectual Property
            </h2>
            <p>
              All software code, visual styling, logo marks, and explanatory text on Fix My File are protected by copyright and intellectual property laws. You may not copy, reproduce, duplicate, or sell any portion of the Fix My File interface without prior written consent.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              6. Service Availability
            </h2>
            <p>
              While we aim to maintain dependable availability, Fix My File does not guarantee that the website or its tools will be uninterrupted, error-free, or compatible with every browser configuration or operating system. We reserve the right to modify, suspend, or discontinue any feature at any time without notice.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              7. Accuracy Limitations &amp; Official Verification
            </h2>
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Notice regarding exam and portal requirements</span>
              </p>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                File-size and dimension requirements vary widely across thousands of recruitment boards, entrance examinations, government portals, and universities. Fix My File does not guarantee that a processed file will be accepted by any specific third-party portal. Always check the official notification or candidate information brochure for your specific application before uploading.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Fix My File, its developers, and contributors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to use the service, including but not limited to rejected application forms, missed deadlines, or file processing errors.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              9. Changes to the Service &amp; Terms
            </h2>
            <p>
              We reserve the right to amend these Terms &amp; Conditions at our discretion. Any revisions will be reflected on this page with an updated &quot;Last updated&quot; date. Your continued use of the website following such changes constitutes your acceptance of the new terms.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              10. Contact Information
            </h2>
            <p>
              If you have questions regarding these Terms &amp; Conditions, please reach out through our{' '}
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
