# Requirements Document

## Introduction

Complete the Turbo Aid highway assistance app — a mobile-friendly React/TypeScript/Tailwind web app that helps stranded motorists find nearby roadside assistance. The app already has a basic shell (Home, Service Selection, Provider List screens) but several features are incomplete or missing.

## Glossary

- **App**: The Turbo Aid React web application
- **Provider**: A roadside assistance business (towing, fuel, tyre repair, etc.)
- **User**: A motorist who is stranded and needs help
- **ServiceType**: One of: tyre-puncture, fuel-assistance, battery-jumpstart, towing, mechanical-help
- **Geolocation**: The browser's GPS/location API result
- **Reverse_Geocoder**: A service that converts lat/lng coordinates into a human-readable address
- **Supabase**: The backend-as-a-service platform used for storing provider data
- **Confirmation_Screen**: A screen shown after the user initiates contact with a provider

## Requirements

### Requirement 1: Install Dependencies and Verify Build

**User Story:** As a developer, I want the project to install and run successfully, so that I can verify the app works before making changes.

#### Acceptance Criteria

1. WHEN `npm install` is run in the project directory, THE App SHALL install all dependencies without errors
2. WHEN `npm run build` is run, THE App SHALL compile without TypeScript or build errors
3. WHEN `npm run typecheck` is run, THE App SHALL pass all type checks

---

### Requirement 2: Real Address via Reverse Geocoding

**User Story:** As a user, I want to see my actual road/location name on the home screen, so that I know my GPS has detected the right place.

#### Acceptance Criteria

1. WHEN the browser grants geolocation permission, THE App SHALL call a free reverse geocoding API (Nominatim/OpenStreetMap) to convert lat/lng to a readable address
2. WHEN the reverse geocoding succeeds, THE App SHALL display the street/road name or nearest locality
3. WHEN the reverse geocoding fails or times out, THE App SHALL display "Location detected" as a fallback
4. THE App SHALL pass the detected address string to the ProviderList screen as the `userLocation` prop (replacing the hardcoded `"Highway location"`)

---

### Requirement 3: Supabase Backend for Providers

**User Story:** As a developer, I want providers to be stored in Supabase, so that the data can be managed and updated without redeploying the app.

#### Acceptance Criteria

1. THE App SHALL create a Supabase client using environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. WHEN the ProviderList screen loads, THE App SHALL fetch providers from a Supabase `providers` table
3. WHILE providers are loading, THE App SHALL display a loading spinner
4. IF the Supabase fetch fails, THE App SHALL fall back to the local static mock providers data
5. THE App SHALL export a SQL schema file for creating the `providers` table in Supabase

---

### Requirement 4: Confirmation Screen After Contact

**User Story:** As a user, I want to see a confirmation screen after I call or WhatsApp a provider, so that I know my request has been noted and I have the provider's details at hand.

#### Acceptance Criteria

1. WHEN a user taps "Call" or "WhatsApp" on a provider, THE App SHALL navigate to a Confirmation screen
2. THE Confirmation_Screen SHALL display the provider name, service type, ETA, and distance
3. THE Confirmation_Screen SHALL show a "Call Again" button that re-initiates the phone call
4. THE Confirmation_Screen SHALL show a "WhatsApp Again" button that re-opens WhatsApp
5. THE Confirmation_Screen SHALL show a "Back to Providers" button to return to the provider list
6. THE Confirmation_Screen SHALL show a "Start Over" button to return to the home screen

---

### Requirement 5: UI Polish and Empty/Error States

**User Story:** As a user, I want the app to handle all edge cases gracefully, so that I always know what's happening.

#### Acceptance Criteria

1. WHEN no providers are found for a service, THE App SHALL display a friendly empty state with a suggestion to try another service
2. WHEN the app is offline, THE App SHALL display the offline banner and use cached/mock provider data
3. THE App SHALL be fully responsive and usable on mobile screen sizes (min 320px width)
4. THE App SHALL show a loading state on the ProviderList while data is being fetched
