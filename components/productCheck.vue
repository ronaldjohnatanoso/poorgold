<template>
    <div>
        <v-btn @click="handleClick" >
           click
        </v-btn>
        <div>
            {{ product }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProductStore } from './stores/productStore';
const productStore = useProductStore()
const product = storeToRefs(productStore)
const handleClick = () => {
    productStore.fetchProducts()
    console.log(product)
}
</script>

<style scoped>

</style>