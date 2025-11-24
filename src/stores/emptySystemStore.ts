 import { defineStore } from 'pinia';
  import { AuthService } from '@/services/AuthService.ts';
  import {TeacherFirstUsingService} from '@/services/TeacherFirstUseServ.ts';
  import  type { ProfileTeacher} from '@/types/interfacesv2.ts';

 export const useEmpSysStore = defineStore('emp_sys_store',{
  	state: () => ({
       user: null as User | ProfileTeacher | null, // <-- Aquí la interfaz ProfileTeacher
       loading: false,
       error: "",
       role: null as string | null,
       isAuthenticated: false,
     }),

    getters: {
      esAuthenticated: (state) => state.isAuthenticated,
      hasError: (state) => state.error !== "",
      userEmail: (state) => state.user?.email ?? null
    },

    actions:{
     	async initializerTeacherUser(){
     		this.loading = true;
     		this.error = "";

     		try{  
          console.log('Sirviendo el estado..');
     			const result = await TeacherFirstUsingService.initialingFirstUse();

     			if (result.success && result.user) {
     				const firstUser: ProfileTeacher = result.user as ProfileTeacher;
     				 this.role = firstUser.role ?? null;
     				 this.isAuthenticated = true;
     			}else{
     				this.error = result.message;
     			}
     		}catch(err: any){
     				this.error = err.message || 'Error inesperado en el primer usuario';
     		}finally{
     			this.loading = false;
     		}
     	}, //# this all, for now
    } //#End_actions
 });