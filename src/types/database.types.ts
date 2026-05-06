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
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          scheduled_time: string
          day_of_week: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          scheduled_time: string
          day_of_week: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          scheduled_time?: string
          day_of_week?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          habit_id: string
          date: string
          status_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          date: string
          status_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          date?: string
          status_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      super_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          start_date: string
          end_date: string
          target_count: number
          current_count: number
          status: 'active' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          start_date?: string
          end_date: string
          target_count: number
          current_count?: number
          status?: 'active' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          start_date?: string
          end_date?: string
          target_count?: number
          current_count?: number
          status?: 'active' | 'completed' | 'failed'
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
  }
}
