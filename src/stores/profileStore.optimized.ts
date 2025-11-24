/* se remplazara, en  lugar de profileStore, ademas se aniadira las funciones faltantes,
  del store base profileStore -->*/
  import { defineStore } from 'pinia';
  import type  {ProfesorUser} from '@/types/interf.index.ts';
  import { ProfileStudentService } from '@/Services/ProfileStudentServ.ts'
  import {ProfileTeachersService } from '@/Services/ProfileTeacherServ.ts'

 export const useProfileStore = defineStore('profiles', {
    state: () => ({
               profile:  null as ProfesorUser | null,
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
            } as Partial <ProfesorUser>, //todas las props son opcionales 
    }),
    
    actions: {
    
        /**  ** ** ** *
         *  Guarda el Perfil segun el Rol 
         *   ** ** ** */
        async saveProfileByRole(userId: string, data: Partial<ProfesorUser>){
            this.loading = true;
            this.error = '';

            try{
                const role = data.role || data.area;

                if (!role) {
                    throw new Error('El rol no ha sido definido');
                }   
                    // Preparar form basico
                const profileData = {
                    uid_alumno: userId,
                    nombre: data.name || '',
                    apellido: data.lname ||'',
                    email: data.email || '',
                    numCuenta:data.numCuenta || '',
                    area: data.area || '',
                    role: role as 'alumno' | 'profesor',
                };

                console.log(`[Estado] Guardando Perfil de ${role} en: `, profileData);

                // Invocar servicio corresp segun sea el rol
                 if (role === 'profesor') {
                    await ProfileTeachersService.saveTeacherProfile(profileData);
                 }else if (role === 'alumno') {
                    await ProfileTeachersService.saveStudentProfile(profileData);
                 } else {
                    throw new Error(`Rol no reconocido: ${role}`);
                 }

                 console.log(`[Store] Perfil de ${role} guardado en Firestore`);
            }catch(err: any){
                this.error = err?.message ?? `Error al guardar el perfil`;
                console.error('[Store] Error en saveProfileByRole:', err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /*----------------------------------------------
           1. Cargar el Perfil segun corresponda el Rol
         -----------------------------------------------*/
        async fetchPerfileByRole(userId: string, role: 'alumno' | 'profesor'){
            try{
                console.log(`[Estado] Cargando Perfil de ${role}: `,userId);

                let profile: ProfesorUser | null = null;

                if (role === 'alumno') {
                  profile = await ProfileStudentService.getStudentById(userId);
                }else if (role === 'profesor') {
                    profile = await ProfileTeachersService.getTeacherById(userId);
                }

                if (profile) {
                    this.profile =  Profile;
                    this.typeUser = {
                        uid: userId,
                        name: profile.name,
                        role: role
                    };
                    console.log('[Store] Perfil cargado en estado:', this.profile);
                }

            }catch(err: any){
                this.error = err?.message ?? 'Error al cargar el perfil';
                console.error('[Store] Error en fetchProfileByRole:', err);
                throw err;
            }
        },

         async saveStudentStProfile(userId: string,data: Partial<StudentUser>){
            return this.saveProfileByRole(userId, {...data, role:'alumno'});
         },

          async saveTeacherStProfile(userId: string,data: Partial<ProfesorUser>){
             return this.saveProfileByRole(userId, {...data, role:'profesor'});
          },
         /*-----------------------------
           // 1. Registro Tradicional
         -----------------------------*/
        async registerTradicional(data: Partial<ProfesorUser> & {password: string; role: 'alumno' | 'profesor'}){
                console.warn('===Advisementent====='); 
             this.error = '';
             this.message = '';
             this.loading = true;
             // console.log('Object ◘ Interface[',this.ProfesorUser,']');
             console.log('Nombre - User_Profesor-Nombre: ', data.name);
             console.log('Apellido - User_Prof/apellido: ', data.lname);
             console.log('Apellido - User_Prof/apellido: ', data.email);
             // console.log('Interface Usuario_Profesor: ', JSON.stringify(data, null, 2));

             
             try{ 
                if (!data.email || !data.password  || !data.name)
                    // console.log('PWD = ',data.password,'Correo =',data.email, 'Rol =',data.role);
                     throw new Error('Completa todos los campos requeridos (nombre, correo y contraseña).');
                   // console.log('PWD = ', data.password, 'Correo =', data.email);
                if (!data.role) {
                    throw new Error('Debes seleccionar un rol(alumno o profesor).');
                }
                  // console.log(`Store Iniciando registro como: ${data.role}: `,data.email);
                console.log(`Email de Profesor: [${data.email}] `);
                console.log(`Contraseña de Profesor: [${data.password}] `);
                 const creadetUser = await this.createUser(data.email, data.password);
                 
                    // console.log('Inf. de creacion ', creadetUser);

                 if (!creadetUser || !creadetUser.uid) 
                    throw new Error('Error: no se obtuvo el identificador del registro');

                  const userId = creadetUser.uid;
                    console.log(`[Store] Usuario creado con UID:`, userId);

                    // Guardamos el perfil segun corresp role
                    await this.saveProfileByRole(userId,data);
                  
                   console.log(`[Store]: Perfil de - ${data.role} guardado exitosamente`);

                    await this.fetchPerfileByRole(userId, data.role);

                  this.message = `Registro completado con el perfil: ${data.role} satisfactoriamente`;

                   return creadetUser;
                  /*await ProfileStudentService.saveStudentProfile({ ...data, uid_alumno: userId, });*/
                  
             }catch(err: any){
                this.error = err.message || 'Error al registrar el usuario.';
                 console.error('[Store] Error en registerTradicional:', err);
                  throw err;
             }finally{
                this.loading = false;
            }
        },

            async createUser(email: string, password: string){
                try{
                    return await ProfileTeachersService.creadedUserWithEmail(email, password);
                }catch(err:any){
                    throw new Error(`Error al crear usuario: ${err.message}`);
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

     /*async saveStudentProfile(userId: string, data: Partial<Profile>){
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
        }, */

        /*async fetchProfiles(userId: string){
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
        },*/

 });