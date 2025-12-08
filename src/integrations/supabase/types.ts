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
      noems: {
        Row: {
          connected_polen_ids: string[] | null
          connections: string[] | null
          created_at: string
          cycle_id: string | null
          id: string
          insight: string
          maturity: Database["public"]["Enums"]["noem_maturity"]
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
        ]
      }
      polen_entries: {
        Row: {
          content: string
          created_at: string
          cycle_id: string | null
          event_id: string | null
          fragment_type: Database["public"]["Enums"]["fragment_type"]
          hexagram_number: number | null
          id: string
          source_reference: string | null
          tags: string[] | null
          tile_id: number | null
          tzolkin_kin: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          cycle_id?: string | null
          event_id?: string | null
          fragment_type?: Database["public"]["Enums"]["fragment_type"]
          hexagram_number?: number | null
          id?: string
          source_reference?: string | null
          tags?: string[] | null
          tile_id?: number | null
          tzolkin_kin?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          cycle_id?: string | null
          event_id?: string | null
          fragment_type?: Database["public"]["Enums"]["fragment_type"]
          hexagram_number?: number | null
          id?: string
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
          calm_requirements: string | null
          calm_risks_and_limits: string | null
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
          open_adjustment_plan: string | null
          open_ontology_and_graph: string | null
          open_real_workflow: string | null
          owner_id: string
          prototype_stage: string
          status: string
          team_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          calm_requirements?: string | null
          calm_risks_and_limits?: string | null
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
          open_adjustment_plan?: string | null
          open_ontology_and_graph?: string | null
          open_real_workflow?: string | null
          owner_id: string
          prototype_stage?: string
          status?: string
          team_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          calm_requirements?: string | null
          calm_risks_and_limits?: string | null
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
          open_adjustment_plan?: string | null
          open_ontology_and_graph?: string | null
          open_real_workflow?: string | null
          owner_id?: string
          prototype_stage?: string
          status?: string
          team_id?: string | null
          title?: string
          updated_at?: string
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
