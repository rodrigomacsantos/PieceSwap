import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  price_eur: number;
  started_at: string;
  expires_at: string | null;
}

interface DailySwipes {
  swipe_count: number;
  swipe_date: string;
}

interface DailySuperlikes {
  used_count: number;
  superlike_date: string;
}

const FREE_SWIPE_LIMIT = 20;
const PREMIUM_SUPERLIKE_LIMIT = 1;

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [dailySwipes, setDailySwipes] = useState<DailySwipes | null>(null);
  const [dailySuperlikes, setDailySuperlikes] = useState<DailySuperlikes | null>(null);
  const [loading, setLoading] = useState(true);

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active';
  const swipesRemaining = isPremium ? Infinity : FREE_SWIPE_LIMIT - (dailySwipes?.swipe_count || 0);
  const canSwipe = isPremium || swipesRemaining > 0;
  const superlikesRemaining = isPremium ? PREMIUM_SUPERLIKE_LIMIT - (dailySuperlikes?.used_count || 0) : 0;
  const canSuperlike = isPremium && superlikesRemaining > 0;

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchDailySwipes();
      fetchDailySuperlikes();
    } else {
      setSubscription(null);
      setDailySwipes(null);
      setDailySuperlikes(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setSubscription(data as Subscription);
    }
    setLoading(false);
  };

  const fetchDailySwipes = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_swipes')
      .select('*')
      .eq('user_id', user.id)
      .eq('swipe_date', today)
      .maybeSingle();

    if (!error && data) {
      setDailySwipes(data as DailySwipes);
    }
  };

  const fetchDailySuperlikes = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_superlikes')
      .select('*')
      .eq('user_id', user.id)
      .eq('superlike_date', today)
      .maybeSingle();

    if (!error && data) {
      setDailySuperlikes(data as DailySuperlikes);
    }
  };

  const recordSwipe = async () => {
    if (!user || !canSwipe) return false;

    const today = new Date().toISOString().split('T')[0];
    
    if (dailySwipes) {
      const { error } = await supabase
        .from('daily_swipes')
        .update({ swipe_count: dailySwipes.swipe_count + 1 })
        .eq('user_id', user.id)
        .eq('swipe_date', today);

      if (!error) {
        setDailySwipes({ ...dailySwipes, swipe_count: dailySwipes.swipe_count + 1 });
        return true;
      }
    } else {
      const { error } = await supabase
        .from('daily_swipes')
        .insert({ user_id: user.id, swipe_date: today, swipe_count: 1 });

      if (!error) {
        setDailySwipes({ swipe_date: today, swipe_count: 1 });
        return true;
      }
    }
    return false;
  };

  const useSuperlike = async (listingId: string) => {
    if (!user || !canSuperlike) return false;

    const today = new Date().toISOString().split('T')[0];

    // Record the superlike
    const { error: superlikeError } = await supabase
      .from('superlikes')
      .insert({ user_id: user.id, listing_id: listingId });

    if (superlikeError) return false;

    // Update daily count
    if (dailySuperlikes) {
      await supabase
        .from('daily_superlikes')
        .update({ used_count: dailySuperlikes.used_count + 1 })
        .eq('user_id', user.id)
        .eq('superlike_date', today);

      setDailySuperlikes({ ...dailySuperlikes, used_count: dailySuperlikes.used_count + 1 });
    } else {
      await supabase
        .from('daily_superlikes')
        .insert({ user_id: user.id, superlike_date: today, used_count: 1 });

      setDailySuperlikes({ superlike_date: today, used_count: 1 });
    }

    return true;
  };

  const subscribeToPremium = async () => {
    if (!user) return false;

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    if (subscription) {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          plan: 'premium', 
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .eq('user_id', user.id);

      if (!error) {
        await fetchSubscription();
        return true;
      }
    } else {
      const { error } = await supabase
        .from('subscriptions')
        .insert({ 
          user_id: user.id, 
          plan: 'premium', 
          status: 'active',
          expires_at: expiresAt.toISOString()
        });

      if (!error) {
        await fetchSubscription();
        return true;
      }
    }
    return false;
  };

  const cancelSubscription = async () => {
    if (!user || !subscription) return false;

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id);

    if (!error) {
      await fetchSubscription();
      return true;
    }
    return false;
  };

  return {
    subscription,
    isPremium,
    loading,
    swipesRemaining,
    canSwipe,
    superlikesRemaining,
    canSuperlike,
    recordSwipe,
    useSuperlike,
    subscribeToPremium,
    cancelSubscription,
    refetch: fetchSubscription,
  };
};
