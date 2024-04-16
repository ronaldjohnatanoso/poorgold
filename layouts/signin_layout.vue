<template>
    
       <v-app class="max-h-20">
        <v-app-bar >
            <v-container>
                <v-app-bar-title>Poor Gold</v-app-bar-title>
                    <div id="signin" class="p-2 space-x-5 inline-block bg-blue-300">
                        <v-btn v-if="!user" @click="handleLoginPress">
                            Login
                        </v-btn>
                        <v-btn v-if="!user" @click="handleRegisterPress">
                            Register
                        </v-btn>
                        <v-btn @click="handleHomePress">
                            Home
                        </v-btn>    
                        <v-btn @click="handleProfile" v-if="user">
                            Profile
                        </v-btn>
                    </div>
            </v-container>
        </v-app-bar>
       </v-app>
        <slot />
   
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

const handleLoginPress = () => {
    router.push('/login')
}

const handleProfile = () => {
    router.push('/profile')
}

const handleRegisterPress = () => {
    router.push('/register')
}

const handleHomePress = () => {
    router.push('/')
}
</script>

<style scoped>

</style>