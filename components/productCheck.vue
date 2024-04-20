<template>
    <div>
        <v-btn @click="handleClick" >
           click
        </v-btn>
        <div>
            {{ products }}
        </div>
        <div>leng {{productsLength}}</div>
    </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useInventoryProductStore } from '../stores/inventoryProductStore';

const supabase = useSupabaseClient();
const productStore = useInventoryProductStore()
const products = storeToRefs(productStore)
const productsArray = products.products.value
const productsLength = ref(0)
const handleClick =  async ()  => {
    productsLength.value =  await productStore.getLength(supabase) || 0;
    
}
</script>

<style scoped>

</style>