import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import EditorCanvas from './components/EditorCanvas';
import Footer from './components/Footer';

export default function App() {
  const editorRef = useRef(null);
  const scrollToEditor = () => {
    const el = document.getElementById('editor');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar onStart={scrollToEditor} />
      <main>
        <Hero onStart={scrollToEditor} />
        <Features />
        <EditorCanvas ref={editorRef} />
      </main>
      <Footer />
    </div>
  );
}
