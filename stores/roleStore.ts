import { acceptHMRUpdate, defineStore } from "pinia";
import type { Database } from "~/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const useRoleStore = defineStore({
  id: "roleStore",
  state: () => ({
    userRole: 'guest', // Initialize an empty array to store products
  }),
  actions:
   {
      async  getUserRole(){
            try {
                const user = await useSupabaseUser()
                let metadata = user.value?.user_metadata
                let myRole = metadata?.role
                
               // console.log("done get user")
               // console.log(userRole)

                if( myRole === undefined){
                  this.userRole = 'guest'
                    return 'guest'
                }

                this.userRole = myRole
                return myRole
            } catch (error) {
                console.log(error)
            }
        },

      async getUserId(){
        try {
          const user = await useSupabaseUser()
          return user.value?.id as string
        } catch (error) {
          console.log(error)
        }

      }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoleStore, import.meta.hot));
}
