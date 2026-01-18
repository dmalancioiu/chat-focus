# ChatFocus Web Application

## Overview

This directory will contain the web application components for ChatFocus, including the landing page, user dashboard, and authentication flows.

## Structure

```
web/
├── landing/              # Marketing Landing Page
│   ├── public/          # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/  # React/Vue components
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── FAQ.jsx
│   │   ├── pages/       # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Pricing.jsx
│   │   │   └── About.jsx
│   │   ├── styles/      # Styling
│   │   │   ├── globals.css
│   │   │   └── components/
│   │   ├── utils/       # Utilities
│   │   └── App.jsx      # Main app
│   ├── package.json
│   └── README.md
├── dashboard/            # User Dashboard
│   ├── src/
│   │   ├── components/  # Dashboard components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Usage.jsx
│   │   │   └── Subscription.jsx
│   │   ├── pages/       # Dashboard pages
│   │   │   ├── Overview.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Billing.jsx
│   │   └── hooks/       # Custom hooks
│   └── package.json
└── auth/                 # Authentication Pages
    ├── src/
    │   ├── components/  # Auth components
    │   │   ├── LoginForm.jsx
    │   │   ├── SignupForm.jsx
    │   │   ├── ResetPassword.jsx
    │   │   └── OAuthButtons.jsx
    │   └── pages/       # Auth pages
    │       ├── Login.jsx
    │       ├── Signup.jsx
    │       └── ForgotPassword.jsx
    └── package.json
```

## Landing Page Features

### Planned Sections

1. **Hero Section**
   - Compelling headline
   - CTA button (Install Extension)
   - Feature highlights
   - Hero image/video

2. **Features Section**
   - Message folding/expansion
   - Table of contents
   - Search & highlighting
   - Code-only mode
   - Multi-site support

3. **How It Works**
   - Step-by-step guide
   - Screenshots/GIFs
   - Video demo

4. **Pricing Section**
   - Free tier features
   - Pro tier features
   - Premium tier features
   - Enterprise options

5. **Testimonials**
   - User reviews
   - Twitter testimonials
   - Use cases

6. **FAQ Section**
   - Common questions
   - Technical details
   - Support info

7. **Footer**
   - Links
   - Social media
   - Legal (Privacy, Terms)

### Tech Stack Options

**Option 1: Next.js** (Recommended)
- Server-side rendering
- Great SEO
- Fast performance
- Easy deployment (Vercel)

**Option 2: Vite + React**
- Fast development
- Lightweight
- Modern tooling

**Option 3: Astro**
- Best performance
- Component framework agnostic
- Perfect for static sites

## Dashboard Features

### Planned Pages

1. **Overview**
   - Usage statistics
   - Recent activity
   - Quick settings

2. **Settings**
   - Extension preferences
   - Sync settings across devices
   - Keyboard shortcuts
   - Theme preferences

3. **Billing**
   - Current plan
   - Payment method
   - Billing history
   - Upgrade/downgrade

4. **Account**
   - Profile information
   - Email preferences
   - Connected devices
   - Delete account

### Features

- Real-time sync with extension
- Settings backup/restore
- Usage analytics
- Subscription management
- Multi-device management

## Authentication

### Auth Features

1. **Sign Up**
   - Email/password
   - OAuth (Google, GitHub)
   - Email verification
   - Terms acceptance

2. **Login**
   - Email/password
   - OAuth providers
   - Remember me
   - 2FA (future)

3. **Password Reset**
   - Email reset link
   - Secure token
   - Password strength meter

4. **OAuth Integration**
   - Google Sign-In
   - GitHub Sign-In
   - Twitter Sign-In (optional)

## Development

### Setup

```bash
# Landing page
cd web/landing
npm install
npm run dev

# Dashboard
cd web/dashboard
npm install
npm run dev

# Auth
cd web/auth
npm install
npm run dev
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Design System

### Colors

```css
/* Primary */
--color-primary: #10a37f;
--color-primary-dark: #0d8c6e;
--color-primary-light: #1ec99d;

/* Neutral */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-900: #111827;

/* Semantic */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Typography

```css
/* Fonts */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing

```css
/* Spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Component Examples

### Hero Component

```jsx
// src/components/Hero.jsx
export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Focus on what matters in your AI chats</h1>
        <p>ChatFocus enhances ChatGPT, Claude, and Gemini with powerful features</p>
        <div className="cta-buttons">
          <a href="#install" className="btn btn-primary">
            Install Free Extension
          </a>
          <a href="#demo" className="btn btn-secondary">
            Watch Demo
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Feature Card

```jsx
// src/components/FeatureCard.jsx
export function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

## SEO

### Meta Tags

```html
<head>
  <title>ChatFocus - Enhance Your AI Chat Experience</title>
  <meta name="description" content="ChatFocus adds powerful features to ChatGPT, Claude, and Gemini. Fold messages, search conversations, and focus on code.">
  <meta name="keywords" content="ChatGPT, Claude, Gemini, AI, extension, productivity">

  <!-- Open Graph -->
  <meta property="og:title" content="ChatFocus">
  <meta property="og:description" content="Enhance your AI chat experience">
  <meta property="og:image" content="/og-image.png">
  <meta property="og:url" content="https://chatfocus.com">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ChatFocus">
  <meta name="twitter:description" content="Enhance your AI chat experience">
  <meta name="twitter:image" content="/twitter-image.png">
</head>
```

## Analytics

### Planned Integrations

- **Google Analytics**: User tracking
- **PostHog**: Product analytics
- **Hotjar**: User behavior
- **Mixpanel**: Event tracking

## Deployment

### Landing Page

```bash
# Vercel (recommended for Next.js)
vercel deploy

# Netlify
netlify deploy --prod

# Cloudflare Pages
wrangler pages publish dist
```

### Dashboard

```bash
# Same as landing page
# Can be same or separate deployment
```

## Status

🚧 **Not yet implemented** - Structure ready for development

## Next Steps

When ready to build web app:
1. Choose framework (Next.js recommended)
2. Set up project structure
3. Design components
4. Implement landing page
5. Build dashboard
6. Create auth flows
7. Deploy to production

## Questions?

See main documentation in `/docs/`
