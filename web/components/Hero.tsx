import React, { useState } from 'react';
import { Button } from './Button';
import { CheckIcon, ChromeIcon, SearchIcon, ListIcon, FoldIcon } from './Icons';

export const Hero: React.FC = () => {
  const [isFolded, setIsFolded] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(true);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              <span>Supported on ChatGPT, Claude & Gemini</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              The Ultimate <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Productivity Layer</span>
              <br /> for AI Chats
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Stop scrolling endlessly. ChatFocus is the #1 browser extension to manage your AI chat history.
              <strong> Fold long responses</strong>, navigate with an <strong>auto-generated Table of Contents</strong>,
              and <strong>search across all your conversations</strong> instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" icon={<ChromeIcon className="w-5 h-5" />} onClick={() => { }}>
                Add to Chrome - It's Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => { document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }) }}>
                View Live Demo
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                <span>100% Local Privacy</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                <span>5-Star Chrome Web Store</span>
              </div>
            </div>
          </div>

          {/* Interactive Demo UI */}
          <div id="demo" className="relative isolate z-10 group perspective-1000">
            {/* Floating Badge */}
            {/* Floating Badge */}
            <div className="absolute -top-14 right-5 z-50 bg-white/90 backdrop-blur px-3 py-2 shadow-lg rounded-xl border border-slate-200/60 animate-bounce">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900">Try clicking these!</span>
                <span className="text-xl">👇</span>
              </div>

            </div>

            <div className="relative bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01] hover:shadow-3xl">

              {/* Mock Browser/Extension Header */}
              <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-md px-3 py-1 shadow-sm space-x-3">
                  <div className="text-xs text-slate-500 font-medium">chatgpt.com</div>
                </div>
                {/* Extension Toolbar Injection */}
                <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                  <button
                    onClick={() => setIsFolded(!isFolded)}
                    className={`p-1.5 rounded-md transition-colors ${isFolded ? 'bg-primary-100 text-primary-600' : 'hover:bg-slate-100 text-slate-500'}`}
                    title="Fold History"
                  >
                    <FoldIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className={`p-1.5 rounded-md transition-colors ${isTocOpen ? 'bg-primary-100 text-primary-600' : 'hover:bg-slate-100 text-slate-500'}`}
                    title="Table of Contents"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500">
                    <SearchIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex h-[400px] bg-white">

                {/* Chat Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white no-scrollbar">
                  {/* Message 1 */}
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-sm text-slate-900">User</div>
                      <div className="text-slate-700 text-sm">How do I create a React hook for fetching data?</div>
                    </div>
                  </div>

                  {/* Message 2 (AI) - Foldable */}
                  <div className={`relative transition-all duration-300 border border-slate-100 rounded-lg p-4 ${isFolded ? 'h-16 overflow-hidden bg-slate-50' : 'bg-white'}`}>
                    <div className="flex space-x-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0">AI</div>
                      <div className="flex-1 space-y-2">
                        <div className="font-semibold text-sm text-slate-900 flex justify-between">
                          <span>ChatGPT</span>
                          {isFolded && <span className="text-xs text-slate-400 font-normal italic">Folded for clarity</span>}
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed">
                          <p className="mb-2">Here is a simple custom hook called <code>useFetch</code> that you can use to fetch data in React.</p>
                          <div className="bg-slate-900 rounded-md p-3 my-2 overflow-hidden">
                            <code className="text-xs text-green-400 font-mono">
                              const useFetch = (url) =&gt; &#123;<br />
                              &nbsp;&nbsp;const [data, setData] = useState(null);<br />
                              &nbsp;&nbsp;/* ... lengthy code ... */<br />
                              &#125;
                            </code>
                          </div>
                          <p>This hook handles loading states and errors automatically. You can import it into any component.</p>
                          <p className="mt-2">Would you like to see how to use it in a component?</p>
                        </div>
                      </div>
                    </div>
                    {/* Fold Overlay */}
                    {isFolded && (
                      <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 flex items-end justify-center pb-2 cursor-pointer hover:bg-slate-50/50"
                        onClick={() => setIsFolded(false)}
                      >
                        <span className="text-xs font-medium text-primary-600 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">Click to expand</span>
                      </div>
                    )}
                  </div>

                  {/* Message 3 */}
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-sm text-slate-900">User</div>
                      <div className="text-slate-700 text-sm">Yes, please show an example component.</div>
                    </div>
                  </div>

                  {/* Message 4 (AI) */}
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0">AI</div>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-sm text-slate-900">ChatGPT</div>
                      <div className="text-slate-600 text-sm leading-relaxed">
                        <p>Certainly! Here's how you use the hook:</p>
                        <div className="bg-slate-100 h-20 rounded-md mt-2 w-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Table of Contents Sidebar (Dynamic) */}
                <div className={`transition-all duration-300 ease-in-out border-l border-slate-200 bg-slate-50 flex flex-col ${isTocOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                  <div className="p-3 border-b border-slate-200 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                    Contents
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1.5 text-xs text-slate-700 bg-white rounded border border-slate-200 shadow-sm cursor-pointer">1. Introduction</div>
                    <div className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200/50 rounded cursor-pointer">2. The useFetch Hook</div>
                    <div className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200/50 rounded cursor-pointer">3. Example Component</div>
                    <div className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200/50 rounded cursor-pointer">4. Error Handling</div>
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