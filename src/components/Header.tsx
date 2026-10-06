/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onStartClick: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({ onStartClick, onNavigate, currentPath = '/' }) => {
  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/');
    }
  };

  const handleNavLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <a
          href="/"
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 text-slate-900 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs tracking-tight">
            FMF
          </span>
          <span>Fix My File</span>
        </a>

        {/* Simple Navigation: Tools, How It Works, FAQ */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="/#tools"
            onClick={(e) => handleNavLink(e, '/#tools')}
            className={`transition-colors hover:text-slate-900 ${
              currentPath === '/' ? 'text-slate-900' : ''
            }`}
          >
            Tools
          </a>
          <a
            href="/#how-it-works"
            onClick={(e) => handleNavLink(e, '/#how-it-works')}
            className="hover:text-slate-900 transition-colors"
          >
            How It Works
          </a>
          <a
            href="/faq"
            onClick={(e) => handleNavLink(e, '/faq')}
            className={`transition-colors hover:text-slate-900 ${
              currentPath === '/faq' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            FAQ
          </a>
        </nav>

        {/* One Clear CTA: Start Now */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% In-Browser</span>
          </div>

          <button
            type="button"
            onClick={onStartClick}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            Start Now
          </button>
        </div>
      </div>
    </header>
  );
};
