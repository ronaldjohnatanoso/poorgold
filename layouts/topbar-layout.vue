<template>
    <v-app >
      <v-app-bar  app class="nice"  dense>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <img class="max-w-[80px]" src="/images/png/logo-no-background.png" alt="">
        <v-toolbar-title class=""><span class="text-2xl text-green-700 font-bold">Poor Gold</span></v-toolbar-title>
 
        <v-spacer></v-spacer>
        <v-btn color="purple"  class=" font-bold mr-2"> <span class=" text-xl">Role:  {{userRole}}</span></v-btn>
      </v-app-bar>
  
      <v-navigation-drawer class="nice" v-model="drawer" app>
        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-list-item v-if="!user" @click="handleLoginPress">
              <v-list-item-icon>
                <v-icon>mdi-login</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="!user" @click="handleRegisterPress">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
  
            <v-list-item @click="handleHomePress">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="user" @click="handleProfile">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="userRole && (userRole === 'customer' || userRole === 'guest')" @click="handleGoToCart">
              <v-list-item-icon>
                <v-icon>mdi-cart</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Cart</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="userRole === 'employee' || userRole === 'admin'" @click="handleGoToInventory">
              <v-list-item-icon>
                <v-icon>mdi-warehouse</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Inventory</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="userRole === 'employee' || userRole === 'admin'" @click="handleGoToPurchases">
              <v-list-item-icon>
                <v-icon>mdi-history</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Purchases History</v-list-item-title>
            </v-list-item>


            <v-list-item v-if="userRole === 'employee' || userRole === 'admin'" @click="handleGoToAnalytics">
              <v-list-item-icon>
                <v-icon>mdi-google-analytics</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Analytics</v-list-item-title>
            </v-list-item>

  
            <v-list-item v-if="userRole === 'employee'" @click="handleGoToCashier">
              <v-list-item-icon>
                <v-icon>mdi-cash-register</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cashier Record</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="user && userRole === 'admin'" @click="handleGoToAdmin">
              <v-list-item-icon>
                <v-icon>mdi-shield</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Admin Page</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="user && userRole === 'vendor'" @click="handleGoToReorder">
              <v-list-item-icon>
                <v-icon>mdi-reorder</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Reorder</v-list-item-title>
            </v-list-item>
  
            <v-list-item v-if="user && userRole === 'vendor'" @click="handleGoToVendorProducts">
              <v-list-item-icon>
                <v-icon>mdi-shopping</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Products</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      
      <div class="py-20">
        <slot />
      </div>
    </v-app>

  </template>
  
  <script setup lang="ts">
  let user = useSupabaseUser();
  const roleStore = useRoleStore();
  const { userRole } = storeToRefs(roleStore);
  await roleStore.getUserRole();
  
  const router = useRouter();
  const drawer = ref(false);
  
  const handleLoginPress = () => {
    router.push("/login");
    drawer.value = false;
  };
  const handleGoToVendorProducts = () => {
    router.push("/vendor_product");
    drawer.value = false;
  };
  const handleProfile = () => {
    router.push("/profile");
    drawer.value = false;
  };
  const handleRegisterPress = () => {
    router.push("/register");
    drawer.value = false;
  };
  const handleGoToReorder = () => {
    router.push("/reorder");
    drawer.value = false;
  };
  const handleGoToCashier = () => {
    router.push("/cashier");
    drawer.value = false;
  };
  const handleHomePress = () => {
    router.push("/");
    drawer.value = false;
  };
  const handleGoToCart = () => {
    router.push("/cart");
    drawer.value = false;
  };
  const handleGoToInventory = () => {
    router.push("/inventory");
    drawer.value = false;
  };
  const handleGoToAdmin = () => {
    console.log(" i want admin");
    router.push("/admin");
    drawer.value = false;
  };
  const handleRoleCheck = async () => {
    await roleStore.getUserRole();
  };

  const handleGoToAnalytics = () => {
    router.push("/analytics")
    drawer.value = false
  }
  const handleGoToPurchases = () => {
    router.push("/purchases");
    drawer.value = false;
  };
  </script>
<style scoped>
.nice {
  background: linear-gradient(to right, #dae699, hsl(55, 72%, 79%));
  /* You can adjust the gradient colors and direction as needed */
}

.big  {
    font-size: 2rem;
    font-weight: bold;
}
</style>