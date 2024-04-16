<template>
 
    
        <div class="p-2 flex justify-center">
            <div>Find the product you like</div>
        </div>
        <v-text-field
        prepend-icon="mdi-magnify"
        hide-details
        single-line
      ></v-text-field>

        <v-container class="">
            <v-card class="max-w-[300px]"
            subtitle="This is a card subtitle"
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!"
            title="This is a title"
          ></v-card>
    
        </v-container>

        <test />
 

</template>

<script setup lang="ts">


    definePageMeta({
        layout: 'signin-layout'
    })
</script>

<style scoped>
    
</style>