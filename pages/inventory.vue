<template>
    <v-container>
        Enter the location of the store:
    </v-container>
    <v-container>
        <v-autocomplete
  label="Enter store location"
    v-model="pickedLocation"
  :items="storeArray.map(store => store.location)"
></v-autocomplete>
        <v-container>
            Store Location: {{ pickedLocation }}
        </v-container>
        <!-- <div> {{ inventoryData }}</div> -->
    </v-container>
    <v-table lazy density="compact">
        <thead>
            <tr>
                <th class="header text-left">
                    Product Name
                </th>
                <th class="header text-left">
                    Brand
                </th>
                <th class="header text-left">
                    Size
                </th>
                <th class="header text-left">
                    Price
                </th>
                <th class="header text-left">
                    Vendor
                </th>
                <th class="header text-left">
                    Product Type
                </th>
                <th class="header text-left">
                    Remaining Stock
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in inventoryArray" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.brand }}</td>
                <td>{{ item.size }}</td>
                <td>P {{ item.price }}</td>
                <td>{{ item.Vendor.fullname }}</td>
                <td>{{item.product_type}}</td>
                <td>{{ item.remaining_stock }}</td>
            </tr>
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

let inventoryKeys : string[] = []

function logMembers(obj: inventory) {
  const keys = Object.keys(obj) as (keyof inventory)[];
  keys.forEach(key => {
    const value = obj[key];
    if (typeof value === 'object') {
    const subKeys = value ? Object.keys(value) as (keyof Database['public']['Tables']['Store']['Row'])[] : [];
      subKeys.forEach(subKey => {
        inventoryKeys.push(`${key}.${subKey}`)
        //console.log(`${key}.${subKey}`);
      });
    } else {
        inventoryKeys.push(`${key}`)
     // console.log(`${key}`);
    }
  });

  console.log(inventoryKeys)
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
const inventoryArray = ref<inventory[]>([])
const handleFetchInventory = async () => {
    //need to get the store id from picked location
    const storeId = storeArray.value.find(store => store.location === pickedLocation.value)?.id

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
   .match({ 'Store.id': storeId });

        
        if( error) throw error
        if(!error) {
            console.log(data)
            inventoryArray.value = data as inventory[]
          //  console.log("type: " + inventoryArray )
        }
    } catch (error) {
        console.log(error)

    }

    logMembers(inventoryArray.value[0]);
}

handleFetchStores()
watch(pickedLocation, handleFetchInventory)

</script>

<style scoped>
.header{
    font-weight: bold;
    font-size: 16px;
    color: black;
    background-color: rgb(233, 176, 176);
}
</style>