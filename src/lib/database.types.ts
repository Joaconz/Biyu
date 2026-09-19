// ATENCIÓN: escrito a mano con el formato de `supabase gen types typescript`, porque no había
// Docker para correr el generador. No está verificado contra la base real y el orden de las
// columnas puede diferir del generado. Regenerar con `npm run gen:types` (supabase start antes).
// Los `numeric` figuran como `number`: los montos NO se deben parsear como float (C2).
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
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: Database["public"]["Enums"]["account_type"]
          currency: Database["public"]["Enums"]["currency_code"]
          archived_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          type: Database["public"]["Enums"]["account_type"]
          currency: Database["public"]["Enums"]["currency_code"]
          archived_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
          currency?: Database["public"]["Enums"]["currency_code"]
          archived_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          icon: string | null
          archived_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          color?: string | null
          icon?: string | null
          archived_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          icon?: string | null
          archived_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          id: string
          user_id: string
          transaction_id: string | null
          person: string
          amount: number
          currency: Database["public"]["Enums"]["currency_code"]
          fx_rate: number | null
          amount_ars: number | null
          direction: Database["public"]["Enums"]["debt_direction"]
          status: Database["public"]["Enums"]["debt_status"]
          settled_at: string | null
          notes: string | null
          incurred_on: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          transaction_id?: string | null
          person: string
          amount: number
          currency: Database["public"]["Enums"]["currency_code"]
          fx_rate?: number | null
          amount_ars?: never
          direction: Database["public"]["Enums"]["debt_direction"]
          status?: Database["public"]["Enums"]["debt_status"]
          settled_at?: string | null
          notes?: string | null
          incurred_on: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_id?: string | null
          person?: string
          amount?: number
          currency?: Database["public"]["Enums"]["currency_code"]
          fx_rate?: number | null
          amount_ars?: never
          direction?: Database["public"]["Enums"]["debt_direction"]
          status?: Database["public"]["Enums"]["debt_status"]
          settled_at?: string | null
          notes?: string | null
          incurred_on?: string
          created_at?: string
        }
        Relationships: [
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
          id: string
          user_id: string
          period: string
          ars_per_usd: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          period: string
          ars_per_usd: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: string
          ars_per_usd?: number
          created_at?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          id: string
          user_id: string
          transaction_id: string
          period: string
          installment_number: number
          amount: number
          amount_ars: number
        }
        Insert: {
          id?: string
          user_id?: string
          transaction_id: string
          period: string
          installment_number: number
          amount: number
          amount_ars: number
        }
        Update: {
          id?: string
          user_id?: string
          transaction_id?: string
          period?: string
          installment_number?: number
          amount?: number
          amount_ars?: number
        }
        Relationships: [
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
          id: string
          user_id: string
          name: string
          amount: number
          currency: Database["public"]["Enums"]["currency_code"]
          category_id: string
          account_id: string
          billing_day: number
          start_period: string
          end_period: string | null
          generate_from_period: string
          status: Database["public"]["Enums"]["subscription_status"]
          paused_at: string | null
          cancelled_at: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          amount: number
          currency: Database["public"]["Enums"]["currency_code"]
          category_id: string
          account_id: string
          billing_day: number
          start_period: string
          end_period?: string | null
          generate_from_period: string
          status?: Database["public"]["Enums"]["subscription_status"]
          paused_at?: string | null
          cancelled_at?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          currency?: Database["public"]["Enums"]["currency_code"]
          category_id?: string
          account_id?: string
          billing_day?: number
          start_period?: string
          end_period?: string | null
          generate_from_period?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          paused_at?: string | null
          cancelled_at?: string | null
          description?: string | null
          created_at?: string
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
          id: string
          user_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          amount: number
          currency: Database["public"]["Enums"]["currency_code"]
          fx_rate: number | null
          amount_ars: number | null
          category_id: string | null
          account_id: string
          installments_count: number
          first_period: string
          description: string | null
          occurred_on: string
          subscription_id: string | null
          subscription_period: string | null
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          type: Database["public"]["Enums"]["transaction_type"]
          amount: number
          currency: Database["public"]["Enums"]["currency_code"]
          fx_rate?: number | null
          amount_ars?: never
          category_id?: string | null
          account_id: string
          installments_count?: number
          first_period: string
          description?: string | null
          occurred_on: string
          subscription_id?: string | null
          subscription_period?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          amount?: number
          currency?: Database["public"]["Enums"]["currency_code"]
          fx_rate?: number | null
          amount_ars?: never
          category_id?: string | null
          account_id?: string
          installments_count?: number
          first_period?: string
          description?: string | null
          occurred_on?: string
          subscription_id?: string | null
          subscription_period?: string | null
          deleted_at?: string | null
          created_at?: string
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
      [_ in never]: never
    }
    Enums: {
      account_type: "credit_card" | "debit_card" | "cash" | "bank_account" | "wallet"
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

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

export const Constants = {
  public: {
    Enums: {
      account_type: ["credit_card", "debit_card", "cash", "bank_account", "wallet"],
      currency_code: ["ARS", "USD"],
      debt_direction: ["owed_to_me", "i_owe"],
      debt_status: ["pending", "settled"],
      subscription_status: ["active", "paused", "cancelled"],
      transaction_type: ["expense", "income"],
    },
  },
} as const
