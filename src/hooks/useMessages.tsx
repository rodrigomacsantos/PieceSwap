import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { z } from 'zod';

const messageSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty").max(5000, "Message must be less than 5000 characters"),
});

export interface ConversationParticipant {
  user_id: string;
  profile?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface Conversation {
  id: string;
  match_id: string | null;
  listing_id: string | null;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  lastMessage?: Message | null;
  listing?: {
    title: string;
    images: string[];
  } | null;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) throw participantError;

      if (!participantData || participantData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participantData.map(p => p.conversation_id);

      // Get full conversation data
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // Get participants and additional data for each conversation
      const conversationsWithData = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Get other participants
          const { data: participantsData } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id);

          // Get profiles for participants
          const participants: ConversationParticipant[] = await Promise.all(
            (participantsData || []).map(async (p) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, full_name, avatar_url')
                .eq('id', p.user_id)
                .maybeSingle();
              
              return {
                user_id: p.user_id,
                profile,
              };
            })
          );

          // Get last message
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          // Get listing info if available
          let listing = null;
          if (conv.listing_id) {
            const { data: listingData } = await supabase
              .from('listings')
              .select('title, images')
              .eq('id', conv.listing_id)
              .maybeSingle();
            listing = listingData;
          }

          return {
            ...conv,
            participants,
            lastMessage: messages?.[0] || null,
            unreadCount: unreadCount || 0,
            listing,
          };
        })
      );

      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) return null;

    try {
      // Validate message content
      const validationResult = messageSchema.safeParse({ content });
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0]?.message || 'Invalid message');
      }

      const validatedContent = validationResult.data.content;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: validatedContent,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Log generic error without exposing details
      console.error('Failed to send message');
      return null;
    }
  };

  const createConversation = async (otherUserId: string, listingId?: string, matchId?: string) => {
    if (!user) return null;

    try {
      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          match_id: matchId,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: otherUserId },
        ]);

      if (partError) throw partError;

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead,
  };
};
