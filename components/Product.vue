<template>
    <v-card
      class="mx-auto"
      max-width="344"
    >
    

      <img cover class="h-[200px]" src="/images/png/logo-color.png" alt="">
  
      <v-card-title>
        {{ productData.name }}
      </v-card-title>
  
      <v-card-subtitle>
        Product Type: {{ productData.product_type }}
        <br> Size: {{ productData.size }} <br>
        Price: {{ productData.price }} <br>
        Brand: {{ productData.brand }}
       </v-card-subtitle>
      
      

      <v-card-actions>
        <v-btn @click="handleAddToCart"
          color="orange-lighten-2"
          text="Add to Cart"
        ></v-btn>
  
        <v-spacer></v-spacer>
  
        <v-btn
          :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="show = !show"
        ></v-btn>
      </v-card-actions>
  
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
  
          <v-card-text>
            {{ productData.description }}
        </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue'
  import type { Database } from '~/lib/database.types';

  const props = defineProps<{
    productData : Database["public"]["Tables"]["Product"]["Row"]
  }>()

  const handleAddToCart = () => {
    console.log("Added to cart")
  }

  const show = ref(false)
  
  const toggleShow = () => {
    show.value = !show.value
  }

  show.value = false
  </script>