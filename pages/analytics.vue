<template>
    <div class="flex">
        <div class="w-1/2">
            <total-sold></total-sold>
        </div>
        <div class="w-1/2">
            <total-sold></total-sold>
        </div>
    </div>

    <v-container class="bg-yellow-100">
        
    </v-container>


  </template>
  

<script setup lang="ts">

definePageMeta({
    middleware: ["employee-only-auth"],
    layout: "topbar-layout"
})
</script>

<style scoped></style>