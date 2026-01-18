import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';

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
            answer: "Absolutely. ChatFocus runs entirely locally in your browser. We do not store, read, or transmit your chat history to any servers. Your data stays on your device."
        },
        {
            question: "How does the 'Folding' feature work?",
            answer: "Simply hover over any AI response, and you'll see a fold button in the top right corner. You can also configure auto-folding rules in the settings to automatically collapse long code blocks."
        },
        {
            question: "Can I export my chats to PDF?",
            answer: "Yes, the Pro plan allows you to export full conversation threads to clean, formatted PDF or Markdown files, perfect for sharing or documentation."
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
        <section id="faq" className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">FAQ</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Frequently Asked Questions
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-primary-200">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-4 flex items-center justify-between bg-white text-left focus:outline-none"
                            >
                                <span className="font-semibold text-slate-900">{faq.question}</span>
                                <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                                </span>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out bg-slate-50 ${
                                    openIndex === index ? 'max-h-48 opacity-100 px-6 py-4' : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                            >
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};