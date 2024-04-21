<template>

     

    <div class="p-2 flex justify-center">
        <div>Find the product you like</div>
    </div>
    <v-container>(refresh if no products show)</v-container>
    <v-text-field prepend-icon="mdi-magnify" hide-details single-line></v-text-field>



    <v-container v-if="productContainer"  :key="refreshKey" class="bg-blue-300">
        <v-row dense>
            <Product :productData="product" v-for="product in inventoryProductsArray" />
        </v-row>
    </v-container>

    



</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';






definePageMeta({
    layout: 'topbar-layout',

})

const refreshKey = ref(0)



const supabase = useSupabaseClient<Database>();
const inventoryProductStore = await useInventoryProductStore()
const inventoryProducts = storeToRefs(inventoryProductStore)
const inventoryProductsArray : InventoryProduct[] = inventoryProducts.products.value
const productsLength = ref()

const productContainer = ref(false)
productsLength.value =  await inventoryProductStore.getLength(supabase) || 0;
productContainer.value = true
watch(inventoryProductsArray, () => {
    refreshKey.value++
})



console.log("length: " + productsLength.value)
</script>

<style scoped></style>