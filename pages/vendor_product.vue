<template>

    <v-container>


        <!--   
    <v-container>
        here: {{ debugString }}
      </v-container>   -->

        <v-card>
            <v-container>
                <v-btn @click="handleAddProduct" color="purple">Add new Product</v-btn>
            </v-container>



            <v-dialog v-model="addProductDialog" transition="dialog-bottom-transition" width="auto">
                <v-sheet class="mx-auto p-2" width="300">
                    <v-form fast-fail @submit.prevent>
                        <v-text-field v-model="pName" label="Product Name"></v-text-field>
                        <v-text-field v-model="pBrand" label="Brand"></v-text-field>
                        <v-text-field v-model="pProductType" label="Product Type"></v-text-field>
                        <v-text-field v-model="pVendorPrice" label="Vendor Price"></v-text-field>
                        <v-text-field v-model="pSize" label="size"></v-text-field>
                        <v-text-field v-model="pDescription" label="description"></v-text-field>
                        <v-text-field v-model="pParentProductType" label="Parent Product type"></v-text-field>
                        <v-btn label="">Upload Image (not working yet)</v-btn>
                        <v-btn @click="handleAddSubmit" class="mt-2" type="submit" block>Submit</v-btn>
                    </v-form>
                </v-sheet>
            </v-dialog>
        </v-card>



        <v-card v-if="productArray.length > 0" title="UPDATE My Product Listing" flat>
            <template v-slot:text>
                <v-text-field v-model="search" label="Search by name of product" prepend-inner-icon="mdi-magnify"
                    variant="outlined" hide-details single-line></v-text-field>
            </template>

            <v-container>
                <v-row justify="space-around">
                    <v-col cols="12" md="6">


                        <v-dialog v-model="dialogOpen" transition="dialog-bottom-transition" width="auto">
                            <v-card>
                                <v-toolbar title="Update product"> </v-toolbar>
                                <v-container>Product ID: {{ correctSingleSelected?.id }}</v-container>
                                <v-sheet class="mx-auto" width="300">
                                    <v-form fast-fail @submit.prevent>
                                        <v-text-field v-model="pName" label="Product Name"></v-text-field>
                                        <v-text-field v-model="pBrand" label="Brand"></v-text-field>
                                        <v-text-field v-model="pProductType" label="Product Type"></v-text-field>
                                        <v-text-field v-model="pVendorPrice" label="Vendor Price"></v-text-field>
                                        <v-text-field v-model="pSize" label="size"></v-text-field>
                                        
                                        <v-text-field v-model="pParentProductType" label="Parent Product Type"></v-text-field>
                                        
                                        <v-text-field v-model="pDescription" label="description"></v-text-field>
                                        

                                        <v-btn label="">Upload Image (not working yet)</v-btn>
                                        <v-btn @click="handleUpdateSubmit" class="mt-2" type="submit"
                                            block>Submit</v-btn>
                                            <v-btn block @click="handleDelete" class="mt-2" color="red">Delete this Product</v-btn>
                                    </v-form>
                                </v-sheet>



                                <v-container>
                                    <span class="text-red-500">{{ statusMsg }}</span>
                                </v-container>

                                <v-card-actions class="justify-end">
                                    <v-btn text="Close" @click="dialogOpen = false"></v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>

                    <v-col cols="12" md="6">

                    </v-col>
                </v-row>
            </v-container>



            <v-btn v-for="header in headers" :key="header.value" @click="toggleColumn(header.value)" :class="[
                'header',
                visibleColumns.includes(header.value) ? 'visible' : 'hidden',
            ]">
                {{ header.title }}
            </v-btn>
            <v-container color>{{ statusMsg }}</v-container>
            <v-data-table :items="productArray" :search="search" :headers="visibleHeaders" select-strategy="single"
                show-select v-model-value="selected" @update:model-value="handleProductSelect($event as any[])"
                item-value="Product_name" return-object></v-data-table>

            <pre>{{ correctSingleSelected }}</pre>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';

definePageMeta({
    middleware: ["vendor-only-auth"],
    layout: "topbar-layout",
});
const supabase = useSupabaseClient<Database>();
const dialogOpen = ref(false);

const statusMsg = ref('');
const newProduct = ref<Product>()
const pName = ref<string>()
const pProductType = ref<string>()
const pSize = ref<string>()
const pParentProductType = ref<string>()
const pDescription = ref<string>()
const pVendorPrice = ref<number>()
const pBrand = ref<string>()
const addProductDialog = ref<boolean>(false)

const handleDelete = async () => {
    const { data, error } = await supabase
        .from('Product')
        .delete()
        .match({ "id": correctSingleSelected.value?.id });
    if (error) {
        statusMsg.value = error.message;
        console.log(error)
    }
    if (!error) {
        statusMsg.value = "Product deleted";
        console.log(data)
        dialogOpen.value = false;
        alert("Product deleted")

        handleFetchProduct()
    }
}

const handleAddSubmit = async () => {
    const { data, error } = await supabase
        .from('Product')
        .insert<Product>(
            {
                name: pName.value,
                product_type: pProductType.value,
                size: pSize.value,
                parent_product_type: pParentProductType.value,
                description: pDescription.value,
                vendor_price: pVendorPrice.value,
                brand: pBrand.value,
                vendor_id: vendorId,
                
            } as Product
        );
    if (error) {
        statusMsg.value = error.message;
        console.log(error)
    }
    if (!error) {
        alert("Product added")
        statusMsg.value = "Product added";
        console.log(data)
        handleFetchProduct()
    }
}

const handleAddProduct = async () => {
    pName.value = ""
    pProductType.value = ""
    pSize.value = ""
    pParentProductType.value = ""
    pDescription.value = ""
    pVendorPrice.value = 0
    pBrand.value = ""
    pDescription.value = ""

    addProductDialog.value = true


}





const handleUpdateSubmit = async () => {

    const { data, error } = await supabase
        .from('Product')
        .update({
            name: pName.value,
            product_type: pProductType.value,
            size: pSize.value,
            parent_product_type: pParentProductType.value,
            description: pDescription.value,
            vendor_price: pVendorPrice.value,
            brand: pBrand.value,

        })
        .match({ "id": correctSingleSelected.value?.id });
    if (error) {
        statusMsg.value = error.message;
        console.log(error)
    }
    if (!error) {
        statusMsg.value = "Product updated";
        console.log(data)
        dialogOpen.value = false;
        alert("Product updated")

        handleFetchProduct()
    }
}

const handleProductSelect = (value: any[]) => {
    statusMsg.value = "";
    //newProduct.value  = value[0]
    pName.value = value[0].name
    pProductType.value = value[0].product_type
    pSize.value = value[0].size
    pParentProductType.value = value[0].parent_product_type
    pDescription.value = value[0].description
    pVendorPrice.value = value[0].vendor_price
    pBrand.value = value[0].brand
    console.log(newProduct.value)
    if (value.length == 0) {
        //just unchecking
        correctSingleSelected.value = undefined;
        console.log("no value")
        return;
    }

    if (value.length) {
        console.log("more than 1 value")
        correctSingleSelected.value = value[0]



        dialogOpen.value = true;
        return;
    }

};


const productArray = ref<Product[]>([]); //
const search = ref('');
const selected = ref<any>(); //flattened inventory that should be at most 1 item because of single select
const visibleColumns = ref<string[]>([]);
const correctSingleSelected = ref<Product>();

const headers = computed(() => {
    if (productArray.value.length > 0) {
        const firstItem = productArray.value[0];
        return Object.keys(firstItem).map((key) => ({
            value: key,
            title: key,
            sortable: true,
        }));
    }
    return [];
});

const toggleColumn = (column: string) => {
    const index = visibleColumns.value.indexOf(column);
    if (index === -1) {
        visibleColumns.value.push(column);
    } else {
        visibleColumns.value.splice(index, 1);
    }
};

const visibleHeaders = computed(() => {
    if (visibleColumns.value.length === 0 && productArray.value.length > 0) {
        visibleColumns.value = Object.keys(productArray.value[0]);
    }
    return headers.value.filter((header) => visibleColumns.value.includes(header.value));
});

const debugString = ref()

const roleStore = useRoleStore()
const vendorId = await roleStore.getUserId()



const handleFetchProduct = async () => {

    try {
        const { data, error } = await supabase
            .from('Product')
            .select(`
        id,
        name,
        brand,
        product_type,
        parent_product_type,
        vendor_price,
        size,
        description
          `)
            .match({ "vendor_id": vendorId });

        if (error) throw error;
        if (!error) {
            console.log(data);
            productArray.value = data as Product[];
            //origProductArray.value = data as ReorderStoreProduct[];
            // Reset visible columns when new data is fetched
            visibleColumns.value = Object.keys(productArray.value[0] || {});
        }
    } catch (error) {
        console.log("error")
        console.log(error);
    }

    // for (let i = 0; i < origProductArray.value.length; i++) {
    //   productArray.value[i] =origProductArray.value[i];
    // }

    debugString.value = JSON.stringify(productArray.value)
};
handleFetchProduct();
newProduct.value = correctSingleSelected.value
//handleFetchStores();
//watch(pickedLocation, handleFetchInventory);


debugString.value = productArray.value

</script>

<style scoped>
.header {
    font-size: 10px;
    color: black;
    background-color: rgb(233, 176, 176);
}

.visible {
    background-color: lightblue;
}

.hidden {
    background-color: rgb(233, 176, 176);
}
</style>