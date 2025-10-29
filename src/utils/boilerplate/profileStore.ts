  import {defineStore} from 'pinia';
  import { ProfileStudentService } from '@/Services/ProfileStudentServ.ts'
  import {ProfileTeachersService} from '@/Services/ProfileTeacherServ.ts'
  import type  {Profile} from '@/types';

    export const useProfileStore = defineStore('profiles', {
     	state() => ({
    	 	   // Dec. de las variables reactivas de ambos roles
     	 	  profile:  profile as Profile;
              typeUser: null as User;
     	 	  loading: false,
     	 	    error: "";
     	}),

 	    actions: {  //*this->storeProf(1)
 	 	    async fetchProfileUno(userId: string){
 	 		  this.loading = true;
 	 		   
 	 		    try{
                    // Identificar que se guardo
                 const perfilR1 = await ProfileStudentService.getStudentById(userId);
                    if(perfilR1){
                       this.profile = perfilR1;
                       this.typeUser = {uid: perfilR1.uid_alumno, name: perfilR1.name,  email: perfilR1.email, role: 'alumno'};
                        console.log('El perfil del Alumno fue obtenido correctamente de la Base Firebase');
                    }
                    return perfilR1; // en fase de prueba (cambios)
   	 	        }catch(err: any){
   	 	   	      this.error = err.message;
   	 	        }finally{
   	 	   	      this.loading = false;
   	 	        }
 	 	    },

 	 	    async fetchProfileDos(userId: string){
 	 		  this.loading = true;
 	 		
 	 		  try{
                     const perfilR2 = await ProfileTeachersService.getTeacherById(userId);

                     if(perfilR2){
                         this.profile = perfilR2;
                         this.typeUser = { uid: perfilR2.uid_proffe, name: perfilR2.name, email: perfilR2.email, role: 'profesor'}
                          console.log('El perfil del Profesor fue obtenido correctamente de la Base Firebase');
                            return perfilR2; // en fase de prueba (cambios)
                     }

   	 	      }catch(err: any){
   	 	   	      this.error = err.message;
   	 	      }finally{
   	 	   	    this.loading = false;
   	 	      }
 	 	    },
                //*this->storeProf(1)
 	 	    async whyProfileToSave(userId: string, data_perfil: Profile){
 	 		  this.loading = true;

 	 		    try{ 	
                    if (this.typeUser?.role === 'alumno' && this.typeUser.uid === userId) {
 	 				     await ProfileStudentService.saveStudentProfile(data_perfil);
                          console.log('El Perfil del ALUMNO ha sido guardado en la Firestore')
                    }else
                    if (this.typeUser?.role === 'profesor' && this.typeUser.uid === userId) {
                         await ProfileTeachersService.saveStudentProfile(data_perfil);
                          console.log('El Perfil del PROFESOR ha sido guardado en la Firestore');
                    } else {
                        console.warn('[Estado de Perfil]: No se reconoció el tipo de usuario para guardar el perfil ');
                    }
                    
   	 	        }catch(err: any){
   	 	   	       this.error = err.message;
   	 	        }finally{
   	 	   	       this.loading = false;
   	 	        }
 	        },  // (,) si se necesitan mas metodos

                //*this->storeProf(2)
            async EditProfileAlumno(userId: string, dataPerfil: Profile){
              try{  //?
                   if(this.typeUser?.role==='alumno' && typeUser.uid === userId)
                   await ProfileStudentService.updateStudentProfile(userId,dataPerfil);
                  if (this.typeUser?.role==='profesor' && typeUser.uid === userId) {
                        await ProfileTeachersService.updateTeacherProfile(userId,dataPerfil);
                  }
              }catch{
                 this.error = err.message;
              }
            }
                /* Eliminar el Perfil del Usuario: Fecha [11/Oct/2025] */
            async selectedProfileForRoleDel(userId: string, Profile: 'alumno' | 'profesor'){
                this.error = "";
                
                try{
                     let deleted;
                    if (role === 'alumno') {        
                          deleted = await ProfileStudentService.getDeleteById(userId);
                    }else if (role === 'profesor') {
                           deleted = await ProfileTeachersService.getDeleteById(userId);
                    } else {
                        throw new Error("El rol no es reconocido para su eliminación");
                    }

                    if (deleted) {
                        console.log([`[stateProfiles]: Perfil de ${role} eliminado correctamente`);
                    }else{
                         alert('Aún no encotramos tú perfil espera un poco más.');
                         return false;
                    }
                }catch(err: any){
                    this.error = err.message || 'El Perfil ya fue Eliminado, o no existe';
                    console.error(`[stateProfiles]: ${this.error}` );
                     return false;
                }
            }

             /** [06/Oct/2025]Registros mediante Redes Social o Correo Elect. **/
            async selectedEmailOrFacebook(){
                this.loading = true;
                this.error = "";

                try{
                    let response;
                    // Validamos que exista el tipo usuario antes de comenzar 
                    if(!this.typeUser !this.role){
                        throw new Error("El usuario no ha sido definido para registro sencillo");
                    }

                    if (this.typeUser?.role==='profesor') {
                          // Registro mediante Google
                        response  = await ProfileTeachersService.signInAndSaveGmailTeacher();
                    }else if (this.typeUser?.role==='alumno') {
                        // Registra mediante Facebook
                        response = await ProfileStudentService.signInAndSaveFBStudent();
                    } else {
                        throw new Error(`Rol Desconocido: ${this.typeUser.role }`);
                    }

                       // Actualizamos el estado global del estado retornado
                     this.typeUser = response;
                     //  Informamos al usuario sobre el valor dinamico de la respuesta del usuario en el store
                      console.error(`[Estado de Perfil- Rol]: El Registro por Red Social, fue completado para: ${this.email}`)
                        return response;
                }catch(error){
                    this.error = err.message || "Error al registrar el usuario mediante la Red Social";
                    console.error("[useProfileSt]: Error en Registro por Red Social"); // provee seguridad robusta en el registro de sesion
                     throw err;
                }finally{
                    this.loading = false;
                }
            }
            /* setters: { }*/
    });