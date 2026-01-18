import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Demo from './components/Demo';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Demo />
        <Pricing />
        <FAQ />

        {/* Simple CTA Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-500 blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to declutter your chats?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Join 10,000+ developers and writers who use ChatFocus to keep their AI conversations sane.
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-white/20">
              Add to Chrome — It's Free
            </button>
            <p className="mt-4 text-xs text-slate-400">Requires Chrome, Edge, or Brave browser.</p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default App;