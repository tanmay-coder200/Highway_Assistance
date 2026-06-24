import { useState, useEffect } from 'react';
import { Provider, ServiceType } from '../types';
import { providers as mockProviders } from '../data/providers';
import { supabase } from '../lib/supabase';
import { calculateDistance, calculateEta } from '../lib/distance';

const MAX_RADIUS_KM = 10;

function enrichProviders(
  rawProviders: Provider[],
  userLat: number | null,
  userLon: number | null
): Provider[] {
  return rawProviders
    .map((p) => {
      if (userLat === null || userLon === null) return p;
      const dist = calculateDistance(userLat, userLon, p.latitude, p.longitude);
      return {
        ...p,
        calculatedDistance: dist,
        calculatedEta: calculateEta(dist),
      };
    })
    .filter((p) =>
      userLat === null || p.calculatedDistance === undefined || p.calculatedDistance <= MAX_RADIUS_KM
    )
    .sort((a, b) => (a.calculatedDistance ?? 999) - (b.calculatedDistance ?? 999));
}

export function useProviders(
  serviceType: ServiceType,
  userLat: number | null,
  userLon: number | null
) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProviders() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .contains('services', [serviceType]);

        if (error || !data) throw error;

        if (!cancelled) {
          const mapped: Provider[] = data.map((row) => ({
            id: row.id,
            name: row.name,
            services: row.services as ServiceType[],
            latitude: row.latitude,
            longitude: row.longitude,
            isOpen: row.is_open,
            verified: row.verified,
            phone: row.phone,
          }));
          setProviders(enrichProviders(mapped, userLat, userLon));
        }
      } catch {
        if (!cancelled) {
          const fallback = mockProviders.filter((p) => p.services.includes(serviceType));
          setProviders(enrichProviders(fallback, userLat, userLon));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProviders();
    return () => { cancelled = true; };
  }, [serviceType, userLat, userLon]);

  return { providers, loading };
}
