// ProfileTeachersService.ts
import { getFirestore, doc, collection,  setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebaseStorage } from '@/public/initializeFirebaseConf.js'; 
import { getAuth, createUserWithEmailAndPassword, signInWithPopup,GoogleAuthProvider} from  'firebase/auth'; //libreria para Gmail
import type ProfesorUser from '@/types/interf.index.ts';

const { auth,db} = initializeFirebaseStorage();  

export class ProfileTeachersService {
  static collectionNameR2 = 'registro_profesores';
   
  static async getTeacherById(uid: string): Promise<ProfesorUser | null>{
    try {
       this.db = getFirestore();
      const docRef = doc(db, this.collectionNameR2, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()){
        const data = docSnap.data();
         return {
          uid: uid,
          uid_prof: uid,
          username: data.email?.split('@')[0] || '',  //** > regex
          name: data.nombre,
          lname: data.apellido,
          email: data.email,
          role: data.role,
          autorRole: data.role,
          numCuenta: data.numCuenta,
          area: data.area, // ** exclusive of this role
         } as ProfesorUser;  // * intfce
      }; 

        return null;
        // return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('[Servicio - PROFESOR]: Error al obtener Profesor', error);
      throw error;
    }
  }
  /*static async getTeacherById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('[ProfileTeachersService]: Error al obtener docente', error);
      throw error;
    }
  }*  >> backup/
  /*Guardar data de Profesor en la Firestore*/
  static async saveTeacherProfile(teacher: { id?: string; nombre: string; email: string; asignaturas?: string[] }) {
    try {
      const docRef = teacher.id ? doc(db, this.collectionNameR2, teacher.id) : doc(collection(db, this.collectionNameR2));
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
        const ref = doc(db,this.collectionNameR2,id);
        await updateDoc(ref,data);
    }catch(error){
      console.error('[ProfileTeacherService]: Error al guardar la actualización del Profesor', error);
        throw error;
    }
  }  // 12/11/2025 (Sin red)
  
   /** Metodos de Actualizacion & Obtencion del Perfil **/
   
    /*------------------------------------------------
      Crear correo electronico Tradicional [11/11/25]
      ------------------------------------------------
    */
  static async creadedUserWithEmail(email:string , password:string ){
    try{
        
         // 0. Obtener la referencia a Firebase
        const auth = getAuth();
    
        // 1. Metodo para traer la credenciales de firebase
            const  userCredential = await createUserWithEmailAndPassword(auth,email,password);
        // 2. Extraer el usuario creado
            const user_email = userCredential.user;
    
        // 3. Asociar la coleccion con las credenciales(base para profesor)
            /*const reference = doc(db,this.collectionNameR2, user.uid)
              await setDoc(reference, { email: user.email, uid_profesor: user.uid, status: 'active',});*/
    
        // 4. devolver el usuario con la coleccion 
              return user_email;
    }catch(error){
      console.error('[ProfileTeacherService]: Error al crear usuario de profesor con email y contraseña', error);
        throw error;
    }
  }
    /* -------------------------------------------------------------------------------------
         Guardar la data del profesor en Firebase, pero este e loggeado mediante Gmail
     ---------------------------------------------------------------------------------------
      [06/Oct/2025]
    */
  static async signInAndSaveGmailTeacher(){
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

      try{
              const result = await signInWithPopup(auth,provider);
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
  /*Actualiza la data del perfil del Profesor (repetido)*/
  static async updateTeacherProfileTwo(id: string, dataProfile:Profile): Promise<void>{
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