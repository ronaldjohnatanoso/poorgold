<template>
    <v-container class="bg-blue-300">
        My Cart
    </v-container>
    <v-table lazy density="compact">
        <thead>
            <tr>
                <th class="text-left">
                    Product ID
                </th>
                <th class="text-left">
                    Product Name
                </th>
                <th class="text-left">
                    Quantity
                </th>
                <th class="text-left">
                    Ordered At Time:
                </th>
                <th class="text-left">
                    Price:
                </th>
                <th class="text-left">
                    Delete Order
                </th>
                <th class="text-left">
                    Remaining Stock
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in orderArray" :key="item.id">
                <td>{{ item.Product.id }}</td>
                <td>{{ item.Product.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.created_at }}</td>
                <td>{{ item.Product.price }}</td>
                <td>
                    <v-btn @click="handleOrderDelete(item.id)">Delete</v-btn>
                </td>
                <td>{{ item.Product.remaining_stock }}</td>
            </tr>
        </tbody>
    </v-table>

    <v-container class="bg-blue-300">
        Total: {{ totalPrice }}
    </v-container>
    <v-container class="text-red-500">
        {{ errorMsg }}
    </v-container>


    <v-container>
        <div>PLEASE NOTE: FOR DEMONSTRATION PURPOSES, WE DONT KEEP TRACK OF CUSTOMER'S PENDING ORDERS. </div>
        <div>WE DON'T EXTEND THE PAYMENT CONFIRMATION AND GATEWAY PART</div>
        <div>Order submission assumes that everything is fine and we just subtract from inventory immediately</div>
    </v-container>

    <v-sheet class="mx-auto" max-width="300">
        <v-form validate-on="submit lazy" @submit.prevent="handleSubmitOrder">
            <v-text-field v-model="address" :rules="addresRules" label="Full Address"></v-text-field>

            <v-text-field v-model="creditCardInfo"
                label="Credit Card Number, Leave empty if paying cash"></v-text-field>

            <v-btn :loading="loading" class="mt-2" text="Submit Orders" type="submit" block></v-btn>
        </v-form>
    </v-sheet>

</template>


<script setup lang="ts">
definePageMeta({
    middleware: ["profile-auth"],
    layout: "topbar-layout",
})

import { ref } from 'vue';
import type { Database } from '~/lib/database.types';
const productStore = useInventoryProductStore()
const products = storeToRefs(productStore)
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const address = ref('')
const orderArray = ref<any>([])
const creditCardInfo = ref('')
const totalPrice = ref(0)
const isSufficientStock = ref(true)
const addresRules = [
    (value: any) => {
        //if not empty
        if (value) return true

        return 'You must enter an address.'
    },
]

const handleDeleteAllOrders = async () => {
    //make the orderArray unique in terms of product and accumate the quantity
    const uniqueOrderArray = orderArray.value.reduce((acc: any, item: any) => {
        const existingItem = acc.find((accItem: any) => accItem.Product.id === item.Product.id)
        if (existingItem) {
            existingItem.quantity += item.quantity

        } else {
            acc.push({ ...item })
        }
        return acc
    }, [])

    //perform a linear check to see if an element's quantity is greater than its remaining stock
    //if it is, then set isSufficientStock to false
    isSufficientStock.value = uniqueOrderArray.every((item: any) => item.Product.remaining_stock >= item.quantity)
    if (isSufficientStock.value === false) {
        errorMsg.value = "Some products are out of stock";
        console.log("Some products are out of stock")
        
        return
    }
    // console.log("first: " +  uniqueOrderArray[0].Product.vendor_id) 
    console.log(uniqueOrderArray)

    //perform an update to db, find the product id and subtract the quantity from the remaining stock   
    try {
        const { error } = await supabase
            .from('Product')
            .upsert(
                uniqueOrderArray.map((item: any) => ({
                    id: item.Product.id,
                    remaining_stock: item.Product.remaining_stock - item.quantity,
                    price: item.Product.price,
                    product_type: item.Product.product_type,
                    store_id: item.Product.store_id,
                    vendor_id: item.Product.vendor_id,
                }))
            )

        if (error) throw error
        if (error) {
            console.log(error)
        } else if (!error) {
            successMsg.value = "update stock success"
            console.log(successMsg.value)
        }
    } catch (error) {
        errorMsg.value = (error as any).error_description || (error as any).message
        console.log(errorMsg.value)
    }



    console.log(uniqueOrderArray)
    console.log("to delete")



    //find the all rows in cart table with the id as customer_id and delete them
    try {
        loading.value = true
        const { data, error } = await supabase
            .from('Cart')
            .delete()
            .eq('customer_id', user.value?.id || '')

        if (error) throw error

        if (error) {
            console.log(error)
        } else if (!error) {
            successMsg.value = "delete all orders success"
            //refresh cart
            handleCartFetch()
            errorMsg.value = ""
        }
    } catch (error) {
        errorMsg.value = (error as any).error_description || (error as any).message
        console.log((error as any).error_description || (error as any).message)
    } finally {
        loading.value = false
    }


}

const handleOrderDelete = async (id: number) => {
    //find the row in Cart table with id as id and delete it
    try {

        const { data, error } = await supabase
            .from('Cart')
            .delete()
            .eq('id', id)

        if (error) throw error

        if (error) {
            console.log(error)
        } else if (!error) {
            successMsg.value = "delete order success"
            //refresh cart
            handleCartFetch()
        }
    } catch (error) {
        errorMsg.value = (error as any).error_description || (error as any).message
        console.log((error as any).error_description || (error as any).message)
    } finally {
        loading.value = false
    }
    console.log("order deleted")
}
const handleSubmitOrder = async () => {
    if (!address.value) {
        errorMsg.value = "Please enter an address"
        console.log("Please enter an address")
        return
    }

    if (!isSufficientStock.value) {
        errorMsg.value = "Some products are out of stock"
        //alert(errorMsg.value)
        console.log("Some products are out of stock")
        location.reload()
        return
    }

    //no need for credit card info, just assume payment is successful
    //check if product stock is below zero, then throw error


    await handleDeleteAllOrders()

    console.log("order submitted")
}

const handleCartFetch = async () => {

    //fetch the row from cart table with user id as customer_id

    loading.value = true
    try {
        loading.value = true
        const { data, error } = await supabase
            .from('Cart')
            .select(`
            *,Inventory(*)
        
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
            totalPrice.value = data.reduce((acc: number, item: any) => {
                return acc + item.Product.price * item.quantity
            }, 0)

            // Check if remaining_stock is zero for any product
            isSufficientStock.value = !data.some(item => item.Inventory && item.Inventory.remaining_stock === 0)
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