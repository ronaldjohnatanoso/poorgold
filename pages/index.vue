<template>

     

    <div class="p-2 flex justify-center">
        <div>Shop now</div>
    </div>
    <v-container>(refresh if no products show)</v-container>
    <v-container >
        <v-autocomplete @update:modelValue="handleTypeChange" hide-details single-line   variant="outlined" prepend-inner-icon="mdi-magnify" v-model="selectedProductType" label="Product Type" :items="categoryList"></v-autocomplete>
    </v-container>


    <v-container  class="rounded bg-yellow-300">
        <v-container>{{selectedProductType}}</v-container>
        <v-row dense>
            <Product  :productData="product" v-for="product in filteredProducts" />
        </v-row>
    </v-container>

    <br>
    <v-container>
        <v-autocomplete  hide-details single-line  variant="outlined" prepend-inner-icon="mdi-magnify" v-model="selectedProductName" label="Search Product Name" :items="allProductNameList"></v-autocomplete>
    </v-container>
    <v-container  v-if="productContainer"  :key="refreshKey" class="rounded bg-blue-300">
        <v-row dense>
            <v-container>Browse All</v-container>
            <Product class="my-5" :productData="product" v-for="product in inventoryProductsArray" />
        </v-row>
    </v-container> 

    



</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';






definePageMeta({
    layout: 'topbar-layout',

})

const refreshKey = ref(0)
import type { InventoryProduct } from '~/lib/table';


const supabase = useSupabaseClient<Database>();
const inventoryProductStore = await useInventoryProductStore()
const inventoryProducts = storeToRefs(inventoryProductStore)
const inventoryProductsArray : InventoryProduct[] = inventoryProducts.products.value
const productsLength = ref()
const categoryList = ref<string[]>([])
const allProductNameList = ref<string[]>([])
const selectedProductName = ref<string | null>(null)
const selectedProductType = ref<string | null>(null)

//filter products that only have the selected product type
let filteredProducts = ref<InventoryProduct[]>([])

const fetchCategories = async () => {
    const {data,error} = await supabase.from(`Inventory`)
        .select(`*,
                  Product(
                    *
                  )`)
        .match({store_id : 2})

    if (error) throw error
    if (data) {
        //get unique categories from Product.name
        categoryList.value  = data.map((product: any) => product.Product.product_type)
        allProductNameList.value = data.map((product: any) => product.Product.name)
    }
}

const handleTypeChange = (value: string) => {
    selectedProductType.value = value
    console.log("selectedProductType: " + selectedProductType.value)
    filteredProducts.value = inventoryProductsArray.filter((product) => {
        return product.Product.product_type === selectedProductType.value
    })
}

const productContainer = ref(false)
productsLength.value =  await inventoryProductStore.getLength(supabase) || 0;
productContainer.value = true

fetchCategories()

watch(inventoryProductsArray, () => {
    refreshKey.value++
})



console.log("length: " + productsLength.value)
</script>

<style scoped></style>