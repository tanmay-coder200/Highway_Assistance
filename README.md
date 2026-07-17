# Turbo Aid — Highway Assistance App

A mobile-first roadside assistance web app built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**. It helps stranded motorists find and contact the nearest service providers in real time.

---

## Live Demo

> Run locally with `npm run dev` → open [http://localhost:5173](http://localhost:5173)

---

## Features

- Real-time GPS location detection with reverse geocoding
- Live distance calculation using the Haversine formula
- Dynamic ETA estimation based on distance
- Providers fetched from Supabase with offline fallback
- Call and WhatsApp contact with a confirmation screen
- Offline mode banner
- Mobile responsive UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Build | Vite |
| Geocoding | OpenStreetMap Nominatim API |

---

## Project Structure

```
src/
├── components/
│   ├── HomeScreen.tsx          # Landing screen with GPS status
│   ├── ServiceSelection.tsx    # Service type picker
│   ├── ProviderList.tsx        # Live provider list with distances
│   └── ConfirmationScreen.tsx  # Post-contact confirmation
├── hooks/
│   ├── useGeolocation.ts       # Browser GPS + reverse geocoding
│   ├── useProviders.ts         # Supabase fetch + distance enrichment
│   └── useOnlineStatus.ts      # Network connectivity detection
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   └── distance.ts             # Haversine + ETA utilities
├── data/
│   └── providers.ts            # Local mock provider data (fallback)
├── types.ts                    # Shared TypeScript interfaces
└── App.tsx                     # Root component + screen routing
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/tanmay-coder200/Highway_Assistance.git
cd Highway_Assistance
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up Supabase database

Run the SQL in `supabase-schema.sql` inside your Supabase SQL Editor. This creates the `providers` table, enables Row Level Security, and seeds the initial provider data.

### 4. Run locally

```bash
npm run dev
```

---

## Functions Explained

### `useGeolocation` — `src/hooks/useGeolocation.ts`

Handles browser GPS detection and converts raw coordinates into a readable address.

- Calls `navigator.geolocation.getCurrentPosition()` on mount
- On success, passes the latitude and longitude to `reverseGeocode()`
- `reverseGeocode()` hits the free **Nominatim OpenStreetMap API** with the coordinates and builds a human-readable string from fields like `road`, `suburb`, `city`, and `state`
- Returns `{ location, status, error }` — status is one of `detecting`, `detected`, or `error`
- Falls back to `"Location detected"` string if the geocoding API fails or times out

---

### `useOnlineStatus` — `src/hooks/useOnlineStatus.ts`

Tracks whether the user's device has an active internet connection.

- Reads `navigator.onLine` as the initial value
- Listens to browser `online` and `offline` events
- Returns a boolean `isOnline` — used in `App.tsx` to show the offline warning banner

---

### `useProviders` — `src/hooks/useProviders.ts`

Fetches service providers and enriches them with live distance and ETA.

- Accepts `serviceType`, `userLat`, and `userLon` as parameters
- Queries the Supabase `providers` table, filtering by service type using `.contains('services', [serviceType])`
- Maps Supabase rows (snake_case) to the app's `Provider` interface (camelCase)
- Passes fetched providers through `enrichProviders()` which:
  - Calls `calculateDistance()` for each provider using user coordinates
  - Calls `calculateEta()` to estimate arrival time
  - Filters out providers more than **10 km** away
  - Sorts remaining providers by distance (closest first)
- If the Supabase fetch fails for any reason, it falls back to local mock data from `providers.ts` and enriches that instead
- Returns `{ providers, loading }`

---

### `calculateDistance` — `src/lib/distance.ts`

Calculates the real-world distance in kilometers between two GPS coordinates using the **Haversine formula**.

```
R = 6371 (Earth's radius in km)
dLat = (lat2 - lat1) in radians
dLon = (lon2 - lon1) in radians

a = sin²(dLat/2) + cos(lat1) × cos(lat2) × sin²(dLon/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c
```

- Takes `lat1, lon1` (user) and `lat2, lon2` (provider)
- Returns distance rounded to 1 decimal place (e.g. `2.4`)

---

### `calculateEta` — `src/lib/distance.ts`

Estimates arrival time in minutes based on distance.

- Assumes an average highway service speed of **40 km/h**
- Formula: `eta = (distance / 40) × 60`
- Returns a minimum of 1 minute to avoid showing 0
- Example: 2 km → 3 min, 8 km → 12 min

---

### `HomeScreen` — `src/components/HomeScreen.tsx`

The landing screen users see when they open the app.

- Uses `useGeolocation` to show GPS detection status with animated icons
- Shows a spinner while detecting, a pin icon when detected, and a warning icon on error
- Displays the real address once GPS resolves (e.g. `NH 48, Vadodara, Gujarat`)
- Has a large "I NEED HELP" button that navigates to service selection

---

### `ServiceSelection` — `src/components/ServiceSelection.tsx`

A grid of service type buttons the user picks from.

- Lists 5 services: Tyre Puncture, Fuel Assistance, Battery Jumpstart, Towing, General Mechanical Help
- Each button passes its `ServiceType` ID up to `App.tsx` via `onSelectService`

---

### `ProviderList` — `src/components/ProviderList.tsx`

Displays nearby providers for the selected service with live distance and ETA.

- Calls `useProviders(serviceType, userLat, userLon)` to get enriched provider list
- Shows a loading spinner while fetching
- Shows a friendly empty state with "Try another service" if no providers are within 10 km
- Shows a yellow banner if location permission was denied (distance shows as "Location permission denied")
- Each provider card shows: name, verified badge, live distance, estimated ETA, open/closed status
- Call button triggers `tel:` protocol directly
- WhatsApp button opens `wa.me` with a pre-filled message including the user's address and service type
- Both buttons also call `onContact()` to navigate to the confirmation screen

---

### `ConfirmationScreen` — `src/components/ConfirmationScreen.tsx`

Shown after the user contacts a provider via call or WhatsApp.

- Displays a success checkmark with the contact method used
- Shows provider name, verified badge, live distance, ETA, service type, and user's address
- "Call Again" re-initiates the phone call
- "WhatsApp Again" re-opens the WhatsApp message
- "Back to Providers" returns to the provider list
- "Start Over" takes the user back to the home screen

---

## Database Schema

```sql
create table providers (
  id          text primary key,
  name        text not null,
  services    text[] not null,      -- e.g. ['tyre-puncture', 'towing']
  latitude    decimal(10,8) not null,
  longitude   decimal(11,8) not null,
  is_open     boolean not null,
  verified    boolean not null,
  phone       text not null,
  created_at  timestamptz default now()
);
```

Row Level Security is enabled with a public read policy. Write access requires the service role key (not exposed in the frontend).

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

> Never commit your `.env` file. It is already listed in `.gitignore`.
