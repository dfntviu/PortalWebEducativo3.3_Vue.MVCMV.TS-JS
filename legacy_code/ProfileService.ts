/**
 * @service BaseProfileService
 * @description Servicio base para operaciones CRUD en perfiles de Firestore
 * @Proposito 
 * - Eliminar duplicacion entre ProfileStntServ y ProfileTeacherSrv
 * - Centralizar lógica común de Firestore
 * - Facilitar el matenimiento(cambia 1, afecta a todos) 
 * 
 * Uso:
 * - Los servicios especifícos(Student/Teacher) delegan a este servicio Base
 * - Este servicio NO se usa directamente desde stores/vistas
 * */
import {  BaseProfileService } from './BaseProfileService.ts';
  import type {Profile} from '@/types/interf.index.ts';
  class ProfileStudentService {
     private static readonly COLLECTION ='students';
  	/**
     * Guarda un perfil del Alumno en Firestore
     * @param data - Datos del Perfil
     */
  	  static async saveStudentProfile(data: Partial):Promise<void> {
  	  	try {
            if (!data.uid) {
               throw new Error('El UID del alumno es requerido');
            }
            
            console.log('[ProfileStudentService] Guardando perfil del alumno: ', data.uid);
            
            // Preparar datos para Firestore
            const studentData = {
            	...data,
            	role: 'student' as const,
            	uid_prof: data.uid,
            };

            await BaseProfileService.saveProfile(this.COLLECTION, data.uid, studentData);

             console.log('[ProfileStudentService] Perfil del alumno guardado exitosamente ');

  	  }catch (error: any) {
            console.error('[ProfileStudentService] ❌ Error al guardar perfil:', error);
            throw new Error(`Error al guardar perfil de Alumno : ${error.message}`);
        }
     }

    	/**
     	* Obtiene un perfil por su UID
     	* @param collectionName - Nombre de la colección
     	* @param uid - ID del usuario
     	* @returns Perfil encontrado o null si no existe
    	 */

     static async getStudentById(uid:string): Promise<Profile| null> {
     	 try{

            
     	 	  console.log('[ProfileStudentService] ✅ Obteniendo ID del alumno');

     	 	     const profile = await BaseProfileService.getProfile(this.COLLECTION, uid);

     	 	     if (profile) {
     	 	     	  console.log('[ProfileStudentService] ✅ El Alumno fue ECONTRADO');
     	 	    }else{
                  console.log(`[ProfileStudentService] ⚠️  El Alumno NO fue ECONTRADO`);
            }
				    return profile;

     	 }catch(error: any){
     	 	console.error('[ProfileStudentService] ❌ Error:', error);
            throw error;
     	 }
     }

      /**
     	* Actualiza el  perfil del Alumno 
     	* @param uid - ID del usuario
     	*  @param updates - Campos a actualizar
    	 */
      static async updateStudentProfile( uid: string, updates: Partial<Profile>)Promise<void>{
       		try{

	     	 	const db = getFirestore();
	            const docRef = doc(db, collectionName, uid);

	            
	     	 	  console.log('[ProfileStudentService] ✅ Actualizando Alumno',uid);

	     	 	     await BaseProfileService.updateProfile(docRef,this.COLLECTION, uid, updates);

					 console.log(`[ProfileStudentService] ⚠️ Perfil Actualizado`);

     	 	}catch(error: any){
     	 		 console.error('[ProfileStudentService] ❌ Error actualizando:', error);
     	 		  throw new Error(`Error al actualizar alumno: ${error.message}`);
     	 	}
      }

      /**
      * Obtiene todos los Alumnos registrados
      * @param limit - Limite de los resutlados
      *  @param Array de los perfiles de Alumnos
       */
      static async getAllStudents( limit: number):Promise<Profile[]>{
            try{

              console.log('[ProfileStudentService] Obteniendo todos los Alumnos');
                 // Preparar datos para Firestore
            const students = await BaseProfileService.getAllProfiles(this.COLLECTION,limit);
               
                console.log(`[ProfileStudentService] ${students.length} Alumnos Obtenidos..`);

                return students;

         }catch(error: any){
             console.error('[ProfileStudentService] ❌ Error al cuantificar Estudiantes:', error);
              throw error;
         }
      }

         /**
      * Busca Alumno por Email
      * @param email - Email del Alumno
      *  @param Perfil del Alumno o null
       */

       static async getStudentByEmail( email: string):Promise<Profile | null>{
            try{

              console.log('[ProfileStudentService] Buscando Alumno por E-mail..');
                 // Preparar datos para Firestore
            const student = await BaseProfileService.getProfileByEmail(this.COLLECTION,email);
                   console.warn(`E-amil: ${email} del Alumno Encontrado..`);

                return student;

         }catch(error: any){
             console.error('[ProfileStudentService] ❌ Error en la busq del E-amil:', error);
              throw error;
         }
      }

      /**
      * Desactiva el perfil del Alumno
      * @param UID - Uid del Alumno
       */
    static async deleteStudent( uid: string):Promise<void>{
        try{
            
            console.log('[ProfileStudentService] Desactivando el Profile del Alumno:',uid);
            
            await BaseProfileService.deleteProfile(this.COLLECTION. uid);
            
            console.log(`[ProfileStudentService] El UID${uid} del Alumno ha sido DESACTIVADO..`);
        }catch(error: any){
               console.error('[ProfileStudentService] ❌ Error al Desactivar Alumno..', error);
              throw error;
    }
    
  }	