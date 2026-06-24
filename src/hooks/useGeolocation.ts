import { useState, useEffect } from 'react';
import { Location } from '../types';

type GeolocationStatus = 'detecting' | 'detected' | 'error';

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
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: 'Highway location detected',
        });
        setStatus('detected');
        setError(null);
      },
      (err) => {
        setStatus('error');
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { location, status, error };
}
