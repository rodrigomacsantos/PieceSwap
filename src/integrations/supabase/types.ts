export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          listing_id: string | null
          match_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id?: string | null
          match_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string | null
          match_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_superlikes: {
        Row: {
          created_at: string
          id: string
          superlike_date: string
          used_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          superlike_date?: string
          used_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          superlike_date?: string
          used_count?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_swipes: {
        Row: {
          created_at: string
          id: string
          swipe_count: number
          swipe_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          swipe_count?: number
          swipe_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          swipe_count?: number
          swipe_date?: string
          user_id?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          accepts_trades: boolean | null
          category: string
          condition: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_highlighted: boolean | null
          price_eur: number | null
          price_swap_coins: number | null
          priority_boost: number | null
          quantity: number | null
          set_number: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepts_trades?: boolean | null
          category: string
          condition: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_highlighted?: boolean | null
          price_eur?: number | null
          price_swap_coins?: number | null
          priority_boost?: number | null
          quantity?: number | null
          set_number?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accepts_trades?: boolean | null
          category?: string
          condition?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_highlighted?: boolean | null
          price_eur?: number | null
          price_swap_coins?: number | null
          priority_boost?: number | null
          quantity?: number | null
          set_number?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          listing1_id: string
          listing2_id: string
          status: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing1_id: string
          listing2_id: string
          status?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing1_id?: string
          listing2_id?: string
          status?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_listing1_id_fkey"
            columns: ["listing1_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_listing2_id_fkey"
            columns: ["listing2_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      partnerships: {
        Row: {
          contact_email: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          contact_email: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          rating: number | null
          swap_coins: number
          total_ratings: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          rating?: number | null
          swap_coins?: number
          total_ratings?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          rating?: number | null
          swap_coins?: number
          total_ratings?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sales_commissions: {
        Row: {
          buyer_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          listing_id: string
          sale_price_eur: number
          seller_id: string
          status: string
        }
        Insert: {
          buyer_id: string
          commission_amount: number
          commission_rate?: number
          created_at?: string
          id?: string
          listing_id: string
          sale_price_eur: number
          seller_id: string
          status?: string
        }
        Update: {
          buyer_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          listing_id?: string
          sale_price_eur?: number
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_commissions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan: string
          price_eur: number | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          price_eur?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          price_eur?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      superlikes: {
        Row: {
          id: string
          listing_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          listing_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          listing_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "superlikes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_actions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      get_nearby_users: {
        Args: {
          max_results?: number
          radius_km?: number
          user_lat: number
          user_lon: number
        }
        Returns: {
          avatar_url: string
          distance_km: number
          full_name: string
          id: string
          location: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
