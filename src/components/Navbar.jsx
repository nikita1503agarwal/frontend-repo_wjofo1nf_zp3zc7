import React from 'react';
import { Rocket, Paintbrush, Github, Sparkles } from 'lucide-react';

export default function Navbar({ onStart, showStart = true }) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-amber-400 grid place-items-center text-white shadow-sm">
            <Paintbrush size={18} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900">DoodleLab</span>
            <span className="text-xs text-slate-500 -mt-0.5">Sketch • Shape • Ship</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#editor" className="hover:text-slate-900 transition-colors">Editor</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Github size={18} />
            <span className="text-sm">GitHub</span>
          </a>
          {showStart && (
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:opacity-95 active:opacity-90"
            >
              <Rocket size={16} />
              Start drawing
            </button>
          )}
          {!showStart && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles size={14} /> Auto-save enabled
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
