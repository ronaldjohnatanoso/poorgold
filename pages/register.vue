<template>
    <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent=handleRegister>
            <v-text-field v-model="email" :rules="emailrules" label="email"></v-text-field>
            <v-text-field type="password" v-model="password" :rules="passrules" label="Password"></v-text-field>
            <v-text-field type="password" v-model="repassword" :rules="passrules"
                label="Re-enter password"></v-text-field>
            <v-text-field v-model="fullname" :rules="namerules" label="Full Name"></v-text-field>
            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
            <div class="m-2 text-red-500">{{ errorMsg }}</div>
        </v-form>
    </v-sheet>

</template>


<script setup lang="ts">
import { ref } from 'vue';
import Data_check from '~/components/data_check.vue';
definePageMeta({
    layout: 'topbar-layout',
    middleware: ['login-auth']
})

const emailrules = [
    (value: any) => {
        //if not empty
        if (value) return true

        return 'You must enter an email.'
    },
]


const namerules = [
    (value: any) => {
        //if not empty
        if (value) return true

        return 'You must a full name'
    },
]


const passrules = [
    (value: any) => {
        //if not empty
        if (value) return true

        return 'You must enter a password.'
    },
]

const fullname = ref<string>('')
const email = ref('');
const password = ref('');
const repassword = ref('');
const errorMsg = ref('');
const successMsg = ref('');
import type { Database } from '~/lib/database.types';
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const router = useRouter()
const roleStore = useRoleStore()


const loading = ref(false)
const handleRegister = async () => {
    //check password re enter
    if (password.value !== repassword.value) {
        errorMsg.value = "Passwords do not match"
        return
    }

    try {
        loading.value = true
        const { error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    role: 'customer',
                    fullname: fullname.value,

                }
            }
        })
        if (error) throw error
    
        if (error) {
            console.log(error)
        } else if (!error) {
            successMsg.value = "Registration successful"
            console.log(successMsg.value)

            //update user metadata to customer table
            const userId = user.value?.id;

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
            //update the user metadata
            const { error } = await supabase
                .from('user')
                .update({ role: 'customer', fullname: fullname.value })
                .eq('id', userId as string)
                .select()
                roleStore.getUserRole()
                router.push('/profile')
        }
    } catch (error) {
        errorMsg.value = (error as any).error_description || (error as any).message
        console.log((error as any).error_description || (error as any).message)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped></style>