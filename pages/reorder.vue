<template>
  
  <v-container>



    <!-- <v-container>
      here: {{ debugString }}
    </v-container>  -->

    <v-card v-if="nestedReorderArray.length > 0" title="Product Reorder and Manual Reorder" flat>
      <template v-slot:text>
        <v-text-field v-model="search" label="Search by name of product" prepend-inner-icon="mdi-magnify"
          variant="outlined" hide-details single-line></v-text-field>
      </template>

      <v-container>
        <v-row justify="space-around">
          <v-col cols="12" md="6">
            <v-dialog v-model="dialogOpen" transition="dialog-bottom-transition" width="auto">
              <v-card>
                <v-toolbar title="Reorder Requests"> </v-toolbar>

                <v-card-text class="text-h2 pa-12">
                  Product ID: {{ correctSingleSelected?.product_id }} <br>
                  Name: {{ correctSingleSelected?.Product_name }} <br>
                  Vendor Price: P{{ correctSingleSelected?.Product_vendor_price }}
                  <br>
                  Amount Requested : {{ (correctSingleSelected as any)?.quantity }}
                  <br>
                  Store Location: {{ correctSingleSelected?.Store_location }} <br>
                </v-card-text>


                <v-container>
                  <v-row justify="space-around">
                    <v-date-picker v-model="date" elevation="24"></v-date-picker>
                  </v-row>
                </v-container>

                <v-btn @click="handleReorderApprove">Approve </v-btn>
                <v-btn @click="handleReorderReject">Reject </v-btn>
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
      <v-container color>{{statusMsg}}</v-container>
      <v-data-table :items="flatReorderArray" :search="search" :headers="visibleHeaders" select-strategy="single"
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
import type { FlattenedInventory, Reorder } from '~/stores/table';
const supabase = useSupabaseClient<Database>();
const dialogOpen = ref(false);

const statusMsg = ref('');
const date = ref()


const handleReorderApprove = async () => {
  console.log("arrive in " + date.value)
  try {
    const { error } = await supabase.from('Reorders').update({
      status: "approved",
      arrival_date: date.value
    }).match({ id: correctSingleSelected.value?.id })

    if (error) throw error;
    if (!error) {
      statusMsg.value = "Reorder request approved";
      dialogOpen.value = false;
      //  alert("Reorder request approved")
    }
  } catch (error) {
    console.log(error);
    statusMsg.value = JSON.stringify(error);

  }
}

const handleReorderReject = async () => {
  try {
    const { error } = await supabase.from('Reorders').update({
      status: "rejected",
      arrival_date: new Date().toISOString()
    }).match({ id: correctSingleSelected.value?.id })

    if (error) throw error;
    if (!error) {
      statusMsg.value = "Reorder request rejected";
      dialogOpen.value = false;
      //lert("Reorder request rejected")
    }
  } catch (error) {
    console.log(error);
    statusMsg.value = JSON.stringify(error);

  }
}

const handleProductSelect = (value: any[]) => {
  statusMsg.value = "";

  if (value.length == 0) {
    //just unchecking
    correctSingleSelected.value = undefined;
    console.log("no value")
    return;
  }

  if (value.length) {
    console.log("more than 1 value")
    correctSingleSelected.value = value[0]

    if( (correctSingleSelected.value as any) .status !== "pending"){
    statusMsg.value = "This request has already been processed - you can sort by status";
    return;
  }

    dialogOpen.value = true;
    return;
  }

};


const nestedReorderArray = ref<ReorderStoreProduct[]>([]);
const flatReorderArray = ref<FlattenedInventory[]>([]); //
const search = ref('');
const selected = ref<any>(); //flattened inventory that should be at most 1 item because of single select
const visibleColumns = ref<string[]>([]);
const correctSingleSelected = ref<FlattenedInventory>();

const headers = computed(() => {
  if (flatReorderArray.value.length > 0) {
    const firstItem = flatReorderArray.value[0];
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
  if (visibleColumns.value.length === 0 && flatReorderArray.value.length > 0) {
    visibleColumns.value = Object.keys(flatReorderArray.value[0]);
  }
  return headers.value.filter((header) => visibleColumns.value.includes(header.value));
});

const debugString = ref()

const roleStore = useRoleStore()
const vendorId = await roleStore.getUserId()

const handleFetchReorders = async () => {

  try {
    const { data, error } = await supabase
      .from('Reorders')
      .select(`
          *,
          Store(
            *
          ),
          Product(
            *
          )
  
        `)
      .match({ 'Product.vendor_id': vendorId });

    if (error) throw error;
    if (!error) {
      console.log(data);
      nestedReorderArray.value = data as ReorderStoreProduct[];
      // Reset visible columns when new data is fetched
      visibleColumns.value = Object.keys(flatReorderArray.value[0] || {});
    }
  } catch (error) {
    console.log("error")
    console.log(error);
  }

  for (let i = 0; i < nestedReorderArray.value.length; i++) {
    flatReorderArray.value[i] = flattenObject(nestedReorderArray.value[i]);
  }

  debugString.value = JSON.stringify(flatReorderArray.value)
};
handleFetchReorders();

//handleFetchStores();
//watch(pickedLocation, handleFetchInventory);


debugString.value = date.value

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