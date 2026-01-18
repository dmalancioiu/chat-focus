import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: "Does ChatFocus work with the free version of ChatGPT?",
            answer: "Yes! ChatFocus is fully compatible with the free version of ChatGPT, as well as ChatGPT Plus, Claude (Free & Pro), and Google Gemini."
        },
        {
            question: "Is my chat data safe?",
            answer: "Absolutely. ChatFocus runs entirely locally in your browser. We do not store, read, or transmit your chat history to any servers. Your data stays securely on your device."
        },
        {
            question: "How does the 'Folding' feature work?",
            answer: "Simply hover over any AI response, and you'll see a fold button in the top right corner. You can also configure auto-folding rules in the settings to automatically collapse long code blocks or reasoning steps."
        },
        {
            question: "Can I export my chats to PDF?",
            answer: "Yes, the Pro plan allows you to export full conversation threads to clean, formatted PDF or Markdown files, perfect for sharing documentation with your team."
        },
        {
            question: "What happens after the free trial?",
            answer: "After the trial, if you choose not to upgrade, you will automatically be moved to the Starter plan. You won't be charged unless you explicitly enter your payment details."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-32 bg-white border-t border-slate-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Support</h2>
                    <h3 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Everything you need to know about the extension and billing.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl transition-all duration-300 border ${isOpen
                                        ? 'bg-white border-primary-100 shadow-lg shadow-primary-500/5'
                                        : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary-700' : 'text-slate-900'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary-100 text-primary-600' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            {/* Plus/Minus Icon Logic */}
                                            {isOpen ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            )}
                                        </svg>
                                    </div>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-transparent">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Contact CTA */}
                <div className="mt-16 text-center">
                    <p className="text-slate-500">
                        Still have questions? <a href="#" className="text-primary-600 font-semibold hover:text-primary-700 underline underline-offset-4">Chat to our friendly team</a>
                    </p>
                </div>

            </div>
        </section>
    );
};