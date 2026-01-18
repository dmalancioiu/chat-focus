import React from 'react';

const Demo: React.FC = () => {
    return (
        <section id="demo" className="py-32 bg-slate-900 relative isolate overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Glow behind the video */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">

                {/* Header */}
                <div className="max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
                        See it in action
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Watch how ChatFocus transforms a messy 200-message chat history into a clean, navigable, and productive workspace in seconds.
                    </p>
                </div>

                {/* Video Container - Cinematic Style */}
                <div className="relative group mx-auto max-w-5xl">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur transition duration-1000 group-hover:opacity-60 group-hover:duration-200"></div>

                    <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">

                        {/* Fake Browser Header (Optional aesthetic detail) */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center px-4 z-20">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
                            </div>
                        </div>

                        {/* Video / Placeholder Content */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 group-hover:bg-slate-800/50 transition-colors duration-500 cursor-pointer">
                            <div className="relative z-30 flex flex-col items-center">
                                {/* Play Button */}
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-xl border border-white/10">
                                    <svg
                                        className="w-8 h-8 text-white group-hover:text-indigo-600 ml-1 transition-colors duration-300"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <p className="text-base font-medium text-white tracking-wide">Play Walkthrough</p>
                                <p className="text-sm text-slate-500 mt-2">1:04 • No audio</p>
                            </div>

                            {/* Abstract background inside placeholder (remove this when you add real video) */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
                        </div>

                        {/* HTML Video Tag (Uncomment to use real video) */}
                        {/* <video 
                            className="w-full h-full object-cover"
                            controls
                            poster="/path/to/poster.jpg"
                        >
                            <source src="/path/to/demo.mp4" type="video/mp4" />
                        </video> 
                        */}
                    </div>
                </div>

                {/* Bottom decorative text/link */}
                <div className="mt-12">
                    <p className="text-slate-500 text-sm">
                        Prefer to try it yourself? <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Install the extension free →</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Demo;