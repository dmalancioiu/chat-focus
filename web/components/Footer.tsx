import React from 'react';
import { LogoIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-slate-900 p-1 rounded">
                <LogoIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">ChatFocus</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Enhancing your AI workflow with organization, search, and clarity. Open source and privacy-focused.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Download</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ChatFocus. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Not affiliated with OpenAI, Anthropic, or Google.</p>
        </div>
      </div>
    </footer>
  );
};