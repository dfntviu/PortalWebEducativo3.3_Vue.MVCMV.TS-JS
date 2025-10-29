/* se remplazara, en  lugar de profileStore, ademas se aniadira las funciones faltantes,
  del store base profileStore -->*/
  import { defineStore } from 'pinia';
  import type  {Profile} from '@/types';
  import { ProfileStudentService } from '@/Services/ProfileStudentServ.ts'
  import {ProfileTeachersService } from '@/Services/ProfileTeacherServ.ts'

 const useProfileStore = defineStore('profiles', {
    state: () => ({
               profile:  null as Profile | null,
              typeUser: null as {uid: string; name?:string; role: 'alumno'| 'profesor'} | null,
              loading: false,
                error: '' as string,
             message: '' as string,
             socialUser: null as any,
            
             socialProfile: {
                 name: '',
                 apellido: '',
                 email: '',
                 role: 'alumno',
            } as Partial <Profile>, //todas las props son opcionales
    }),

    actions: {
        /*-------------------------------------------------
           1. Metodo que determina que tipo de perfil most
         --------------------------------------------------*/
        async fetchProfiles(userId: string){
             if (!userId) return null;
              this.loading = true;
              this.error = '';
              // this.loading = true;

                try{
                    // Obtener el perfil del Alumno
                    const perfilR1 = await ProfileStudentService.getStudentById(userId);
                    if(perfilR1){
                       this.profile = perfilR1;
                       this.typeUser = {uid: perfilR1.uid_alumno, name: perfilR1.name,  email: perfilR1.email, role: 'alumno'};
                            this.message = 'El perfil del Alumno fue cargado con exito';
                        return perfilR1;
                    }   
                        // Obtener el perfil del Profesor
                     let perfilR2 = await ProfileTeachersService.getTeacherById(userId);  
                    if(perfilR2){
                        this.profile = perfilR2;
                        this.typeUser = perfilR2 = {uid: perfilR2.uid_alumno, name: perfilR2.name,  email: perfilR2.email, role: 'profesor'};  
                        this.message = 'El perfil del Profesor fue cargado con exito'
                        return perfilR2; 
                    }
                    this.profile = null;
                    this.typeUser = null;
                     this.message = 'No existe la cuenta, con el perfil asociado';
                     return null;
                }catch(err: any){
                  this.error = err.message ?? 'Error al obtener el perfil';
                  console.error('Error en el metodo: fetchProfiles',err);
                  return null;
                }finally{
                  this.loading = false;
                }
        },

        /* 
        --------------------------------------------------------------------------------------
          3. Guardar o actualizar registro por medio del perfil Social
        --------------------------------------------------------------------------------------
        */
        async saveProfile(provider: 'facebook' | 'gmail'| 'tradicional', userId: string, payload: Partial<Profile> ){
             this.loading = true;
              this.error = '';
            try{
                // const data = this.socialProfile;

                // Se elige si es provider o typeUser si ya existe
                 if (provider ===  'facebook' || (this.typeUser?.role === 'alumno' && provider !== 'gmail')) {
                     const data = {
                        ...payload,
                        uid_alumno: userId,
                              role: 'alumno'
                     } as any; 
                      await this.saveStudentProfile(userId,data); 
                      this.message = `El Perfil de: ${provider} Alumno fue guardado correctamente.`;
                            return;
                }

                // Se elige si es provider o typeUser si ya existe
                 if (provider ===  'gmail' || this.typeUser?.role === 'profesor' ) {
                     const data = {
                        ...payload,
                        uid_alumno: userId,
                              role: 'profesor'
                     } as any; 
                      await this.saveTeacherProfile(userId,data); 
                      this.message = `El Perfil del Profesor fue guardado correctamente.`;
                            return;
                }

                 await this.fetchProfiles(userId);
                  this.message = 'Se itentó guardar el perfil revisa el rol';
            }catch(err: any){
                this.error = err?.message ?? 'Error al guardar el perfil';
                console.error('saveProfile-Desc:',err);
                throw err;
            }finally{
                this.loading = false;
            }
        },

        async saveStudentProfile(userId: string, data: Partial<Profile>){
          this.loading = true;
          this.error = '';
           
            try{
              await ProfileStudentService.saveStudentProfile({...data,uid_alumno:userId} as any);
                // actualizar el est local.
               this.fetchProfiles(userId);
            }catch(err: any){
                  this.error = err?.message ?? 'Error al guardar el perfil del Alumno';
                  throw err;
            }finally{
                  this.loading = false;
            }
        },

        async saveTeacherProfile(userId: string, data: Partial<Profile>){
            this.loading = true;
              this.error = '';
           
           try{
              await ProfileStudentService.saveTeacherProfile({...data,uid_profesor:userId} as any);
                // actualizar el est local.
               this.fetchProfiles(userId);
            }catch(err: any){
              this.error = err?.message ?? 'Error al guardar el perfil del Profesor';
              throw err;
            }finally{
              this.loading = false;
            }
        },

        /*-----------------------------
        // 1. Registro Tradicional
        -----------------------------*/
        async registerTradicional(data: Profile & {password: string}){
             this.error = '';
             this.message = '';
             this.loading = true;

             try{
                if (!data.email || !data.password || !data.name)
                     throw new Error('Completa todos los campos requeridos (nombre, correo y contraseña).');

                 const creadetUser = ProfileStudentService.creadetUserWithEmail(data.email, data.password);

                 if (!creadetUser || !creadetUser.uid) 
                    throw new Error('Error: no se obtuvo el identificador del registro');

                  const userId = creadetUser.uid;
                  
                  await ProfileStudentService.saveStudentProfile({
                     ...data,
                     uid_alumno: userId,
                  });
                  this.message = 'Registro completado y perfil guardado satisfactoriamente';
             }catch(err: any){
                this.error = err.message || 'Error al registrar el usuario.';
             }finally{
                this.loading = false;
            }
        },

        /*-------------------------------
        // 2. Iniciar Sesion con Facebook
        -------------------------------*/
        async signInWithFacebook(){
            this.message = '';
            this.loading = true;

            try{
                const social = await ProfileTeachersService.signInAndSaveFBStudent();
                if (!social) throw new Error('No se obtuvo ningún usuario de Facebook.');

                this.socialUser = social;

                this.socialProfile = {
                    name: social.displayName ?? social.name ?? '',
                    apellido: social.displayName ?? '',
                    email: social.lastName ?? '',
                    role: 'alumno',
                };  
                    // guarda automaticamente en la base al uid de provider
                await this.saveProfile('facebook', social.uid ?? social.uid_alumno ?? social.id, this.socialProfile as any)
                return social;
            }catch(err: any){
                this.error = (err as any)?.message ?? 'Error al intentar inciar sesión mediante Facebook.';
            }finally{
                this.loading = false;
            }
        },

          /*-------------------------------
        // 3. Iniciar Sesion con Google
        -------------------------------*/
        async signInWithGoogle(){
            this.loading = true;
            this.error = '';

            try{
                 const social = await ProfileTeachersService.signInAndSaveGmailTeacher();
                 if (!social) throw new Error('No fue posible obtener ningún usuario de G. Gmail');

                 this.socialsocial = social;

                 this.socialUser = {
                     name: social.displayName ?? social.name ?? '',
                 apellido: social.lastName ?? '',
                    email: social.email ?? '',
                     role: 'profesor',
                 };
                    this.saveProfile('gmail', social.uid ?? social.uid_profesor ?? social.id ?? this.socialProfile as any)
                    return social;
            }catch(err: any){
                this.error = err.message ?? 'Error al intentar acceder mediante G. Gmail.';
                throw err;
            }finally{
                this.loading = false;
            }
        },
        /** ---------------------------------------
         * 4. Editar cualquier perfil en ambos Roles
         * ----------------------------------------*/
        async editProfile(userId: string, data: Profile) {
          this.loading = true;
          this.error = '';
           
           try{
             if (this.typeUser?.role === 'alumno') {
               await ProfileStudentService.updateStudentProfile(userId,data as any);

             }else if (this.typeUser?.role === 'profesor') {
                 await ProfileStudentService.updateTeacherProfile(userId,data as any);
             }
    
              await this.fetchProfiles(userId);
               this.message = 'El perfil ha sido Actualizado correctamente' ;
           }catch(err: any){
              this.error = err?.message ?? 'Error al editar el Perfil correspondiente.';
              throw err;
           }finally{
              this.loading = false;
           }
        },
        /*-------------------------------
           5. Eliminar el perfil de ambos
         -------------------------------*/
        async deleteProfiles(userId: string){
            this.loading = true;
            this.error = '';

            try{
                 let deleted;
                 if (this.typeUser?.role === 'alumno')
                   deleted = await ProfileStudentService.getDeleteById(userId);
               else if (this.typeUser?.role === 'profesor')
                   deleted = await ProfileTeachersService.getDeleteById(userId);  

                if (deleted){
                    this.profile = null;
                    this.typeUser = null;
                    this.message = 'El perfil fue eliminado';
                }else{
                  this.message = 'No se encontró el perfil a eliminar.';
                }
                return deleted;
            }catch(err: any){
                this.error = err?.message ?? 'Error al eliminar el Perfil.';
                throw err;
            }finally{
                this.loading = false;
            }
        },//# end_delete,

        /*-------------------------------
           6. Metodo para limpiar
         -------------------------------*/
        clearSocial(){
            this.socialUser = null;
            this.socialProfile =  {
             name: '',
             apellido:'',
             email:'',
             role: 'alumno',
           };
           this.message = '';
           this.error = '';
        } //# end_clear, 
    },
 });