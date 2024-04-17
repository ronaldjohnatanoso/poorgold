import { acceptHMRUpdate, defineStore } from 'pinia';
import type { Database } from '~/lib/database.types';

const supabase = useSupabaseClient<Database>()

export const useProductStore = defineStore({
  id: 'productStore',
  state: () => ({
    products: [] as any[] , // Initialize an empty array to store products
  }),
  actions: {
    async fetchProducts() {
      try {
        const { data, error } = await supabase.from('Product').select('*'); // Select all columns from the 'Products' table

        if (error) {
          throw error;
        }

        // Update the 'products' state with the fetched data
        this.products = data ;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}