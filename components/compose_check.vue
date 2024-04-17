<template>
    <div>
        <v-btn @click="handleClick" >
            clicked : {{ count }}
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useClickStore } from './stores/clickStore';
const clickStore = useClickStore()
const {count } = storeToRefs(clickStore)

const handleClick = () => {
    clickStore.increment()
}

</script>

<style scoped>

</style>