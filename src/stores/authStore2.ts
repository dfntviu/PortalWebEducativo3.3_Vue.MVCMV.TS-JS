import {defineStore} from 'pinia';
import {AuthService} from '@/services/AuthService2.ts';
import  {TeacherFirstUsingService} from '@/services/TeacherFirstUseServ2.final_total.design.ts';
import {ProfileTeacher,ProfileStudent} from '@/types/interfacesv2.ts'; 
 import {nextTick} from 'vue';
import { useRouter} from 'vue-router';

    export const useAuthStore = defineStore('auth_store2', {
   	  state: () => ({
   	  	 user: null as ProfileTeacher | ProfileStudent | null,
   	  	 loading: false, 
   	  	 error: "",
         email: '',
         password: '',
         role: null as string | null, 
         isAuthenticated: false,     	   
       }),

      getters: {
        esAutenticado: (state) => state.isAuthenticated,
        hasError: (state) => state.error !== '',
        userEmail: (state) => state.user?.email ?? null,
      },

      actions: {

        async anyUserExist(): Promise<boolean>{
          try{
             return await TeacherFirstUsingService.anyUserExist();
          }catch{

          }
        },

        async initializerTeacherUser(){
          this.loading = true;
          this.error = '';

          try{  
            const result = await TeacherFirstUsingService.initialingFirstUse(); //review
            console.log('Salida-InitUser: ', result);

            if (result.success && result.user) {
               this.user = result.user;
               this.role = result.user.role ?? null;
               this.isAuthenticated = true;
                return result;
                // console.log('ES: ',result);
            }else{
              this.error = result.message;
              return result;
            }
          }catch(err: any){
              this.error = err.message || 'Error inesperado en el primer usuario';
              return { success: false, message: this.error};
          }finally{
            this.loading = false;
          }
              return result;
        },
          // Si funciono (Corregido: Dom. 08/Nov/2025)
        async initFirstTeacher(){
            const router = useRouter();

             const first_teacherResult =  await TeacherFirstUsingService.sendCredentials(router,nextTick());

             if (first_teacherResult.success) {
               this.email = first_teacherResult.email;
               this.password = first_teacherResult.password;
               // this.user = first_teacherResult.user
               this.isAuthenticated = true;
                   // console.log('[Store-TeacherInit]- Credenciales recibidas: ',this.email, this.password);
             } else{  
                   console.error(first_teacherResult.message);
                  // console.warn('[Store-TeacherInit]- Credenciales recibidas: ',first_teacherResult.email);
             }
             return first_teacherResult;   //la clave
        },

        async login(email: string, password: string){
             this.loading = true;
            this.error = ''
            try{
               //  Determina que el usuario se loggeo con las credenciales 
               const rest = await AuthService.login(email,password);
               
               if (rest.success && rest.user) {
                  this.user = rest.user;
                  this.role = rest.user.role ?? null;
                  this.isAuthenticated = true;
               } else {
                   this.error = rest.message
               }
                 return rest;
              }catch(err: any){
                this.error = err.message || 'Error inesperado al iniciar';
              }finally{
                this.loading = false;
            }
        },
         async logout() {
          const res = await AuthService.logout();
           if (res.success) {
             this.user = null;
             this.role = null;
             this.isAuthenticated = false;
          } else {
            this.error = res.message;
          }
            return res;
          },
      },
  });