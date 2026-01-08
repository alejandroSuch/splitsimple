# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions workflow for automatic cleanup of old groups (30+ days inactive)
- Node.js script `scripts/cleanup-groups.js` for automated group deletion using Firebase Admin SDK
- Scheduled weekly cleanup job running on Sundays at 2 AM UTC
- Telegram Bot notifications on cleanup completion (success or failure)
- Detailed logging of deleted groups and expenses
- Comprehensive documentation in `scripts/README.md` with Telegram setup guide
- `CHANGELOG.md` for tracking project changes
- Inline documentation in workflow file for easy Telegram Bot configuration

### Changed
- Group cleanup period reduced from 90 days to 30 days of inactivity
- Added `cleanup` script to package.json for manual execution

## [1.0.0] - 2026-01-07

### Added
- Complete SplitSimple application for expense sharing
- Google Authentication via Firebase Auth
- One active group per registered user
- Share groups via unique links
- Real-time expense management (add/edit/delete) for anyone with the link
- Automatic balance calculation (who owes whom)
- Optimized greedy algorithm for minimum transactions
- Auto-deletion system for groups (90 days - not yet triggered automatically)
- HashRouter for GitHub Pages compatibility
- Responsive modern UI with gradients and animations
- GitHub Actions for automatic deployment to GitHub Pages

#### Components
- **Auth**: Login page with Google OAuth, Protected routes
- **Dashboard**: User dashboard, Create group functionality
- **Group**: Group view, Expense form, Expense list, Balance calculations
- **Layout**: Header with user info, Share link component with copy functionality

#### Services
- **Firebase**: Firestore database and Authentication setup
- **Auth Service**: Google sign-in, sign-out, auth state management
- **Expenses Service**: CRUD operations for groups and expenses, cleanup function
- **Balance Calculator**: Smart algorithm for optimal debt settlement

#### Infrastructure
- Firebase Firestore for database
- Firebase Authentication for user management
- GitHub Pages hosting
- GitHub Actions CI/CD pipeline
- Vite build system
- React 19 with React Router

#### Documentation
- README.md with complete project documentation
- FIREBASE_SETUP.md with step-by-step Firebase configuration guide
- ROUTING_SOLUTION.md explaining HashRouter implementation for GitHub Pages
- NEXT_STEPS.md with deployment and configuration instructions
- IMPLEMENTATION_PLAN.md with original project planning
- firestore.rules with security rules

#### Features Detail
- **Shared Groups**: Anyone with the link can add/edit/delete expenses without login
- **Real-time Updates**: Firestore real-time listeners for instant synchronization
- **Balance Display**:
  - Total expenses and per-person share
  - Individual balance (positive = owed, negative = owes)
  - Optimized transaction list for settling debts
- **Currency Formatting**: Configurable (default: EUR)
- **Activity Tracking**: `lastActivity` timestamp updated on every expense operation
- **Group Management**: Create, close (for owners), auto-share link generation

#### Security
- Firestore security rules restricting user document access
- Public read/write for groups and expenses (by design for sharing)
- Firebase API keys properly managed via GitHub Secrets
- No sensitive data in repository

#### UI/UX Features
- Clean, modern design with purple gradient theme
- Google-style login button
- Responsive layout for mobile and desktop
- Loading states and error handling
- Copy-to-clipboard for share links
- Feature highlights on login page
- Empty states with helpful hints

### Technical Decisions
- **HashRouter**: Chosen over BrowserRouter for GitHub Pages compatibility (no 404 on refresh)
- **Firebase Spark Plan**: Free tier suitable for small-scale usage
- **No Backend**: Serverless architecture using Firebase
- **Client-Side**: React SPA with real-time Firestore

### Developer Experience
- Vite for fast development and builds
- Modern React with hooks
- ESM modules
- Clean folder structure
- Comprehensive documentation

---

## Version History

- **v1.0.0** (2026-01-07): Initial release with full feature set
- **Unreleased**: Automatic cleanup system with GitHub Actions

---

## Links

- [Repository](https://github.com/alejandroSuch/splitsimple)
- [Live Demo](https://alejandroSuch.github.io/splitsimple)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Routing Documentation](./ROUTING_SOLUTION.md)
