<template >

    <v-app class="max-h-20 overflow-auto">
        
        <v-app-bar class="p-2">
            <img class="max-w-[50px]" src="/images/png/logo-no-background.png" alt="">
    
            <v-container class="flex  justify-between">
      


                <div class="bg-yellow-300"> 
                    <v-btn class="bg-red-300 !important"  >
                        Poor Gold
                    </v-btn>
                </div>
                <div id="signin" class="p-2 space-x-5 bg-blue-300">
                    <v-btn v-if="!user" @click="handleLoginPress" color="purple">Login</v-btn>
                    <v-btn v-if="!user" @click="handleRegisterPress" color="purple">Register</v-btn>
                    <v-btn @click="handleHomePress" :color="$route.path === '/' ? 'purple' : undefined">Home</v-btn>
                    <v-btn @click="handleProfile"  v-if="user" :color="$route.path === '/profile' ? 'purple' : undefined"   >Profile</v-btn>
                    <v-btn @click="handleGoToCart" v-if="user && userRole=='customer'" :color="$route.path === '/cart' ? 'purple' : undefined">My Cart</v-btn>
                    <v-btn @click="handleGoToInventory" v-if="userRole === 'employee'" :color="$route.path === '/inventory' ? 'purple' : undefined">Inventory</v-btn>
                    <v-btn @click="handleGoToPurchases" v-if="userRole === 'employee'" :color="$route.path === '/purchases' ? 'purple' : undefined">Purchases History</v-btn>
                    <v-btn @click="handleGoToCashier" v-if="userRole === 'employee'" :color="$route.path === '/cashier' ? 'purple' : undefined">Cashier Record</v-btn>
                    <v-btn @click="handleGoToAdmin" v-if="user && userRole =='admin'" :color="$route.path === '/admin' ? 'purple' : undefined">Admin Page</v-btn>
                    <v-btn @click="handleGoToReorder" v-if="user && userRole =='vendor'" :color="$route.path === '/reorder' ? 'purple' : undefined">Reorder</v-btn>
                    <v-btn @click="handleGoToVendorProducts" v-if="user && userRole =='vendor'" :color="$route.path === '/vendor_product' ? 'purple' : undefined">My Products</v-btn>
                    <v-btn @click="handleRoleCheck" class="bg-red-300">role: {{ userRole }}</v-btn>
                    
                  </div>
            </v-container>
        </v-app-bar>
    
       
    </v-app>
    <slot />

</template>

<script setup lang="ts">



let user = useSupabaseUser()
const roleStore = useRoleStore()
const {userRole} = storeToRefs(roleStore)
await roleStore.getUserRole()
// let metadata = user.value?.user_metadata
// let userRole = metadata?.role
const router = useRouter()

const handleLoginPress = () => {
    router.push('/login')
}

const handleGoToVendorProducts = () => {
    router.push('/vendor_product')
}

const handleProfile = () => {
    router.push('/profile')
}

const handleRegisterPress = () => {
    router.push('/register')
}

const handleGoToReorder = () => {
    router.push('/reorder')
}

const handleGoToCashier = () => {
    router.push('/cashier')
}

const handleHomePress = () => {
    router.push('/')
}

const handleGoToCart = () => {
    router.push('/cart')
}

const handleGoToInventory = () => {
    router.push('/inventory')
}

const handleGoToAdmin = () => {
    console.log(" i want admin")
    router.push('/admin')
}

const handleRoleCheck = async () => {
    await roleStore.getUserRole()
  
}

const handleGoToPurchases = () => {
    router.push('/purchases')
}






</script>

<style scoped></style>