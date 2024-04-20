import type { Database } from "~/lib/database.types"

export default defineNuxtRouteMiddleware(() => {
   const user = useSupabaseUser()
    const supabase = useSupabaseClient<Database>()
    //check if role is employee


let metadata = user.value?.user_metadata
let userRole = metadata?.role
    

    // if(!user.value) {
    //     return navigateTo('/login')
    // }

    if(userRole !== 'vendor') {
        return navigateTo('/login')
    }
})
