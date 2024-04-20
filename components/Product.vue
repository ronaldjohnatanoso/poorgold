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
      <v-btn @click="handleAddToCart" color="orange-lighten-2" text="Add to Cart"></v-btn>

      <v-spacer></v-spacer>

      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ productData.Product.description }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Database } from '~/lib/database.types';
import type { InventoryProduct } from '~/stores/table';
const loading = ref(false)
const errorMsg = ref('')
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const successMsg = ref('')
const props = defineProps<{
  productData: InventoryProduct
}>()
const route = useRouter()
const handleAddToCart = async () => {
  console.log("Added to cart")

  try {
    loading.value = true
    const {  error } = await supabase
      .from('Cart')
      .insert(
      {
        customer_id: user.value ? user.value.id : '',
        product_id: props.productData.id,
        quantity: 1
      }
      )
    if (error) throw error

    if (error) {
      console.log(error)
      route.push('/login')
      
    } else if (!error) {

      console.log(successMsg.value)
  
      //update user metadata to customer table
      const userId = user.value?.id;

      // Find the user row in the `public.user` table
      const { data, error: queryError } = await supabase
        .from('user')
        .select('*')
        .eq('id', userId as string)
        .single();

      if (queryError) {
        // Handle query error
        console.error('Query error:', queryError);
        return;
      }
      // //update the user metadata
      // const { error } = await supabase
      //   .from('user')
      //   .update({ role: 'customer', fullname: fullname.value })
      //   .eq('id', userId as string)
      //   .select()

    }
  } catch (error) {
    errorMsg.value = (error as any).error_description || (error as any).message
    console.log((error as any).error_description || (error as any).message)
  } finally {
    loading.value = false
  }
}

const show = ref(false)

const toggleShow = () => {
  show.value = !show.value
}

show.value = false
</script>