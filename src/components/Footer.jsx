import React from 'react';

export default function Footer() {
  return (
    <footer className="py-10 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600">© {new Date().getFullYear()} DoodleLab. Built for creators.</p>
        <div className="text-sm text-slate-500 flex items-center gap-4">
          <a href="#" className="hover:text-slate-700">Privacy</a>
          <a href="#" className="hover:text-slate-700">Terms</a>
          <a href="#" className="hover:text-slate-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}
