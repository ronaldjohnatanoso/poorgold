<template>

    <v-container class="outer">
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

        <div class="bg-purple-200">
            <v-container  v-if="pickedProduct">Total Sold All-time: <span class="font-bold">{{ totalSold }}</span></v-container>
   
        </div>
    </v-container>

    <v-container v-if="pickedProduct" >
        <v-container class="bg-green-300 ">
            <span>range from: </span>
            <v-btn @click="minDateDialog = true">
                {{ minDate?.toLocaleDateString() || "Select the minimum date" }}
            </v-btn>
            
            <span> to </span>
    
            <v-btn @click="maxDateDialog = true">
                {{ maxDate?.toLocaleDateString() || "Select the maximum date" }}
            </v-btn> : 
    
            <span class="font-bold">{{totalRangeSold ?? 0}} </span>
        </ v-container>

       

        <v-dialog v-model="minDateDialog" width="auto">
            <v-card max-width="400" prepend-icon="mdi-update"
                title="Select the minimum date">
                <v-container>
                    <v-row justify="space-around">
                        <v-date-picker v-model="minDate" elevation="0"></v-date-picker>
                    </v-row>
                </v-container>
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="minDateDialog = false"></v-btn>
                </template>
            </v-card>
        </v-dialog>

        <v-dialog v-model="maxDateDialog" width="auto">
            <v-card max-width="400" prepend-icon="mdi-update"
                title="Select the max date">
                <v-container>
                    <v-row justify="space-around">
                        <v-date-picker v-model="maxDate" elevation="0"></v-date-picker>
                    </v-row>
                </v-container>
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="maxDateDialog = false"></v-btn>
                </template>
            </v-card>
        </v-dialog>
           
    </v-container>



</template>

<script setup lang="ts">


import type { Database } from '~/lib/database.types';
const supabase = useSupabaseClient<Database>();
const pickedLocation = ref<string | null>(null);
const locationArray = ref<string[]>([]);
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([]);
const pickedProduct = ref<string | null>(null);
const productsArray = ref<string[]>([]);
const totalSold = ref<number>(0);
const totalRangeSold = ref<number>(0);
let productMap = new Map<string, number>();
const minDate = ref<Date | null>(null);
const maxDate = ref<Date | null>(null);
const minDateDialog = ref<boolean>(false);
const maxDateDialog = ref<boolean>(false);
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
        const { data, error } = await supabase
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
const handleRangeTotalSold = async () => {
    console.log("min date is ", minDate.value)
    console.log("max date is ", maxDate.value)
    if (minDate.value && maxDate.value) {
        const minDateStr = minDate.value.toISOString();
        const maxDateStr = maxDate.value.toISOString();
        try {
            const { data, error } = await supabase
                .from('Purchase')
                .select('quantity.sum()')
                .eq('inventory_id', productMap.get(pickedProduct.value as string) as number)
                .gte('created_at', minDateStr)
                .lte('created_at', maxDateStr)
                .single()
            const sumData = data as { sum: number } | null;

            if (error) throw error;;
            if (data) {
                console.log("the range data is ", data)
                totalRangeSold.value = sumData?.sum as number;
            }
        } catch (error) {
            console.log(error);
        }
    }
}
handleFetchStores()
watch(pickedLocation,
    async () => {
        await handleInventoryProducts()

    }
)
watch(pickedProduct, async () => {
    await handleTotalSold()
})



watch([minDate, maxDate, pickedProduct], async () => {
    await handleRangeTotalSold()
})
</script>

<style scoped></style>