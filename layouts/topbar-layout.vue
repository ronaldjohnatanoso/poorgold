<template >

    <v-app class="max-h-20 ">
        
        <v-app-bar class="p-2">
            <img class="max-w-[50px]" src="/images/png/logo-no-background.png" alt="">
    
            <v-container class="flex  justify-between">
      


                <div class="bg-yellow-300"> 
                    <v-btn class="bg-yellow-300">
                        Poor Gold
                    </v-btn>
                </div>
                <div id="signin" class="p-2 space-x-5 bg-blue-300">
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
                    <v-btn @click="handleGoToCart" v-if="user">
                        My Cart
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

const handleGoToCart = () => {
    router.push('/cart')
}
</script>

<style scoped></style>