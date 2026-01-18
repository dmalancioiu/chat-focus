import React, { useState, useEffect } from 'react';
import { LogoIcon } from './Icons';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <LogoIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ChatFocus</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">Features</a>
            <a href="#demo" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">How it works</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">FAQ</a>
          </div>

          <div className="flex items-center">
            <Button variant="primary" size="sm" onClick={() => window.open('https://chrome.google.com', '_blank')}>
              Add to Chrome
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};