<template>
    <v-sheet class="mx-auto" width="300">

      <img src="/images/png/logo-no-background.png" alt="">
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
        <span class="underline text-blue-500">forgot password?</span>
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
    const roleStore = useRoleStore()

const loading = ref(false)
    const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (error) throw error
        if (error) {
         // console.log(error)
        }
        else if (!error) {
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

<style scoped>

</style>