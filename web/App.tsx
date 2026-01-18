import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Demo from './components/Demo';
import { Reveal } from './components/Reveal'; // Import the new component

function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero is usually visible on load, so we might not animate it, 
            or animate just the inner content inside Hero.tsx itself if preferred. 
            For now, let's keep Hero static for instant LCP (Largest Contentful Paint). */}
        <Hero />

        {/* Wrap sections in Reveal for scroll effects */}

        <Reveal>
          <Features />
        </Reveal>

        <Reveal>
          <Demo />
        </Reveal>

        <Reveal>
          <Pricing />
        </Reveal>

        <Reveal>
          <FAQ />
        </Reveal>

        {/* CTA Section */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary-500/20 blur-[100px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to declutter your chats?
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join 10,000+ developers, writers, and researchers who use ChatFocus to keep their AI conversations sane.
              </p>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => window.open('https://chrome.google.com', '_blank')}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10">Add to Chrome — It's Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <p className="mt-6 text-sm text-slate-500 font-medium">
                  Works on Chrome, Edge, Brave & Opera
                </p>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;