<template>

        <v-btn @click="handleUpdateRole">
            update role
        </v-btn>

    <div class="p-2 flex justify-center">
        <div>Find the product you like</div>
    </div>
    <v-text-field prepend-icon="mdi-magnify" hide-details single-line></v-text-field>



    <v-container class="bg-blue-300">
        <v-row dense>
            <Product :productData="product" v-for="product in productsArray" />
        </v-row>
    </v-container>

    

<!-- 
    <ProductCheck /> -->


</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia';



definePageMeta({
    layout: 'topbar-layout',

})

const roleStore = useRoleStore()
const {userRole} = storeToRefs(roleStore)

const handleUpdateRole = async () => {
    await roleStore.getUserRole()
}

const supabase = useSupabaseClient();
const productStore = useProductStore()
const products = storeToRefs(productStore)
const productsArray = products.products.value
const productsLength = ref(0)
productsLength.value =  await productStore.getLength(supabase) || 0;
console.log("length: " + productsLength.value)
</script>

<style scoped></style>