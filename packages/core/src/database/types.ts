export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          plan: 'free' | 'basic' | 'premium'
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: 'free' | 'basic' | 'premium'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: 'free' | 'basic' | 'premium'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          tenant_id: string
          name: string
          address: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          address: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          address?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          tenant_id: string
          name: string
          email: string
          phone: string | null
          role: 'admin' | 'professional' | 'reception'
          password_hash: string | null
          auth_provider: 'supabase' | 'google' | 'microsoft' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          email: string
          phone?: string | null
          role: 'admin' | 'professional' | 'reception'
          password_hash?: string | null
          auth_provider?: 'supabase' | 'google' | 'microsoft' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'admin' | 'professional' | 'reception'
          password_hash?: string | null
          auth_provider?: 'supabase' | 'google' | 'microsoft' | null
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          unit_id: string
          name: string
          bio: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          name: string
          bio?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          bio?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          tenant_id: string
          name: string
          email: string
          phone: string | null
          consent_flags: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          email: string
          phone?: string | null
          consent_flags?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          email?: string
          phone?: string | null
          consent_flags?: Json
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          tenant_id: string
          name: string
          duration_min: number
          base_price: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          duration_min: number
          base_price: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          duration_min?: number
          base_price?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      schedule_rules: {
        Row: {
          id: string
          calendar_id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_min: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          calendar_id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_min?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          calendar_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          slot_min?: number
          created_at?: string
          updated_at?: string
        }
      }
      time_off: {
        Row: {
          id: string
          calendar_id: string
          start: string
          end: string
          reason: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          calendar_id: string
          start: string
          end: string
          reason: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          calendar_id?: string
          start?: string
          end?: string
          reason?: string
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          tenant_id: string
          unit_id: string
          customer_id: string
          professional_id: string
          service_id: string
          start: string
          end: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'completed'
          source: 'web' | 'phone' | 'walk_in'
          price_estimate: number
          notes: string | null
          idempotency_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          unit_id: string
          customer_id: string
          professional_id: string
          service_id: string
          start: string
          end: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'completed'
          source?: 'web' | 'phone' | 'walk_in'
          price_estimate: number
          notes?: string | null
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          unit_id?: string
          customer_id?: string
          professional_id?: string
          service_id?: string
          start?: string
          end?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'completed'
          source?: 'web' | 'phone' | 'walk_in'
          price_estimate?: number
          notes?: string | null
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          tenant_id: string
          channel: 'email' | 'sms' | 'push'
          to: string
          template_code: string
          payload_json: Json
          status: 'pending' | 'sent' | 'failed'
          scheduled_for: string
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          channel: 'email' | 'sms' | 'push'
          to: string
          template_code: string
          payload_json: Json
          status?: 'pending' | 'sent' | 'failed'
          scheduled_for: string
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          channel?: 'email' | 'sms' | 'push'
          to?: string
          template_code?: string
          payload_json?: Json
          status?: 'pending' | 'sent' | 'failed'
          scheduled_for?: string
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
