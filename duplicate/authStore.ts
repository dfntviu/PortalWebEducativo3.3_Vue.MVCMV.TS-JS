import {defineStore} from 'pinia';
import {AuthService} from '@/services/AuthService.ts';
  import type {User} from "@/types/interf.index.ts";

    export const useAuthStore = defineStore('auth', {
   	  state: () => ({
   	  	 user: null as User | null,
   	  	 loading: false, // load of state
   	  	 error: "",
         errorHistory: [] as string[], //📌historial de errores
         role: null as string | null, //Rol de inicio de session
         isAuthenticated: false,  //-- state of authenticated --
   	  }),

      getters:{
        esAuthenticated: (state) => state.isAuthenticated, // .user !== null
        hasError: (state) => state.error !== "",
        userEmail: (state) => state.user?.email ?? null,
      },

   	  actions: {
        /* ----------------
         *   SETTERS
         * ---------------- */
         setUser(user: User | null){
           this.user = user;
         },

         setRole(role: string | null) {
          this.role = role;
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
               //  Determina que el usuario se loggeo con las credenciales 
               const user = await AuthService.signInUser(email,password);
               
               if (user) {
                 // Obtiene el rol, posterior hacer login
                  const role = AuthService.fethUserRole(user.uid);

                  this.setRole(role);  //Establece el rol de usuario
                  this.setUser(user);   // Establece el usuario que esta activo firebase-alm
                  this.isAuthenticated = true; // Determina si el usuario como autenticado

               }
   	   	 	   	 /*const user = await AuthService.login(email, password);
                this.setUser(user);*/
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
              this.isAuthenticated = false;
   	   	 	  	 await AuthService.logout();
              //  this.setUser(null);
              // this.setRole(null);
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