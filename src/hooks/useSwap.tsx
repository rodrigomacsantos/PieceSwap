import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMessages } from './useMessages';
import { Listing } from './useListings';

export const useSwap = () => {
  const [swipeableListings, setSwipeableListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { createConversation } = useMessages();

  const fetchSwipeableListings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get listings the user has already swiped on
      const { data: swipedData } = await supabase
        .from('swipe_actions')
        .select('listing_id')
        .eq('user_id', user.id);

      const swipedListingIds = swipedData?.map(s => s.listing_id) || [];

      // Get active listings that accept trades, excluding user's own
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('accepts_trades', true)
        .neq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter out already swiped listings
      const filteredListings = (data || []).filter(
        listing => !swipedListingIds.includes(listing.id)
      );

      // Fetch seller profiles
      const listingsWithSellers = await Promise.all(
        filteredListings.map(async (listing) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, rating')
            .eq('id', listing.user_id)
            .maybeSingle();
          
          return {
            ...listing,
            seller: profile,
          };
        })
      );

      setSwipeableListings(listingsWithSellers);
    } catch (error) {
      console.error('Error fetching swipeable listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordSwipe = async (listingId: string, action: 'like' | 'dislike') => {
    if (!user) return null;

    try {
      const { error } = await supabase
        .from('swipe_actions')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          action,
        });

      if (error) throw error;

      // If liked, check for match
      if (action === 'like') {
        return await checkForMatch(listingId);
      }

      return null;
    } catch (error) {
      console.error('Error recording swipe:', error);
      return null;
    }
  };

  const checkForMatch = async (likedListingId: string) => {
    if (!user) return null;

    try {
      // Get the owner of the listing we just liked
      const { data: likedListing } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', likedListingId)
        .single();

      if (!likedListing) return null;

      const otherUserId = likedListing.user_id;

      // Get our listings
      const { data: ourListings } = await supabase
        .from('listings')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('accepts_trades', true);

      if (!ourListings || ourListings.length === 0) return null;

      const ourListingIds = ourListings.map(l => l.id);

      // Check if the other user has liked any of our listings
      const { data: theirLikes } = await supabase
        .from('swipe_actions')
        .select('listing_id')
        .eq('user_id', otherUserId)
        .eq('action', 'like')
        .in('listing_id', ourListingIds);

      if (theirLikes && theirLikes.length > 0) {
        // It's a match! Create the match record
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .insert({
            user1_id: user.id,
            user2_id: otherUserId,
            listing1_id: theirLikes[0].listing_id, // Our listing they liked
            listing2_id: likedListingId, // Their listing we liked
          })
          .select()
          .single();

        if (matchError) {
          // Match might already exist
          console.log('Match creation error (might already exist):', matchError);
        } else if (match) {
          // Create a conversation for the match
          await createConversation(otherUserId, likedListingId, match.id);
          
          // Fetch the listing details for the match modal
          const { data: listingData } = await supabase
            .from('listings')
            .select('*')
            .eq('id', likedListingId)
            .single();

          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', otherUserId)
            .maybeSingle();
          
          return {
            match,
            listing: listingData ? { ...listingData, seller: profile } : null,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking for match:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchSwipeableListings();
  }, [user]);

  return {
    swipeableListings,
    loading,
    fetchSwipeableListings,
    recordSwipe,
  };
};
