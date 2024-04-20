import type { Database } from "~/lib/database.types";

export type FlattenedInventory = {
    id: number;
    created_at: string;
    vendor_id: number;
    store_id: number;
    store_price: number;
    remaining_stock: number;
    product_id: number;
    Store_id: number;
    Store_location: string;
    Store_time_open: string;
    Store_created_at: string;
    Store_contact_number: number;
    Vendor_id: number;
    Vendor_fullname: string;
    Vendor_created_at: string;
    Vendor_contact_number: number;
    Product_id: number;
    Product_name: string;
    Product_size: string;
    Product_brand: string;
    Product_vendor_id: number;
    Product_created_at: string;
    Product_description: string;
    Product_product_type: string;
    Product_vendor_price: number;
    Product_parent_product_type: null;
  };

  export type Reorder = Database["public"]["Tables"]["Reorders"]["Row"]


  export type InventoryProduct = Database["public"]["Tables"]["Inventory"]["Row"] & {  Product : Database["public"]["Tables"]["Product"]["Row"] ;
    Store : Database["public"]["Tables"]["Store"]["Row"]
   }


   export type Store = Database["public"]["Tables"]["Store"]["Row"]
   export type Product = Database["public"]["Tables"]["Product"]["Row"]
  export type ReorderStoreProduct = Reorder & {Store : Store, Product : Product}