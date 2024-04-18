<template>
    <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent=handleRegister>
            <v-text-field v-model="email" :rules="emailrules" label="email"></v-text-field>
            <v-text-field type="password" v-model="password" :rules="passrules" label="Password"></v-text-field>
            <v-text-field type="password" v-model="repassword" :rules="passrules"
                label="Re-enter password"></v-text-field>
            <v-text-field v-model="fullname" :rules="namerules" label="Full Name"></v-text-field>
            <v-select v-model="roleType" :rules="roleRules" label="What is the role?" :items="['customer', 'employee', 'vendor', 'admin']"
                variant="outlined"></v-select>
            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
            <div class="m-2 text-red-500">{{ errorMsg }}</div>
        </v-form>
    </v-sheet>
    <div>hei</div>

</template>

<script setup lang="ts">

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

const roleRules = [
    (value: any) => {
        //if not empty
        if (value) return true

        return 'You must select a role.'
    },
]

const fullname = ref<string>('')
const email = ref('');
const password = ref('');
const repassword = ref('');
const roleType = ref('');
const errorMsg = ref('');
const successMsg = ref('');
import type { Database } from '~/lib/database.types';
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const router = useRouter()


const loading = ref(false)
const handleRegister = async () => {
    const currentUser = user.value

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
                    role: roleType.value,
                    fullname: fullname.value,

                }
            }
        })
        if (error) throw error
        //router.push('/login')
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
                .update({ role: roleType.value, fullname: fullname.value })
                .eq('id', userId as string)
                .select()

            //sign out


        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
            router.push('/login')
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