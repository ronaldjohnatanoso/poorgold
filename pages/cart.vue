<template>
    <v-container class="bg-blue-300">
        My Cart
    </v-container>
    <v-table density="compact">
        <thead>
            <tr>
                <th class="text-left">
                    Product Name
                </th>
                <th class="text-left">
                    Quantity
                </th>
                <th class="text-left">
                    Ordered At Time:
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in orderArray" :key="item.name">
                <td>{{ item.product_id }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.created_at }}</td>
            </tr>
        </tbody>
    </v-table>
</template>
<!-- 
  <script lang="ts">
  export default {
    data () {
      return {
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            time: 'now'
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            time: 'now'
          },
          {
            name: 'Eclair',
            calories: 262,
            time: 'now'
          },
          {
            name: 'Cupcake',
            calories: 305,
            time: 'now'
          },
          {
            name: 'Gingerbread',
            calories: 356,
            time: 'now'
          },
          {
            name: 'Jelly bean',
            calories: 375,
            time: 'now'
          },
          {
            name: 'Lollipop',
            calories: 392,
            time: 'now'
          },
          {
            name: 'Honeycomb',
            calories: 408,
            time: 'now'
          },
          {
            name: 'Donut',
            calories: 452,
            time: 'now'
          },
          {
            name: 'KitKat',
            calories: 518,
            time: 'now'
          },
        ],
      }
    },
  }
</script> -->

<script setup lang="ts">
definePageMeta({
    middleware: ["profile-auth"],
    layout: "topbar-layout",
})

import { ref } from 'vue';
import type { Database } from '~/lib/database.types';
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const orderArray = ref<Database['public']['Tables']['Cart']['Row'][]>([])

const handleCartFetch = async () => {

    //fetch the row from cart table with user id as customer_id


    try {
        loading.value = true
        const { data, error } = await supabase
            .from('Cart')
            .select('*')
            .eq('customer_id', user.value?.id || '')
        if (error) throw error

        if (error) {
            console.log(error)
        } else if (!error) {
            successMsg.value = "fetch cart success"
            console.log(successMsg.value)
            console.log(data)
            orderArray.value = data
    
        }
    } catch (error) {
        errorMsg.value = (error as any).error_description || (error as any).message
        console.log((error as any).error_description || (error as any).message)
    } finally {
        loading.value = false
    }
}

handleCartFetch()

</script>

<style scoped></style>