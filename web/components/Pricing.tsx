import React from 'react';
import { PricingTier } from '../types';
import { CheckIcon } from './Icons';
import { Button } from './Button';

export const Pricing: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$0",
      description: "Essential chat organization for casual users.",
      features: [
        "Unlimited Message Folding",
        "Basic Table of Contents",
        "Local History Search (Last 7 days)",
        "Standard Community Support"
      ],
      cta: "Add to Chrome",
      popular: false
    },
    {
      name: "Pro",
      price: "$4.99",
      description: "The ultimate power user toolkit for AI workflows.",
      features: [
        "Everything in Starter",
        "Full History Semantic Search",
        "Export Chats to Markdown & PDF",
        "Custom Keyboard Shortcuts",
        "Cross-Browser Sync",
        "Priority Email Support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Team",
      price: "Custom",
      description: "Centralized management for engineering teams.",
      features: [
        "Everything in Pro",
        "Centralized Billing Dashboard",
        "Team Usage Analytics",
        "SSO / SAML Integration",
        "Dedicated Account Manager"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Pricing Plans</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Affordable Productivity
          </p>
          <p className="mt-4 text-xl text-slate-500">
            Start organizing your AI conversations today. Upgrade anytime as your workflow grows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col p-8 bg-white rounded-2xl transition-all duration-300 ${
                tier.popular 
                  ? 'border-2 border-primary-500 shadow-2xl scale-105 z-10' 
                  : 'border border-slate-200 shadow-sm hover:border-primary-200 hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-sm text-slate-500 mt-2 h-10">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-slate-500 font-medium">/month</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.popular ? 'primary' : 'outline'} 
                className="w-full justify-center"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};