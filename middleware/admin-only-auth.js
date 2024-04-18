// import type { Database } from "~/lib/database.types"

export default defineNuxtRouteMiddleware(() => {
   const user = useSupabaseUser()
   // const supabase = useSupabaseClient()
    //check if role is employee

console.log("the role is : " + user.value?.user_metadata.role)

let metadata = user.value?.user_metadata
let userRole = metadata?.role
    

    if(!user.value) {
        return navigateTo('/login')
    }

    if(userRole !== 'admin') {
        return navigateTo('/login')
    }
})
