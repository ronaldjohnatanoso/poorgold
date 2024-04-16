<template>
    <v-btn @click="handleCheck">
        Check date
    </v-btn>
    <span>{{ created_at }}</span>
</template>

<script setup lang="ts">
import type { Database } from '~/lib/database.types';

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const created_at = ref<string>('')

const userId = user.value?.id;

const handleCheck = async () => {
    // Ensure userId is defined
    if (!userId) {
        console.error('User ID is undefined');
        return;
    }

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

    


    const { error } = await supabase
  .from('user')
    .update({ role: 'customer' } )
  .eq('id', userId as string)
  .select()


    created_at.value = data.role as string
}
</script>

<style scoped></style>