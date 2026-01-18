import React from 'react';
import { PricingTier } from '../types';
import { CheckIcon } from './Icons';
import { Button } from './Button';

export const Pricing: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$0",
      description: "Essential organization for casual AI users.",
      features: [
        "Unlimited Message Folding",
        "Basic Table of Contents",
        "Local History Search (7 days)",
        "Community Support"
      ],
      cta: "Add to Chrome",
      popular: false
    },
    {
      name: "Pro",
      price: "$4.99",
      description: "The complete toolkit for power users.",
      features: [
        "Everything in Starter",
        "Unlimited Semantic Search",
        "Export to Markdown & PDF",
        "Custom Shortcuts & Themes",
        "Sync Across Devices",
        "Priority Support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Team",
      price: "Custom",
      description: "Control & compliance for organizations.",
      features: [
        "Everything in Pro",
        "Centralized Billing",
        "Team Usage Analytics",
        "SSO / SAML Integration",
        "Dedicated Success Manager",
        "Custom Contracts"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Simple Pricing</h2>
          <h3 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">focus</span>.
          </h3>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Stop wasting time scrolling. Start organizing your AI knowledge today.
            <br className="hidden sm:block" /> 100% money-back guarantee for 30 days.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${tier.popular
                  ? 'bg-white border-2 border-primary-500 shadow-2xl scale-105 z-10 ring-4 ring-primary-50'
                  : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-xl hover:-translate-y-1'
                }`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold ${tier.popular ? 'text-primary-700' : 'text-slate-900'}`}>{tier.name}</h3>
                <p className="text-sm text-slate-500 mt-2 min-h-[40px] leading-relaxed">{tier.description}</p>
              </div>

              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-bold text-slate-900 tracking-tight">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-slate-500 font-medium ml-2">/month</span>}
              </div>

              <div className="border-t border-slate-100 my-8"></div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${tier.popular ? 'bg-primary-100' : 'bg-green-100'}`}>
                      <CheckIcon className={`w-3 h-3 ${tier.popular ? 'text-primary-600' : 'text-green-600'}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? 'primary' : 'outline'}
                className={`w-full justify-center py-4 text-sm font-bold ${tier.popular ? 'shadow-lg shadow-primary-500/30' : ''}`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400">
            Secure payment via Stripe • Cancel anytime • No credit card required for free tier
          </p>
        </div>

      </div>
    </section>
  );
};