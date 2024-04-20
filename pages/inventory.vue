<template>
  <v-container>
    Enter the location of the store:
  </v-container>
  <v-container>
    <v-autocomplete label="Enter store location" v-model="pickedLocation"
      :items="storeArray.map((store) => store.location)"></v-autocomplete>
    <v-container>
      Store Location: {{ pickedLocation }}
    </v-container>

    <v-card v-if="inventoryArray.length > 0" title="Product Inventory" flat>
      <template v-slot:text>
        <v-text-field v-model="search" label="Search by name of product" prepend-inner-icon="mdi-magnify"
          variant="outlined" hide-details single-line></v-text-field>
      </template>

      <v-container>
        <v-row justify="space-around">
          <v-col cols="12" md="6">
            <v-dialog v-model="dialogOpen" transition="dialog-bottom-transition" width="auto">
              <v-card>
                <v-toolbar title="Product Update and Reorder">{{selected?.name}}</v-toolbar>

                <v-card-text class="text-h2 pa-12">
                  obj: {{ selected[0] }}
                  <br>
                  string : {{selected[0].name}}
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn text="Close" @click="dialogOpen = false"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>

          <v-col cols="12" md="6">

          </v-col>
        </v-row>
      </v-container>

      <v-btn v-for="header in headers" :key="header.value" @click="toggleColumn(header.value)" :class="[
        'header',
        visibleColumns.includes(header.value) ? 'visible' : 'hidden',
      ]">
        {{ header.title }}
      </v-btn>

      <v-data-table :items="inventoryArray" :search="search" :headers="visibleHeaders" select-strategy="single"
        show-select v-model-value="selected" @update:model-value="handleProductSelect($event as Inventory)"
        item-value="id" return-object></v-data-table>

      <pre>{{ selected }}</pre>
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
const dialogOpen = ref(false);
const handleProductSelect = (value: Inventory) => {
  selected.value = value;
  dialogOpen.value = true;
  console.log(selected.value.name);
};

//type joined from Product as base, joined by Store and Vendor
type Inventory = Database['public']['Tables']['Product']['Row'] & {
  Store: Database['public']['Tables']['Store']['Row'];
  Vendor: Database['public']['Tables']['Vendor']['Row'];
};

type FlattenedInventory = {
     id : string,
     created_at :  string,
     name :  string,
     vendor_id: number,
     store_id: number,
     brand  :  string,
     product_type  :  string,
     size  :  string,
     parent_product_type :  string,
     price: number,
     description :  string,
     remaining_stock: number,
     Store_id: number,
     Store_location :  string,
     Store_time_open :  string,
     Store_created_at :  string,
     Store_contact_number: number,
     Vendor_id : number,
     Vendor_fullname :  string,
     Vendor_created_at :  string,
     Vendor_contact_number : number
    
};

const inventoryArray = ref<Inventory[]>([]);
const flattenedInventoryArray = ref<FlattenedInventory[]>([]);
const search = ref('');
const selected = ref<Inventory | null>(null);
const visibleColumns = ref<string[]>([]);

const headers = computed(() => {
  if (inventoryArray.value.length > 0) {
    const firstItem = inventoryArray.value[0];
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
  if (visibleColumns.value.length === 0 && inventoryArray.value.length > 0) {
    visibleColumns.value = Object.keys(inventoryArray.value[0]);
  }
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

const handleFetchInventory = async () => {
  //need to get the store id from picked location
  const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;

  try {
    const { data, error } = await supabase
      .from('Product')
      .select(`
          *,
          Store!inner(
            *
          ),
          Vendor(
            *
          )
        `)
      .match({ 'Store.id': storeId });

    if (error) throw error;
    if (!error) {
      console.log(data);
      inventoryArray.value = data as Inventory[];
      // Reset visible columns when new data is fetched
      visibleColumns.value = Object.keys(inventoryArray.value[0] || {});
    }
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < inventoryArray.value.length; i++) {
    inventoryArray.value[i] = flattenObject(inventoryArray.value[i]);
  }
};

handleFetchStores();
watch(pickedLocation, handleFetchInventory);

function flattenObject(obj: any, prefix = ''): any {
  const result: { [key: string]: any } = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}


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