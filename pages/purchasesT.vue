<template>
    <v-container>
        Enter the location of the store:
    </v-container>

    <v-autocomplete label="Enter store location" v-model="pickedLocation"
        :items="storeArray.map((store) => store.location)"></v-autocomplete>



        
    <v-container>
        Store Location: {{ pickedLocation }}
    </v-container>

</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["employee-only-auth"],
    layout: "topbar-layout",
});
import type { Database } from '~/lib/database.types';
type Purchase = Database['public']['Tables']['Purchase']['Row'] & {
    Store: Database['public']['Tables']['Store']['Row'];
    Vendor: Database['public']['Tables']['Product']['Row'];
  };

const supabase = useSupabaseClient();
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([]);
const locationArray = ref<string[]>([]);
const pickedLocation = ref<string | null>(null);
const purchaseArray = ref<Purchase[]>([]);
const handleFetchStores = async () => {
    try {
      const { data, error } = await supabase.from('Store').select('*');
  
      if (error) throw error;
      if (!error) {
        storeArray.value = data;
      }
  
      //get the locations only from the object
      locationArray.value = storeArray.value
        .filter((store) => store.location !== null)
        .map((store) => store.location as string);
    } catch (error) {
      console.log(error);
    }
  };

const handleFetchPurchases = async () => {
    const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;
  

    try {
      const { data, error } = await supabase
        .from('Purchase')
        .select(`
          *,
          Store!inner(
            *
          ),
          Product(
            *
          )
        `)
        .match({ 'Store.id': storeId });
  
      if (error) throw error;
      if (!error) {
        console.log(data);
        purchaseArray.value = data as Purchase[];
        // Reset visible columns when new data is fetched
        visibleColumns.value = Object.keys(inventoryArray.value[0] || {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleFetchStores();
  watch(pickedLocation, handleFetchPurchases);

</script>

<style scoped></style>