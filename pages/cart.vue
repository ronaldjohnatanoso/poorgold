<template>
  
    <v-container>
  
  
 <!-- <v-container>
        here: {{ debugString }}
      </v-container>   -->
      <v-card title="My Cart"></v-card>
  
      <v-card v-if="nestedCartInventoryProduct.length > 0" flat>
        <template v-slot:text>
          <v-text-field v-model="search" label="Search by name of product" prepend-inner-icon="mdi-magnify"
            variant="outlined" hide-details single-line></v-text-field>
        </template>
  
        <v-container>
          <v-row justify="space-around">

            
            <v-col cols="12" md="6">
              <v-dialog v-model="dialogOpen" transition="dialog-bottom-transition" width="auto">
                <v-card>
                  <v-toolbar title="Delete?"> </v-toolbar>
  
    
  
          
  
          
                  <v-btn class="m-2" @click="handleOrderDelete">Delete </v-btn>
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
        <v-container>
            <v-btn @click="handleCheckOut">Check out</v-btn>
        </v-container>
        <v-container >
           Total:  {{total}}
        </v-container>
  
        <v-container color>{{statusMsg}}</v-container>
        <v-data-table :items="flatCartArray" :search="search" :headers="visibleHeaders" select-strategy="single"
          show-select v-model-value="selected" @update:model-value="handleProductSelect($event as any[])"
          item-value="Product_name" return-object></v-data-table>
  
        <pre>{{ correctSingleSelected }}</pre>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { handleError } from 'vue';
import type { Database } from '~/lib/database.types';
  
  definePageMeta({
    //middleware: ["vendor-only-auth"],
    layout: "topbar-layout",
  });
  import type { CartInventoryProduct, FlattenedInventory, Reorder } from '~/stores/table';
  const supabase = useSupabaseClient<Database>();
  const dialogOpen = ref(false);
  const openTable =ref<boolean>(true)
  const statusMsg = ref('');
  const date = ref()
  const total = ref<number>(0)

const handleOrderDelete = async () => {


    const {error}  = await supabase.from('Cart').delete().eq( 'id', correctSingleSelected.value.id)

    if(error)  {
        statusMsg.value = "Error deleting"
        console.log("error deleteing")
    } else {
        statusMsg.value = "Deleted"
        console.log("deleted")
        dialogOpen.value = false
        await handleFetchReorders()
        
        calculateTotal()
    }


    

} 

  const calculateTotal = () => {
    let sum = 0
    for (let i = 0; i < flatCartArray.value.length; i++) {
      sum += flatCartArray.value[i].Inventory_store_price
    }
    total.value = sum
  }

  const handleCheckOut = async () => {
  //check if any of the remaining stock is less than the quantity
  for (let i = 0; i < flatCartArray.value.length; i++) {
    if (flatCartArray.value[i].Inventory_remaining_stock < 1) {
      statusMsg.value = "One of the items is out of stock";
      return;
    }
  }

  // Condense similar products and accumulate quantities
  const condensedProducts : any = {};
  for (const product of flatCartArray.value) {
    const productId = product.Product_id;
    if (condensedProducts[productId]) {
      condensedProducts[productId].quantity += 1;
    } else {
      condensedProducts[productId] = {
        ...product,
        quantity: 1,
      };
    }
  }

  // Check if quantities are less than remaining stock and update stock
  
  for (const condensedProduct of Object.values(condensedProducts) as any) {
    const remainingStock = condensedProduct.Inventory_remaining_stock;
    if (condensedProduct.quantity > remainingStock) {
      statusMsg.value = `Not enough stock for ${condensedProduct.Product_name}`;
      return;
    } else {
      // Update the remaining stock in the database
      const { error } = await supabase
        .from('Inventory')
        .update({ remaining_stock: remainingStock - condensedProduct.quantity } as any)
        .eq('id', condensedProduct.Inventory_id);

      if (error) {
        statusMsg.value = 'Error updating stock';
        console.error('Error updating stock:', error);
        return;
      }
    }
  }

  // Checkout successful, perform any additional actions needed
  statusMsg.value = 'Checkout successful!';
  // Clear the cart or perform other post-checkout actions
  const myID = await roleStore.getUserId();
  // Clear the cart after successful checkout
const { error: clearError } = await supabase
  .from('Cart')
  .delete()
  .match({ customer_id: myID });

if (clearError) {
  statusMsg.value = 'Error clearing cart';
  console.error('Error clearing cart:', clearError);
} else {
  // Reset flatCartArray and nestedCartInventoryProduct
  flatCartArray.value = [];
  nestedCartInventoryProduct.value = [];
  statusMsg.value = 'Cart cleared successfully';
}

    await handleFetchReorders()

};

  const handleProductSelect = (value: any[]) => {
    statusMsg.value = "";
  
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
  
  
  const nestedCartInventoryProduct = ref<CartInventoryProduct[]>([]);
  const flatCartArray = ref<any[]>([]); //
  const search = ref('');
  const selected = ref<any>(); //flattened inventory that should be at most 1 item because of single select
  const visibleColumns = ref<string[]>([]);
  const correctSingleSelected = ref<any>();
  
  const headers = computed(() => {
    if (flatCartArray.value.length > 0) {
      const firstItem = flatCartArray.value[0];
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
    if (visibleColumns.value.length === 0 && flatCartArray.value.length > 0) {
      visibleColumns.value = Object.keys(flatCartArray.value[0]);
    }
    return headers.value.filter((header) => visibleColumns.value.includes(header.value));
  });
  
  const debugString = ref()
  
  const roleStore = useRoleStore()

  
  const handleFetchReorders = async () => {
  const myID = await roleStore.getUserId();

  try {
    const { data, error } = await supabase
      .from('Cart')
      .select(`
        *,
        Inventory(
          *
        ),
        Product(
          *
        )
      `)
      .match({ 'customer_id': myID });

    if (error) throw error;
    if (!error) {
      console.log(data);
      nestedCartInventoryProduct.value = data as CartInventoryProduct[]; // Update nestedCartInventoryProduct directly
      // Reset visible columns when new data is fetched
      visibleColumns.value = Object.keys(flatCartArray.value[0] || {});

      // Update flatCartArray based on nestedCartInventoryProduct
      flatCartArray.value = nestedCartInventoryProduct.value.map(item => flattenObject(item));
    }
  } catch (error) {
    console.log("error");
    console.log(error);
  }

  debugString.value = JSON.stringify(nestedCartInventoryProduct.value);
};


  await handleFetchReorders();

  calculateTotal()
  //handleFetchStores();
  //watch(pickedLocation, handleFetchInventory);
  
  
  debugString.value = date.value
  
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