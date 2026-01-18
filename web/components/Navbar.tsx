import React, { useState, useEffect } from 'react';
import { LogoIcon } from './Icons';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-2'
            : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">

            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-slate-900 text-white p-1.5 rounded-lg shadow-md shadow-slate-900/10">
                <LogoIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">ChatFocus</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Button
                  variant="primary"
                  size="sm"
                  className="shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all"
                  onClick={() => window.open('https://chrome.google.com', '_blank')}
                >
                  Add to Chrome
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={() => window.open('https://chrome.google.com', '_blank')}
              >
                Add to Chrome
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay Background (Optional, closes menu when clicking outside) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ top: '60px' }} // Start below navbar
        ></div>
      )}
    </>
  );
};