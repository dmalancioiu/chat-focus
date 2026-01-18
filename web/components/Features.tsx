import React from 'react';
import { CheckIcon } from './Icons';

// Import images
import chatgptPng from '../public/logos/chatgpt.png';
import claudePng from '../public/logos/claude.png';
import geminiPng from '../public/logos/gemini.png';

export const Features: React.FC = () => {
    return (
        <>
            {/* --- SECTION 1: FEATURES (White Background) --- */}
            <section id="features" className="py-32 bg-white relative overflow-hidden">
                {/* Decorative subtle pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800 mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                            Powerful Capabilities
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                            Master your context. <br className="hidden sm:block" />
                            <span className="text-slate-400">Tame the chaos.</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            ChatFocus transforms your endless chat streams into a structured, searchable knowledge base. Stop scrolling, start finding.
                        </p>
                    </div>

                    <div className="space-y-32">
                        {/* Feature 1: Folding */}
                        <div className="group grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative perspective-1000">
                                {/* Abstract UI: Chat Window */}
                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-1.5 transform transition-transform duration-700 hover:rotate-0 rotate-1 hover:scale-[1.02]">
                                    <div className="bg-slate-50 rounded-xl overflow-hidden h-80 flex flex-col relative">
                                        <div className="h-10 bg-white border-b border-slate-100 flex items-center px-4 space-x-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                        </div>
                                        <div className="p-6 flex flex-col gap-6">
                                            <div className="flex gap-4 items-start opacity-40">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                                                <div className="space-y-2 w-full">
                                                    <div className="h-2.5 bg-slate-200 rounded w-1/3"></div>
                                                    <div className="h-2 bg-slate-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                            <div className="border border-indigo-200 bg-white rounded-xl shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group-hover:translate-x-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold ring-4 ring-indigo-50">AI</div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-800">Detailed Code Explanation</div>
                                                        <div className="text-xs text-slate-400">Collapsed for clarity</div>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">Expand</span>
                                            </div>
                                            <div className="flex gap-4 items-start opacity-40">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                                                <div className="space-y-2 w-full">
                                                    <div className="h-2.5 bg-slate-200 rounded w-1/4"></div>
                                                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <h3 className="text-3xl font-bold text-slate-900 mb-6">Focus on What Matters</h3>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    Long responses and code blocks clutter your view. reclaim your screen real estate by collapsing lengthy AI outputs with a single click.
                                </p>
                                <ul className="space-y-4">
                                    {["Auto-collapse specific topics", "Keyboard shortcuts for speed", "Persists across page reloads"].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-700 font-medium">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <CheckIcon className="w-3.5 h-3.5 text-green-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2: TOC */}
                        <div className="group grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-6">Navigate Instantly</h3>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    Never scroll endlessly to find "that one prompt" again. ChatFocus auto-generates a sidebar navigation based on your conversation headers.
                                </p>
                                <ul className="space-y-4">
                                    {["Generated in real-time", "Click to jump to message", "Floating or fixed sidebar modes"].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-700 font-medium">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                <CheckIcon className="w-3.5 h-3.5 text-blue-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative perspective-1000">
                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-1.5 transform transition-transform duration-700 -rotate-1 hover:rotate-0 hover:scale-[1.02]">
                                    <div className="flex h-80 bg-slate-50 rounded-xl overflow-hidden relative">
                                        <div className="flex-1 p-6 space-y-6 opacity-30 blur-[1px]">
                                            <div className="h-6 bg-slate-300 rounded w-3/4"></div>
                                            <div className="h-32 bg-slate-200 rounded w-full"></div>
                                            <div className="h-6 bg-slate-300 rounded w-1/2"></div>
                                            <div className="h-32 bg-slate-200 rounded w-full"></div>
                                        </div>
                                        <div className="absolute right-0 top-0 bottom-0 w-56 bg-white/95 backdrop-blur-sm border-l border-slate-200 p-5 shadow-[ -10px_0_40px_-10px_rgba(0,0,0,0.1) ]">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">On this page</div>
                                            <div className="space-y-2">
                                                <div className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-100 cursor-pointer">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                                    <div className="h-2 w-24 bg-blue-300 rounded"></div>
                                                </div>
                                                <div className="flex items-center p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></div>
                                                    <div className="h-2 w-32 bg-slate-200 rounded"></div>
                                                </div>
                                                <div className="flex items-center p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></div>
                                                    <div className="h-2 w-20 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tl from-blue-100/50 to-cyan-100/50 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                        </div>

                        {/* Feature 3: Search */}
                        <div className="group grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative perspective-1000">
                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-1.5 transform transition-transform duration-700 rotate-1 hover:rotate-0 hover:scale-[1.02]">
                                    <div className="bg-slate-900 rounded-xl h-80 flex items-center justify-center p-6 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
                                            <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                                <div className="w-4 h-4 text-slate-400">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                                                </div>
                                                <div className="h-2.5 w-32 bg-slate-300 rounded animate-pulse"></div>
                                            </div>
                                            <div className="p-2 bg-white">
                                                <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer group/result transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="text-sm font-semibold text-slate-700">React Hooks vs Classes</div>
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Chat</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">Found in "Web Dev Study" • 2 days ago</div>
                                                </div>
                                                <div className="p-3 bg-primary-50/50 rounded-lg cursor-pointer border border-primary-100">
                                                    <div className="flex justify-between items-start">
                                                        <div className="text-sm font-bold text-primary-700">Python Data Analysis</div>
                                                        <span className="text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">Code</span>
                                                    </div>
                                                    <div className="text-xs text-primary-400 mt-1">Found in "Data Project" • 1 week ago</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-orange-100/50 to-amber-100/50 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <h3 className="text-3xl font-bold text-slate-900 mb-6">Global Semantic Search</h3>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    Don't lose your insights. Search across all your chat history instantly, even if the chat is archived or months old.
                                </p>
                                <ul className="space-y-4">
                                    {["Search by keywords or meaning", "Filter by date or platform", "Instant results, zero latency"].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-700 font-medium">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                                <CheckIcon className="w-3.5 h-3.5 text-orange-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: COMPATIBILITY (Light Gray Background) --- */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">
                        Works seamlessly with your favorite tools
                    </p>
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">

                        {/* Card Component for Logos */}
                        {[
                            { name: "ChatGPT", img: chatgptPng, color: "hover:border-[#74aa9c]/30 hover:shadow-[#74aa9c]/20" },
                            { name: "Claude", img: claudePng, color: "hover:border-[#d97757]/30 hover:shadow-[#d97757]/20" },
                            { name: "Gemini", img: geminiPng, color: "hover:border-[#4E86F5]/30 hover:shadow-[#4E86F5]/20" }
                        ].map((tool) => (
                            <div key={tool.name} className="flex flex-col items-center gap-4 group cursor-default">
                                <div className={`w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${tool.color}`}>
                                    <img
                                        src={tool.img}
                                        alt={`${tool.name} Logo`}
                                        className="w-10 h-10 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                                <span className="font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">{tool.name}</span>
                            </div>
                        ))}

                    </div>
                </div>
            </section>
        </>
    );
};