import React from 'react';
import { Shapes, PencilRuler, MousePointerClick, Share2 } from 'lucide-react';

const features = [
  {
    icon: Shapes,
    title: 'Shapes & connectors',
    desc: 'Draw rectangles, circles, lines, arrows, and connect them with smart snapping.'
  },
  {
    icon: PencilRuler,
    title: 'Pixel-perfect controls',
    desc: 'Resize, rotate, nudge with keyboard, align and distribute with guides.'
  },
  {
    icon: MousePointerClick,
    title: 'Intuitive interactions',
    desc: 'Drag to pan, space to hand tool, hold shift for straight lines — it just works.'
  },
  {
    icon: Share2,
    title: 'Export & share',
    desc: 'Export to PNG/SVG with transparent background and copy to clipboard.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything you need to doodle fast</h2>
        <p className="mt-3 text-slate-600 max-w-2xl">A focused toolset that keeps you in flow without the clutter. Built for speed and clarity.</p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
