<template>
    <div>
        <v-container class="flex  justify-between">
      


            <div id="admin-nav" class="p-2 space-x-5 bg-blue-300">

                <v-btn @click="handleGoToRegisterEmployee">
                    Register Employee
                </v-btn>
                <v-btn>
                    option 1
                </v-btn>
                    <v-btn>
                        option 2
                    </v-btn>
            </div>
        </v-container>
    </div>
        <RegisterEmployee v-if="windowOption === 'register-employee'" />
</template>

<script setup lang="ts">
import Admin_nav from '~/components/admin_nav.vue';
const windowOption = ref<string>("")

definePageMeta({
    middleware: ["admin-only-auth"],
    layout: "topbar-layout", 
})

const handleGoToRegisterEmployee = () => {
    console.log("register employee")
    windowOption.value = "register-employee"
}
</script>

<style scoped>

</style>