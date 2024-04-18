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
</template>

<script setup lang="ts">
const router = useRouter()

const handleGoToRegisterEmployee = () => {
    console.log("register employee")

    
}
</script>

<style scoped>

</style>