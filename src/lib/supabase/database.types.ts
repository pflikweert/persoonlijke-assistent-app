export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_regeneration_job_steps: {
        Row: {
          applied: number
          candidate_keys: Json
          cursor: number
          failed: number
          id: string
          job_id: string
          last_update_at: string
          openai_completed: number
          phase: string
          queued: number
          status: string
          step_type: string
          total: number
        }
        Insert: {
          applied?: number
          candidate_keys?: Json
          cursor?: number
          failed?: number
          id?: string
          job_id: string
          last_update_at?: string
          openai_completed?: number
          phase?: string
          queued?: number
          status?: string
          step_type: string
          total?: number
        }
        Update: {
          applied?: number
          candidate_keys?: Json
          cursor?: number
          failed?: number
          id?: string
          job_id?: string
          last_update_at?: string
          openai_completed?: number
          phase?: string
          queued?: number
          status?: string
          step_type?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_regeneration_job_steps_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "admin_regeneration_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_regeneration_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          id: string
          options: Json
          selected_types: Json
          started_at: string | null
          status: string
          summary: Json
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          id?: string
          options?: Json
          selected_types?: Json
          started_at?: string | null
          status?: string
          summary?: Json
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          id?: string
          options?: Json
          selected_types?: Json
          started_at?: string | null
          status?: string
          summary?: Json
          updated_at?: string
        }
        Relationships: []
      }
      admin_regeneration_step_batches: {
        Row: {
          attempt: number
          created_at: string
          error_file_id: string | null
          id: string
          input_file_id: string | null
          job_id: string
          openai_batch_id: string
          output_file_id: string | null
          prompt_tokens_est: number
          request_count: number
          requests_json: Json
          retry_of: string | null
          status: string
          step_id: string
          updated_at: string
        }
        Insert: {
          attempt?: number
          created_at?: string
          error_file_id?: string | null
          id?: string
          input_file_id?: string | null
          job_id: string
          openai_batch_id: string
          output_file_id?: string | null
          prompt_tokens_est?: number
          request_count?: number
          requests_json?: Json
          retry_of?: string | null
          status?: string
          step_id: string
          updated_at?: string
        }
        Update: {
          attempt?: number
          created_at?: string
          error_file_id?: string | null
          id?: string
          input_file_id?: string | null
          job_id?: string
          openai_batch_id?: string
          output_file_id?: string | null
          prompt_tokens_est?: number
          request_count?: number
          requests_json?: Json
          retry_of?: string | null
          status?: string
          step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_regeneration_step_batches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "admin_regeneration_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_regeneration_step_batches_retry_of_fkey"
            columns: ["retry_of"]
            isOneToOne: false
            referencedRelation: "admin_regeneration_step_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_regeneration_step_batches_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "admin_regeneration_job_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_live_generation_log: {
        Row: {
          created_at: string
          flow_id: string
          id: string
          metadata_json: Json
          model: string
          request_id: string
          source_record_id: string
          source_type: Database["public"]["Enums"]["ai_test_case_source_type"]
          target_record_id: string
          target_table: string
          task_id: string
          task_version_id: string
        }
        Insert: {
          created_at?: string
          flow_id: string
          id?: string
          metadata_json?: Json
          model: string
          request_id: string
          source_record_id: string
          source_type: Database["public"]["Enums"]["ai_test_case_source_type"]
          target_record_id: string
          target_table: string
          task_id: string
          task_version_id: string
        }
        Update: {
          created_at?: string
          flow_id?: string
          id?: string
          metadata_json?: Json
          model?: string
          request_id?: string
          source_record_id?: string
          source_type?: Database["public"]["Enums"]["ai_test_case_source_type"]
          target_record_id?: string
          target_table?: string
          task_id?: string
          task_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_live_generation_log_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "ai_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_live_generation_log_task_version_id_fkey"
            columns: ["task_version_id"]
            isOneToOne: false
            referencedRelation: "ai_task_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_task_versions: {
        Row: {
          became_live_at: string | null
          changelog: string | null
          config_json: Json
          created_at: string
          created_by: string | null
          id: string
          locked_at: string | null
          max_items: number | null
          min_items: number | null
          model: string
          output_schema_json: Json
          prompt_template: string
          status: Database["public"]["Enums"]["ai_task_version_status"]
          system_instructions: string
          task_id: string
          updated_at: string
          version_number: number
        }
        Insert: {
          became_live_at?: string | null
          changelog?: string | null
          config_json?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          locked_at?: string | null
          max_items?: number | null
          min_items?: number | null
          model: string
          output_schema_json?: Json
          prompt_template: string
          status?: Database["public"]["Enums"]["ai_task_version_status"]
          system_instructions?: string
          task_id: string
          updated_at?: string
          version_number: number
        }
        Update: {
          became_live_at?: string | null
          changelog?: string | null
          config_json?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          locked_at?: string | null
          max_items?: number | null
          min_items?: number | null
          model?: string
          output_schema_json?: Json
          prompt_template?: string
          status?: Database["public"]["Enums"]["ai_task_version_status"]
          system_instructions?: string
          task_id?: string
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_task_versions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "ai_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          input_type: Database["public"]["Enums"]["ai_task_input_type"]
          is_active: boolean
          key: string
          label: string
          output_type: Database["public"]["Enums"]["ai_task_output_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          input_type: Database["public"]["Enums"]["ai_task_input_type"]
          is_active?: boolean
          key: string
          label: string
          output_type?: Database["public"]["Enums"]["ai_task_output_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          input_type?: Database["public"]["Enums"]["ai_task_input_type"]
          is_active?: boolean
          key?: string
          label?: string
          output_type?: Database["public"]["Enums"]["ai_task_output_type"]
          updated_at?: string
        }
        Relationships: []
      }
      ai_test_cases: {
        Row: {
          created_at: string
          id: string
          is_golden: boolean
          label: string
          source_record_id: string
          source_type: Database["public"]["Enums"]["ai_test_case_source_type"]
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_golden?: boolean
          label: string
          source_record_id: string
          source_type: Database["public"]["Enums"]["ai_test_case_source_type"]
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_golden?: boolean
          label?: string
          source_record_id?: string
          source_type?: Database["public"]["Enums"]["ai_test_case_source_type"]
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_test_cases_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "ai_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_test_runs: {
        Row: {
          completion_tokens: number | null
          config_snapshot_json: Json
          created_at: string
          created_by: string | null
          id: string
          input_snapshot_json: Json
          latency_ms: number | null
          model_snapshot: string
          output_json: Json | null
          output_schema_snapshot_json: Json
          output_text: string | null
          prompt_snapshot: string
          prompt_tokens: number | null
          reviewer_label: Database["public"]["Enums"]["ai_review_label"] | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["ai_test_run_status"]
          system_instructions_snapshot: string
          task_id: string
          task_version_id: string
          test_case_id: string
          total_tokens: number | null
        }
        Insert: {
          completion_tokens?: number | null
          config_snapshot_json?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          input_snapshot_json?: Json
          latency_ms?: number | null
          model_snapshot: string
          output_json?: Json | null
          output_schema_snapshot_json?: Json
          output_text?: string | null
          prompt_snapshot: string
          prompt_tokens?: number | null
          reviewer_label?: Database["public"]["Enums"]["ai_review_label"] | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["ai_test_run_status"]
          system_instructions_snapshot?: string
          task_id: string
          task_version_id: string
          test_case_id: string
          total_tokens?: number | null
        }
        Update: {
          completion_tokens?: number | null
          config_snapshot_json?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          input_snapshot_json?: Json
          latency_ms?: number | null
          model_snapshot?: string
          output_json?: Json | null
          output_schema_snapshot_json?: Json
          output_text?: string | null
          prompt_snapshot?: string
          prompt_tokens?: number | null
          reviewer_label?: Database["public"]["Enums"]["ai_review_label"] | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["ai_test_run_status"]
          system_instructions_snapshot?: string
          task_id?: string
          task_version_id?: string
          test_case_id?: string
          total_tokens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_test_runs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "ai_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_test_runs_task_version_id_fkey"
            columns: ["task_version_id"]
            isOneToOne: false
            referencedRelation: "ai_task_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_test_runs_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "ai_test_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      day_journals: {
        Row: {
          generation_meta: Json
          id: string
          journal_date: string
          narrative_text: string
          sections: Json
          summary: string
          updated_at: string
          user_id: string
        }
        Insert: {
          generation_meta?: Json
          id?: string
          journal_date: string
          narrative_text?: string
          sections?: Json
          summary?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          generation_meta?: Json
          id?: string
          journal_date?: string
          narrative_text?: string
          sections?: Json
          summary?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      entries_normalized: {
        Row: {
          body: string
          created_at: string
          generation_meta: Json
          id: string
          raw_entry_id: string
          summary_short: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          generation_meta?: Json
          id?: string
          raw_entry_id: string
          summary_short?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          generation_meta?: Json
          id?: string
          raw_entry_id?: string
          summary_short?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_normalized_raw_entry_id_fkey"
            columns: ["raw_entry_id"]
            isOneToOne: true
            referencedRelation: "entries_raw"
            referencedColumns: ["id"]
          },
        ]
      }
      entries_raw: {
        Row: {
          audio_duration_ms: number | null
          audio_mime_type: string | null
          audio_saved_at: string | null
          audio_size_bytes: number | null
          audio_storage_path: string | null
          captured_at: string
          client_processing_id: string | null
          created_at: string
          id: string
          import_external_message_id: string | null
          import_file_name: string | null
          import_source_ref: string | null
          import_source_type: string | null
          journal_date: string | null
          raw_text: string | null
          source_type: string
          transcript_text: string | null
          user_id: string
        }
        Insert: {
          audio_duration_ms?: number | null
          audio_mime_type?: string | null
          audio_saved_at?: string | null
          audio_size_bytes?: number | null
          audio_storage_path?: string | null
          captured_at?: string
          client_processing_id?: string | null
          created_at?: string
          id?: string
          import_external_message_id?: string | null
          import_file_name?: string | null
          import_source_ref?: string | null
          import_source_type?: string | null
          journal_date?: string | null
          raw_text?: string | null
          source_type: string
          transcript_text?: string | null
          user_id: string
        }
        Update: {
          audio_duration_ms?: number | null
          audio_mime_type?: string | null
          audio_saved_at?: string | null
          audio_size_bytes?: number | null
          audio_storage_path?: string | null
          captured_at?: string
          client_processing_id?: string | null
          created_at?: string
          id?: string
          import_external_message_id?: string | null
          import_file_name?: string | null
          import_source_ref?: string | null
          import_source_type?: string | null
          journal_date?: string | null
          raw_text?: string | null
          source_type?: string
          transcript_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      period_reflections: {
        Row: {
          generated_at: string
          generation_meta: Json
          highlights_json: Json
          id: string
          model_version: string
          narrative_text: string
          period_end: string
          period_start: string
          period_type: string
          reflection_points_json: Json
          summary_text: string
          user_id: string
        }
        Insert: {
          generated_at?: string
          generation_meta?: Json
          highlights_json?: Json
          id?: string
          model_version?: string
          narrative_text?: string
          period_end: string
          period_start: string
          period_type: string
          reflection_points_json?: Json
          summary_text?: string
          user_id: string
        }
        Update: {
          generated_at?: string
          generation_meta?: Json
          highlights_json?: Json
          id?: string
          model_version?: string
          narrative_text?: string
          period_end?: string
          period_start?: string
          period_type?: string
          reflection_points_json?: Json
          summary_text?: string
          user_id?: string
        }
        Relationships: []
      }
      user_background_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          detail_current: number | null
          detail_label: string | null
          detail_total: number | null
          download_expires_at: string | null
          error_message: string | null
          id: string
          input_payload: Json
          last_update_at: string
          notice_dismissed_at: string | null
          notice_seen_at: string | null
          payload: Json
          phase: string
          progress_current: number
          progress_total: number
          result_file_name: string | null
          result_mime_type: string | null
          result_payload: Json | null
          result_size_bytes: number | null
          result_storage_path: string | null
          source_ref: string | null
          started_at: string | null
          status: string
          task_type: string
          updated_at: string
          user_id: string
          warning_count: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          detail_current?: number | null
          detail_label?: string | null
          detail_total?: number | null
          download_expires_at?: string | null
          error_message?: string | null
          id?: string
          input_payload?: Json
          last_update_at?: string
          notice_dismissed_at?: string | null
          notice_seen_at?: string | null
          payload?: Json
          phase?: string
          progress_current?: number
          progress_total?: number
          result_file_name?: string | null
          result_mime_type?: string | null
          result_payload?: Json | null
          result_size_bytes?: number | null
          result_storage_path?: string | null
          source_ref?: string | null
          started_at?: string | null
          status?: string
          task_type: string
          updated_at?: string
          user_id: string
          warning_count?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          detail_current?: number | null
          detail_label?: string | null
          detail_total?: number | null
          download_expires_at?: string | null
          error_message?: string | null
          id?: string
          input_payload?: Json
          last_update_at?: string
          notice_dismissed_at?: string | null
          notice_seen_at?: string | null
          payload?: Json
          phase?: string
          progress_current?: number
          progress_total?: number
          result_file_name?: string | null
          result_mime_type?: string | null
          result_payload?: Json | null
          result_size_bytes?: number | null
          result_storage_path?: string | null
          source_ref?: string | null
          started_at?: string | null
          status?: string
          task_type?: string
          updated_at?: string
          user_id?: string
          warning_count?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          obsidian_default_note: string | null
          obsidian_vault_path: string | null
          save_audio_recordings: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          obsidian_default_note?: string | null
          obsidian_vault_path?: string | null
          save_audio_recordings?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          obsidian_default_note?: string | null
          obsidian_vault_path?: string | null
          save_audio_recordings?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_openai_debug_storage_settings: {
        Args: never
        Returns: {
          flow_overrides_json: Json
          id: number
          master_enabled: boolean
          master_expires_at: string
          updated_at: string
        }[]
      }
      admin_upsert_openai_debug_storage_settings: {
        Args: {
          p_flow_overrides_json: Json
          p_master_enabled: boolean
          p_master_expires_at: string
          p_updated_by: string
        }
        Returns: {
          flow_overrides_json: Json
          id: number
          master_enabled: boolean
          master_expires_at: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      ai_review_label: "better" | "equal" | "worse" | "fail"
      ai_task_input_type: "entry" | "day" | "week" | "month"
      ai_task_output_type: "text" | "json" | "text_list"
      ai_task_version_status: "draft" | "testing" | "live" | "archived"
      ai_test_case_source_type: "entry" | "day" | "week" | "month"
      ai_test_run_status: "queued" | "completed" | "failed"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      ai_review_label: ["better", "equal", "worse", "fail"],
      ai_task_input_type: ["entry", "day", "week", "month"],
      ai_task_output_type: ["text", "json", "text_list"],
      ai_task_version_status: ["draft", "testing", "live", "archived"],
      ai_test_case_source_type: ["entry", "day", "week", "month"],
      ai_test_run_status: ["queued", "completed", "failed"],
    },
  },
} as const
