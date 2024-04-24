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
        <!--   
      <v-container>
        {{ debugString }}
      </v-container> -->

        <v-card>



        </v-card>

        <v-card v-if="pickedLocation" title="Cashier Log" flat>
            
            <v-sheet class="mx-auto p-2" width="500">
                <v-form fast-fail @submit.prevent>
                    <v-checkbox v-model="isRegistered" label="Is the customer already a registered online customer user?"></v-checkbox>

                    <v-checkbox v-if="!isRegistered" v-model="isWantRegister" label="Does he want to register?"></v-checkbox>
                    <v-container v-if="isWantRegister">They can register at our online website. There are a lot of benefits so they better do it :)</v-container>
                    <v-text-field v-if="isRegistered" v-model="customerID" label="Customer ID"></v-text-field>
                    <v-autocomplete :rules="productRules" label="Choose the product inventory ID:" v-model="pickedProduct"
                    :items="inventoryArray.map((product) => product.id)"></v-autocomplete>
                    <v-text-field :rules="integerOnly" v-model="quantityPicked" label="quantity"></v-text-field>
                      
                    <v-btn @click="handleAddSubmit" class="mt-2" type="submit" block>Submit</v-btn>
                </v-form>
            </v-sheet>

        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';
import type { basicInventory, basicPurchase } from '~/lib/table';
import Purchases from './purchases.vue';

definePageMeta({
    middleware: ["employee-only-auth"],
    layout: "topbar-layout",
});

const supabase = useSupabaseClient<Database>();
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([]);
const locationArray = ref<string[]>([]);
const pickedLocation = ref<string | null>(null);

//type joined from Product as base, joined by Store and Vendor
type Purchase = Database['public']['Tables']['Purchase']['Row'] & {
    Store: Database['public']['Tables']['Store']['Row'];
    Product: Database['public']['Tables']['Product']['Row'];
};
const customerID = ref<number | null>(null);
const isRegistered = ref(false);
const isWantRegister = ref(false);
const pickedProduct = ref<number | null>(null);
const purchaseArray = ref<Purchase[]>([]);

const search = ref('');
const integerOnly = ref([
    (v: any) => !isNaN(v) || 'Value must be a number',
    (v: any) => v !== '' || 'Value cannot be empty'
]);

const productRules = ref([
    (v: any) => !!v || 'Item is required',
]);
 


const quantityPicked = ref<number | null>(null);
const handleAddSubmit = async () => {
    console.log("the inventory id is: ", pickedProduct.value)
    console.log("the quantity picked is: ", quantityPicked.value)
    //console.log(pickedProduct.value)
    console.log('submitting');
    const { data, error } = await supabase.from('Purchase').insert({
        quantity : quantityPicked.value,
        customer_id : customerID.value,
        store_id : storeIDref.value,
      //  product_id : pickedProduct.value,
        created_at : new Date().toISOString(),
        inventory_id : pickedProduct.value

    } as basicPurchase )
    if (error) {
        console.log(error)
    }
    if(!error){
        console.log(data)
        alert("done submitting")
        //clear the inputs


        //subtract quantity from inventory
        console.log("-the inventory id is: ", pickedProduct.value)
        console.log("-the quantity picked is: ", quantityPicked.value)
  
    await handleSubtractInventory( )
 
       quantityPicked.value = null
        customerID.value = null
        pickedProduct.value = null
    }
};

const handleGetRemainingStock = async ()  => {
    console.log("fetching remaining stock")
    console.log("the inventory id is: ", pickedProduct.value)
    
    console.log("the store id is: ", storeIDref.value)
    const { data, error } = await supabase
        .from('Inventory')
        .select('*')
        .match({ id: pickedProduct.value 
            });

    if (error) {
        console.log("there is eror")
        console.log(error);
    } else {
        console.log("no error")
        console.log(data);
        console.log("remaining stock is: ", data[0].remaining_stock)
        console.log("the quantity picked is: ", quantityPicked.value)
        return data[0].remaining_stock as number ;
    }
    

};

const handleSubtractInventory = async () => {

    console.log("The inventory id is: ", pickedProduct.value)
    console.log("The quantity picked is: ", quantityPicked.value)
    
    //get the remaining stock of the product
    const remainingStock = await handleGetRemainingStock()  as number

    const newStock = remainingStock - (quantityPicked.value ?? 0); // Calculate the new stock value, defaulting to 0 if quantityPicked.value is null

    console.log("the remaining stock is: ", remainingStock);
    console.log("the quantity is picked is: ", quantityPicked.value);
    console.log(remainingStock, "-", quantityPicked.value, "=", newStock);
    if(remainingStock === 0){
        alert("Product is out of stock")
        return}
    if(remainingStock === undefined){
        alert("Product not found")
        return
    }
    if (quantityPicked.value !== null && remainingStock < quantityPicked.value) {
        alert("Not enough stock")
        return
    }

  const { data, error } = await supabase
    .from('Inventory')
    .update({
       remaining_stock : newStock
    })
    .match({ id: pickedProduct.value });

  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
};


const inventoryArray = ref<basicInventory[]>([]);

const productArray = ref<number[]>([])
const handleFetchInventoryProducts = async (storeID: number)=>{
    try {
        const { data, error } = await supabase.from('Inventory').select('*')
            .match({ 'store_id': storeID });

        if (error) throw error;
        if (!error) {
            console.log("here ")
            console.log(data)
            inventoryArray.value = data as basicInventory[];

                //
        }

        //get the locations only from the object
        productArray.value = inventoryArray.value
            .filter((product) => product.store_id !== null)
            .map((store) => store.store_id as number);
    } catch (error) {
        console.log(error);
    }

}




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
    } catch (error) {
        console.log(error);
    }
};
const debugString = ref()
const storeIDref = ref<number>()
//this opens 
const handleFetchPurchase = async () => {
    //need to get the store id from picked location
    const storeId = storeArray.value.find((store) => store.location === pickedLocation.value)?.id;
    storeIDref.value = storeId
    console.log("curren'te store id is: ", storeId)
    //fetch the product list from inventory
    await handleFetchInventoryProducts(storeId as number)

    
    try {
        const { data, error } = await supabase
            .from('Purchase')
            .select(`
          *,
          Store!inner(
            *
          )
        `)
            .match({ 'Store.id': storeId });

        if (error) throw error;
        if (!error) {
            console.log(data);
            purchaseArray.value = data as any;
            // Reset visible columns when new data is fetched
         //   visibleColumns.value = Object.keys(purchaseArray.value[0] || {});

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