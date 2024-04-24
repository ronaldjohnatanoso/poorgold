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

    <!-- <v-container>
      here: {{ debugString }}
    </v-container> -->
     
    <v-container v-if="pickedLocation">
      <v-btn color="purple" v-model="addProductDialogOpen" @click="handleAddProduct">Add New Product from Vendor</v-btn>

    </v-container>

    <v-dialog v-model="addProductDialogOpen" transition="dialog-bottom-transition" width="auto">
      <v-card v-if="vendorProductArray.length > 0">
        <v-toolbar title="Add New Product">{{ correctSingleSelected?.Store_location }}</v-toolbar>
      
        <v-container>
          <span class="text-red-500">{{ statusMsg }}</span>
        </v-container>

          <v-container>
            <v-btn v-for="header in vendorHeaders" :key="header.value" @click="toggleVendorColumn(header.value)" :class="[
              'header',
              visibleVendorColumns.includes(header.value) ? 'visible' : 'hidden',
            ]">
              {{ header.title }}
            </v-btn>
          </v-container>

        <v-data-table :items="vendorProductArray" :search="vendorProductSearch" :headers="visibleVendorHeaders" select-strategy="single"
          show-select v-model-value="vendorProductSelected" @update:model-value="handleVendorProductSelect($event as Product[])"
          item-value="id" return-object></v-data-table>

          <v-container v-if="vendorProductSelected">
            <v-btn @click="handleNewProduct" color="purple">Add New Product to Store Inventory</v-btn>
            <v-card-text color="purple">Initial stock in local store will be zero, do a manual reorder to increase stock.</v-card-text>
            <v-container color="red">{{addOrderMsg}}</v-container>
          </v-container>

        <v-card-actions class="justify-end">
          <v-btn text="Close" @click="addProductDialogOpen = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



   
    <v-card v-if="inventoryArray.length > 0" title="Product Inventory and Manual Reorder" flat>
      <template v-slot:text>
        <v-text-field v-model="search" label="Search by name of product" prepend-inner-icon="mdi-magnify"
          variant="outlined" hide-details single-line></v-text-field>
      </template>

      <v-container>
        <v-row justify="space-around">
          <v-col cols="12" md="6">
            <v-dialog v-model="dialogOpen" transition="dialog-bottom-transition" width="auto">
              <v-card>
                <v-toolbar title="Manual Reorder">{{ correctSingleSelected?.Store_location }}</v-toolbar>

                <v-card-text class="text-h2 pa-12">
                  Name: {{ correctSingleSelected?.Product_name }} <br>
                  Price: P{{ correctSingleSelected?.store_price }}
                  <br>
                  Remaining stock : {{ correctSingleSelected?.remaining_stock }} <br>
                  Vendor: {{ correctSingleSelected?.Vendor_fullname }} <br>
                </v-card-text>
                <v-select v-model="reorderQuantity" label="Select quantity to be added"
                  :items="[5, 10, 20, 50, 100]"></v-select>

                <v-btn @click="handleReorderRequest">Request Reorder</v-btn>
                <v-container>
                  <span class="text-red-500">{{ statusMsg }}</span>
                </v-container>

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

      <v-data-table :items="flattenedInventoryArray" :search="search" :headers="visibleHeaders" select-strategy="single"
        show-select v-model-value="selected" @update:model-value="handleProductSelect($event as FlattenedInventory[])"
        item-value="id" return-object></v-data-table>

      <pre>{{ correctSingleSelected }}</pre>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';

definePageMeta({
  middleware: ["employee-only-auth"],
  layout: "topbar-layout",
});
import type { FlattenedInventory, Reorder } from '~/lib/table';
import type { Product } from '~/lib/table';
import type { basicInventory } from '~/lib/table';
const supabase = useSupabaseClient<Database>();
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([]);
const locationArray = ref<string[]>([]);
const pickedLocation = ref<string | null>(null);
const dialogOpen = ref(false);
const reorderQuantity = ref<number | null>(null);
import { v4 as uuidv4 } from 'uuid';
const statusMsg = ref('');
const addProductDialogOpen = ref(true);
const vendorProductArray = ref<Product[]>([]);
const visibleVendorColumns = ref<string[]>([])
//const productSelected = ref<any>();
const vendorProductSelected = ref<Product>();
const addOrderMsg = ref('');
  const handleAddProduct = async () => {
  addProductDialogOpen.value = true;
  //do an api call to get the products from the vendor
  const { data, error } = await supabase.from('Product').select('*');
  if (error) throw error;
  if (!error) {
    console.log(data);
    vendorProductArray.value = data as Product[];
    visibleVendorColumns.value = Object.keys(vendorProductArray.value[0] || {});
  }
};
const handleVendorProductSelect = (value: Product[]) => {
  vendorProductSelected.value = value[0];

};

const handleNewProduct = async () => {
  console.log(vendorProductSelected.value)

  //check if the selected product already exists in the store
  const existingProduct = inventoryArray.value.find(
    (inventory) => inventory.product_id === vendorProductSelected.value?.id
  );

  if (existingProduct) {
    addOrderMsg.value = "Product already exists in store";
    return;
  }

  addOrderMsg.value = "";
  if (vendorProductSelected.value === undefined) {
    addOrderMsg.value = "Please select a product";
    return;
  }
  //get the store id from picked location
  const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;
  console.log(storeId);

  try {
    const { error } = await supabase.from('Inventory').insert<basicInventory>({
      product_id: vendorProductSelected.value?.id,
      store_id: storeId,
      remaining_stock: 0,
      store_price: vendorProductSelected.value?.vendor_price,
      created_at : new Date().toISOString(),
      vendor_id : vendorProductSelected.value?.vendor_id
    } as Inventory)
  

    if (error) throw error;
    if (!error) {
      addOrderMsg.value = "Product added to store inventory";
    }
  } catch (error) {
    console.log(error);
    addOrderMsg.value = JSON.stringify(error);
    handleFetchInventory()
  }
};




const handleReorderRequest = async () => {
  const reorderID = uuidv4();

  //get the store id from picked location
  const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;
  console.log(storeId);

  if (reorderQuantity.value === null || correctSingleSelected.value === undefined) {
    statusMsg.value = "Please select a product and quantity";
    return;
  }

  try {
    const { error } = await supabase.from('Reorders').insert<Reorder>({
      arrival_date: "none",
      created_at: new Date().toISOString(),
      id: reorderID as string,
      product_id: correctSingleSelected.value?.product_id as number,
      quantity: reorderQuantity.value as number,
      status: "pending",
      store_id: storeId as number,
      // vendor_id: correctSingleSelected.value?.vendor_id as number

    } as Reorder)

    if (error) throw error;
    if (!error) {
      statusMsg.value = "Reorder request sent";
      dialogOpen.value = false;
      alert("Reorder request sent")
    }
  } catch (error) {
    console.log(error);
    statusMsg.value = JSON.stringify(error);

  }

  console.log(reorderQuantity.value);
};
const handleProductSelect = (value: FlattenedInventory[]) => {
  console.log(value)


  if (value.length == 0) {
    //just unchecking
    correctSingleSelected.value = undefined;
    console.log("no value")
    return;
  }

  if (value.length) {
    console.log("more than 1 value")
    correctSingleSelected.value = value[0]
    dialogOpen.value = true;
    return;
  }

};
//type joined from Product as base, joined by Store and Vendor
type Inventory = Database['public']['Tables']['Inventory']['Row'] & {
  Store: Database['public']['Tables']['Store']['Row'];
  Vendor: Database['public']['Tables']['Vendor']['Row'];
  Product: Database['public']['Tables']['Product']['Row'];
};



const inventoryArray = ref<Inventory[]>([]);
const flattenedInventoryArray = ref<FlattenedInventory[]>([]); //
const search = ref('');
const vendorProductSearch = ref('');
const selected = ref<any>(); //flattened inventory that should be at most 1 item because of single select
const visibleColumns = ref<string[]>([]);
const correctSingleSelected = ref<FlattenedInventory>();

const headers = computed(() => {
  if (flattenedInventoryArray.value.length > 0) {
    const firstItem = flattenedInventoryArray.value[0];
    return Object.keys(firstItem).map((key) => ({
      value: key,
      title: key,
      sortable: true,
    }));
  }
  return [];
});

const visibleVendorHeaders = computed(() => {
  if (visibleVendorColumns.value.length === 0 && vendorProductArray.value.length > 0) {
    visibleVendorColumns.value = Object.keys(vendorProductArray.value[0]);
  }
  return vendorHeaders.value.filter((header) => visibleVendorColumns.value.includes(header.value));
});

const toggleVendorColumn = (column: string) => {
  const index = visibleVendorColumns.value.indexOf(column);
  if (index === -1) {
    visibleVendorColumns.value.push(column);
  } else {
    visibleVendorColumns.value.splice(index, 1);
  }
};

const toggleColumn = (column: string) => {
  const index = visibleColumns.value.indexOf(column);
  if (index === -1) {
    visibleColumns.value.push(column);
  } else {
    visibleColumns.value.splice(index, 1);
  }
};

const vendorHeaders = computed(() => {
  if (vendorProductArray.value.length > 0) {
    const firstItem = vendorProductArray.value[0];
    return Object.keys(firstItem).map((key) => ({
      value: key,
      title: key,
      sortable: true,
    }));
  }
  return [];
});

const visibleHeaders = computed(() => {
  if (visibleColumns.value.length === 0 && flattenedInventoryArray.value.length > 0) {
    visibleColumns.value = Object.keys(flattenedInventoryArray.value[0]);
  }
  return headers.value.filter((header) => visibleColumns.value.includes(header.value));
});

const debugString = ref()

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
    debugString.value = JSON.stringify(error)
  }
};

const handleFetchInventory = async () => {
  //need to get the store id from picked location
  const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;

  try {
    const { data, error } = await supabase
      .from('Inventory')
      .select(`
          *,
          Store!inner(
            *
          ),
          Vendor(
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
      inventoryArray.value = data as Inventory[];
      // Reset visible columns when new data is fetched
      visibleColumns.value = Object.keys(flattenedInventoryArray.value[0] || {});
    }
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < inventoryArray.value.length; i++) {
    flattenedInventoryArray.value[i] = flattenObject(inventoryArray.value[i]);
  }

  debugString.value = JSON.stringify(flattenedInventoryArray.value)
};

handleFetchStores();
watch(pickedLocation, handleFetchInventory);




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