<template>
    <v-container>
        Enter the location of the store:
    </v-container>
    <v-container>
        <v-autocomplete label="Enter store location" v-model="pickedLocation"
            :items="storeArray.map(store => store.location)"></v-autocomplete>
        <v-container>
            Store Location: {{ pickedLocation }}
        </v-container>
        <div> {{ expandedInventoryArray[0] }} = length = {{ expandedInventoryArray.length }}</div>
    </v-container>
    <v-table lazy density="compact">


        <thead>
            <tr v-if="expandedInventoryArray.length != 0">
                <th class="header text-left" v-if="expandedInventoryArray && expandedInventoryArray[0].id.render">{{
                    "Product_" + expandedInventoryArray[0].id.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].created_at.render">{{ "Product_" +
                        expandedInventoryArray[0].created_at.propertyName }}</th>
                <th class="header text-left" v-if="expandedInventoryArray && expandedInventoryArray[0].name.render">{{
                    "Product_" + expandedInventoryArray[0].name.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].vendor_id.render">{{ "Product_" +
                        expandedInventoryArray[0].vendor_id.propertyName }}</th>
                <th class="header text-left" v-if="expandedInventoryArray && expandedInventoryArray[0].store_id.render">
                    {{ "Product_" + expandedInventoryArray[0].store_id.propertyName }}</th>
                <th class="header text-left" v-if="expandedInventoryArray && expandedInventoryArray[0].brand.render">{{
                    "Product_" + expandedInventoryArray[0].brand.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].product_type.render">{{ "Product_" +
                        expandedInventoryArray[0].product_type.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].parent_product_type.render">{{ "Product_"
                        + expandedInventoryArray[0].parent_product_type.propertyName }}</th>
                <th class="header text-left" v-if="expandedInventoryArray && expandedInventoryArray[0].size.render">{{
                    "Product_" + expandedInventoryArray[0].size.propertyName }}</th>
                <th class="header text-left" v-if="expandedInventoryArray && expandedInventoryArray[0].price.render">{{
                    "Product_" + expandedInventoryArray[0].price.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].description.render">{{ "Product_" +
                        expandedInventoryArray[0].description.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].remaining_stock.render">{{ "Product_" +
                        expandedInventoryArray[0].remaining_stock.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0]?.store_id.render">{{ "Store_" +
                        expandedInventoryArray[0].store_id.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0]?.Store_location.render">{{ "Store_" +
                        expandedInventoryArray[0].Store_location.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Store_time_open.render">{{ "Store_" +
                        expandedInventoryArray[0].Store_time_open.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Store_created_at.render">{{ "Store_" +
                        expandedInventoryArray[0].Store_created_at.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Store_contact_number.render">{{ "Store_"
                        +
                        expandedInventoryArray[0].Store_contact_number.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Vendor_id.render">{{ "Vendor_" +
                        expandedInventoryArray[0].Vendor_id.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Vendor_fullname.render">{{ "Vendor_" +
                        expandedInventoryArray[0].Vendor_fullname.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Vendor_created_at.render">{{ "Vendor_" +
                        expandedInventoryArray[0].Vendor_created_at.propertyName }}</th>
                <th class="header text-left"
                    v-if="expandedInventoryArray && expandedInventoryArray[0].Vendor_contact_number.render">{{
                        "Vendor_"
                        + expandedInventoryArray[0].Vendor_contact_number.propertyName }}</th>
            </tr>

        </thead>


        <tbody>

            <tr v-for="item in expandedInventoryArray">
                <td v-if="item.id.render">{{ item.id.value || 'NULL' }}</td>
                <td v-if="item.created_at.render">{{ item.created_at.value || 'NULL' }}</td>
                <td v-if="item.name.render">{{ item.name.value || 'NULL' }}</td>
                <td v-if="item.vendor_id.render">{{ item.vendor_id.value || 'NULL' }}</td>
                <td v-if="item.store_id.render">{{ item.store_id.value || 'NULL' }}</td>
                <td v-if="item.brand.render">{{ item.brand.value || 'NULL' }}</td>
                <td v-if="item.product_type.render">{{ item.product_type.value || 'NULL' }}</td>
                <td v-if="item.parent_product_type.render">{{ item.parent_product_type.value || 'NULL' }}</td>
                <td v-if="item.size.render">{{ item.size.value || 'NULL' }}</td>
                <td v-if="item.price.render">{{ item.price.value || 'NULL' }}</td>
                <td v-if="item.description.render">{{ item.description.value || 'NULL' }}</td>
                <td v-if="item.remaining_stock.render">{{ item.remaining_stock.value || 'NULL' }}</td>
                <td v-if="item.Store_id.render">{{ item.Store_id.value || 'NULL' }}</td>
                <td v-if="item.Store_location.render">{{ item.Store_location.value || 'NULL' }}</td>
                <td v-if="item.Store_time_open.render">{{ item.Store_time_open.value || 'NULL' }}</td>
                <td v-if="item.Store_created_at.render">{{ item.Store_created_at.value || 'NULL' }}</td>
                <td v-if="item.Store_contact_number.render">{{ item.Store_contact_number.value || 'NULL' }}</td>
                <td v-if="item.Vendor_id.render">{{ item.Vendor_id.value || 'NULL' }}</td>
                <td v-if="item.Vendor_fullname.render">{{ item.Vendor_fullname.value || 'NULL' }}</td>
                <td v-if="item.Vendor_created_at.render">{{ item.Vendor_created_at.value || 'NULL' }}</td>
                <td v-if="item.Vendor_contact_number.render">{{ item.Vendor_contact_number.value || 'NULL' }}</td>
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
function isLeafProperty(property: any) {
    if (typeof property === 'object') {
        // Check if the property is an object with a 'render' property
        return property.hasOwnProperty('render');
    } else {
        // The property is not an object, so it's a leaf property
        return true;
    }
}


const supabase = useSupabaseClient()
const storeArray = ref<Database['public']['Tables']['Store']['Row'][]>([])
const locationArray = ref<string[]>([])
const pickedLocation = ref<string | null>(null)

//type joined from Product as base, joined by Store and Vendor
type Inventory = Database['public']['Tables']['Product']['Row'] & {
    Store: Database['public']['Tables']['Store']['Row'],
    Vendor: Database['public']['Tables']['Vendor']['Row']
}

let inventoryKeys: string[] = []

function logMembers(obj: Inventory) {
    const keys = Object.keys(obj) as (keyof Inventory)[];
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

    //console.log(inventoryKeys)
}
// type StoreType = Database['public']['Tables']['Store']['Row']; //nested foreign table
// type VendorType = Database['public']['Tables']['Vendor']['Row']; //nested foreign table
type PropertyObject<T> = { value: T; render: boolean; propertyName: string };
type ExpandedType<T> = T extends object
    ? T extends Array<infer U>
    ? Array<ExpandedType<U>>
    : { [K in keyof T]: ExpandedType<T[K]> }
    : PropertyObject<T>;

function expandObject<T>(obj: T, parentPropertyName: string = ''): any{
    const expandedObj: any = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            const propertyName = parentPropertyName ? `${parentPropertyName}_${key}` : key;
            if (value === null) {
                expandedObj[key] = { value: null, render: true, propertyName };
            } else if (typeof value === 'object') {
                expandedObj[key] = expandObject(value, propertyName);
            } else {
                expandedObj[key] = { value, render: true, propertyName };
            }
        }
    }
    return expandedObj;
}

const handleFetchStores = async () => {
    try {
        const { data, error } = await supabase
            .from('Store')
            .select('*')

        if (error) throw error
        if (!error) {
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
const inventoryArray = ref<Inventory[]>([])
type ExpandedInventory = {
    [Property in
    | 'id'
    | 'created_at'
    | 'name'
    | 'vendor_id'
    | 'store_id'
    | 'brand'
    | 'product_type'
    | 'size'
    | 'parent_product_type'
    | 'price'
    | 'description'
    | 'remaining_stock'
    | 'Store_id'
    | 'Store_location'
    | 'Store_time_open'
    | 'Store_created_at'
    | 'Store_contact_number'
    | 'Vendor_id'
    | 'Vendor_fullname'
    | 'Vendor_created_at'
    | 'Vendor_contact_number'
    ]:
    {
        value: any;
        render: boolean;
        propertyName: string;
    };
};

const expandedInventoryArray = ref<ExpandedInventory[]>([]);

const inventoryData = ref<ExpandedType<Inventory> | null>(null)
const storeIdd = ref<string>("")
const handleFetchInventory = async () => {
    //clear the expanded array
    expandedInventoryArray.value = []

    //need to get the store id from picked location
    const storeId = storeArray.value.find(store => store.location === pickedLocation.value)?.id

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


        if (error) throw error
        if (!error) {
            console.log(data)
            inventoryArray.value = data as Inventory[]
            //  console.log("type: " + inventoryArray )
        }
    } catch (error) {
        console.log(error)

    }

    //logMembers(inventoryArray.value[0]);

    //flattenObject(inventoryArray.value)

    for (let i = 0; i < inventoryArray.value.length; i++) {
        inventoryArray.value[i] = flattenObject(inventoryArray.value[i])
    }

    //expand the object adding render property
    for (let i = 0; i < inventoryArray.value.length; i++) {
        expandedInventoryArray.value.push(expandObject(inventoryArray.value[i]))
    }
    //given the expanded object array, i want to flatten it to one level, where nested keys are concatenated ex: Store.id.value -> Store_id.value

    //storeIdd.value = flattenedInventoryArray[0].Store_id.value
    //


    for (let i = 0; i < expandedInventoryArray.value.length; i++) {
        console.log(expandedInventoryArray.value[i])
    }



}

handleFetchStores()
watch(pickedLocation, handleFetchInventory)

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
    font-weight: bold;
    font-size: 16px;
    color: black;
    background-color: rgb(233, 176, 176);
}
</style>