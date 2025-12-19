-- supabase/migrations/20251219161000_create_handle_swipe_function.sql

-- This migration creates the `handle_swipe` RPC function.
--
-- This function is the core of the matching logic. It is called from the frontend
-- whenever a user swipes on a listing.
--
-- Parameters:
-- - `listing_id_swiped_on`: The UUID of the listing that was swiped.
-- - `swipe_direction`: The direction of the swipe ('left' or 'right').
--
-- Logic:
-- 1. It identifies the current user (`current_user_id`) and the owner of the swiped listing (`listing_owner_id`).
-- 2. It prevents a user from swiping on their own listing.
-- 3. It records the swipe in the `swipes` table. If a swipe on this listing already exists, it updates the direction.
-- 4. If the swipe is a 'right' swipe, it checks for a mutual swipe from the other user.
-- 5. If a mutual right swipe is found, it creates a new record in the `matches` table.
-- 6. It returns a JSON object indicating whether a match occurred (`"match": true/false`).

CREATE OR REPLACE FUNCTION handle_swipe(listing_id_swiped_on uuid, swipe_direction text)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    current_user_id uuid := auth.uid();
    listing_owner_id uuid;
    reciprocal_swipe RECORD;
    match_found boolean := false;
    new_match_id bigint;
BEGIN
    -- Get the owner of the listing being swiped on
    SELECT user_id INTO listing_owner_id FROM public.listings WHERE id = listing_id_swiped_on;

    -- A user cannot swipe on their own listing
    IF current_user_id = listing_owner_id THEN
        RETURN json_build_object('match', false, 'error', 'Cannot swipe on your own listing');
    END IF;

    -- Insert the new swipe record, or update the direction if it already exists
    INSERT INTO public.swipes (swiper_id, listing_id, direction)
    VALUES (current_user_id, listing_id_swiped_on, swipe_direction)
    ON CONFLICT (swiper_id, listing_id) DO UPDATE SET direction = excluded.direction;

    -- If it's a right swipe, check for a match
    IF swipe_direction = 'right' THEN
        -- Check if the other user has swiped right on any of the current user's active listings
        SELECT s.id as swipe_id, s.listing_id as swiper_listing_id
        INTO reciprocal_swipe
        FROM public.swipes s
        JOIN public.listings l ON s.listing_id = l.id
        WHERE s.swiper_id = listing_owner_id -- The other user...
        AND l.user_id = current_user_id   -- ...swiped on one of my listings...
        AND l.status = 'active'           -- ...that is currently active...
        AND s.direction = 'right'         -- ...and they swiped right.
        LIMIT 1;

        -- If a reciprocal swipe is found, we have a match!
        IF reciprocal_swipe IS NOT NULL THEN
            -- Insert into the matches table, handling potential duplicates
            INSERT INTO public.matches (user1_id, user2_id, listing1_id, listing2_id)
            VALUES (current_user_id, listing_owner_id, reciprocal_swipe.swiper_listing_id, listing_id_swiped_on)
            ON CONFLICT (user1_id, user2_id, listing1_id, listing2_id) DO NOTHING
            RETURNING id INTO new_match_id;

            INSERT INTO public.matches (user1_id, user2_id, listing1_id, listing2_id)
            VALUES (listing_owner_id, current_user_id, listing_id_swiped_on, reciprocal_swipe.swiper_listing_id)
            ON CONFLICT (user1_id, user2_id, listing1_id, listing2_id) DO NOTHING;

            -- If the insert created a new row, return the match details
            IF new_match_id IS NOT NULL THEN
              RETURN json_build_object('match', true, 'new_match_id', new_match_id);
            ELSE
              -- It was a duplicate match that already existed.
              -- Still, signal a match to the UI as the user's action completed the pair.
              RETURN json_build_object('match', true, 'new_match_id', null, 'note', 'Match already exists');
            END IF;
        END IF;
    END IF;

    -- If no match was found, return a standard response
    RETURN json_build_object('match', false);
END;
$$;
