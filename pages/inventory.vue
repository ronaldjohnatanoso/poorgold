<template>
    <v-container>
        Enter the location of the store:
    </v-container>
    <v-container>
        <v-autocomplete
  label="Enter store location"
    v-model="pickedLocation"
  :items="locationArray"
></v-autocomplete>
        <v-container>
            Store Location: {{ pickedLocation }}
        </v-container>
        <div> {{ inventoryData }}</div>
    </v-container>
    <v-table lazy density="compact">
        <thead>
            <tr>
                <th class="text-left">
                    Product ID
                </th>
                <th class="text-left">
                    Product Name
                </th>
                <th class="text-left">
                    Quantity
                </th>
                <th class="text-left">
                    Ordered At Time:
                </th>
                <th class="text-left">
                    Price:
                </th>
                <th class="text-left">
                    Delete Order
                </th>
                <th class="text-left">
                    Remaining Stock
                </th>
            </tr>
        </thead>
        <tbody>
            <!-- <tr v-for="item in orderArray" :key="item.id">
                <td>{{ item.Product.id }}</td>
                <td>{{ item.Product.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.created_at }}</td>
                <td>{{ item.Product.price }}</td>
   
                <td>{{ item.Product.remaining_stock }}</td>
            </tr> -->
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';

definePageMeta({
    middleware: ["profile-auth"],
    layout: "topbar-layout",
})

const supabase = useSupabaseClient()
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([])
const locationArray = ref<string[]>([])
const pickedLocation = ref<string | null>(null)

//type joined from Product as base, joined by Store and Vendor
type inventory = Database['public']['Tables']['Product']['Row'] & {
    Store: Database['public']['Tables']['Store']['Row'],
    Vendor: Database['public']['Tables']['Vendor']['Row']
}

const handleFetchStores = async () => {
    try {
        const {data, error} = await supabase
            .from('Store')
            .select('*')

        if( error) throw error
        if(!error) {
           // console.log(data)
            storeArray.value = data
        }

        //get the locations only from the object
        locationArray.value = storeArray.value
            .filter(store => store.location !== null)
            .map(store => store.location as string);
    } catch (error) {
        console.log(error)
    }
}
const inventoryData = ref<inventory[]>([])
const handleFetchInventory = async () => {
    console.log("i fetch inventory" + pickedLocation.value)
    try {
        const { data , error } = await supabase
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
   .match({ 'Store.id': 2 });

        
        if( error) throw error
        if(!error) {
            console.log(data)
            inventoryData.value = data as inventory[]
            console.log("type: " + inventoryData )
        }
    } catch (error) {
        console.log(error)

    }
}

handleFetchStores()
watch(pickedLocation, handleFetchInventory)

</script>

<style scoped>

</style>