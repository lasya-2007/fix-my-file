/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { POPULAR_EXAM_SPECS, ExamSpecification } from '../data/examSpecs';
import { ArrowRight, FileCheck } from 'lucide-react';

interface ExamSpecsTableProps {
  onApplySpec: (spec: ExamSpecification, tool: 'compressor' | 'resizer' | 'signature') => void;
}

export const ExamSpecsTable: React.FC<ExamSpecsTableProps> = ({ onApplySpec }) => {
  return (
    <section id="exam-specs" className="py-14 sm:py-20 border-t border-slate-200/80 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reference Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Standard Requirements by Examination
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xs sm:text-right">
            Tap any row to quickly jump and prepare your file with the official dimensions &amp; size limits.
          </p>
        </div>

        <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Examination / Portal</th>
                  <th className="py-3.5 px-4">Photo Requirements</th>
                  <th className="py-3.5 px-4">Signature Requirements</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {POPULAR_EXAM_SPECS.map((spec) => (
                  <tr key={spec.portal} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-5">
                      <span className="font-bold text-slate-900 block">{spec.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{spec.portal}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{spec.photoLimit}</div>
                      <div className="text-xs text-slate-500">{spec.photoDimensions}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{spec.signLimit}</div>
                      <div className="text-xs text-slate-500">{spec.signDimensions}</div>
                    </td>

                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onApplySpec(spec, 'compressor')}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                        >
                          Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => onApplySpec(spec, 'signature')}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          Signature
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Small Disclaimer */}
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          <strong>Disclaimer:</strong> File-size and dimension requirements vary by application. Always check the latest official notification before uploading.
        </p>
      </div>
    </section>
  );
};
