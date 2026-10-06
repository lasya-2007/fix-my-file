/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, AlertCircle, Info, Send, CheckCircle2 } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('tool-problem');
  const [message, setMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Contact Fix My File',
      description: 'Contact Fix My File for questions, feedback, suggestions or problems with our file preparation tools.',
      path: '/contact',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowStatus(true);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
            Contact Fix My File
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions or encountered an issue with a tool? You can contact Fix My File regarding:
          </p>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Website problems</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Tool problems</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Suggestions &amp; new features</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Feedback &amp; other questions</span>
            </li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* Transparent backend status note */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-semibold block mb-0.5">Note:</strong>
              Contact form submission is not connected yet. Fix My File currently operates as a 100% client-side web utility without an active email backend server.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Contact
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="tool-problem">Tool Problem (Photo / Signature / PDF)</option>
                <option value="website-problem">Website Problem / Bug</option>
                <option value="suggestion">Feature Suggestion</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other Question</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, tool problem, or suggestion..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Submit Message</span>
            </button>
          </form>

          {/* Submission Notice */}
          {showStatus && (
            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Contact form submission is not connected yet.</strong>
                Because Fix My File is an in-browser static application with no backend mailer, this message cannot be routed to an inbox. If you encountered an issue with photo compression or dimension limits, please review the instructions on our{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/faq')}
                  className="font-bold underline cursor-pointer"
                >
                  FAQ page
                </button>
                .
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
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
  );
};
