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
      profiles: {
        Row: {
          id: string
          name: string
          is_moderator: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          is_moderator?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_moderator?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: number
          task: string
          proof_type: 'photo' | 'text' | 'screenshot'
          description: string
          created_at: string
        }
        Insert: {
          id?: number
          task: string
          proof_type: 'photo' | 'text' | 'screenshot'
          description: string
          created_at?: string
        }
        Update: {
          id?: number
          task?: string
          proof_type?: 'photo' | 'text' | 'screenshot'
          description?: string
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          task_id: number
          proof: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: number
          proof: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: number
          proof?: string
          status?: 'pending' | 'approved' | 'rejected'
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