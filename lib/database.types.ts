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
      Cart: {
        Row: {
          created_at: string
          customer_id: string
          id: number
          product_id: number
          quantity: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: number
          product_id: number
          quantity?: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: number
          product_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Cart_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Product: {
        Row: {
          brand: string | null
          created_at: string
          description: string | null
          id: number
          name: string | null
          parent_product_type: string | null
          price: number
          product_type: string
          remaining_stock: number
          size: string | null
          store_id: number
          vendor_id: number
        }
        Insert: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          parent_product_type?: string | null
          price: number
          product_type: string
          remaining_stock?: number
          size?: string | null
          store_id: number
          vendor_id: number
        }
        Update: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          parent_product_type?: string | null
          price?: number
          product_type?: string
          remaining_stock?: number
          size?: string | null
          store_id?: number
          vendor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Product_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "Store"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Product_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "Vendor"
            referencedColumns: ["id"]
          },
        ]
      }
      Purchase: {
        Row: {
          created_at: string
          customer_id: string | null
          id: number
          product_id: number
          quantity: number
          store_id: number
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: number
          product_id: number
          quantity?: number
          store_id: number
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: number
          product_id?: number
          quantity?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Purchase_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Purchase_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Purchase_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "Store"
            referencedColumns: ["id"]
          },
        ]
      }
      Sale: {
        Row: {
          created_at: string
          customer_id: number
          id: number
          open_time: string | null
          product_id: number
          quantity: number
          store_id: number
        }
        Insert: {
          created_at?: string
          customer_id: number
          id?: number
          open_time?: string | null
          product_id: number
          quantity?: number
          store_id: number
        }
        Update: {
          created_at?: string
          customer_id?: number
          id?: number
          open_time?: string | null
          product_id?: number
          quantity?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Sale_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Store: {
        Row: {
          contact_number: number | null
          created_at: string
          id: number
          location: string | null
          time_open: string | null
        }
        Insert: {
          contact_number?: number | null
          created_at?: string
          id?: number
          location?: string | null
          time_open?: string | null
        }
        Update: {
          contact_number?: number | null
          created_at?: string
          id?: number
          location?: string | null
          time_open?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          fullname: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string
          fullname?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string
          fullname?: string | null
          id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Vendor: {
        Row: {
          contact_number: number | null
          created_at: string
          fullname: string | null
          id: number
        }
        Insert: {
          contact_number?: number | null
          created_at?: string
          fullname?: string | null
          id?: number
        }
        Update: {
          contact_number?: number | null
          created_at?: string
          fullname?: string | null
          id?: number
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
      [_ in never]: never
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
