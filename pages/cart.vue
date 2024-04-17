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
            <tr v-for="item in orderArray" :key="item.id">
                <td>{{ item.Product.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.created_at }}</td>
            </tr>
        </tbody>
    </v-table>
</template>


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
// const orderArray = ref<Database['public']['Tables']['Cart'][]>([])
const orderArray = ref<any>([])

const handleCartFetch = async () => {

    //fetch the row from cart table with user id as customer_id


    try {
        loading.value = true
        const { data, error } = await supabase
            .from('Cart')
            .select(`
        Product (
          name
        ),
        quantity,
        created_at
      `)
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