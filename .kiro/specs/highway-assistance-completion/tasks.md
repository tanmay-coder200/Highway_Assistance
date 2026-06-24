# Implementation Plan: Highway Assistance Completion

## Tasks

- [x] 1. Install dependencies and verify build
  - Run `npm install` in the Highway-assistance directory
  - Run `npm run typecheck` to confirm no type errors
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Fix reverse geocoding in useGeolocation hook
  - [x] 2.1 Update `useGeolocation.ts` to call Nominatim API after getting coordinates
    - Fetch `https://nominatim.openstreetmap.org/reverse?lat=X&lon=Y&format=json`
    - Set address from `display_name` or `road + city` fields
    - Fall back to "Location detected" on error/timeout
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 2.2 Pass real address from `useGeolocation` through `App.tsx` to `ProviderList`
    - Store `location.address` in App state
    - Replace hardcoded `"Highway location"` with real address
    - _Requirements: 2.4_

- [ ] 3. Set up Supabase client and environment variables
  - [x] 3.1 Create `src/lib/supabase.ts` with Supabase client using env vars
    - Use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
    - _Requirements: 3.1_
  - [ ] 3.2 Create `.env.example` file documenting required env vars
  - [ ] 3.3 Create `supabase-schema.sql` with the providers table DDL
    - _Requirements: 3.5_

- [ ] 4. Wire Supabase fetch into ProviderList
  - [x] 4.1 Create `src/hooks/useProviders.ts` hook that fetches from Supabase with mock fallback
    - Accept `serviceType` as parameter
    - Show loading state while fetching
    - Fall back to local mock data on error
    - _Requirements: 3.2, 3.3, 3.4_
  - [x] 4.2 Update `ProviderList.tsx` to use `useProviders` hook
    - Replace direct import of `providers` array with hook
    - Show loading spinner while fetching
    - _Requirements: 3.2, 3.3, 5.4_

- [ ] 5. Build Confirmation Screen
  - [ ] 5.1 Create `src/components/ConfirmationScreen.tsx`
    - Display provider name, service type, ETA, distance
    - "Call Again", "WhatsApp Again", "Back to Providers", "Start Over" buttons
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [-] 5.2 Add `confirmation` screen state and navigation to `App.tsx`
    - Add `selectedProvider` state
    - Navigate to confirmation after Call or WhatsApp action
    - Pass all required props to ConfirmationScreen
    - _Requirements: 4.1_

- [ ] 6. UI polish and edge case handling
  - [ ] 6.1 Improve empty state in `ProviderList.tsx`
    - Add icon and "Try a different service" suggestion
    - _Requirements: 5.1_
  - [ ] 6.2 Verify offline banner and mobile responsiveness
    - _Requirements: 5.2, 5.3_

- [ ] 7. Final checkpoint
  - Run `npm run typecheck` to confirm no type errors
  - Ensure all screens render without console errors
