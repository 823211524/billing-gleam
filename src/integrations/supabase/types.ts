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
      bills: {
        Row: {
          amount: number
          consumption: number
          created_at: string
          due_date: string
          id: number
          paid: boolean
          pdf_url: string
          reading_id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          amount: number
          consumption: number
          created_at?: string
          due_date: string
          id?: number
          paid?: boolean
          pdf_url: string
          reading_id: number
          updated_at?: string
          user_id: number
        }
        Update: {
          amount?: number
          consumption?: number
          created_at?: string
          due_date?: string
          id?: number
          paid?: boolean
          pdf_url?: string
          reading_id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bills_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: true
            referencedRelation: "readings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consumers: {
        Row: {
          address: string
          created_at: string | null
          disabled_at: string | null
          email: string
          given_name: string
          id: string
          is_enabled: boolean | null
          surname: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          disabled_at?: string | null
          email: string
          given_name: string
          id?: string
          is_enabled?: boolean | null
          surname: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          disabled_at?: string | null
          email?: string
          given_name?: string
          id?: string
          is_enabled?: boolean | null
          surname?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meters: {
        Row: {
          consumer_id: number | null
          created_at: string
          id: string
          is_enabled: boolean
          latitude: number
          longitude: number
          qr_code: string
          secret_word: string | null
          table_name: string | null
          updated_at: string
        }
        Insert: {
          consumer_id?: number | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          latitude: number
          longitude: number
          qr_code: string
          secret_word?: string | null
          table_name?: string | null
          updated_at?: string
        }
        Update: {
          consumer_id?: number | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          latitude?: number
          longitude?: number
          qr_code?: string
          secret_word?: string | null
          table_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meters_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      readings: {
        Row: {
          created_at: string
          id: number
          image_location: Json | null
          image_url: string
          manual_input: boolean
          meter_id: string
          month: number
          ocr_confidence: number | null
          reading: number
          updated_at: string
          user_id: number
          validated: boolean
          validated_by_admin: boolean
          validated_by_consumer: boolean
          validation_errors: string[] | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: number
          image_location?: Json | null
          image_url: string
          manual_input?: boolean
          meter_id: string
          month: number
          ocr_confidence?: number | null
          reading: number
          updated_at?: string
          user_id: number
          validated?: boolean
          validated_by_admin?: boolean
          validated_by_consumer?: boolean
          validation_errors?: string[] | null
          year: number
        }
        Update: {
          created_at?: string
          id?: number
          image_location?: Json | null
          image_url?: string
          manual_input?: boolean
          meter_id?: string
          month?: number
          ocr_confidence?: number | null
          reading?: number
          updated_at?: string
          user_id?: number
          validated?: boolean
          validated_by_admin?: boolean
          validated_by_consumer?: boolean
          validation_errors?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "readings_meter_id_fkey"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string
          created_at: string
          disabled_at: string | null
          email: string
          given_name: string
          id: number
          is_enabled: boolean
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          secret_word: string | null
          surname: string
          table_name: string | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          disabled_at?: string | null
          email: string
          given_name: string
          id?: number
          is_enabled?: boolean
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          secret_word?: string | null
          surname: string
          table_name?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          disabled_at?: string | null
          email?: string
          given_name?: string
          id?: number
          is_enabled?: boolean
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          secret_word?: string | null
          surname?: string
          table_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          id: number
          billing_rate: number
          reading_due_day: number
          payment_grace_period: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          billing_rate: number
          reading_due_day: number
          payment_grace_period: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          billing_rate?: number
          reading_due_day?: number
          payment_grace_period?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "ADMIN" | "CONSUMER"
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
