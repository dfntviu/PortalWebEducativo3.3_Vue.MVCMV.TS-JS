   import {signInWithPopup, GoogleAuthProvider,FacebookAuthProvider, sigInWithEmailAndPassword, createWithEmailAndPassword,User} from 'firebase/auth';
 import {doc,setDoc, getDoc, updateDoc, serverTimestamp} from 'firebase/firestore';
 import {initializeFirebaseStorage} from '@/config/initializeFirebaseConf';
 
  const {auth, db} = initializeFirebaseStorage();
    // =============================
    //    TIPOS E INTERFACES
    // =============================
   
   export type UserRole = 'alumno' | 'profesor';
   export type    Theme = 'ligth' '| dark  | system';

    export interface UserPersonallity {
       uid: string;
      email: string;
      nombre: string;
      apellido?: string;
      // photoURL?: string;
       role: UserRole;
       provider: 'google' | 'facebook' | 'email';
   
       // Preferencias
     preferences:{
       theme:Theme;
       shortcutsEnabled: boolean;
       soundEnabled: boolean;
     };

    // Metadata
     createdAt: Date;
     lastLogin: Date;     
     updateCount: number;
    }

    interface AuthResult {
      success: boolean;
      message: string;
      user?: UserPersonallity;
    }

      // ============================
      //    SERVICIO PRINCIPAL
      // ============================

    class PersonalityServiceRoles {
       private static readonly COLLECTION_STUDENT =  'form_student-register';
       private static readonly COLLECTION_TEACHER =  'teachers_register';

        // ============================================
        //    METODOS DE AUTENTIFICACIÓN
       //  ============================================

       /**
        * Login con Google
        * */
          static async loginWithGoogle(role: UserRole): Promise<AuthResult> {
            try{
               const provider = new GoogleAuthProvider();
                provider.addScope('email');
                provider.addScope('profile');

                  const result = await signInWithPopup(auth, provider);
                  const user = result.user;

                  // Verificar si el Usuario existe
                  const personality = await getUserPersonality(auth, provider);
                   
                   if (personality) {
                     await this.updateLastLogin(user.uid, role);
                        return {
                           success: true,
                           message: 'Inicio de sesión Exitoso'; 
                           user: personality,
                        };
                   }
                   //  Usuario Nuevo -> Crear el Perfil
                   const newPersonality = await this.createUserPersonality(user, role, 'google');

                    return {
                       success: true;
                       message:' Cuentra creada exitosamente',
                       user:newPersonality,
                    };
            }catch(error: any){
               console.error('[PersonalityService]: Error en el Acceso al login de Google ',error);
                 return {
                    success: false,
                    message: this.getErrorMessage(error);
                };
            };
        }

        /**
         * Login con Facebook */
         static async loginWithFacebook(role:UserRole): Promise<AuthResult> {
           try {
             const provider = new FacebookAuthProvider();
             provider.addScope('email');
             provider.addScope('public_profile');

             const result = await signInWithPopup(auth, provider);
               const user = result.user;

               const personality =  this.getUserPersonality(user.uid, role);

               if (personality) {
                  // El usuario es existente - actualizar al ultimo login
                    this.updateLastLogin(user.uid, role);

                    return{
                       success: true,
                       message: 'Inicio de Sesión exitoso',
                       user: personality
                    };
               }

               // Usuario nuevo - Crear Perfil
                const newPersonality = this.createUserPersonality(user,role, 'facebook');

                  return {
                       success: true;
                       message:' Cuentra creada exitosamente',
                       user: newPersonality,
                  };
            } catch(error: any){
                console.error('[PersonalityService]: Error en Login con Facebook.', error);
                 return {
                   success: false
                   message: this.getErrorMessage(error);
                 };
            }
        }
        
        /** 
         * REGISTRO con Email & Password
         * */
        static async loginWithEmail(email: string, password: string, nombre: string, apellido: string, role: UserRole): Promise<AuthResult> {
            try{
                    const personality = await this.getUserPersonality(user.uid, role);

                    if (!personality) {
                       return {
                          success: false,
                          message: 'No se encontró el perfil del Usuario',
                       };
                    }

                    // Actualizar el último login
                     await this.updateLastLogin(user.uid, role);
                     
                      return{
                         success: true,
                         message: 'Inicio de sesión Exitoso',
                         user: personality,
                      };
                }catch(error: any){
                     console.error('[PersonalityService]: Error en el Login con email', error);
                        return{
                          success: false,
                          message:  this.getErrorMessage(error),
                        };
                }
            }

        /**
         * Registro con Email y Password
         * */
         static async registerWithEmail( email: string, password: string, nombre: string, apellido: string, role:UserRole): Promise<AuthResult>{
            try{
               // Validar email intitucional para Estudiantes
                    if (role === 'alumno' && email.endWish('@alumno.uaemex.mx')) {
                      return {
                        success: false,
                        message: 'Debes de usar tu correo institucional @alumno.uaemex.mx'
                      };
  
                      const result = await createWithEmailAndPassword(auth, email, password);
                      const user = result.user;
  
                      // Crear el perfil completo
                    const personality = await this.createUserPersonality(user, role, 'email', {nombre, apellido});
  
                    return {
                       success: true,
                       message: 'Cuenta creada Exitosamente',
                       user: personality,
                    }
              }
        }catch(error: any){
           console.error('[PersonalityService]: Error en el Registro ', error),
            return {
               success: false,
               message: this.getErrorMessage(error),
            };
        }
     }

      // ================================
      //     METODOS DEL PERFIL
      // ================================

       /**
        * Obtener Personalidad del Usuario */
        static async getUserPersonality(uid: string, role: UserRole): Promise<UserPersonallity | null>{
           try{
              const collection = role === 'alumno'
                ? this.COLLECTION_STUDENT
                : this.COLLECTION_TEACHER;

               const docReference =  doc(db, collection, uid);
               const docSnapst = await getDoc(docReference);

              if (!docSnapst.exists()) {
                 return null;
              }

              const data = docSnapst.data();

                return {
                   uid: docSnapst.uid,
                   email: data.email,
                   nombre: data.nombre,
                   apellido: data.apellido,
                   // photoURL: data.photoURL,
                   role: data.role,
                   preferences: data.preferences || this.getDefaultPreferences(),
                   createdAt: data.createdAt?.toDate() || new Date(),
                   lastLogin: data.lastLogin?.toDate() || new Date(),
                   updateCount: data.updateCount || 0,
                };
            }catch(error){
               console.error('[PersonalityService]: Error al obtener el Perfil', error);
                return null;
            }
        }
       /**
        * Crear Personalidad de usuario*/
        private static async createUserPersonality(user: User, role: UserRole, provider: 'google'| 'facebook'|  'email',
              extraData?: {nombre?: string; apellido?: string}
          ): Promise <UserPersonallity> {
            const collection = role === 'alumno'
              ? this.COLLECTION_STUDENT
              : this.COLLECTION_TEACHER;

              const displayNameParts = user.displayName?.split(' ') || [];
              const nombre = extraData?.nombre || displayNameParts[0] || 'Usuario';
              const apellido = extraData?.apellido || displayNameParts.slice(1).join(' ')

                const personality: UserPersonallity = {
                 uid: user.uid,
                 email: user.email!,
                 nombre,
                 apellido,
                  // photoURL:user.photoURL || undefined
                  role,
                  provider,
                  preferences: this.getDefaultPreferences(),
                  createdAt: new Date(),
                  lastLogin: new Date(),
                  updateCount: 0,               
                };

                const docReference = doc(db,collection, user.uid);
                
                await setDoc(docReference, {
                    ...personality,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                });

               return personality;
        }

        /**
         * Actualizar Ultimo Login
         * */
        private static async updateLastLogin(uid: string, role: UserRole): Promise<void>{
           try{
              const collection = role === 'alumno'
                  ? this.COLLECTION_STUDENT
                  : this.COLLECTION_TEACHER;

                const docRef = doc(db, collection, uid);
                await updateDoc(docRef, {
                    lastLogin: serverTimestamp(),
                });
           }catch(error){
             console.error('[PersonalityService]: Error al Actualizar último Login');
           }
        }

        // =====================================
        //    METODOS DE PREFERENCIAS
        // =====================================
        
        /**
         * Actualizar el Tema
         * */
        static async updateTheme(uid: string, role: UserRole, theme: Theme): Promise<void>{
          try{
             const collection = role === 'alumno'
               ? this.COLLECTION_STUDENT
               : this.COLLECTION_TEACHER;

               const docRef = doc(db, collection, uid);
                  await updateDoc(docRef, {
                     lastLogin:serverTimestamp
                  });
          }catch(error){
             console.error('[PersonalityService] Error al actualizar último Login..');
          }
        }
        /**
         * Actualizar el estado de
         * Atajos. */
        static async updateShortcutsEnabled(uid: string, role: UserRole, enababled: boolean): Promise<void>{
            try{
               const collection = role === 'alumno'
                 ? this.COLLECTION_TEACHER
                 : this.COLLECTION_STUDENT;

                 const docRef = doc(db, collection, uid);
                  await updateDoc(docRef, {
                     'preferences.shortcutsEnabled': enababled
                  });

                   console.log('[PersonalityService]: Atajos ', enababled ? 'habilitados': 'deshabilitados');
            }catch(error){
                 console.error('[PersonalityService]: Error al actualizar atajos', error);
                  throw error;
            }
        }

        /**
         * Actualizar las notificaciones */
         static async updateNotificationsEnabled(
            uid: string, role: UserRole, enababled: boolean
          ): Promise<void>{
              try{
                 const collection = role === 'alumno'
                   ? this.COLLECTION_STUDENT
                   : this.COLLECTION_TEACHER;

                 const docRef = doc(db,collection, uid);
                 await updateDoc(docRef, {
                     'preferences.notificationsEnabled':enababled,
                 });

              }catch(error){
                  console.error('[PersonalityService]: Error al actualizar las Notificaciones');
                   throw error;
              }        
         }

        /** 
         * Actualizar el
         * Sonido*/
        static async updateSoundEnabled(uid: string, role: UserRole, preferences: Partial<UserPersonallity['preferences']>): Promise<void> {
            try{
               const collection = role === 'alumno'
                  ? this.COLLECTION_STUDENT
                  : this.COLLECTION_TEACHER;

                  const docRef = doc(db,collection, uid);
                  const updates: Record<string, any> = {};

                  Object.entries(preferences).forEach(([key,value]) => {
                      updates[`preferences.${key}`] = value;
                  });

                   await updateDoc(docRef, updates);

                    console.log('[PersonalityService]: Preferencias actualizadas');
            }catch(error){
                 console.log('[PersonalityService]: Error al actualizar preferencias');
                   throw error;
            }
        }

        /**
         * Actualizar todas las preferencias */
        static async updatePreferences( uid: string, role: UserRole, preferences: Partial<UserPersonallity['preferences']> ){
            try{
                const collection = role === 'alumno'
                 ?  this.COLLECTION_STUDENT
                 :  this.COLLECTION_TEACHER;

                 const docRef = doc(db, collection, uid);
                 const updates: Record<string, any> = {};

                 Object.entries(preferences).forEach(([key, value]) => {
                       updates[`preferences ${key}`] = value;
                 });

                 await updateDoc(docRef, updates);

                 console.log('[PersonalityService]: Preferencias Actualizadas');
            }catch(error){
                console.error('[PersonalityService]: Error al Actualizar las preferencias');
            }
        }

         // ===================================
         //         METODOS AUXILIARES
         // ===================================

        /**
         * Obtener preferencias por defecto 
         * */
        private static getDefaultPreferences(): UserPersonallity['preferences'] {
            return {
             theme: 'system',
             shortcutsEnabled: true,
             notificationsEnabled: true,
               soundEnabled: true,
            };
        }

        /**
         * Obtener el mensaje de Error amigable
         * */
        private static getErrorMessage(error:any): string {
            const errorMessages: Record<string, string> = {
                'auth/user-not-found': 'Usuario no Encontrado',
                'auth/wrong-password': 'Contraseña Incorrecta',
                'auth/email-already-in-use': 'El correo ya esá en uso',
                'auth/weak-password': 'La contraseña es muy débil',
                'auth/invalid-email': 'Correo electrónico inválido',
                 'auth/popup-closed-by-user': 'Ventana de autenticación cerrada',
                 'auth/accout-exists-with-different-credential': 'Ya existe una cuenta con este correo',
            };
              return errorMessages[error.code] || 'Error en la autenticación';
        }
  }