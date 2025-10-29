/* se remplazara, en su en lugar del profileStore, ademas de aniadir las funciones previamente definidas(modificar),
  en el store previamente mencionado. DCon el proposito de dejar limpio el registro del studiante. -->*/
  import {defineStore} from 'pinia';
  import { ProfileStudentService } from '@/Services/ProfileStudentServ.ts'
  import {ProfileTeachersService} from '@/Services/ProfileTeacherServ.ts'
  import type  {Profile} from '@/types';

 const useProfileStore = defineStore('profiles', {
    state: () => ({
        profile:  null as Profile | null,
              typeUser: null as User,
              loading: false,
                error: "",
             message: '' as string,
             socialUser: null as any,
            
             socialProfile: {
                 name: '',
                 apellido: '',
                 email: '',
                 role: 'alumno',
            } as Profile,
    }),

    actions: {
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
                  this.message = 'Registro completo y perfil guardado correctamente';
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
            this.error = '';
            this.message = '';
            this.loading = true;

            try{
                const user = await ProfileTeachersService.signInAndSaveFBStudent();
                if (!user) throw new Error('No se obtuvo ningún usuario de Facebook.');

                this.socialUser = user;

                this.socialUser = {
                    name: user.displayName ?? user.name ?? '',
                    apellido: user.displayName ?? '',
                    email: user.lastName ?? '',
                    role: 'alumno',
                };

                this.message = 'La sesión se inició mediante Facebook. Edita la información y guarda el perfil';
            }catch(err: any){
                this.error = err.message || 'Error al intentarm acceder mediante Facebook.';
            }finally{
                this.loading = false;
            }
         },

          /*-------------------------------
        // 3. Iniciar Sesion con Google
        -------------------------------*/
        async signInWithGoogle(){
            this.error = '';
            this.message = '';
            this.loading = true;

            try{
                 const user = await ProfileTeachersService.signInAndSaveGmailTeacher();
                 if (!user) throw new Error('No fue posible obtener ningún usuario de Gmail');

                 this.socialUser = user;

                 this.socialProfile = {
                     name: user.displayName ?? user.name ?? '',
                 apellido: user.lastName ?? '',
                    email: user.email ?? '',
                     role: 'profesor',
                 };

                 this.message = 'La sesión se inicio mediante Gmail. Edita la infomación y guarda el perfil';

            }catch(err: any){
                this.error = err.message || 'Error al intentar acceder mediante Gmail. ';
            }finally{
                this.loading = false;
            }
        },

        /* 
        --------------------------------------------------------------------------------------
          4. Guardar o actualizar registro por medio del perfil Social
        --------------------------------------------------------------------------------------
        */
        async saveProfile(provider: 'facebook' | 'gmail',data_perfil: Profile){ 
            try{   
                //T, Conjuntos -> A ∪ B = {'facebook', 'gmail'} A={'facebook'} B={'gmail'}
                const data = this.socialProfile;
                 if (provider ===  'facebook') 
                     await ProfileStudentService.saveStudentProfile(data);
                 else
                     await ProfileTeachersService.saveTeacherProfile(data);

                    this.message = `Perfil ${provider} guardado correctamente.`;
            }catch(err: any){
                this.error = err.message || 'Error al guardar el perfil social';
            }
        },

        async editProfile(userId: string, data: Profile) {
          try {
            if (this.typeUser?.role === 'alumno')
              await ProfileStudentService.updateStudentProfile(userId, data);
            else if (this.typeUser?.role === 'profesor')
              await ProfileTeachersService.updateTeacherProfile(userId, data);

            this.message = 'Perfil actualizado correctamente.';
          } catch (err: any) {
            this.error = err.message || 'Error al actualizar el perfil.';
          }
        },
        /*-------------------------------
           5. Editar y eliminar perfil
         -------------------------------*/
        async deleteProfile(userId: string){
        
            try{
                 let deleted;
                 if (this.typeUser?.role === 'alumno')
                   deleted = await ProfileStudentService.getDeleteById(userId);
               else if (this.typeUser?.role === 'profesor')
                   deleted = await ProfileTeachersService.getDeleteById(userId);  

                if (deleted) 
                  this.message = 'El Perfil eliminado correctamente.';  
               else throw new Error('No se encontró el perfil a eliminar.');
            }catch(err: any){
                this.error = err.message || 'Error al eliminar el perfil.';
            }finally{
                this.loading = false;
            }
        },

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
        },
        /*-------------------------------------------------
           7. Metodo que determina que tipo de perfil most
         --------------------------------------------------*/
        async fetchProfiles(userId: string){
              this.loading = true;
              this.message = '';
              this.loading = true;

                try{
                    // Obtener el perfil del Alumno
                    const perfilR1 = await ProfileStudentService.getStudentById(userId);
                    if(perfilR1){
                       this.profile = perfilR1;
                       this.typeUser = {uid: perfilR1.uid_alumno, name: perfilR1.name,  email: perfilR1.email, role: 'alumno'};
                        console.log('El perfil del Alumno fue obtenido correctamente de la Base Firebase');
                        return perfilR1;
                    }   
                        // Obtener el perfil del Profesor
                     let perfilR2 = await ProfileTeachersService.getTeacherById(userId);  
                    if(perfilR2){
                        this.profile = perfilR2 = {uid: perfilR2.uid_alumno, name: perfilR2.name,  email: perfilR2.email, role: 'profesor'};  
                        return perfilR2; 
                    }
                     throw new Error('Error: No se encontró el perfil asociado al usuario.');
                }catch(err: any){
                  this.error = err.message || 'Error al obtener el perfil' ;
                  console.error('Error en el metodo: fetchProfiles',err);
                }finally{
                  this.loading = false;
                }
        }
    }
 });