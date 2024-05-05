<template>

    <v-container>
        <v-container>
            Enter the location of the store:
        </v-container>
        <v-autocomplete label="Enter store location" v-model="pickedLocation"
            :items="storeArray.map((store) => store.location)"></v-autocomplete>
        <v-container>
            Store Location: {{ pickedLocation }}
        </v-container>
    </v-container>


    <v-container v-if="pickedLocation">
        <v-container>Enter Product: </v-container>
        <v-autocomplete label="Choose product" v-model="pickedProduct" :items="productsArray">

        </v-autocomplete>

        <v-container v-if="pickedProduct">Total Sold: {{ totalSold }}</v-container>
    </v-container>

</template>

<script setup lang="ts">

definePageMeta({
    middleware: ["employee-only-auth"],
    layout: "topbar-layout"
})
import type { Database } from '~/lib/database.types';
const supabase = useSupabaseClient<Database>();
const pickedLocation = ref<string | null>(null);
const locationArray = ref<string[]>([]);
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([]);
const pickedProduct = ref<string | null>(null);
const productsArray = ref<string[]>([]);
const totalSold = ref<number>(0);
let productMap = new Map<string, number>();
const handleInventoryProducts = async () => {
    productsArray.value = [];
    try {
        const { data, error } = await supabase.from('Inventory').select(`
        *,
        Store!inner(*),
        Product(*)
        `)
            .match({ 'Store.location': pickedLocation.value })

        if (error) throw error;
        if (!error) {

            if (!error) {
                data.forEach((item) => {
                    const productName = item.Product?.name as string;
                    const invId = item.id;
                    if (productName && invId) {
                        productMap.set(productName, invId);
                    }
                });
                productsArray.value = Array.from(productMap.keys());
            }
            console.log("these are the products: ", productsArray.value)
        }
    } catch (error) {
        console.log(error);
    }
};

const handleFetchStores = async () => {
    try {
        const { data, error } = await supabase.from('Store').select('*');

        if (error) throw error;
        if (!error) {
            storeArray.value = data;
            // console.log("these are the store: ", storeArray.value)
        }

        //get the locations only from the object
        locationArray.value = storeArray.value
            .filter((store) => store.location !== null)
            .map((store) => store.location as string);

        console.log("here")

    } catch (error) {
        console.log(error);
    }
};
const handleTotalSold = async () => {
  // Get the inventory entry id of the product
  const invId = productMap.get(pickedProduct.value as string);
  console.log("the selected product is ", pickedProduct.value);
  console.log("the id the selected product is", invId);

  // Aggregate the total quantity column in Purchase table with rows matching inventory_id == invId
  try {
    const { data , error } = await supabase
      .from('Purchase')
      .select('quantity.sum()')
      .eq('inventory_id', invId as number)
      .single()
    const sumData = data as { sum: number } | null;

    if (error) throw error;;
    if (data) {
        console.log("the data is ", data)
        totalSold.value = sumData?.sum as number;
    }
  } catch (error) {
    console.log(error);
  }
};
handleFetchStores()
watch(pickedLocation,
    async () => {
        await handleInventoryProducts()
     
    }
)
watch(pickedProduct, async () => {
    await handleTotalSold()
})
</script>

<style scoped></style>