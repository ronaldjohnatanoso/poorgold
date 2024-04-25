import { acceptHMRUpdate, defineStore } from "pinia";
import type { Database } from "~/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import type { InventoryProduct } from "~/lib/table";

// type InventoryProductt = Database['public']['Tables']['Inventory']['Row'] & {
//   Product: Database['public']['Tables']['Product']['Row'];
//   Store: Database['public']['Tables']['Store']['Row'];
  
// };

export const useInventoryProductStore = defineStore({
  id: "inventoryProductStore",
  state: () => ({
    products: [] as InventoryProduct[],
  }),
  actions: {
    async fetchProducts(supabase: SupabaseClient<Database>) {
      try {
        const { data, error } = await supabase.from("Inventory").select(`
          *,
          Product(*),
          Store!inner(*)
        `)
        // .eq('Store.location', 'website')
        .match({
          'Store.location': 'website',
        })
        .gt('remaining_stock', 0)
 
        ;

        if (error) {
          throw error;
        }

        // Update the 'products' state with the fetched data
      this.products = data as InventoryProduct[];
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    async getLength(supabase: SupabaseClient<Database>) {
      try {
        const { data, error } = await supabase.from("Inventory").select(`
          *,
          Product(*),
          Store!inner(*)
        `)
        // .eq('Store.location', 'website')
        .match({
          'Store.location': 'website',
        })
        .gt('remaining_stock', 0)
 
        ;

        if (error) {
          throw error;
        }

        // Update the 'products' state with the fetched data
      console.log(data);
        this.products = data as InventoryProduct[];
        return this.products.length as number | 0;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInventoryProductStore, import.meta.hot));
}
