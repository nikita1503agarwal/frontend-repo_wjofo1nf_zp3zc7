import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-amber-50" />
      <div className="absolute inset-0" aria-hidden>
        <div className="pointer-events-none absolute -top-24 right-1/2 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-amber-500" />
            The modern canvas for ideas
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Sketch like Excalidraw, design like Figma, feel like magic
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            DoodleLab is a fast, minimal canvas to draw, create shapes, and brainstorm together. Clean UI, keyboard-friendly, and delightful.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-white shadow-sm hover:opacity-95 active:opacity-90"
            >
              Open the editor
              <ArrowRight size={18} />
            </button>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-slate-700 bg-white hover:bg-slate-50">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
