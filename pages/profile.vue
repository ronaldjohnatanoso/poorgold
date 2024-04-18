<template>
    <div>
        email: {{ user ? user.email : '' }}
    </div>
    <div>
        role: {{ userRole }}
    </div>

    <div>
        full: {{ userFullName }}
    </div>
    <div>
        id: {{ user ? user.id : '' }}
    </div>
    <!-- <data_check /> -->
    <div>
        <v-btn>
            <button @click="handleLogout">Logout</button>
        </v-btn>
    </div>
    <ProductCheck />
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ["profile-auth"],
    layout: "topbar-layout",
})

import type { Database } from '~/lib/database.types';
const supabase = useSupabaseClient<Database>();

const {
    data: { user },
} = await supabase.auth.getUser()
let metadata = user?.user_metadata;
const router = useRouter();
const userId = user?.id;

const userRole = ref<string>("default role");
const userFullName = ref<string>(metadata?.fullname || "unknown");

const handleLogout = async () => {
   
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        router.push("/login")
    } catch (error) {
        router.push("/login")
        console.log((error as Error).message);
    }
}

const handleFetchUserInfo = async () =>{

    try {
 
        const { data, error } = await supabase
            .from('user')
            .select(`*
      `)
            .eq('id', userId || '')
            .single()

        if (error) throw error

        if (error) {
            console.log(error)
        } else if (!error) {
          userRole.value = data.role as string
        }
    } catch (error) {
       
        console.log((error as any).error_description || (error as any).message)
    } finally {
       
    }
}

handleFetchUserInfo()
</script>

<style scoped></style>