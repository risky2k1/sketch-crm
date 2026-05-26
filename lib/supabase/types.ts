export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      calendar_event_reminders: {
        Row: {
          id: string;
          event_id: string;
          workspace_id: string;
          remind_before_minutes: number;
          channels: string[];
          enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          workspace_id: string;
          remind_before_minutes: number;
          channels?: string[];
          enabled?: boolean;
          created_at?: string;
        };
        Update: {
          remind_before_minutes?: number;
          channels?: string[];
          enabled?: boolean;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          workspace_id: string;
          created_by: string;
          title: string;
          description: string | null;
          location: string | null;
          starts_at: string;
          ends_at: string | null;
          all_day: boolean;
          timezone: string;
          color: string | null;
          type: "general" | "birthday" | "task" | "meeting" | "reminder";
          rrule: string | null;
          recurrence_enabled: boolean;
          recurrence_until: string | null;
          lunar_enabled: boolean;
          lunar_day: number | null;
          lunar_month: number | null;
          lunar_is_leap_month: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          created_by: string;
          title: string;
          description?: string | null;
          location?: string | null;
          starts_at: string;
          ends_at?: string | null;
          all_day?: boolean;
          timezone?: string;
          color?: string | null;
          type?: "general" | "birthday" | "task" | "meeting" | "reminder";
          rrule?: string | null;
          recurrence_enabled?: boolean;
          recurrence_until?: string | null;
          lunar_enabled?: boolean;
          lunar_day?: number | null;
          lunar_month?: number | null;
          lunar_is_leap_month?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          location?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          all_day?: boolean;
          timezone?: string;
          color?: string | null;
          type?: "general" | "birthday" | "task" | "meeting" | "reminder";
          rrule?: string | null;
          recurrence_enabled?: boolean;
          recurrence_until?: string | null;
          lunar_enabled?: boolean;
          lunar_day?: number | null;
          lunar_month?: number | null;
          lunar_is_leap_month?: boolean;
          metadata?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          domain: string | null;
          industry: string | null;
          size: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          domain?: string | null;
          industry?: string | null;
          size?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          updated_by?: string;
        };
        Update: {
          name?: string;
          domain?: string | null;
          industry?: string | null;
          size?: string | null;
          description?: string | null;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          workspace_id: string;
          recipient_id: string;
          actor_id: string | null;
          source_type: "calendar_event" | "task" | "deal" | "system";
          source_id: string | null;
          title: string;
          body: string | null;
          channels: string[];
          status: "pending" | "sent" | "read" | "failed";
          scheduled_for: string | null;
          sent_at: string | null;
          read_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          recipient_id: string;
          actor_id?: string | null;
          source_type: "calendar_event" | "task" | "deal" | "system";
          source_id?: string | null;
          title: string;
          body?: string | null;
          channels?: string[];
          status?: "pending" | "sent" | "read" | "failed";
          scheduled_for?: string | null;
          sent_at?: string | null;
          read_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "sent" | "read" | "failed";
          read_at?: string | null;
          sent_at?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          updated_by?: string;
        };
        Update: {
          name?: string;
          slug?: string | null;
          owner_id?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: "owner" | "admin" | "member" | "viewer";
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member" | "viewer";
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          updated_by?: string;
        };
        Update: {
          role?: "owner" | "admin" | "member" | "viewer";
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_workspace: {
        Args: { workspace_name: string };
        Returns: Database["public"]["Tables"]["workspaces"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
