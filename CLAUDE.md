# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular application (v16.2.3) that visualizes CodeWars activity in a GitHub-style activity graph. Users enter their CodeWars username and see their completed kata (coding challenges) displayed as a calendar heat map.

## Development Commands

### Development Server
```bash
npm start  # or ng serve
# Navigate to http://localhost:4200/
```

### Build
```bash
npm run build  # or ng build
# Build artifacts stored in docs/ directory (configured for GitHub Pages deployment)
```

### Testing
```bash
npm test  # or ng test
# Runs Karma with Jasmine in Chrome
```

### Watch Mode
```bash
npm run watch
# Builds in development mode with watch enabled
```

## Architecture

### Component Structure
The app uses a simple component hierarchy:
- **AppComponent** (root) - Main app container
- **HeaderComponent** - Displays user information fetched from CodeWars API (username, rank, honor points)
- **CalendarComponent** - Core feature; renders activity calendar and handles username input with debounced API calls

### Services
- **DataService** (`src/app/services/data.service.ts`) - Manages CodeWars API communication
  - `getKatas()`: Fetches completed challenges from `/api/v1/users/{username}/code-challenges/completed`
  - `getUserInfo()`: Fetches user profile from `/api/v1/users/{username}`
- **UserNameStorageService** (`src/app/services/user-name-storage.service.ts`) - Handles username persistence in localStorage

### Data Flow Pattern
CalendarComponent demonstrates the key data flow:
1. User input is debounced (1000ms) using RxJS `fromEvent` and `debounceTime`
2. Username saved to localStorage via UserNameStorageService
3. API calls made through DataService using `switchMap` to cancel in-flight requests
4. Kata data is grouped by year and transformed into calendar day objects
5. Each day object tracks completed kata for that date

### Memory Management
Components use `takeUntilDestroyed(destroyRef)` operator with Angular's DestroyRef for automatic subscription cleanup. This is the modern approach replacing OnDestroy manual unsubscription.

### Data Transformation Logic
CalendarComponent's `setData()` method:
- Groups kata by year using Map
- Generates all days for each year via `getDaysInYear()`
- Handles edge case where year doesn't start on Monday (stores in `beforeMonday` array)
- Associates completed kata with specific dates

## Important Notes

- Build output goes to `docs/` directory (configured in angular.json) for GitHub Pages hosting
- Styles use SCSS (configured in angular.json schematics)
- Environment files: `environment.ts` (dev) and `environment.prod.ts` (production)
- No routing configured - single page application
- External API dependency: CodeWars API v1 (no authentication required for public user data)
