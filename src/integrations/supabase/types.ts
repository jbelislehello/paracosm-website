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
      debts: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          interest_rate: number | null
          minimum_payment: number | null
          name: string
          notes: string | null
          payment_date: string | null
          remaining_payments: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          name: string
          notes?: string | null
          payment_date?: string | null
          remaining_payments?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          name?: string
          notes?: string | null
          payment_date?: string | null
          remaining_payments?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotional_states: {
        Row: {
          calm_level: number
          created_at: string
          free_level: number
          garden: Database["public"]["Enums"]["garden_type"]
          higher_self_notes: string | null
          id: string
          love_level: number
          magic_level: number
          open_level: number
          shadow_self_notes: string | null
          user_id: string
        }
        Insert: {
          calm_level: number
          created_at?: string
          free_level: number
          garden: Database["public"]["Enums"]["garden_type"]
          higher_self_notes?: string | null
          id?: string
          love_level: number
          magic_level: number
          open_level: number
          shadow_self_notes?: string | null
          user_id: string
        }
        Update: {
          calm_level?: number
          created_at?: string
          free_level?: number
          garden?: Database["public"]["Enums"]["garden_type"]
          higher_self_notes?: string | null
          id?: string
          love_level?: number
          magic_level?: number
          open_level?: number
          shadow_self_notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          emotional_state_id: string | null
          garden: Database["public"]["Enums"]["garden_type"]
          id: string
          insights: string | null
          rising_question: string | null
          situation_context: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          emotional_state_id?: string | null
          garden: Database["public"]["Enums"]["garden_type"]
          id?: string
          insights?: string | null
          rising_question?: string | null
          situation_context?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          emotional_state_id?: string | null
          garden?: Database["public"]["Enums"]["garden_type"]
          id?: string
          insights?: string | null
          rising_question?: string | null
          situation_context?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_emotional_state_id_fkey"
            columns: ["emotional_state_id"]
            isOneToOne: false
            referencedRelation: "emotional_states"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          created_at: string
          due_date: string | null
          goal: string | null
          id: string
          notes: string | null
          priority: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          due_date?: string | null
          goal?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          due_date?: string | null
          goal?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_collaborations: {
        Row: {
          collaborator_user_id: string
          comment: string | null
          created_at: string
          id: string
          journal_entry_id: string | null
        }
        Insert: {
          collaborator_user_id: string
          comment?: string | null
          created_at?: string
          id?: string
          journal_entry_id?: string | null
        }
        Update: {
          collaborator_user_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          journal_entry_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_collaborations_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      energetic_axis: "love" | "magic" | "calm" | "open" | "free"
      garden_type: "intelligence" | "systems" | "prototypes"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      energetic_axis: ["love", "magic", "calm", "open", "free"],
      garden_type: ["intelligence", "systems", "prototypes"],
    },
  },
} as const
