// ProfileTeachersService.ts
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { initializateFireabaseStg } from '@/config/initializateFirebase.js';
import { getAuth, signWithPopUp, GoogleAuthProvider} from  'firebase/auth'; //libreria para Gmail
import type Profile from '@/types/interf.index.ts';

const { db } = initializateFireabaseStg();

export class ProfileTeachersService {
  static collectionNameR2 = 'teachers';
   
  static async getTeacherById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('[ProfileTeachersService]: Error al obtener docente', error);
      throw error;
    }
  }
  /*Guardar data de Profesor en la Firestore*/
  static async saveTeacherProfile(teacher: { id?: string; nombre: string; email: string; asignaturas?: string[] }) {
    try {
      const docRef = teacher.id ? doc(db, this.collectionName, teacher.id) : doc(collection(db, this.collectionName));
      const data = {
        nombre: teacher.nombre,
        email: teacher.email,
        asignaturas: teacher.asignaturas || [],
        fechaActualizacion: new Date(),
      };
      await setDoc(docRef, data, { merge: true });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('[ProfileTeachersService]: Error al guardar perfil Profesor', error);
      throw error;
    }
  }

   /*------------------------------------------------
      Editar el Perfil del Alumno
    ------------------------------------------------
  */
  static async updateTeacherProfile(id: string, data: Materiales<Profile>): Promise<void>{
    try{
        const ref = doc(db,this.collectionName,id);
        await updateDoc(ref,data);
    }catch(error){
      console.error('[ProfileTeacherService]: Error al guardar la actualización del Profesor', error);
        throw error;
    }
  }
   /** Metodos de Actualizacion & Obtencion del Perfil **/

    /* -------------------------------------------------------------------------------------
         Guardar la data del profesor en Firebase, pero este e loggeado mediante Gmail
     ---------------------------------------------------------------------------------------
      [06/Oct/2025]
    */
  static async signInAndSaveGmailTeacher(){
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

      try{
              const result = await signWithPopUp(auth,provider);
               const  user = result.user;

              /*Datos basicos que aloja Google-Gmail: Seleccionar la inf deseada*/
              const teacher_data = {
                 uid: user.uuid,
                 nombre: user.displayName?.split(" ")[0] || 'Sin nombre',
                 apellido: user.displayName?.split(" ")[1] || '',
                 email: user.email,
                 role: 'profesor',
                 fechaRegistro: new Date(),
              };

              /*Guarda o actualiza información de Google en la Firestore*/
               const docRef = doc(db,this.collectionNameR2,user.uid);
               await setDoc(docRef,teacher_data,{merge: true});  //comprobacion si se mezco inf

               /*Advertimos al Sistema, que la info fue guardada*/
                console.log('[Servicio-Profesor]El perfil del Profesor fue guardado exitosamente');
                return teacher_data;
      }catch(error){
        console.error('[ProfileTeachersService]: Error en el Registro de Profesor', error);
        throw error;
      }
  }
  /*Actualiza la data del perfil del Profesor*/
  static async updateTeacherProfile(id: string, dataProfile:Profile): Promise<void>{
    try{
        const ref = doc(db,this.collectionNameR2,id);
        await updateDoc(ref,dataProfile);
    }catch(error){
      console.error('[ProfileTeachersService]: Error al actualizar los datos del Profesor', error);
        throw error;
    }
  }
  /*Obtener info del profesor loggeado desde la firestore*/
  static async getTeacherProfile(id:string):Promise<Profile| null>{
     try{
        const ref = doc(db,this.collectionNameR2,id);
         const snap = await getDoc(ref,data)
           if (docSnap.exists()) {
             return snap.data() as Profile;
           }else{
              return null;
           }
     }catch(error){
        console.error('[ProfileTeachersService]: Error al obtener el  Perfil del Profesor', error);
          throw error;
     }
  }

}