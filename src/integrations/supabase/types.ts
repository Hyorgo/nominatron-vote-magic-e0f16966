export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          email: string
          event_id: string | null
          first_name: string
          id: string
          last_name: string
          number_of_tickets: number
          stripe_session_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id?: string | null
          first_name: string
          id?: string
          last_name: string
          number_of_tickets: number
          stripe_session_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          number_of_tickets?: number
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_information"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_stripe_session_id_fkey"
            columns: ["stripe_session_id"]
            isOneToOne: false
            referencedRelation: "stripe_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      contact_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          success: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean | null
        }
        Relationships: []
      }
      event_information: {
        Row: {
          address: string
          created_at: string | null
          event_date: string
          id: string
          location: string
          remaining_tickets: number
          total_tickets: number
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          event_date: string
          id?: string
          location: string
          remaining_tickets?: number
          total_tickets?: number
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          event_date?: string
          id?: string
          location?: string
          remaining_tickets?: number
          total_tickets?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      home_content: {
        Row: {
          content: string | null
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean | null
          section_name: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          display_order: number
          id?: string
          is_active?: boolean | null
          section_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          section_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nominees: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "nominees_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominees_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vote_statistics"
            referencedColumns: ["category_id"]
          },
        ]
      }
      page_backgrounds: {
        Row: {
          background_type: string
          background_value: string
          created_at: string | null
          id: string
          is_active: boolean | null
          page_name: string
          updated_at: string | null
        }
        Insert: {
          background_type: string
          background_value: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_name: string
          updated_at?: string | null
        }
        Update: {
          background_type?: string
          background_value?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scrolling_text: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_transactions: {
        Row: {
          amount: number
          created_at: string | null
          email: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          email: string
          id?: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          email?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      ticket_pricing: {
        Row: {
          created_at: string | null
          id: string
          price_ht: number
          tva_rate: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          price_ht?: number
          tva_rate?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          price_ht?: number
          tva_rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: []
      }
      validated_emails: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      vote_opening_notifications: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          category_id: string | null
          created_at: string | null
          email: string
          id: string
          nominee_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          nominee_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nominee_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vote_statistics"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "vote_statistics"
            referencedColumns: ["nominee_id"]
          },
        ]
      }
      voting_config: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          start_date?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vote_statistics: {
        Row: {
          category_id: string | null
          category_name: string | null
          nominee_id: string | null
          nominee_name: string | null
          vote_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_booking_rate_limit: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
      check_contact_rate_limit: {
        Args: {
          user_email: string
          user_ip: string
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
      check_tickets_availability: {
        Args: {
          requested_tickets: number
        }
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
