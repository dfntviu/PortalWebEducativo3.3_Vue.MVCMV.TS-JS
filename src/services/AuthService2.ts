 import {initializeFirebaseStorage} from '@/public/initializeFirebaseConf.js';
import { signOut, signInWithEmailAndPassword, getAuth} from "firebase/auth";
import { doc,getDoc } from 'firebase/firestore';
import {ProfileTeacher,ProfileStudent} from '@/types/interfacesv2.ts'; 
import {ServiceResult} from '@./TeacherFirstUseServ2.ts';

const { auth,db } = initializeFirebaseStorage();
 const COLLECT_TEACHER = 'teachers_register';

 export class AuthService {
   static async login(email: string, password: string): Promise<ProfileTeacher| ProfileStudent>{
      try{
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const uid = cred.user.uid;
          const userDoc = await getDoc(doc(db,COLLECT_TEACHER, uid));

         if (!userDoc.exists()) {
            return {
               success: false,
               message: 'El perfil no existe en la base de datos',
            };
         }

         const data = userDoc.data() as ProfileTeacher | ProfileStudent;
         
         return{
            success: true,
            message:'Inicio de sesión exitoso',
            user: {...data, uid},
         }
      }catch(error){
         const msg =
           error.code === 'auth/wrong-password'
             ? 'contrasena incorrecta'
             : error.code === 'auth/user-not-found'
             ? 'No encontrado'
             : 'Error al inicia ses'
            return  {success: false, message: msg};
      }
   }

   static async logout(): Promise<ServiceResult<null>> {
    try {
      await signOut(auth);
      return { success: true, message: 'Sesión cerrada correctamente' };
    } catch (error: any) {
      return { success: false, message: 'Error al cerrar sesión' };
    }
  } 
 }