import { acceptHMRUpdate, defineStore } from "pinia";
import type { Database } from "~/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const useProductStore = defineStore({
  id: "productStore",
  state: () => ({
    products: [] as Database["public"]["Tables"]["Product"]["Row"][], // Initialize an empty array to store products
  }),
  actions: {
    async fetchProducts(supabase: SupabaseClient<Database>) {
      try {
        const { data, error } = await supabase.from("Product").select(`
          *,
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
        this.products = data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    async getLength(supabase: SupabaseClient<Database>) {
      try {
        const { data, error } = await supabase.from("Product").select(`
          *,
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
        this.products = data;
        return this.products.length as number | 0;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
