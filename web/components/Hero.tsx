import React, { useState } from 'react';
import { Button } from './Button';
import { CheckIcon, ChromeIcon, SearchIcon, ListIcon, FoldIcon } from './Icons';

export const Hero: React.FC = () => {
  const [isFolded, setIsFolded] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(true);

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Text Content */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Productivity Layer</span>
              <br /> for AI Chats
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Stop scrolling endlessly. Transform ChatGPT, Claude, and Gemini into a structured workspace with
              <span className="font-semibold text-slate-900"> message folding</span>,
              <span className="font-semibold text-slate-900"> auto-TOC</span>, and
              <span className="font-semibold text-slate-900"> global search</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <Button size="lg" icon={<ChromeIcon className="w-5 h-5" />} onClick={() => { }} className="shadow-lg shadow-primary-500/20">
                Add to Chrome - It's Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => { document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }) }}>
                View Live Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                No signup required
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                100% Local Privacy
              </div>
              <div className="flex items-center">
                <div className="flex -space-x-1 mr-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-4 h-4 rounded-full bg-yellow-400 border border-white"></div>
                  ))}
                </div>
                5-Star Rated
              </div>
            </div>
          </div>

          {/* Interactive Demo UI */}
          <div id="demo" className="relative z-10 perspective-1000 group">

            {/* Floating Badge */}
            <div className="absolute -top-12 -right-4 lg:-right-12 z-50 animate-bounce hidden sm:block">
              <div className="bg-white/80 backdrop-blur border border-slate-200 shadow-xl rounded-2xl px-4 py-2 flex items-center gap-2 transform rotate-3">
                <span className="text-sm font-bold text-slate-800">Try clicking these!</span>
                <span className="text-2xl">👇</span>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">

              {/* Browser Header */}
              <div className="h-11 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 select-none">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                </div>
                <div className="bg-white border border-slate-200 rounded px-3 py-0.5 text-[10px] font-medium text-slate-400 flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div> chatgpt.com
                </div>
                {/* Extension Toolbar Injection */}
                <div className="flex items-center space-x-1 border-l border-slate-200 pl-3">
                  <button
                    onClick={() => setIsFolded(!isFolded)}
                    className={`p-1.5 rounded-md transition-all duration-200 ${isFolded ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500/20' : 'hover:bg-slate-100 text-slate-500'}`}
                    title="Fold History"
                  >
                    <FoldIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className={`p-1.5 rounded-md transition-all duration-200 ${isTocOpen ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500/20' : 'hover:bg-slate-100 text-slate-500'}`}
                    title="Table of Contents"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                    <SearchIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex h-[420px] bg-white relative">

                {/* Chat Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white no-scrollbar scroll-smooth">

                  {/* Message 1 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0"></div>
                    <div className="space-y-1.5 max-w-[85%]">
                      <div className="font-semibold text-xs text-slate-900">User</div>
                      <div className="text-slate-700 text-sm leading-relaxed">How do I create a React hook for fetching data?</div>
                    </div>
                  </div>

                  {/* Message 2 (AI) - Foldable */}
                  <div className={`group/msg relative transition-all duration-500 ease-in-out border rounded-xl overflow-hidden ${isFolded ? 'border-primary-100 bg-primary-50/30' : 'border-transparent bg-transparent'}`}>

                    {/* Fold Toggle (Hover) */}
                    {!isFolded && (
                      <button
                        onClick={() => setIsFolded(true)}
                        className="absolute top-2 right-2 opacity-0 group-hover/msg:opacity-100 transition-opacity bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-500 px-2 py-1 rounded hover:text-primary-600 hover:border-primary-200"
                      >
                        Fold
                      </button>
                    )}

                    <div className={`p-2 transition-all duration-500 ${isFolded ? 'h-14 overflow-hidden' : ''}`}>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 text-[10px] font-bold flex-shrink-0 shadow-sm">AI</div>
                        <div className="space-y-2 max-w-[90%]">
                          <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                            ChatGPT
                            {isFolded && <span className="text-[10px] text-primary-600 bg-primary-100 px-1.5 py-0.5 rounded font-medium">Folded</span>}
                          </div>

                          <div className="text-slate-600 text-sm leading-relaxed space-y-3">
                            <p>Here is a simple custom hook called <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">useFetch</code>.</p>

                            <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-xs text-blue-300 shadow-inner border border-slate-800">
                              <div className="flex gap-1.5 mb-3 opacity-50">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                              </div>
                              <span className="text-purple-400">const</span> <span className="text-yellow-200">useFetch</span> = (url) <span className="text-purple-400">=&gt;</span> &#123;<br />
                              &nbsp;&nbsp;<span className="text-purple-400">const</span> [data, setData] = <span className="text-blue-200">useState</span>(null);<br />
                              &nbsp;&nbsp;<span className="text-gray-500">// ... logic ...</span><br />
                              &nbsp;&nbsp;<span className="text-purple-400">return</span> &#123; data &#125;;<br />
                              &#125;
                            </div>

                            <p>This hook handles loading states and errors automatically.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expand overlay */}
                    {isFolded && (
                      <div
                        className="absolute inset-0 cursor-pointer bg-gradient-to-b from-transparent to-primary-50/50 hover:bg-primary-50/80 transition-colors flex items-center justify-center"
                        onClick={() => setIsFolded(false)}
                      >
                        <span className="bg-white text-primary-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-primary-100 transform translate-y-2 group-hover/msg:translate-y-0 transition-transform">Click to expand</span>
                      </div>
                    )}
                  </div>

                  {/* Message 3 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0"></div>
                    <div className="space-y-1.5 max-w-[85%]">
                      <div className="font-semibold text-xs text-slate-900">User</div>
                      <div className="text-slate-700 text-sm leading-relaxed">Show me an example component.</div>
                    </div>
                  </div>

                  {/* Spacer for scroll */}
                  <div className="h-12"></div>

                </div>

                {/* Table of Contents Sidebar (Dynamic) */}
                <div className={`absolute top-0 right-0 bottom-0 bg-white border-l border-slate-200 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col z-20 ${isTocOpen ? 'w-48 translate-x-0' : 'w-48 translate-x-full opacity-0'}`}>
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 backdrop-blur">
                    <div className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Contents</div>
                  </div>
                  <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    <div className="px-2 py-2 text-xs font-medium text-primary-700 bg-primary-50 rounded border border-primary-100 cursor-pointer transition-colors">1. Introduction</div>
                    <div className="px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded cursor-pointer transition-colors">2. The useFetch Hook</div>
                    <div className="px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded cursor-pointer transition-colors">3. Example Component</div>
                    <div className="px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded cursor-pointer transition-colors">4. Error Handling</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};