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
      accounts: {
        Row: {
          archived_at: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          id: string
          name: string
          type: Database["public"]["Enums"]["account_type"]
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          name: string
          type: Database["public"]["Enums"]["account_type"]
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          archived_at: string | null
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          amount: number
          amount_ars: number | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          direction: Database["public"]["Enums"]["debt_direction"]
          fx_rate: number | null
          id: string
          incurred_on: string
          notes: string | null
          person: string
          settled_at: string | null
          status: Database["public"]["Enums"]["debt_status"]
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          amount_ars?: number | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          direction: Database["public"]["Enums"]["debt_direction"]
          fx_rate?: number | null
          id?: string
          incurred_on: string
          notes?: string | null
          person: string
          settled_at?: string | null
          status?: Database["public"]["Enums"]["debt_status"]
          transaction_id?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          amount_ars?: number | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          direction?: Database["public"]["Enums"]["debt_direction"]
          fx_rate?: number | null
          id?: string
          incurred_on?: string
          notes?: string | null
          person?: string
          settled_at?: string | null
          status?: Database["public"]["Enums"]["debt_status"]
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debts_transaction_fk"
            columns: ["transaction_id", "user_id"]
            isOneToOne: false
            referencedRelation: "ledger_integrity_violations"
            referencedColumns: ["transaction_id", "user_id"]
          },
          {
            foreignKeyName: "debts_transaction_fk"
            columns: ["transaction_id", "user_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      fx_rates: {
        Row: {
          ars_per_usd: number
          created_at: string
          id: string
          period: string
          user_id: string
        }
        Insert: {
          ars_per_usd: number
          created_at?: string
          id?: string
          period: string
          user_id?: string
        }
        Update: {
          ars_per_usd?: number
          created_at?: string
          id?: string
          period?: string
          user_id?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          amount_ars: number
          id: string
          installment_number: number
          period: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          amount: number
          amount_ars: number
          id?: string
          installment_number: number
          period: string
          transaction_id: string
          user_id?: string
        }
        Update: {
          amount?: number
          amount_ars?: number
          id?: string
          installment_number?: number
          period?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_transaction_fk"
            columns: ["transaction_id", "user_id"]
            isOneToOne: false
            referencedRelation: "ledger_integrity_violations"
            referencedColumns: ["transaction_id", "user_id"]
          },
          {
            foreignKeyName: "ledger_entries_transaction_fk"
            columns: ["transaction_id", "user_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string
          amount: number
          billing_day: number
          cancelled_at: string | null
          category_id: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          description: string | null
          end_period: string | null
          generate_from_period: string
          id: string
          name: string
          paused_at: string | null
          start_period: string
          status: Database["public"]["Enums"]["subscription_status"]
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          billing_day: number
          cancelled_at?: string | null
          category_id: string
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          end_period?: string | null
          generate_from_period: string
          id?: string
          name: string
          paused_at?: string | null
          start_period: string
          status?: Database["public"]["Enums"]["subscription_status"]
          user_id?: string
        }
        Update: {
          account_id?: string
          amount?: number
          billing_day?: number
          cancelled_at?: string | null
          category_id?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          end_period?: string | null
          generate_from_period?: string
          id?: string
          name?: string
          paused_at?: string | null
          start_period?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_fk"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "subscriptions_category_fk"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          amount_ars: number | null
          category_id: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          deleted_at: string | null
          description: string | null
          first_period: string
          fx_rate: number | null
          id: string
          installments_count: number
          occurred_on: string
          subscription_id: string | null
          subscription_period: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          amount_ars?: number | null
          category_id?: string | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          deleted_at?: string | null
          description?: string | null
          first_period: string
          fx_rate?: number | null
          id?: string
          installments_count?: number
          occurred_on: string
          subscription_id?: string | null
          subscription_period?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Update: {
          account_id?: string
          amount?: number
          amount_ars?: number | null
          category_id?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          deleted_at?: string | null
          description?: string | null
          first_period?: string
          fx_rate?: number | null
          id?: string
          installments_count?: number
          occurred_on?: string
          subscription_id?: string | null
          subscription_period?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_fk"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "transactions_category_fk"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "transactions_subscription_fk"
            columns: ["subscription_id", "user_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
    }
    Views: {
      ledger_integrity_violations: {
        Row: {
          entries_amount: number | null
          entries_amount_ars: number | null
          transaction_amount: number | null
          transaction_amount_ars: number | null
          transaction_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_transaction: {
        Args: {
          p_account_id: string
          p_amount: number
          p_category_id: string
          p_currency: Database["public"]["Enums"]["currency_code"]
          p_description?: string
          p_fx_rate: number
          p_installments_count: number
          p_occurred_on: string
          p_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: string
      }
    }
    Enums: {
      account_type:
        | "credit_card"
        | "debit_card"
        | "cash"
        | "bank_account"
        | "wallet"
      currency_code: "ARS" | "USD"
      debt_direction: "owed_to_me" | "i_owe"
      debt_status: "pending" | "settled"
      subscription_status: "active" | "paused" | "cancelled"
      transaction_type: "expense" | "income"
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
      account_type: [
        "credit_card",
        "debit_card",
        "cash",
        "bank_account",
        "wallet",
      ],
      currency_code: ["ARS", "USD"],
      debt_direction: ["owed_to_me", "i_owe"],
      debt_status: ["pending", "settled"],
      subscription_status: ["active", "paused", "cancelled"],
      transaction_type: ["expense", "income"],
    },
  },
} as const

