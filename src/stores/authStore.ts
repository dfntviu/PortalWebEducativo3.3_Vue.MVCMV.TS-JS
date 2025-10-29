import {defineStore} from 'pinia';
import {AuthService} from '@/services/AuthService.ts';
  import type {User} from "@/types/interf.index.ts";

    export const useAuthStore = defineStore('auth', {
   	  state: () => ({
   	  	 user: null as User | null,
   	  	 loading: false,
   	  	 error: "",
         errorHistory: [] as string[], //📌historial de errores
   	  }),

      getters:{
        isAuthenticated: (state) => state.user !== null,
        hasError: (state) => state.error !== "",
        userEmail: (state) => state.user?.email ?? null
      },

   	  actions: {
        /* ----------------
         *   SETTERS
         * ---------------- */
         setUser(user: User | null){
           this.user = user;
         },

         setError(msg: string) {
           this.error = msg;
            //📌 Traza de Consola
           console.error("[Estado-Error] Error:", msg);
            // 📌 Guarda el historial de Errores
            this.errorHistory.push(
               `${new Date().toISOString()}- ${msg}`
            );
         },

          clearError(){
            this.error = "";
          },

          setLoading(value: boolean){
            this.loading = value;
          },

   	   	async login(email: string, password: string){
           this.setLoading(true);
   	   	 	 this.clearError();

   	   	 	   try{
   	   	 	   	 const user = await AuthService.login(email, password);
                this.setUser(user);
   	   	 	   }catch(err: any){
               this.setError(err.message || 'Error de Login');
   	   	 	   }finally{
               this.setLoading(false);
   	   	 	   }
   	   	},

   	   	async logout() {
            this.setLoading(true);
           this.clearError();

   	   	 	  try{
   	   	 	  	 await AuthService.logout();
               this.setUser(null);
   	   	 	  }catch(err: any){
   	   	 	  	  this.setError(err.message || 'Error al cerrar Sesión')
   	   	 	  }finally{
              this.setLoading(false);
   	   	 	  }
   	   	},
        
   	   	async getCurrentUser() {
          this.setLoading(true);
           this.clearError();

            try{
   	   		     const user = await AuthService.getCurrentUser();
                this.setUser(user);
            }catch(err: any){
               this.setError(err.message || 'Error al Obtener el usuario Actual');
            }finally{
               this.setLoading(false);
            }

   	   	},

        async credencialesDeSession(email: string, password: string) {
          this.setLoading(true);
           this.clearError();

            try{
               const email = await AuthService.signInUser(email,null);
               const contrasenia = await AuthService.signInUser(null,password);
                // this.setUser(user);
                  return {Email, contrasenia};
            }catch(err: any){
               this.setError(err.message || 'Error al Obtener el usuario Actual');
            }finally{
               this.setLoading(false);
            }

        },

   	  },
   	   	
    });