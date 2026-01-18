# ChatFocus Backend

## Overview

This directory will contain the backend API and services for ChatFocus when transitioning to a full SaaS product.

## Planned Structure

```
backend/
├── api/                      # API Layer
│   ├── routes/              # Route definitions
│   │   ├── auth.js         # Auth endpoints
│   │   ├── users.js        # User management
│   │   ├── subscriptions.js # Subscription management
│   │   └── sync.js         # Settings sync
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── subscriptionController.js
│   └── middleware/          # Middleware
│       ├── auth.js         # Authentication middleware
│       ├── validation.js   # Request validation
│       └── errorHandler.js # Error handling
├── services/                # Business Logic
│   ├── auth/               # Authentication service
│   │   ├── jwt.js         # JWT handling
│   │   ├── oauth.js       # OAuth providers
│   │   └── password.js    # Password management
│   ├── stripe/             # Stripe integration
│   │   ├── payments.js    # Payment processing
│   │   ├── subscriptions.js # Subscription management
│   │   └── webhooks.js    # Stripe webhooks
│   ├── user/               # User service
│   │   ├── userService.js # User CRUD
│   │   └── preferences.js # User preferences
│   └── sync/               # Settings sync service
│       └── syncService.js # Cross-device sync
├── database/                # Database Layer
│   ├── models/             # Data models (ORM)
│   │   ├── User.js        # User model
│   │   ├── Subscription.js # Subscription model
│   │   └── Settings.js    # Settings model
│   ├── migrations/         # Database migrations
│   │   └── 001_initial_schema.js
│   ├── seeds/              # Seed data (dev/test)
│   │   └── users.js
│   └── index.js           # Database connection
├── config/                  # Configuration
│   ├── database.js         # DB configuration
│   ├── stripe.js           # Stripe configuration
│   ├── jwt.js              # JWT configuration
│   └── environment.js      # Environment variables
├── tests/                   # Tests
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── scripts/                 # Utility scripts
│   ├── seed.js             # Seed database
│   └── migrate.js          # Run migrations
├── .env.example            # Environment template
├── package.json
└── server.js               # Entry point
```

## Planned Features

### Phase 1: User Management
- User registration and login
- OAuth integration (Google, GitHub)
- JWT authentication
- Password reset

### Phase 2: Subscription Management
- Stripe integration
- Subscription tiers (Free, Pro, Premium)
- Payment processing
- Webhook handling

### Phase 3: Settings Sync
- Cross-device settings sync
- Cloud backup of preferences
- Sync state across browsers

### Phase 4: Analytics
- Usage tracking
- Feature analytics
- Performance metrics

## Tech Stack

### Planned Technologies

**Framework**: Express.js or Fastify
- Fast, minimal, well-supported
- Large ecosystem
- Easy to scale

**Database**: PostgreSQL
- Robust, reliable
- Good for relational data
- Excellent JSON support

**ORM**: Prisma or Sequelize
- Type-safe queries
- Easy migrations
- Good developer experience

**Authentication**: JWT + Passport.js
- Industry standard
- Flexible
- Well-documented

**Payments**: Stripe
- Best developer experience
- Comprehensive API
- Webhooks for automation

**Deployment**: Docker + Cloud Run/Heroku/Railway
- Easy deployment
- Scalable
- Cost-effective

## API Endpoints (Planned)

### Authentication
```
POST   /api/auth/register       # Create account
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/forgot-password # Request reset
POST   /api/auth/reset-password  # Reset password
GET    /api/auth/oauth/:provider # OAuth login
```

### Users
```
GET    /api/users/me            # Get current user
PUT    /api/users/me            # Update profile
DELETE /api/users/me            # Delete account
GET    /api/users/me/settings   # Get settings
PUT    /api/users/me/settings   # Update settings
```

### Subscriptions
```
GET    /api/subscriptions       # Get subscription
POST   /api/subscriptions       # Create subscription
PUT    /api/subscriptions       # Update subscription
DELETE /api/subscriptions       # Cancel subscription
POST   /api/subscriptions/webhook # Stripe webhook
```

### Sync
```
GET    /api/sync/settings       # Get synced settings
PUT    /api/sync/settings       # Update synced settings
POST   /api/sync/push           # Push local settings
GET    /api/sync/pull           # Pull remote settings
```

## Database Schema (Planned)

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    tier VARCHAR(50), -- 'free', 'pro', 'premium'
    status VARCHAR(50), -- 'active', 'canceled', 'past_due'
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Settings Table
```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    settings JSONB, -- All extension settings
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/chatfocus

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email (optional)
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@chatfocus.com
```

## Development Workflow

### Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run migrate
npm run seed
npm run dev
```

### Running
```bash
npm run dev          # Start dev server
npm run test         # Run tests
npm run migrate      # Run migrations
npm run seed         # Seed database
npm run build        # Build for production
npm start            # Start production server
```

## Security Considerations

1. **Authentication**
   - Hash passwords with bcrypt (cost factor 12+)
   - Use secure JWT tokens
   - Implement rate limiting
   - Use HTTPS only

2. **Data Protection**
   - Encrypt sensitive data at rest
   - Use parameterized queries
   - Validate all inputs
   - Sanitize outputs

3. **API Security**
   - CORS configuration
   - API rate limiting
   - Request size limits
   - Authentication required for sensitive endpoints

## Monitoring & Logging

- **Error Tracking**: Sentry or similar
- **Logging**: Winston or Pino
- **Metrics**: Prometheus + Grafana
- **Uptime**: UptimeRobot or Pingdom

## Deployment

```bash
# Docker deployment
docker build -t chatfocus-backend .
docker run -p 3000:3000 chatfocus-backend

# Cloud deployment
git push heroku main
# or
railway up
```

## Status

🚧 **Not yet implemented** - Structure ready for development

## Next Steps

When ready to build backend:
1. Initialize Node.js project
2. Set up database
3. Implement authentication
4. Add Stripe integration
5. Build sync service
6. Deploy to cloud

## Questions?

See main documentation in `/docs/`
