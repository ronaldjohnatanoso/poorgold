<template>
 
    
        <div class="p-2 flex justify-center">
            <div>Find the product you like</div>
        </div>
        <v-text-field
        prepend-icon="mdi-magnify"
        hide-details
        single-line
      ></v-text-field>


        <Product />

        <v-container class="bg-blue-300">
            <v-row>
                <Product />
                <Product />
                <Product />
            </v-row>
        </v-container>
          
    

</template>

<script setup lang="ts">


    definePageMeta({
        layout: 'signin-layout'
    })
</script>

<style scoped>
    
</style>