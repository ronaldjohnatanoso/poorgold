<template>

    <div class="page-container">
    
        <div class="p-2 flex justify-center">
            <div class="font-bold text-2xl">Shop now</div>
        </div>
        <v-container>(refresh if no products show)</v-container>
        <v-container class="shadow-xl bg-yellow-100">
            <v-autocomplete @update:modelValue="handleTypeChange" hide-details single-line variant="outlined"
                prepend-inner-icon="mdi-magnify" v-model="selectedProductType" label="Product Type"
                :items="categoryList"></v-autocomplete>
        </v-container>
    
     <v-container   class="shadow-xl rounded bg-yellow-100">
            <v-container v-if="selectedProductType">{{ selectedProductType  }}</v-container>
            <v-row dense  >
                <Product :productData="product" v-for="product in filteredProducts" />
            </v-row> 
        </v-container>  
    
        <br>
        <v-container class="shadow-xl bg-blue-200">
            <v-autocomplete @update:modelValue="handleNameChange" hide-details single-line variant="outlined" prepend-inner-icon="mdi-magnify"
                v-model="selectedProductName" label="Search Product Name" :items="allProductNameList"></v-autocomplete>
        </v-container>
        <v-container v-if="searchedInventoryProduct.length < 1" :key="refreshKey" class="shadow-xl rounded bg-blue-200">
            <v-row dense>
                <v-container>Browse All</v-container>
                <Product class="my-5" :productData="product" v-for="product in inventoryProductsArray" />
            </v-row>
        </v-container>
    
        <v-container v-else-if="searchedInventoryProduct.length > 0"  class="shadow-xl rounded bg-blue-200">
            <v-row dense>
                <v-container>Browse All</v-container>
                <Product class="my-5" :productData="product" v-for="product in searchedInventoryProduct" />
            </v-row>
        </v-container>
    
    </div>
    
    
    
    
    
    </template>
    
    <script setup lang="ts">
    import type { Database } from '~/lib/database.types';
    
    
    
    
    
    
    definePageMeta({
        layout: 'topbar-layout',
    
    })
    
    const refreshKey = ref(0)
    import type { InventoryProduct } from '~/lib/table';
    
    
    const supabase = useSupabaseClient<Database>();
    const inventoryProductStore = await useInventoryProductStore()
    const inventoryProducts = storeToRefs(inventoryProductStore)
    const inventoryProductsArray = ref<InventoryProduct[]>(inventoryProducts.products.value)
    const productsLength = ref()
    const categoryList = ref<string[]>([])
    const allProductNameList = ref<string[]>([])
    const selectedProductName = ref<string | null>(null)
    const selectedProductType = ref<string | null>(null)
    const searchedInventoryProduct = ref<InventoryProduct[]>([])
    
    //filter products that only have the selected product type
    const filteredProducts = ref<InventoryProduct[]>([])
    
    const fetchCategories = async () => {
        const { data, error } = await supabase.from(`Inventory`)
            .select(`*,
                      Product(
                        *
                      )`)
            .match({ store_id: 2 })
    
        if (error) throw error
        if (data) {
            //get unique categories from Product.name
            categoryList.value = data.map((product: any) => product.Product.product_type)
            allProductNameList.value = data
  .filter((product: any) => product.remaining_stock > 0)
  .map((product: any) => product.Product.name);
        }
    }
    
    const handleTypeChange = (value: string) => {
        console.log("there")
        console.log("value: " + value)
        
        selectedProductType.value = value
        // console.log("selectedProductType: " + selectedProductType.value)
        // //console.log("filtered: " + filteredProducts.value)

        filteredProducts.value = inventoryProductsArray.value.filter((product) => {
            return product.Product.product_type === selectedProductType.value
        })

        if(filteredProducts.value.length > 0){
          console.log("filtered at least 1")
        }
        else{
            console.log("filtered 0")
        }
        return

      //   console.log("filteredProducts: " + filteredProducts.value[0].Product.name)
    
    
    }
    
    const handleNameChange = (value: string) => {
         selectedProductName.value = value
        console.log("selectedProductName: " + selectedProductName.value)
         searchedInventoryProduct.value = inventoryProductsArray.value.filter((product) => {
           return product.Product.name === selectedProductName.value
         })
    }
    
    const productContainer = ref(false)
    productsLength.value = await inventoryProductStore.getLength(supabase) || 0;
    productContainer.value = true
    
    fetchCategories()
    
    watch(inventoryProductsArray, () => {
        refreshKey.value++
    })
    
    
    
    console.log("length: " + productsLength.value)
    </script>
    
    <style scoped>
        .page-containedr{
    
            background: linear-gradient(to bottom right, #4facfe, #00f2fe);
    
        }
    
    </style>