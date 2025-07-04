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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          device_info: Json | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          location_info: Json | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          device_info?: Json | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          location_info?: Json | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          device_info?: Json | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          location_info?: Json | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          admin_role: Database["public"]["Enums"]["admin_role"]
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          user_id: string
        }
        Insert: {
          admin_role?: Database["public"]["Enums"]["admin_role"]
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          user_id: string
        }
        Update: {
          admin_role?: Database["public"]["Enums"]["admin_role"]
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          subject: string
          template_name: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          subject: string
          template_name: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          subject?: string
          template_name?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          id: string
          investigated_at: string | null
          investigated_by: string | null
          metadata: Json | null
          resolution_notes: string | null
          severity: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          metadata?: Json | null
          resolution_notes?: string | null
          severity?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          metadata?: Json | null
          resolution_notes?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string | null
          id: string
          metadata: Json | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url?: string | null
          id?: string
          metadata?: Json | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string | null
          id?: string
          metadata?: Json | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_number: string | null
          account_type: string | null
          address: Json | null
          annual_income: number | null
          balance: number | null
          citizenship_status: string | null
          created_at: string | null
          date_of_birth: string | null
          document_expiry_date: string | null
          document_number: string | null
          document_type: string | null
          document_url: string | null
          email: string | null
          employer_name: string | null
          employment_status: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          middle_name: string | null
          mother_maiden_name: string | null
          phone: string | null
          profile_picture_url: string | null
          secondary_phone: string | null
          ssn_last_four: string | null
          state_of_birth: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          account_number?: string | null
          account_type?: string | null
          address?: Json | null
          annual_income?: number | null
          balance?: number | null
          citizenship_status?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          document_expiry_date?: string | null
          document_number?: string | null
          document_type?: string | null
          document_url?: string | null
          email?: string | null
          employer_name?: string | null
          employment_status?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          middle_name?: string | null
          mother_maiden_name?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          secondary_phone?: string | null
          ssn_last_four?: string | null
          state_of_birth?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          account_number?: string | null
          account_type?: string | null
          address?: Json | null
          annual_income?: number | null
          balance?: number | null
          citizenship_status?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          document_expiry_date?: string | null
          document_number?: string | null
          document_type?: string | null
          document_url?: string | null
          email?: string | null
          employer_name?: string | null
          employment_status?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          middle_name?: string | null
          mother_maiden_name?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          secondary_phone?: string | null
          ssn_last_four?: string | null
          state_of_birth?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          tittle: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tittle?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tittle?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          description: string | null
          device_info: Json | null
          fee: number | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          recipient_account: string | null
          recipient_name: string | null
          reference_number: string
          status: string
          transaction_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          device_info?: Json | null
          fee?: number | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          recipient_account?: string | null
          recipient_name?: string | null
          reference_number: string
          status?: string
          transaction_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          device_info?: Json | null
          fee?: number | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          recipient_account?: string | null
          recipient_name?: string | null
          reference_number?: string
          status?: string
          transaction_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          created_at: string | null
          device_name: string | null
          device_type: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          location: Json | null
          os: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          browser?: string | null
          created_at?: string | null
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location?: Json | null
          os?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          browser?: string | null
          created_at?: string | null
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location?: Json | null
          os?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          author_id: string
          content: Json
          content_type: string
          created_at: string | null
          id: string
          published_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: Json
          content_type: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: Json
          content_type?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_account_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_initial_balance: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_reference_number: {
        Args: { transaction_type: string }
        Returns: string
      }
      is_admin: {
        Args: {
          _user_id: string
          _min_role?: Database["public"]["Enums"]["admin_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator" | "support"
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
      admin_role: ["super_admin", "admin", "moderator", "support"],
    },
  },
} as const
