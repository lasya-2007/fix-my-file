/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] tracking-tight">
                FMF
              </span>
              <span className="font-bold text-base text-slate-900 tracking-tight">Fix My File</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Make Your Files Ready for Online Applications
            </p>
            <p className="text-xs text-slate-500 max-w-md">
              Fix, compress and resize photos, signatures and PDFs for online applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-medium text-slate-600">
            <a
              href="/#tools"
              onClick={(e) => handleLinkClick(e, '/#tools')}
              className="hover:text-slate-900 transition-colors"
            >
              Tools
            </a>
            <a
              href="/#how-it-works"
              onClick={(e) => handleLinkClick(e, '/#how-it-works')}
              className="hover:text-slate-900 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/about"
              onClick={(e) => handleLinkClick(e, '/about')}
              className="hover:text-slate-900 transition-colors"
            >
              About
            </a>
            <a
              href="/faq"
              onClick={(e) => handleLinkClick(e, '/faq')}
              className="hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => handleLinkClick(e, '/privacy-policy')}
              className="hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, '/terms')}
              className="hover:text-slate-900 transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, '/contact')}
              className="hover:text-slate-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Disclaimer & Privacy Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-slate-700">Disclaimer:</strong> File-size and dimension requirements vary by application. Always check the latest official notification before uploading.
          </p>
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>🔒 Your files are processed in your browser and are not uploaded.</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Fix My File. Built for Indian students and applicants.</span>
          <span>100% In-Browser · Private &amp; Secure</span>
        </div>
      </div>
    </footer>
  );
};
