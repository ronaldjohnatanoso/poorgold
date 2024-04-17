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
    <dir>
        id: {{ user ? user.id : '' }}
    </dir>
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


const supabase = useSupabaseClient();
const {
    data: { user },
} = await supabase.auth.getUser()
let metadata = user?.user_metadata;
const router = useRouter();


const userRole = ref<string>(metadata?.role || "default role");
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
</script>

<style scoped></style>