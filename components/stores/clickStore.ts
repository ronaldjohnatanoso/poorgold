import {acceptHMRUpdate, defineStore} from 'pinia';

export const useClickStore = defineStore({
    id: 'clickStore',
    state: () => ({
        count: 0
    }),
    actions: {
        increment() {
            this.count++
        }
    }
})


if(import.meta.hot){;
    import.meta.hot.accept(acceptHMRUpdate(useClickStore, import.meta.hot) )
}