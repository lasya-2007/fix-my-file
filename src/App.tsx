/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Camera,
  PenTool,
  FileText,
  CreditCard,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { Header } from './components/Header';
import { PhotoCompressorCard } from './components/PhotoCompressorCard';
import { PhotoResizerCard } from './components/PhotoResizerCard';
import { SignatureToolCard } from './components/SignatureToolCard';
import { PdfCompressorCard } from './components/PdfCompressorCard';
import { PassportPhotoCard } from './components/PassportPhotoCard';
import { HowItWorks } from './components/HowItWorks';
import { SeoGuideSections } from './components/SeoGuideSections';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

import { SEO_LANDING_PAGES } from './data/seoLandingPages';
import { SeoLandingPage } from './pages/SeoLandingPage';

// Informational pages
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { updatePageSeo } from './utils/seo';

function getNormalizedPath(): string {
  const p = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (p === '/' && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1).toLowerCase().replace(/\/$/, '') || '/';
  }
  return p;
}

export default function App() {
  // Client-side router path: '/' | '/about' | '/privacy-policy' | '/terms' | '/contact' | '/faq'
  const [currentPath, setCurrentPath] = useState<string>(() => getNormalizedPath());

  // Current active tool on homepage: 'photo' (primary default), 'signature', 'pdf', 'resize', or 'passport'
  const [activeTool, setActiveTool] = useState<'photo' | 'signature' | 'pdf' | 'resize' | 'passport'>('photo');
  const [transferredFile, setTransferredFile] = useState<File | undefined>(undefined);
  const [presetTargetKB, setPresetTargetKB] = useState<number>(100);

  const toolsSectionRef = useRef<HTMLDivElement>(null);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getNormalizedPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // SEO update when path changes to homepage
  useEffect(() => {
    if (currentPath === '/' || currentPath === '') {
      updatePageSeo({
        title: 'Fix My File | Compress & Resize Photos, Signatures & PDFs',
        description:
          'Fix, compress and resize photos, signatures and PDFs for online applications.',
        path: '/',
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              url: typeof window !== 'undefined' ? window.location.origin + '/' : '/',
              name: 'Fix My File',
              description:
                'Fix, compress and resize photos, signatures and PDFs for online applications.',
            },
            {
              '@type': 'WebApplication',
              url: typeof window !== 'undefined' ? window.location.origin + '/' : '/',
              name: 'Fix My File',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'All',
              browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas support.',
              description:
                'Fix, compress and resize photos, signatures and PDFs for online applications.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
            },
          ],
        },
      });
    }
  }, [currentPath]);

  // Navigate helper
  const navigate = (path: string) => {
    // Handle anchor links like /#tools or /#how-it-works
    if (path.includes('#')) {
      const [targetRoute, hash] = path.split('#');
      const normalizedRoute = targetRoute.replace(/\/$/, '') || '/';

      if (currentPath !== normalizedRoute) {
        window.history.pushState({}, '', path);
        setCurrentPath(normalizedRoute);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
      } else {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    const normalized = path.replace(/\/$/, '') || '/';
    if (normalized !== currentPath) {
      window.history.pushState({}, '', normalized);
      setCurrentPath(normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTools = () => {
    if (currentPath !== '/') {
      navigate('/#tools');
    } else {
      toolsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTool = (
    tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport',
    initialFile?: File
  ) => {
    setActiveTool(tool);
    if (initialFile) {
      setTransferredFile(initialFile);
    }
    // Smooth scroll to the tool workspace
    toolsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGuideSelect = (
    tool: 'photo' | 'resize' | 'signature' | 'pdf' | 'passport',
    targetKB?: number
  ) => {
    if (targetKB) {
      setPresetTargetKB(targetKB);
    }
    setActiveTool(tool);
    toolsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render the appropriate view
  const renderCurrentView = () => {
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/privacy-policy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (currentPath === '/faq') {
      return <FaqPage onNavigate={navigate} />;
    }

    // Check if path matches one of the 8 SEO landing pages
    const slug = currentPath.replace(/^\//, '').toLowerCase();
    if (SEO_LANDING_PAGES[slug]) {
      return (
        <SeoLandingPage
          pageData={SEO_LANDING_PAGES[slug]}
          onNavigate={navigate}
          onNavigateToTool={handleSelectTool}
        />
      );
    }

    // Default: Existing Homepage (exactly as originally built)
    return (
      <>
        {/* COMPACT HERO SECTION */}
        <section id="home" className="pt-8 pb-6 sm:pt-12 sm:pb-8 bg-white border-b border-slate-200/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% In-Browser · Private &amp; Instant</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-3 text-balance">
              Make Your Files Ready for Online Applications
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
              Fix, compress and resize photos, signatures and PDFs for online applications.
            </p>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={scrollToTools}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span>Start Preparing My File</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* TOOL SELECTION & WORKSPACE */}
        <section ref={toolsSectionRef} id="tools" className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
          {/* THREE LARGE, EASY-TO-UNDERSTAND CARDS */}
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Select What You Need to Prepare:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Card 1: 📷 Photo (Primary / Featured Option) */}
              <button
                type="button"
                onClick={() => setActiveTool('photo')}
                className={`p-5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  activeTool === 'photo'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-emerald-400 hover:bg-emerald-50/20 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-xl">
                    📷
                  </div>
                  {/* Featured badge */}
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span>Photo</span>
                </h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Compress or resize your photo
                </p>
              </button>

              {/* Card 2: ✍️ Signature */}
              <button
                type="button"
                onClick={() => setActiveTool('signature')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTool === 'signature'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-indigo-400 hover:bg-indigo-50/20 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-indigo-800 flex items-center justify-center text-xl mb-2">
                  ✍️
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Signature
                </h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Resize your signature to the required size
                </p>
              </button>

              {/* Card 3: 📄 PDF */}
              <button
                type="button"
                onClick={() => setActiveTool('pdf')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTool === 'pdf'
                    ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-amber-400 hover:bg-amber-50/20 shadow-2xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center text-xl mb-2">
                  📄
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  PDF
                </h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Compress your PDF for online uploads
                </p>
              </button>
            </div>

            {/* Quick helper switcher for specialized tools if user navigated from result card */}
            {(activeTool === 'resize' || activeTool === 'passport') && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-slate-500">Active mode:</span>
                <span className="font-bold text-slate-800 capitalize bg-slate-200 px-2 py-0.5 rounded">
                  {activeTool === 'resize' ? 'Photo Resizer' : 'Passport Photo'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTool('photo')}
                  className="text-emerald-700 font-semibold hover:underline ml-2 cursor-pointer"
                >
                  ← Back to Photo Compressor
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE TOOL CARD CONTAINER */}
          <div>
            {activeTool === 'photo' && (
              <PhotoCompressorCard
                onNavigateToTool={handleSelectTool}
                presetTargetKB={presetTargetKB}
              />
            )}

            {activeTool === 'signature' && (
              <SignatureToolCard
                onNavigateToTool={handleSelectTool}
                initialTargetKB={20}
              />
            )}

            {activeTool === 'pdf' && (
              <PdfCompressorCard
                onNavigateToTool={handleSelectTool}
              />
            )}

            {activeTool === 'resize' && (
              <PhotoResizerCard
                onNavigateToTool={handleSelectTool}
                initialFile={transferredFile}
                initialWidth={350}
                initialHeight={450}
              />
            )}

            {activeTool === 'passport' && (
              <PassportPhotoCard
                onNavigateToTool={handleSelectTool}
                initialFile={transferredFile}
              />
            )}
          </div>
        </section>

        {/* SEO COMPACT GUIDES */}
        <SeoGuideSections onSelectGuidePreset={handleGuideSelect} onNavigate={navigate} />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* FAQ SECTION */}
        <FAQSection />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        onStartClick={scrollToTools}
        onNavigate={navigate}
        currentPath={currentPath}
      />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
