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
      agentic_decks: {
        Row: {
          audience: string
          created_at: string
          id: string
          length_preset: string
          outline: Json | null
          slides: Json | null
          source_urls: string[]
          title: string
          tone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audience?: string
          created_at?: string
          id?: string
          length_preset?: string
          outline?: Json | null
          slides?: Json | null
          source_urls?: string[]
          title?: string
          tone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audience?: string
          created_at?: string
          id?: string
          length_preset?: string
          outline?: Json | null
          slides?: Json | null
          source_urls?: string[]
          title?: string
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          path: string | null
          properties: Json
          referrer: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          path?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          path?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      book_chapter_drafts: {
        Row: {
          audience: string
          chapter_id: string
          created_at: string
          created_by: string | null
          draft_md: string
          id: string
          is_current: boolean
          model: string
          prompt_snapshot: string | null
        }
        Insert: {
          audience?: string
          chapter_id: string
          created_at?: string
          created_by?: string | null
          draft_md: string
          id?: string
          is_current?: boolean
          model: string
          prompt_snapshot?: string | null
        }
        Update: {
          audience?: string
          chapter_id?: string
          created_at?: string
          created_by?: string | null
          draft_md?: string
          id?: string
          is_current?: boolean
          model?: string
          prompt_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_chapter_drafts_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "book_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      book_chapters: {
        Row: {
          created_at: string
          id: string
          is_free_sample: boolean
          order_index: number
          phase: string
          published_at: string | null
          published_excerpt: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_free_sample?: boolean
          order_index?: number
          phase?: string
          published_at?: string | null
          published_excerpt?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_free_sample?: boolean
          order_index?: number
          phase?: string
          published_at?: string | null
          published_excerpt?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_compasses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
          phase_affinity: string[]
          practices: string[]
          quote: string | null
          quote_attribution: string | null
          slug: string
          status: string
          timing: string | null
          tools: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
          phase_affinity?: string[]
          practices?: string[]
          quote?: string | null
          quote_attribution?: string | null
          slug: string
          status?: string
          timing?: string | null
          tools?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          phase_affinity?: string[]
          practices?: string[]
          quote?: string | null
          quote_attribution?: string | null
          slug?: string
          status?: string
          timing?: string | null
          tools?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      book_orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          email: string
          id: string
          metadata: Json | null
          status: string
          stripe_session_id: string | null
          tier: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          metadata?: Json | null
          status?: string
          stripe_session_id?: string | null
          tier: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          status?: string
          stripe_session_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      book_preorders: {
        Row: {
          chapter_slug: string | null
          created_at: string
          email: string
          id: string
          interest: string | null
          language: string
          name: string
          role: string | null
          source: string | null
          tier: string
          utm: Json | null
        }
        Insert: {
          chapter_slug?: string | null
          created_at?: string
          email: string
          id?: string
          interest?: string | null
          language?: string
          name: string
          role?: string | null
          source?: string | null
          tier?: string
          utm?: Json | null
        }
        Update: {
          chapter_slug?: string | null
          created_at?: string
          email?: string
          id?: string
          interest?: string | null
          language?: string
          name?: string
          role?: string | null
          source?: string | null
          tier?: string
          utm?: Json | null
        }
        Relationships: []
      }
      book_reflection_nodes: {
        Row: {
          body_md: string
          chapter_slug: string | null
          compass_slug: string | null
          created_at: string
          id: string
          kind: string
          language: string
          order_index: number
          source_ref: string | null
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          body_md: string
          chapter_slug?: string | null
          compass_slug?: string | null
          created_at?: string
          id?: string
          kind?: string
          language?: string
          order_index?: number
          source_ref?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          body_md?: string
          chapter_slug?: string | null
          compass_slug?: string | null
          created_at?: string
          id?: string
          kind?: string
          language?: string
          order_index?: number
          source_ref?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      book_sources: {
        Row: {
          chapter_id: string
          created_at: string
          excerpt: string | null
          id: string
          included: boolean
          kind: string
          notes: string | null
          ref: string
          title: string | null
          weight: number
        }
        Insert: {
          chapter_id: string
          created_at?: string
          excerpt?: string | null
          id?: string
          included?: boolean
          kind: string
          notes?: string | null
          ref: string
          title?: string | null
          weight?: number
        }
        Update: {
          chapter_id?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          included?: boolean
          kind?: string
          notes?: string | null
          ref?: string
          title?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_sources_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "book_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      book_uploads: {
        Row: {
          chapter_id: string | null
          created_at: string
          extracted_text: string | null
          file_path: string
          id: string
          mime: string | null
          notes: string | null
          original_name: string | null
          uploaded_by: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          extracted_text?: string | null
          file_path: string
          id?: string
          mime?: string | null
          notes?: string | null
          original_name?: string | null
          uploaded_by?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          extracted_text?: string | null
          file_path?: string
          id?: string
          mime?: string | null
          notes?: string | null
          original_name?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_uploads_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "book_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
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
      dream_runs: {
        Row: {
          axes: Json
          created_at: string
          filename: string | null
          id: string
          is_public: boolean
          overall_maturity: Json | null
          question: string
          share_slug: string
          summary: string | null
          user_id: string | null
        }
        Insert: {
          axes?: Json
          created_at?: string
          filename?: string | null
          id?: string
          is_public?: boolean
          overall_maturity?: Json | null
          question: string
          share_slug?: string
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          axes?: Json
          created_at?: string
          filename?: string | null
          id?: string
          is_public?: boolean
          overall_maturity?: Json | null
          question?: string
          share_slug?: string
          summary?: string | null
          user_id?: string | null
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
      events: {
        Row: {
          adversity_level: Database["public"]["Enums"]["adversity_level"]
          ap_aspect: Database["public"]["Enums"]["ap_aspect"]
          created_at: string
          curiosity_level: Database["public"]["Enums"]["curiosity_level"]
          description: string
          id: string
          next_step: string | null
          oscillation_state: Database["public"]["Enums"]["oscillation_state"]
          positionality: Database["public"]["Enums"]["positionality"]
          process_state: Database["public"]["Enums"]["process_state"]
          quadrant: Database["public"]["Enums"]["quadrant"]
          reflection: string | null
          senge_focus: Database["public"]["Enums"]["senge_discipline"]
          team_id: string | null
          tile_id: number
          timestamp: string
          title: string
          updated_at: string
          user_id: string
          wu_wei_mode: Database["public"]["Enums"]["wu_wei_mode"]
        }
        Insert: {
          adversity_level: Database["public"]["Enums"]["adversity_level"]
          ap_aspect: Database["public"]["Enums"]["ap_aspect"]
          created_at?: string
          curiosity_level: Database["public"]["Enums"]["curiosity_level"]
          description: string
          id?: string
          next_step?: string | null
          oscillation_state: Database["public"]["Enums"]["oscillation_state"]
          positionality: Database["public"]["Enums"]["positionality"]
          process_state: Database["public"]["Enums"]["process_state"]
          quadrant: Database["public"]["Enums"]["quadrant"]
          reflection?: string | null
          senge_focus: Database["public"]["Enums"]["senge_discipline"]
          team_id?: string | null
          tile_id: number
          timestamp?: string
          title: string
          updated_at?: string
          user_id: string
          wu_wei_mode: Database["public"]["Enums"]["wu_wei_mode"]
        }
        Update: {
          adversity_level?: Database["public"]["Enums"]["adversity_level"]
          ap_aspect?: Database["public"]["Enums"]["ap_aspect"]
          created_at?: string
          curiosity_level?: Database["public"]["Enums"]["curiosity_level"]
          description?: string
          id?: string
          next_step?: string | null
          oscillation_state?: Database["public"]["Enums"]["oscillation_state"]
          positionality?: Database["public"]["Enums"]["positionality"]
          process_state?: Database["public"]["Enums"]["process_state"]
          quadrant?: Database["public"]["Enums"]["quadrant"]
          reflection?: string | null
          senge_focus?: Database["public"]["Enums"]["senge_discipline"]
          team_id?: string | null
          tile_id?: number
          timestamp?: string
          title?: string
          updated_at?: string
          user_id?: string
          wu_wei_mode?: Database["public"]["Enums"]["wu_wei_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_tile_id_fkey"
            columns: ["tile_id"]
            isOneToOne: false
            referencedRelation: "tiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hexagram_readings: {
        Row: {
          changing_lines: number[] | null
          created_at: string
          cycle_id: string | null
          emotional_state: Json | null
          id: string
          interpretation: string | null
          primary_hexagram: number
          question: string
          reflection: string | null
          relating_hexagram: number | null
          tags: string[] | null
          tile_id: number | null
          user_id: string
        }
        Insert: {
          changing_lines?: number[] | null
          created_at?: string
          cycle_id?: string | null
          emotional_state?: Json | null
          id?: string
          interpretation?: string | null
          primary_hexagram: number
          question: string
          reflection?: string | null
          relating_hexagram?: number | null
          tags?: string[] | null
          tile_id?: number | null
          user_id: string
        }
        Update: {
          changing_lines?: number[] | null
          created_at?: string
          cycle_id?: string | null
          emotional_state?: Json | null
          id?: string
          interpretation?: string | null
          primary_hexagram?: number
          question?: string
          reflection?: string | null
          relating_hexagram?: number | null
          tags?: string[] | null
          tile_id?: number | null
          user_id?: string
        }
        Relationships: []
      }
      image_credits: {
        Row: {
          created_at: string
          event: string | null
          location: string | null
          photographer: string | null
          slug: string
          updated_at: string
          updated_by: string | null
          year: string | null
        }
        Insert: {
          created_at?: string
          event?: string | null
          location?: string | null
          photographer?: string | null
          slug: string
          updated_at?: string
          updated_by?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string
          event?: string | null
          location?: string | null
          photographer?: string | null
          slug?: string
          updated_at?: string
          updated_by?: string | null
          year?: string | null
        }
        Relationships: []
      }
      journal_cycles: {
        Row: {
          board: Database["public"]["Enums"]["board"]
          completed_at: string | null
          created_at: string
          current_distance: number
          current_tile_id: number | null
          current_zone: Database["public"]["Enums"]["tolerance_zone"]
          cycle_number: number
          id: string
          inner_radius: number
          integrator_tiles_unlocked: number
          phase: Database["public"]["Enums"]["journal_phase"]
          started_at: string
          stretch_radius: number
          team_id: string | null
          tiles_visited: number[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          board: Database["public"]["Enums"]["board"]
          completed_at?: string | null
          created_at?: string
          current_distance?: number
          current_tile_id?: number | null
          current_zone?: Database["public"]["Enums"]["tolerance_zone"]
          cycle_number: number
          id?: string
          inner_radius?: number
          integrator_tiles_unlocked?: number
          phase?: Database["public"]["Enums"]["journal_phase"]
          started_at?: string
          stretch_radius?: number
          team_id?: string | null
          tiles_visited?: number[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          board?: Database["public"]["Enums"]["board"]
          completed_at?: string | null
          created_at?: string
          current_distance?: number
          current_tile_id?: number | null
          current_zone?: Database["public"]["Enums"]["tolerance_zone"]
          cycle_number?: number
          id?: string
          inner_radius?: number
          integrator_tiles_unlocked?: number
          phase?: Database["public"]["Enums"]["journal_phase"]
          started_at?: string
          stretch_radius?: number
          team_id?: string | null
          tiles_visited?: number[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_cycles_current_tile_id_fkey"
            columns: ["current_tile_id"]
            isOneToOne: false
            referencedRelation: "tiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_cycles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
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
      manifold_edges: {
        Row: {
          created_at: string
          edge_type: string
          from_entry_id: string
          id: string
          project_id: string | null
          to_entry_id: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          edge_type: string
          from_entry_id: string
          id?: string
          project_id?: string | null
          to_entry_id: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          edge_type?: string
          from_entry_id?: string
          id?: string
          project_id?: string | null
          to_entry_id?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "manifold_edges_from_entry_id_fkey"
            columns: ["from_entry_id"]
            isOneToOne: false
            referencedRelation: "polen_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manifold_edges_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manifold_edges_to_entry_id_fkey"
            columns: ["to_entry_id"]
            isOneToOne: false
            referencedRelation: "polen_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      noems: {
        Row: {
          connected_polen_ids: string[] | null
          connections: string[] | null
          created_at: string
          cycle_id: string | null
          id: string
          insight: string
          maturity: Database["public"]["Enums"]["noem_maturity"]
          project_id: string | null
          title: string
          topology_x: number | null
          topology_y: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_polen_ids?: string[] | null
          connections?: string[] | null
          created_at?: string
          cycle_id?: string | null
          id?: string
          insight: string
          maturity?: Database["public"]["Enums"]["noem_maturity"]
          project_id?: string | null
          title: string
          topology_x?: number | null
          topology_y?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_polen_ids?: string[] | null
          connections?: string[] | null
          created_at?: string
          cycle_id?: string | null
          id?: string
          insight?: string
          maturity?: Database["public"]["Enums"]["noem_maturity"]
          project_id?: string | null
          title?: string
          topology_x?: number | null
          topology_y?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "noems_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "journal_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      playbook_progress: {
        Row: {
          completed_at: string | null
          completed_steps: string[]
          created_at: string
          current_step_index: number
          garden: string
          id: string
          mode: string
          playbook_id: string
          project_id: string | null
          started_at: string
          step_outputs: Json
          tile_sequence: number[]
          tiles_visited: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: string[]
          created_at?: string
          current_step_index?: number
          garden: string
          id?: string
          mode: string
          playbook_id: string
          project_id?: string | null
          started_at?: string
          step_outputs?: Json
          tile_sequence?: number[]
          tiles_visited?: number[]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: string[]
          created_at?: string
          current_step_index?: number
          garden?: string
          id?: string
          mode?: string
          playbook_id?: string
          project_id?: string | null
          started_at?: string
          step_outputs?: Json
          tile_sequence?: number[]
          tiles_visited?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playbook_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poems: {
        Row: {
          connected_noem_ids: string[] | null
          created_at: string
          cycle_id: string | null
          id: string
          market_fit: string | null
          narrative: string
          poem_type: Database["public"]["Enums"]["poem_type"]
          prd_id: string | null
          project_id: string | null
          tech_stack_hints: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_noem_ids?: string[] | null
          created_at?: string
          cycle_id?: string | null
          id?: string
          market_fit?: string | null
          narrative: string
          poem_type?: Database["public"]["Enums"]["poem_type"]
          prd_id?: string | null
          project_id?: string | null
          tech_stack_hints?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_noem_ids?: string[] | null
          created_at?: string
          cycle_id?: string | null
          id?: string
          market_fit?: string | null
          narrative?: string
          poem_type?: Database["public"]["Enums"]["poem_type"]
          prd_id?: string | null
          project_id?: string | null
          tech_stack_hints?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poems_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "journal_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poems_prd_id_fkey"
            columns: ["prd_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      polen_entries: {
        Row: {
          charge: string | null
          content: string
          created_at: string
          cycle_id: string | null
          event_id: string | null
          fragment_type: Database["public"]["Enums"]["fragment_type"]
          hexagram_number: number | null
          id: string
          intensity: number | null
          phase: string | null
          project_id: string | null
          season_context: string | null
          source_reference: string | null
          tags: string[] | null
          tile_id: number | null
          tzolkin_kin: number | null
          user_id: string
        }
        Insert: {
          charge?: string | null
          content: string
          created_at?: string
          cycle_id?: string | null
          event_id?: string | null
          fragment_type?: Database["public"]["Enums"]["fragment_type"]
          hexagram_number?: number | null
          id?: string
          intensity?: number | null
          phase?: string | null
          project_id?: string | null
          season_context?: string | null
          source_reference?: string | null
          tags?: string[] | null
          tile_id?: number | null
          tzolkin_kin?: number | null
          user_id: string
        }
        Update: {
          charge?: string | null
          content?: string
          created_at?: string
          cycle_id?: string | null
          event_id?: string | null
          fragment_type?: Database["public"]["Enums"]["fragment_type"]
          hexagram_number?: number | null
          id?: string
          intensity?: number | null
          phase?: string | null
          project_id?: string | null
          season_context?: string | null
          source_reference?: string | null
          tags?: string[] | null
          tile_id?: number | null
          tzolkin_kin?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "polen_entries_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "journal_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polen_entries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polen_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polen_entries_tile_id_fkey"
            columns: ["tile_id"]
            isOneToOne: false
            referencedRelation: "tiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prd_links: {
        Row: {
          created_at: string
          event_id: string
          id: string
          prd_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          prd_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          prd_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prd_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prd_links_prd_id_fkey"
            columns: ["prd_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
        ]
      }
      prds: {
        Row: {
          anthems_audience_segments: string | null
          anthems_brand_narrative: string | null
          anthems_go_to_market: string | null
          anthems_market_positioning: string | null
          anthems_storytelling_assets: string | null
          anthems_success_signals: string | null
          auto_compiled_at: string | null
          calm_requirements: string | null
          calm_risks_and_limits: string | null
          compilation_trigger: string | null
          compiled_prompt: string | null
          compiled_tech_stack: Json | null
          consciousness_geometry: Json | null
          created_at: string
          free_first_poem_description: string | null
          free_next_cycle_hooks: string | null
          free_success_criteria: string | null
          free_totem_anthem: string | null
          id: string
          love_decision_to_exist: string | null
          love_signals_summary: string | null
          magic_hypotheses: string | null
          magic_patterns: string | null
          magic_prd_outline: string | null
          magic_storyworld: string | null
          main_board: Database["public"]["Enums"]["board"] | null
          main_dimension: Database["public"]["Enums"]["ap_aspect"] | null
          main_oscillation:
            | Database["public"]["Enums"]["oscillation_state"]
            | null
          main_quadrant: Database["public"]["Enums"]["quadrant"] | null
          main_senge_focus:
            | Database["public"]["Enums"]["senge_discipline"]
            | null
          manifold_embedding: Json | null
          noems_concepts: string | null
          noems_intuitions: string | null
          noems_mental_models: string | null
          noems_shared_ideas: string | null
          open_adjustment_plan: string | null
          open_ontology_and_graph: string | null
          open_real_workflow: string | null
          owner_id: string
          poems_environments: string | null
          poems_messages: string | null
          poems_objects: string | null
          poems_people: string | null
          poems_prototypes: string | null
          poems_systems: string | null
          pollens_aspirations: string | null
          pollens_constraints: string | null
          pollens_cultural_elements: string | null
          pollens_relational_patterns: string | null
          pollens_stakes: string | null
          pollens_team_dynamics: string | null
          project_id: string | null
          prompt_hooks_anthems: string | null
          prompt_hooks_noems: string | null
          prompt_hooks_poems: string | null
          prompt_hooks_pollens: string | null
          prompt_hooks_totems: string | null
          prototype_stage: string
          quick_fill: Json | null
          stack_implications_anthems: string | null
          stack_implications_noems: string | null
          stack_implications_poems: string | null
          stack_implications_pollens: string | null
          stack_implications_totems: string | null
          status: string
          team_id: string | null
          thermodynamic_profile: Json | null
          title: string
          topology_signature: Json | null
          totems_access_controls: string | null
          totems_data_architecture: string | null
          totems_integration_points: string | null
          totems_security_policies: string | null
          totems_system_requirements: string | null
          totems_technical_debt: string | null
          updated_at: string
          was_forced: boolean | null
          window_state: Json | null
        }
        Insert: {
          anthems_audience_segments?: string | null
          anthems_brand_narrative?: string | null
          anthems_go_to_market?: string | null
          anthems_market_positioning?: string | null
          anthems_storytelling_assets?: string | null
          anthems_success_signals?: string | null
          auto_compiled_at?: string | null
          calm_requirements?: string | null
          calm_risks_and_limits?: string | null
          compilation_trigger?: string | null
          compiled_prompt?: string | null
          compiled_tech_stack?: Json | null
          consciousness_geometry?: Json | null
          created_at?: string
          free_first_poem_description?: string | null
          free_next_cycle_hooks?: string | null
          free_success_criteria?: string | null
          free_totem_anthem?: string | null
          id?: string
          love_decision_to_exist?: string | null
          love_signals_summary?: string | null
          magic_hypotheses?: string | null
          magic_patterns?: string | null
          magic_prd_outline?: string | null
          magic_storyworld?: string | null
          main_board?: Database["public"]["Enums"]["board"] | null
          main_dimension?: Database["public"]["Enums"]["ap_aspect"] | null
          main_oscillation?:
            | Database["public"]["Enums"]["oscillation_state"]
            | null
          main_quadrant?: Database["public"]["Enums"]["quadrant"] | null
          main_senge_focus?:
            | Database["public"]["Enums"]["senge_discipline"]
            | null
          manifold_embedding?: Json | null
          noems_concepts?: string | null
          noems_intuitions?: string | null
          noems_mental_models?: string | null
          noems_shared_ideas?: string | null
          open_adjustment_plan?: string | null
          open_ontology_and_graph?: string | null
          open_real_workflow?: string | null
          owner_id: string
          poems_environments?: string | null
          poems_messages?: string | null
          poems_objects?: string | null
          poems_people?: string | null
          poems_prototypes?: string | null
          poems_systems?: string | null
          pollens_aspirations?: string | null
          pollens_constraints?: string | null
          pollens_cultural_elements?: string | null
          pollens_relational_patterns?: string | null
          pollens_stakes?: string | null
          pollens_team_dynamics?: string | null
          project_id?: string | null
          prompt_hooks_anthems?: string | null
          prompt_hooks_noems?: string | null
          prompt_hooks_poems?: string | null
          prompt_hooks_pollens?: string | null
          prompt_hooks_totems?: string | null
          prototype_stage?: string
          quick_fill?: Json | null
          stack_implications_anthems?: string | null
          stack_implications_noems?: string | null
          stack_implications_poems?: string | null
          stack_implications_pollens?: string | null
          stack_implications_totems?: string | null
          status?: string
          team_id?: string | null
          thermodynamic_profile?: Json | null
          title: string
          topology_signature?: Json | null
          totems_access_controls?: string | null
          totems_data_architecture?: string | null
          totems_integration_points?: string | null
          totems_security_policies?: string | null
          totems_system_requirements?: string | null
          totems_technical_debt?: string | null
          updated_at?: string
          was_forced?: boolean | null
          window_state?: Json | null
        }
        Update: {
          anthems_audience_segments?: string | null
          anthems_brand_narrative?: string | null
          anthems_go_to_market?: string | null
          anthems_market_positioning?: string | null
          anthems_storytelling_assets?: string | null
          anthems_success_signals?: string | null
          auto_compiled_at?: string | null
          calm_requirements?: string | null
          calm_risks_and_limits?: string | null
          compilation_trigger?: string | null
          compiled_prompt?: string | null
          compiled_tech_stack?: Json | null
          consciousness_geometry?: Json | null
          created_at?: string
          free_first_poem_description?: string | null
          free_next_cycle_hooks?: string | null
          free_success_criteria?: string | null
          free_totem_anthem?: string | null
          id?: string
          love_decision_to_exist?: string | null
          love_signals_summary?: string | null
          magic_hypotheses?: string | null
          magic_patterns?: string | null
          magic_prd_outline?: string | null
          magic_storyworld?: string | null
          main_board?: Database["public"]["Enums"]["board"] | null
          main_dimension?: Database["public"]["Enums"]["ap_aspect"] | null
          main_oscillation?:
            | Database["public"]["Enums"]["oscillation_state"]
            | null
          main_quadrant?: Database["public"]["Enums"]["quadrant"] | null
          main_senge_focus?:
            | Database["public"]["Enums"]["senge_discipline"]
            | null
          manifold_embedding?: Json | null
          noems_concepts?: string | null
          noems_intuitions?: string | null
          noems_mental_models?: string | null
          noems_shared_ideas?: string | null
          open_adjustment_plan?: string | null
          open_ontology_and_graph?: string | null
          open_real_workflow?: string | null
          owner_id?: string
          poems_environments?: string | null
          poems_messages?: string | null
          poems_objects?: string | null
          poems_people?: string | null
          poems_prototypes?: string | null
          poems_systems?: string | null
          pollens_aspirations?: string | null
          pollens_constraints?: string | null
          pollens_cultural_elements?: string | null
          pollens_relational_patterns?: string | null
          pollens_stakes?: string | null
          pollens_team_dynamics?: string | null
          project_id?: string | null
          prompt_hooks_anthems?: string | null
          prompt_hooks_noems?: string | null
          prompt_hooks_poems?: string | null
          prompt_hooks_pollens?: string | null
          prompt_hooks_totems?: string | null
          prototype_stage?: string
          quick_fill?: Json | null
          stack_implications_anthems?: string | null
          stack_implications_noems?: string | null
          stack_implications_poems?: string | null
          stack_implications_pollens?: string | null
          stack_implications_totems?: string | null
          status?: string
          team_id?: string | null
          thermodynamic_profile?: Json | null
          title?: string
          topology_signature?: Json | null
          totems_access_controls?: string | null
          totems_data_architecture?: string | null
          totems_integration_points?: string | null
          totems_security_policies?: string | null
          totems_system_requirements?: string | null
          totems_technical_debt?: string | null
          updated_at?: string
          was_forced?: boolean | null
          window_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "prds_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prds_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
          mode: Database["public"]["Enums"]["user_mode"] | null
          time_zone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          mode?: Database["public"]["Enums"]["user_mode"] | null
          time_zone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["user_mode"] | null
          time_zone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_collaborators: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string
          project_id: string
          role: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by: string
          project_id: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string
          project_id?: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_season_progress: {
        Row: {
          ai_summary_connections: Json | null
          ai_summary_generated_at: string | null
          ai_summary_hexagram: Json | null
          ai_summary_insights: Json | null
          ai_summary_next_areas: string[] | null
          ai_summary_themes: string[] | null
          completed_seasons: string[]
          created_at: string
          current_season: string
          id: string
          journey_path: Json
          journey_started: boolean
          prd_id: string | null
          project_id: string
          season_progress: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary_connections?: Json | null
          ai_summary_generated_at?: string | null
          ai_summary_hexagram?: Json | null
          ai_summary_insights?: Json | null
          ai_summary_next_areas?: string[] | null
          ai_summary_themes?: string[] | null
          completed_seasons?: string[]
          created_at?: string
          current_season?: string
          id?: string
          journey_path?: Json
          journey_started?: boolean
          prd_id?: string | null
          project_id: string
          season_progress?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary_connections?: Json | null
          ai_summary_generated_at?: string | null
          ai_summary_hexagram?: Json | null
          ai_summary_insights?: Json | null
          ai_summary_next_areas?: string[] | null
          ai_summary_themes?: string[] | null
          completed_seasons?: string[]
          created_at?: string
          current_season?: string
          id?: string
          journey_path?: Json
          journey_started?: boolean
          prd_id?: string | null
          project_id?: string
          season_progress?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_season_progress_prd_id_fkey"
            columns: ["prd_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_season_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          consciousness_bits: number | null
          convergence_state: string | null
          created_at: string
          garden: string
          id: string
          mode: string
          parent_product_id: string | null
          product_status: string | null
          project_name: string
          prototypal_stage: string | null
          source_prompt_id: string | null
          target_platform: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consciousness_bits?: number | null
          convergence_state?: string | null
          created_at?: string
          garden: string
          id?: string
          mode: string
          parent_product_id?: string | null
          product_status?: string | null
          project_name: string
          prototypal_stage?: string | null
          source_prompt_id?: string | null
          target_platform?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consciousness_bits?: number | null
          convergence_state?: string | null
          created_at?: string
          garden?: string
          id?: string
          mode?: string
          parent_product_id?: string | null
          product_status?: string | null
          project_name?: string
          prototypal_stage?: string | null
          source_prompt_id?: string | null
          target_platform?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_source_prompt_id_fkey"
            columns: ["source_prompt_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
        ]
      }
      published_software: {
        Row: {
          consciousness_geometry: Json | null
          created_at: string
          deployment_url: string | null
          description: string | null
          id: string
          integration_strength: number | null
          is_recursive: boolean | null
          lineage_depth: number | null
          name: string
          parent_software_id: string | null
          source_project_id: string | null
          source_prompt_id: string | null
          status: string
          target_platform: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consciousness_geometry?: Json | null
          created_at?: string
          deployment_url?: string | null
          description?: string | null
          id?: string
          integration_strength?: number | null
          is_recursive?: boolean | null
          lineage_depth?: number | null
          name: string
          parent_software_id?: string | null
          source_project_id?: string | null
          source_prompt_id?: string | null
          status?: string
          target_platform?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consciousness_geometry?: Json | null
          created_at?: string
          deployment_url?: string | null
          description?: string | null
          id?: string
          integration_strength?: number | null
          is_recursive?: boolean | null
          lineage_depth?: number | null
          name?: string
          parent_software_id?: string | null
          source_project_id?: string | null
          source_prompt_id?: string | null
          status?: string
          target_platform?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_software_parent_software_id_fkey"
            columns: ["parent_software_id"]
            isOneToOne: false
            referencedRelation: "published_software"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_software_source_project_id_fkey"
            columns: ["source_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_software_source_prompt_id_fkey"
            columns: ["source_prompt_id"]
            isOneToOne: false
            referencedRelation: "prds"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_opportunities: {
        Row: {
          amount_max: number | null
          amount_min: number
          client_name: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          probability: string
          proposal_deadline: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number
          client_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          probability?: string
          proposal_deadline?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_max?: number | null
          amount_min?: number
          client_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          probability?: string
          proposal_deadline?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_overrides: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          reason: string | null
          tier: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          reason?: string | null
          tier: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          reason?: string | null
          tier?: string
          user_id?: string
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
      team_memberships: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiles: {
        Row: {
          board: Database["public"]["Enums"]["board"]
          calm_magic_phase: Database["public"]["Enums"]["board"]
          col: number | null
          created_at: string
          default_process_state: Database["public"]["Enums"]["process_state"]
          hexagram: number | null
          id: number
          mindfulness_focus: Json | null
          row: number | null
          senge_discipline: Database["public"]["Enums"]["senge_discipline"]
          short_prompt: string
          tzolkin_index: number
          updated_at: string
          vl_path_index: number | null
          wu_wei_intensity: Database["public"]["Enums"]["wu_wei_intensity"]
        }
        Insert: {
          board: Database["public"]["Enums"]["board"]
          calm_magic_phase: Database["public"]["Enums"]["board"]
          col?: number | null
          created_at?: string
          default_process_state: Database["public"]["Enums"]["process_state"]
          hexagram?: number | null
          id: number
          mindfulness_focus?: Json | null
          row?: number | null
          senge_discipline: Database["public"]["Enums"]["senge_discipline"]
          short_prompt: string
          tzolkin_index: number
          updated_at?: string
          vl_path_index?: number | null
          wu_wei_intensity?: Database["public"]["Enums"]["wu_wei_intensity"]
        }
        Update: {
          board?: Database["public"]["Enums"]["board"]
          calm_magic_phase?: Database["public"]["Enums"]["board"]
          col?: number | null
          created_at?: string
          default_process_state?: Database["public"]["Enums"]["process_state"]
          hexagram?: number | null
          id?: number
          mindfulness_focus?: Json | null
          row?: number | null
          senge_discipline?: Database["public"]["Enums"]["senge_discipline"]
          short_prompt?: string
          tzolkin_index?: number
          updated_at?: string
          vl_path_index?: number | null
          wu_wei_intensity?: Database["public"]["Enums"]["wu_wei_intensity"]
        }
        Relationships: []
      }
      tolerance_expansion_events: {
        Row: {
          created_at: string
          cycle_id: string
          id: string
          new_inner: number
          previous_inner: number
          reflection: string | null
          trigger_tile_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          id?: string
          new_inner: number
          previous_inner: number
          reflection?: string | null
          trigger_tile_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          id?: string
          new_inner?: number
          previous_inner?: number
          reflection?: string | null
          trigger_tile_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tolerance_expansion_events_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "journal_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tolerance_expansion_events_trigger_tile_id_fkey"
            columns: ["trigger_tile_id"]
            isOneToOne: false
            referencedRelation: "tiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          module_id: string
          passed: boolean | null
          score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          module_id: string
          passed?: boolean | null
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          module_id?: string
          passed?: boolean | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_attempts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      training_enrollments: {
        Row: {
          created_at: string
          data_maturity: number | null
          email: string
          goals: string | null
          id: string
          language: string
          name: string
          org: string | null
          productivity_style: string | null
          role: string | null
          training_slug: string
          utm: Json | null
        }
        Insert: {
          created_at?: string
          data_maturity?: number | null
          email: string
          goals?: string | null
          id?: string
          language?: string
          name: string
          org?: string | null
          productivity_style?: string | null
          role?: string | null
          training_slug: string
          utm?: Json | null
        }
        Update: {
          created_at?: string
          data_maturity?: number | null
          email?: string
          goals?: string | null
          id?: string
          language?: string
          name?: string
          org?: string | null
          productivity_style?: string | null
          role?: string | null
          training_slug?: string
          utm?: Json | null
        }
        Relationships: []
      }
      training_modules: {
        Row: {
          content_md: string | null
          created_at: string
          hands_on_md: string | null
          hours: number | null
          id: string
          order_index: number
          summary: string | null
          title: string
          training_id: string
          updated_at: string
          video_duration_min: number | null
          video_placeholder_url: string | null
          video_theme: string | null
          video_title: string | null
        }
        Insert: {
          content_md?: string | null
          created_at?: string
          hands_on_md?: string | null
          hours?: number | null
          id?: string
          order_index?: number
          summary?: string | null
          title: string
          training_id: string
          updated_at?: string
          video_duration_min?: number | null
          video_placeholder_url?: string | null
          video_theme?: string | null
          video_title?: string | null
        }
        Update: {
          content_md?: string | null
          created_at?: string
          hands_on_md?: string | null
          hours?: number | null
          id?: string
          order_index?: number
          summary?: string | null
          title?: string
          training_id?: string
          updated_at?: string
          video_duration_min?: number | null
          video_placeholder_url?: string | null
          video_theme?: string | null
          video_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_modules_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      training_questions: {
        Row: {
          correct_answer: Json | null
          created_at: string
          explanation_md: string | null
          id: string
          kind: string
          module_id: string
          options: Json
          order_index: number
          prompt: string
          weight: number
        }
        Insert: {
          correct_answer?: Json | null
          created_at?: string
          explanation_md?: string | null
          id?: string
          kind?: string
          module_id: string
          options?: Json
          order_index?: number
          prompt: string
          weight?: number
        }
        Update: {
          correct_answer?: Json | null
          created_at?: string
          explanation_md?: string | null
          id?: string
          kind?: string
          module_id?: string
          options?: Json
          order_index?: number
          prompt?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          audience_md: string | null
          big_picture_md: string | null
          created_at: string
          crewdle_focus: string | null
          cta_label: string
          delivery_breakdown: Json | null
          hero_quote: string | null
          hours: number
          id: string
          order_index: number
          outcomes: Json
          slug: string
          status: string
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audience_md?: string | null
          big_picture_md?: string | null
          created_at?: string
          crewdle_focus?: string | null
          cta_label?: string
          delivery_breakdown?: Json | null
          hero_quote?: string | null
          hours?: number
          id?: string
          order_index?: number
          outcomes?: Json
          slug: string
          status?: string
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audience_md?: string | null
          big_picture_md?: string | null
          created_at?: string
          crewdle_focus?: string | null
          cta_label?: string
          delivery_breakdown?: Json | null
          hero_quote?: string | null
          hours?: number
          id?: string
          order_index?: number
          outcomes?: Json
          slug?: string
          status?: string
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      trajectory_states: {
        Row: {
          created_at: string
          higher_self_position: Json | null
          higher_self_quadrant: string | null
          id: string
          last_shadow_position: Json | null
          project_id: string | null
          prophecy_reflection: string | null
          prophecy_set_at: string | null
          shadow_factors: Json | null
          shadow_nudge: Json | null
          trajectory_log: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          higher_self_position?: Json | null
          higher_self_quadrant?: string | null
          id?: string
          last_shadow_position?: Json | null
          project_id?: string | null
          prophecy_reflection?: string | null
          prophecy_set_at?: string | null
          shadow_factors?: Json | null
          shadow_nudge?: Json | null
          trajectory_log?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          higher_self_position?: Json | null
          higher_self_quadrant?: string | null
          id?: string
          last_shadow_position?: Json | null
          project_id?: string | null
          prophecy_reflection?: string | null
          prophecy_set_at?: string | null
          shadow_factors?: Json | null
          shadow_nudge?: Json | null
          trajectory_log?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trajectory_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      urgent_priorities: {
        Row: {
          category: string
          consequences: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_cost: number | null
          id: string
          priority_level: string
          related_debt_id: string | null
          related_task_id: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          consequences?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          priority_level?: string
          related_debt_id?: string | null
          related_task_id?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          consequences?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          priority_level?: string
          related_debt_id?: string | null
          related_task_id?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      training_questions_public: {
        Row: {
          created_at: string | null
          id: string | null
          kind: string | null
          module_id: string | null
          options: Json | null
          order_index: number | null
          prompt: string | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_book_stats: {
        Args: never
        Returns: {
          chapters: number
          drafts: number
          sources: number
        }[]
      }
      grade_training_attempt: {
        Args: { p_answers: Json; p_module_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_project_owner: { Args: { project_uuid: string }; Returns: boolean }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_owner: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      adversity_level: "A1" | "A2" | "A3"
      ap_aspect: "F" | "E" | "L" | "V"
      app_role: "admin" | "moderator" | "user"
      board: "LOVE" | "MAGIC" | "CALM" | "OPEN" | "FREE"
      curiosity_level: "C1" | "C2" | "C3"
      energetic_axis: "love" | "magic" | "calm" | "open" | "free"
      fragment_type:
        | "text"
        | "quote"
        | "image"
        | "voice"
        | "screenshot"
        | "link"
      garden_type: "intelligence" | "systems" | "prototypes"
      journal_phase: "glitch" | "drift" | "tune"
      noem_maturity: "seed" | "growing" | "ripe"
      oscillation_state: "shadow" | "mixed" | "higher_self"
      poem_type: "story" | "metaphor" | "anthem" | "manifold"
      positionality: "P1" | "P2" | "P3" | "P4" | "P5"
      process_state: "GLITCH" | "DRIFT" | "TUNE" | "FREE"
      quadrant: "SN" | "IN" | "IM" | "SM"
      senge_discipline:
        | "PersonalMastery"
        | "MentalModels"
        | "SharedVision"
        | "TeamLearning"
        | "SystemsThinking"
      team_role: "owner" | "member"
      tolerance_zone: "inner" | "stretch" | "outer"
      user_mode: "solo" | "team"
      wu_wei_intensity: "LOW" | "MEDIUM" | "HIGH"
      wu_wei_mode: "ALLOW_FIRST" | "MINIMAL_INTERVENTION" | "NO_FORCE"
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
    Enums: {
      adversity_level: ["A1", "A2", "A3"],
      ap_aspect: ["F", "E", "L", "V"],
      app_role: ["admin", "moderator", "user"],
      board: ["LOVE", "MAGIC", "CALM", "OPEN", "FREE"],
      curiosity_level: ["C1", "C2", "C3"],
      energetic_axis: ["love", "magic", "calm", "open", "free"],
      fragment_type: ["text", "quote", "image", "voice", "screenshot", "link"],
      garden_type: ["intelligence", "systems", "prototypes"],
      journal_phase: ["glitch", "drift", "tune"],
      noem_maturity: ["seed", "growing", "ripe"],
      oscillation_state: ["shadow", "mixed", "higher_self"],
      poem_type: ["story", "metaphor", "anthem", "manifold"],
      positionality: ["P1", "P2", "P3", "P4", "P5"],
      process_state: ["GLITCH", "DRIFT", "TUNE", "FREE"],
      quadrant: ["SN", "IN", "IM", "SM"],
      senge_discipline: [
        "PersonalMastery",
        "MentalModels",
        "SharedVision",
        "TeamLearning",
        "SystemsThinking",
      ],
      team_role: ["owner", "member"],
      tolerance_zone: ["inner", "stretch", "outer"],
      user_mode: ["solo", "team"],
      wu_wei_intensity: ["LOW", "MEDIUM", "HIGH"],
      wu_wei_mode: ["ALLOW_FIRST", "MINIMAL_INTERVENTION", "NO_FORCE"],
    },
  },
} as const
