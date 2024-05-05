<template>
  <v-card class="mx-auto" max-width="344">


    <img cover class="h-[200px]" src="/images/png/logo-color.png" alt="">

    <v-card-title>
      {{ productData.Product.name }}
    </v-card-title>

    <v-card-subtitle>
      Product Type: {{ productData.Product.product_type }}
      <br> Size: {{ productData.Product.size }} <br>
      Price: {{ productData.store_price }} <br>
      Brand: {{ productData.Product.brand }} <br>
      Available: {{ productData.remaining_stock }}
    </v-card-subtitle>



    <v-card-actions>
      <v-btn @click="handleAddToCart" class="bg-green" color="yellow" text="Add to Cart"></v-btn>

      <v-spacer></v-spacer>

      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ productData.Product.description }}
          <br>
          Quantity: {{ orderQuantity }}
          <v-btn icon @click="subtractQuantity">
            <v-icon size="18">mdi-minus</v-icon>
          </v-btn>
          <v-btn icon @click="addQuantity">
            <v-icon size="18">mdi-plus</v-icon>
          </v-btn>
          
        </v-card-text>
        
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Database } from '~/lib/database.types';
import type { InventoryProduct } from '~/lib/table';
import type {Cart } from '~/lib/table'
const loading = ref(false)
const errorMsg = ref('')
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const successMsg = ref('')
const orderQuantity = ref<number>(0)
const props = defineProps<{
  productData: InventoryProduct
}>()

console.log("productData: " + props.productData)

const route = useRouter()

const roleStore = useRoleStore()
const userRole = await roleStore.getUserRole()

const handleAddToCart = async () => {
  console.log("i want to handle")
  if(userRole != 'customer'){
    errorMsg.value = "You must be a customer to add to cart"
    console.log("You must be a customer to add to cart")

    return
  }
  try {
    loading.value = true
    const {  error } = await supabase
      .from('Cart')
      .insert<Cart>(
      {
      
        created_at: new Date().toISOString(),
        quantity: orderQuantity.value,
        customer_id : user.value?.id,
        inventory_id : props.productData.id,
        product_id : props.productData.Product.id
      } as Cart
      )
    if (error) throw error

    if (error) {
      console.log(error)
      route.push('/login')
      
    } else if (!error) {
      console.log("Added to cart")
      console.log(successMsg.value)
  


    }
  } catch (error) {
    errorMsg.value = (error as any).error_description || (error as any).message
    console.log((error as any).error_description || (error as any).message)
  } finally {
    loading.value = false
  }
}

const subtractQuantity = ()=>{
  if(orderQuantity.value < 0 ){return}
  orderQuantity.value = orderQuantity.value - 1;
}
const addQuantity = ()=>{
  orderQuantity.value = orderQuantity.value + 1
}

const show = ref(false)


show.value = false
</script>