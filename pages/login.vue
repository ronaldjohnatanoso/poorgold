<template>
    <v-sheet class="mx-auto" width="300">
      <v-form @submit.prevent=handleLogin>
        <v-text-field
          v-model="email"
          :rules="rules"
          label="email"
        ></v-text-field>
        <v-text-field type="password"
          v-model="password"
          :rules="passrules"
          label="Password"
        ></v-text-field>

       
        <v-btn  class="mt-2" type="submit" block>Submit</v-btn>
        <div class="m-2 text-red-500">{{errorMsg}}</div>
      </v-form>
    </v-sheet>
 
    

  </template>


<script setup lang="ts">
    import { ref } from 'vue';
    definePageMeta({
        layout: 'topbar-layout',
        middleware : ['login-auth']
    })

    const rules = [
        (value: any) => {
            //if not empty
          if (value) return true

          return 'You must enter an email.'
        },
    ]

    const passrules = [
        (value: any) => {
            //if not empty
          if (value) return true

          return 'You must enter a password.'
        },
    ]
 

    const email = ref('');
    const password = ref('');
    const errorMsg = ref('');
    const successMsg = ref('');
    const supabase = useSupabaseClient()
    const router = useRouter()


const loading = ref(false)
    const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (error) throw error
        router.push('/profile')
        if (error) {
         // console.log(error)
        }
    } catch (error) {
      errorMsg.value = (error as any).error_description || (error as any).message
      console.log((error as any).error_description || (error as any).message)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>

</style>