import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface NearbyUser {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  location: string | null;
  distance_km: number;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocalização não suportada pelo navegador' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setState({ latitude, longitude, error: null, loading: false });

        // Save to profile if user is logged in
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ latitude, longitude })
            .eq('id', user.id);

          if (error) {
            console.error('Error saving location:', error);
          } else {
            toast({
              title: "Localização atualizada",
              description: "A sua localização foi guardada com sucesso.",
            });
          }
        }
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido';
            break;
        }
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        toast({
          title: "Erro de localização",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [user, toast]);

  const fetchNearbyUsers = useCallback(async (radiusKm: number = 50) => {
    if (!state.latitude || !state.longitude) {
      return;
    }

    setLoadingNearby(true);
    try {
      const { data, error } = await supabase.rpc('get_nearby_users', {
        user_lat: state.latitude,
        user_lon: state.longitude,
        radius_km: radiusKm,
        max_results: 20,
      });

      if (error) throw error;

      // Filter out current user
      const filtered = (data || []).filter((u: NearbyUser) => u.id !== user?.id);
      setNearbyUsers(filtered);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    } finally {
      setLoadingNearby(false);
    }
  }, [state.latitude, state.longitude, user?.id]);

  // Auto-fetch nearby users when location changes
  useEffect(() => {
    if (state.latitude && state.longitude) {
      fetchNearbyUsers();
    }
  }, [state.latitude, state.longitude, fetchNearbyUsers]);

  return {
    ...state,
    nearbyUsers,
    loadingNearby,
    requestLocation,
    fetchNearbyUsers,
  };
};
