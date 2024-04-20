<template>

     

    <div class="p-2 flex justify-center">
        <div>Find the product you like</div>
    </div>
    <v-container>(refresh if no products show)</v-container>
    <v-text-field prepend-icon="mdi-magnify" hide-details single-line></v-text-field>



    <v-container class="bg-blue-300">
        <v-row dense>
            <Product :productData="product" v-for="product in inventoryProductsArray" />
        </v-row>
    </v-container>

    



</template>

<script setup lang="ts">





definePageMeta({
    layout: 'topbar-layout',

})

const roleStore = useRoleStore()
const {userRole} = storeToRefs(roleStore)



const supabase = useSupabaseClient();
const inventoryProductStore = useInventoryProductStore()
const inventoryProducts = storeToRefs(inventoryProductStore)
const inventoryProductsArray = inventoryProducts.products.value
const productsLength = ref(0)
productsLength.value =  await inventoryProductStore.getLength(supabase) || 0;
console.log("length: " + productsLength.value)
</script>

<style scoped></style>