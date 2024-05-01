<template>
    <!-- <img src="/images/png/abstract-green-background-free-vector.jpg" alt=""> -->




    <div  class="page-container mb-[-25px]">
    
        <div class="p-2 flex justify-center">
            <div class="font-bold text-2xl">Shop now</div>
        </div>
        <v-container>(refresh if no products show)</v-container>
        <v-container class="bg-yellow-100 rounded-md shadow-2xl">
            <v-container>
                <span  ref="productTypeContainer"></span>
                <v-autocomplete @update:modelValue="handleTypeChange" hide-details single-line variant="outlined"
                    prepend-inner-icon="mdi-magnify" v-model="selectedProductType" label="Product Type"
                    :items="categoryList"></v-autocomplete>
                    <v-container>
                        <v-row>
                            <v-col v-for="type in categoryList">
                                <v-btn @click="handleTypeChange(type)" color="green">{{type}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
       
            </v-container>
        
         <v-container class=" ">
                <v-container  v-if="selectedProductType"><span class="font-bold">Category: {{ selectedProductType  }}</span></v-container>
                <v-row dense  >
                    <Product :productData="product" v-for="product in filteredProducts" />
                </v-row> 
            </v-container>  
        </v-container>
    
        <br>
        <v-container class="shadow-2xl rounded-md bg-blue-200 ">
            <v-container class="">
                <span ref="browseAllContainer"></span>
                <v-autocomplete @update:modelValue="handleNameChange" hide-details single-line variant="outlined" prepend-inner-icon="mdi-magnify"
                    v-model="selectedProductName" label="Search Product Name" :items="allProductNameList"></v-autocomplete>
            </v-container>
            <v-container v-if="searchedInventoryProduct.length < 1" :key="refreshKey" >
                <v-row dense>
                    <v-container><span class="font-bold">All Products</span></v-container>
                    <Product class="my-5" :productData="product" v-for="product in inventoryProductsArray" />
                </v-row>
                
            </v-container>
        
            <v-container v-else-if="searchedInventoryProduct.length > 0" ">
                <v-row dense>
                    <v-container>Browse All</v-container>
                    <Product class="my-5" :productData="product" v-for="product in searchedInventoryProduct" />
                </v-row>
            </v-container>
        </v-container>
 
    
    </div>
    
    
    
    
    <v-bottom-navigation class="nice">
        <v-btn @click="handleViewCategory" value="category">
          <v-icon>mdi-star</v-icon>
      
          <span>Categories</span>
        </v-btn>
      
        <v-btn @click="handleViewAll" value="all">
          <v-icon>mdi-heart</v-icon>
      
          <span>Browse All</span>
        </v-btn>
      

      </v-bottom-navigation>
    </template>
    
    <script setup lang="ts">
    import type { Database } from '~/lib/database.types';
    
    
    
    
    
    
    definePageMeta({
        layout: 'topbar-layout',
    
    })
    
    const refreshKey = ref(0)
    import type { InventoryProduct } from '~/lib/table';
    //import backgroundImage from '@/assets/images/abstract-green-background-free-vector.jpg';
    
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
    const productTypeContainer = ref<HTMLElement | null>(null)
    const browseAllContainer = ref<HTMLElement | null>(null)
    //filter products that only have the selected product type
    const filteredProducts = ref<InventoryProduct[]>([])
    
    import bg_green from '@/assets/bg-green.jpg'
    
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

    const handleViewCategory = () => {
    console.log("view category");
    if (productTypeContainer.value instanceof HTMLElement) {
        productTypeContainer.value.scrollIntoView({ behavior: 'smooth' });
    }
};

const handleViewAll = () => {
    console.log("view all")
    if (browseAllContainer.value instanceof HTMLElement) {
        browseAllContainer.value.scrollIntoView({ behavior: 'smooth'});
    }
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
        .page-container{
    
            background-image: url('/images/png/abstract-green-background-free-vector.jpg');
            background-repeat: repeat;
            background-size: cover;
            margin-top: -1rem;
;
        }
    
        .nice {
            background: linear-gradient(to right, #dae699, hsl(55, 72%, 79%));
        }
    
    </style>