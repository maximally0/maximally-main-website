# YouTube-Style Loading Bar Feature

## Overview
A sleek, YouTube-style loading bar has been added to the top of the website in Maximally's signature red color (#E50914). The loading bar provides visual feedback during:

1. **Page Navigation** - Shows progress when navigating between routes
2. **Authentication** - Displays while loading user profile from Supabase
3. **API Calls** - Tracks React Query fetching and mutation states
4. **Data Loading** - Any async operations tracked by React Query

## Implementation Details

### Files Created/Modified

1. **`client/src/components/LoadingBar.tsx`** (NEW)
   - Main loading bar component
   - Tracks route changes via React Router
   - Monitors auth loading state
   - Integrates with React Query for API call tracking
   - Uses Maximally red color with glow effect

2. **`client/src/App.tsx`** (MODIFIED)
   - Added LoadingBar component import
   - Created AppContent wrapper to access auth context
   - Integrated loading bar at the top of the app

### Features

- **Smooth Animations**: CSS transitions for fluid progress
- **Smart Progress**: Gradually increases to 90% while loading, completes to 100% when done
- **Multiple Triggers**: Responds to route changes, auth state, and API calls
- **Non-blocking**: Fixed position at top, doesn't affect layout
- **High z-index**: Always visible above other content (z-index: 9999)
- **Glow Effect**: Red shadow for enhanced visibility

### Technical Details

```typescript
// The loading bar tracks:
- Route changes (via useLocation from react-router-dom)
- Auth loading state (via useAuth context)
- React Query fetching (via useIsFetching)
- React Query mutations (via useIsMutating)
```

### Styling

- Height: 1px (4px in Tailwind)
- Color: #E50914 (Maximally red)
- Shadow: 0 0 10px rgba(229, 9, 20, 0.5)
- Position: Fixed at top
- Transition: 300ms ease-out

## Usage

The loading bar works automatically - no additional configuration needed. It will:

1. Show when navigating between pages
2. Display during login/signup operations
3. Appear during profile data loading
4. Track any React Query API calls

## Future Enhancements

Potential improvements:
- Add configuration for custom colors per route
- Expose progress control API for manual triggering
- Add different animation styles
- Support for multiple concurrent operations
