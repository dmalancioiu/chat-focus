import React from 'react';
import { LogoIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800/60 relative overflow-hidden">

      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute -top-[100px] left-1/4 w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-16">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-5 lg:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-white text-slate-900 p-1.5 rounded-lg shadow-lg shadow-white/10">
                <LogoIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">ChatFocus</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-8 max-w-sm">
              The ultimate productivity layer for AI chat interfaces. Transform chaos into a structured knowledge base without leaving your browser.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-5">
              <SocialLink href="#" label="Twitter">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </SocialLink>
              <SocialLink href="#" label="GitHub">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </SocialLink>
              <SocialLink href="#" label="Discord">
                <path d="M21.75 6.13c-.85-.6-1.77-1.05-2.73-1.34a.6.6 0 0 0-.64.25c-.37.7-.76 1.62-.83 1.83-1.02-.15-2.04-.23-3.05-.23s-2.03.08-3.05.23c-.07-.21-.46-1.13-.83-1.83a.59.59 0 0 0-.64-.25 20.35 20.35 0 0 0-2.73 1.34.6.6 0 0 0-.27.4C3.23 11.77 4.14 17.2 8.44 21.63a.59.59 0 0 0 .61-.06c.9-.68 1.74-1.42 2.5-2.22a.59.59 0 0 0-.15-.83 13.72 13.72 0 0 1-1.86-.88.6.6 0 0 1 .63-1.01c.37.17.75.36 1.12.56.04.02.09.03.13.03 2.13.97 4.46.97 6.57 0 .05 0 .09-.01.13-.03.37-.2.75-.39 1.12-.56a.6.6 0 0 1 .63 1.01c-.6.33-1.22.62-1.86.88a.59.59 0 0 0-.15.83c.76.8 1.6 1.54 2.5 2.22a.59.59 0 0 0 .61.06c4.3-4.43 5.21-9.86 2.44-15.1a.6.6 0 0 0-.27-.4Z"></path>
              </SocialLink>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-7">
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="#">Download</FooterLink></li>
              <li><FooterLink href="#">Features</FooterLink></li>
              <li><FooterLink href="#">Pricing</FooterLink></li>
              <li><FooterLink href="#">Changelog</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="#">Documentation</FooterLink></li>
              <li><FooterLink href="#">Guide</FooterLink></li>
              <li><FooterLink href="#">Community</FooterLink></li>
              <li><FooterLink href="#">Help Center</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
              <li><FooterLink href="#">Cookie Policy</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ChatFocus. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p>Not affiliated with OpenAI, Anthropic, or Google.</p>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components for cleaner code
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-slate-400 hover:text-white transition-colors duration-200 block">
    {children}
  </a>
);

const SocialLink = ({ href, children, label }: { href: string; children: React.ReactNode; label: string }) => (
  <a
    href={href}
    aria-label={label}
    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  </a>
);