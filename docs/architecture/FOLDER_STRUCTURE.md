# ChatFocus - Folder Structure

## Overview
This document outlines the production-ready folder structure for ChatFocus, designed to support:
- Multi-site implementations (ChatGPT, Claude, Gemini, etc.)
- Full-stack application (extension + web + backend)
- Scalable development and maintenance

## Structure

```
chat-focus/
├── extension/                     # Browser Extension Code
│   ├── manifest.json
│   ├── content/                   # Content Scripts
│   │   ├── core/                 # Core functionality
│   │   │   ├── config.js        # Configuration constants
│   │   │   ├── state.js         # State management
│   │   │   ├── utils.js         # Utility functions
│   │   │   └── icons.js         # SVG icon definitions
│   │   ├── features/             # Feature modules
│   │   │   ├── message-folding/
│   │   │   │   ├── folding.js          # Message folding logic
│   │   │   │   └── processing.js       # Message processing
│   │   │   ├── table-of-contents/
│   │   │   │   ├── toc.js             # TOC main logic
│   │   │   │   ├── search.js          # TOC search functionality
│   │   │   │   └── highlighting.js     # Search highlighting
│   │   │   ├── controls/
│   │   │   │   ├── floating-controls.js # Floating control buttons
│   │   │   │   └── actions.js          # Control actions
│   │   │   └── code-mode/
│   │   │       └── code-mode.js        # Code-only mode
│   │   ├── sites/                # Site-specific adapters
│   │   │   ├── chatgpt/
│   │   │   │   ├── selectors.js       # ChatGPT-specific selectors
│   │   │   │   ├── adapter.js         # ChatGPT adapter
│   │   │   │   └── styles.css         # ChatGPT-specific styles
│   │   │   ├── claude/
│   │   │   │   ├── selectors.js
│   │   │   │   ├── adapter.js
│   │   │   │   └── styles.css
│   │   │   └── gemini/
│   │   │       ├── selectors.js
│   │   │       ├── adapter.js
│   │   │       └── styles.css
│   │   ├── storage/              # Storage management
│   │   │   └── settings.js       # Settings persistence
│   │   ├── main.js               # Main initialization
│   │   └── index.js              # Entry point
│   ├── popup/                    # Extension Popup
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   ├── options/                  # Extension Options/Settings
│   │   ├── options.html
│   │   ├── options.js
│   │   └── options.css
│   ├── background/               # Background Scripts
│   │   └── background.js
│   ├── shared/                   # Shared extension code
│   │   ├── constants.js
│   │   └── utils.js
│   ├── assets/                   # Static assets
│   │   └── icons/                # Extension icons
│   └── styles/                   # Stylesheets
│       ├── base.css              # Base styles
│       ├── components/           # Component styles
│       │   ├── message-folding.css
│       │   ├── toc.css
│       │   ├── controls.css
│       │   └── code-mode.css
│       └── themes/               # Theme files
│           ├── light.css
│           └── dark.css
│
├── web/                          # Web Application
│   ├── landing/                  # Landing Page
│   │   ├── public/               # Public assets
│   │   ├── src/
│   │   │   ├── components/       # React/Vue components
│   │   │   ├── pages/            # Page components
│   │   │   └── styles/           # Styling
│   │   └── package.json
│   ├── dashboard/                # User Dashboard
│   │   └── (similar structure)
│   └── auth/                     # Authentication Pages
│       └── (login, signup, etc.)
│
├── backend/                      # Backend API
│   ├── api/                      # API Layer
│   │   ├── routes/               # Route definitions
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   └── subscriptions.js
│   │   ├── controllers/          # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── subscriptionController.js
│   │   └── middleware/           # Middleware
│   │       ├── auth.js
│   │       ├── validation.js
│   │       └── errorHandler.js
│   ├── services/                 # Business Logic
│   │   ├── auth/                 # Auth service
│   │   │   ├── jwt.js
│   │   │   └── oauth.js
│   │   ├── stripe/               # Stripe integration
│   │   │   ├── payments.js
│   │   │   └── subscriptions.js
│   │   └── user/                 # User service
│   │       └── userService.js
│   ├── database/                 # Database Layer
│   │   ├── models/               # Data models
│   │   │   ├── User.js
│   │   │   └── Subscription.js
│   │   ├── migrations/           # DB migrations
│   │   └── seeds/                # Seed data
│   └── config/                   # Configuration
│       ├── database.js
│       ├── stripe.js
│       └── environment.js
│
├── shared/                       # Shared Code (monorepo)
│   ├── types/                    # TypeScript types/interfaces
│   │   ├── user.ts
│   │   └── subscription.ts
│   └── utils/                    # Shared utilities
│       └── validation.js
│
└── docs/                         # Documentation
    ├── architecture/             # Architecture docs
    │   ├── FOLDER_STRUCTURE.md  # This file
    │   ├── MULTI_SITE.md        # Multi-site architecture
    │   └── STATE_MANAGEMENT.md  # State management
    ├── api/                      # API documentation
    │   └── endpoints.md
    └── development/              # Development guides
        ├── SETUP.md
        ├── CONTRIBUTING.md
        └── SITE_ADAPTER_GUIDE.md
```

## File Organization Principles

### 1. Separation of Concerns
- Each module has a single responsibility
- Features are self-contained
- Site-specific code is isolated

### 2. Scalability
- Easy to add new sites (just add a new adapter)
- Easy to add new features (just add a new feature module)
- Clear separation between extension, web, and backend

### 3. Maintainability
- Small, focused files (<300 lines)
- Clear module boundaries
- Consistent naming conventions

### 4. Modularity
- ES6 modules for better tree-shaking
- Shared code is properly extracted
- No circular dependencies

## Key Design Patterns

### Site Adapter Pattern
Each site (ChatGPT, Claude, Gemini) has its own adapter that implements:
- `selectors`: Site-specific DOM selectors
- `adapter`: Site-specific behavior overrides
- `styles`: Site-specific styling

### Feature Module Pattern
Each feature is self-contained with:
- Core logic
- UI components
- State management (if needed)

### Storage Abstraction
All chrome.storage interactions go through the storage module for:
- Consistency
- Easy testing
- Potential migration to other storage mechanisms

## Migration Path

To migrate from the current structure:
1. Features are extracted from content.js into feature modules
2. Styles are split into component-specific files
3. Site-specific code is isolated into adapters
4. Main entry point coordinates everything

## Future Additions

### When adding a new site:
1. Create folder: `extension/content/sites/{site-name}/`
2. Add: `selectors.js`, `adapter.js`, `styles.css`
3. Register in main initialization

### When adding a new feature:
1. Create folder: `extension/content/features/{feature-name}/`
2. Add feature module files
3. Add corresponding styles in `extension/styles/components/`
4. Import and register in main.js

### When adding backend functionality:
1. Add routes in `backend/api/routes/`
2. Add controllers in `backend/api/controllers/`
3. Add services in `backend/services/`
4. Add models in `backend/database/models/`

## Notes

- This structure supports both monorepo and separate repos
- TypeScript can be added incrementally
- Testing structure can mirror the source structure
- CI/CD can be configured per directory
