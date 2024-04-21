<template>
    <v-container>
      Enter the location of the store:
    </v-container>
    <v-container>
      <v-autocomplete
        label="Enter store location"
        v-model="pickedLocation"
        :items="storeArray.map((store) => store.location)"
      ></v-autocomplete>
      <v-container>
        Store Location: {{ pickedLocation }}
      </v-container>
<!--   
      <v-container>
        {{ debugString }}
      </v-container> -->

      <v-card v-if="purchaseArray.length > 0" title="Store Purchases" flat>
        <template v-slot:text>
          <v-text-field
            v-model="search"
            label="Search by name of product"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </template>
  
        <v-btn
          v-for="header in headers"
          :key="header.value"
          @click="toggleColumn(header.value)"
          :class="[
            'header',
            visibleColumns.includes(header.value) ? 'visible' : 'hidden',
          ]"
        >
          {{ header.title }}
        </v-btn>
  
        <v-data-table
          :items="purchaseArray"
          :search="search"
          :headers="visibleHeaders"
  
        ></v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import type { Database } from '~/lib/database.types';
  
  definePageMeta({
    middleware: ["employee-only-auth"],
    layout: "topbar-layout",
  });
  
  const supabase = useSupabaseClient();
  const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([]);
  const locationArray = ref<string[]>([]);
  const pickedLocation = ref<string | null>(null);
  
  //type joined from Product as base, joined by Store and Vendor
  type Purchase = Database['public']['Tables']['Purchase']['Row'] & {
    Store: Database['public']['Tables']['Store']['Row'];
    Inventory: Database['public']['Tables']['Inventory']['Row'];
  };
  
  const purchaseArray = ref<Purchase[]>([]);
  
  const search = ref('');
  
  const visibleColumns = ref<string[]>([]);
  
  const headers = computed(() => {
    if (purchaseArray.value.length > 0) {
      const firstItem = purchaseArray.value[0];
      return Object.keys(firstItem).map((key) => ({
        value: key,
        title: key,
        sortable: true,
      }));
    }
    return [];
  });
  
  const toggleColumn = (column: string) => {
    const index = visibleColumns.value.indexOf(column);
    if (index === -1) {
      visibleColumns.value.push(column);
    } else {
      visibleColumns.value.splice(index, 1);
    }
  };
  
  const visibleHeaders = computed(() => {
    return headers.value.filter((header) => visibleColumns.value.includes(header.value));
  });
  
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
  const debugString = ref()
  const handleFetchPurchase = async () => {
    //need to get the store id from picked location
    const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;
  
    try {
      const { data, error } = await supabase
        .from('Purchase')
        .select(`
          *,
          Store!inner(
            *
          ),Inventory(*)
   
        `)
        .match({ 'Store.id': storeId });
  
      if (error) throw error;
      if (!error) {
        console.log(data);
        purchaseArray.value = data  ;
        // Reset visible columns when new data is fetched
        visibleColumns.value = Object.keys(purchaseArray.value[0] || {});
      }
    } catch (error) {
      console.log(error);
    }
    debugString.value = JSON.stringify(purchaseArray.value)
    for (let i = 0; i < purchaseArray.value.length; i++) {
      purchaseArray.value[i] = flattenObject(purchaseArray.value[i]);
    }
    
   // debugString.value = JSON.stringify(purchaseArray.value)
  };
  
  handleFetchStores();
  watch(pickedLocation, handleFetchPurchase);



  </script>
  
  <style scoped>
  .header {
    font-size: 10px;
    color: black;
    background-color: rgb(233, 176, 176);
  }
  
  .visible {
    background-color: lightblue;
  }
  
  .hidden {
    background-color: rgb(233, 176, 176);
  }
  </style>