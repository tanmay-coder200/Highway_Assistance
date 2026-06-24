import { useState, useEffect } from 'react';
import { Location } from '../types';

type GeolocationStatus = 'detecting' | 'detected' | 'error';

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) throw new Error('Geocode failed');
    const data = await res.json();
    const { road, suburb, city, town, village, state } = data.address || {};
    return [road, suburb || city || town || village, state]
      .filter(Boolean)
      .join(', ') || data.display_name || 'Location detected';
  } catch {
    return 'Location detected';
  }
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('detecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation not supported');
      return;
    }

    setStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setLocation({ latitude, longitude, address });
        setStatus('detected');
        setError(null);
      },
      (err) => {
        setStatus('error');
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { location, status, error };
}
