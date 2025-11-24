
import {updatePassword,reauthenticateWithCredential,EmailAuthProvider} from 'firebase/auth'; 
import { initializeFirebaseStorage } from '@/public/initializeFirebaseConf.js';
 import {SearchMaterial} from '@/components/SearchMaterials.vue';/*Nuevo metodo de componente de Busqueda*/
import  {AuthService} from '@/services/AuthService2.ts'; /*servicios  p/cargar el perfil del usuario */
import { getAuth, createUserWithEmailAndPassword,signInWithPopup, FacebookAuthProvider} from  'firebase/auth'; //libreria para FB
import {getFirestore,doc,collection, setDoc, getDoc, query, where, getDocs} from 'firebase/firestore';  
import  {ProfileTeachersService} from '@/services/ProfileTeacherServ.ts';
/* End_servs loadUser*/
 import type {Profile, ProfesorUser} from '@/types/interf.index.ts'
  
const { db } = initializeFirebaseStorage();  

export class ProfileStudentService {
  static collectionNameR1 = 'form_students-register';
    
    /*Obtiene el PERFIL Del Alumno.*/
  static async getStudentById(uid: string): Promise< Profile | null> {
    try {
       this.db = getFirestore();
      const docRef = doc(db, this.collectionNameR1, uid);
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
         } as Profile;  // * intfce
      }; 

        return null;
        // return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('[Servicio - ESTUDIANTE]: Error al obtener alumno', error);
      throw error;
    }
  }

  /*static async getStudentById(id: string,role:'alumno') ->backup-f(n) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('[ProfileStudentService]: Error al obtener alumno', error);
      throw error;
    }
  }*/

  static async saveStudentProfile(student: { id?: string; nombre: string; apellido: string; email: string;
                                  carrera: string, curso?: string, edad: number}) {
    try {
         const docRef = student.id ? doc(db, this.collectionNameR1, student.id) : doc(collection(db, this.collectionName));
            const data = {
                nombre: student.name,
                apellido: student.lname,
                email: student.email,
                // carrera: student.carrera,
                contrasenia: student.password,
                cuenta: student.numCuenta,
                area: student.area,
                rol: student.role,
                /*fechaActualizacion: new Date(),
                edad: student.edad,*/
            };
             await setDoc(docRef, data, { merge: true });
              return { id: docRef.id, ...data };
    } catch (error) {
         console.error('[ProfileStudentService]: Error al guardar perfil de alumno', error);
        throw error;
    }
  }
  /*-------------------------------------------------
      Crear correo electronico Tradicional [11/11/25]
    -------------------------------------------------
  */
  static async createUserWithEmail(email:string , password:string ){
    try{
        console.log('Visitando la f(n)');
         // 0. Obtener la referencia a Firebase
        const auth = getAuth();
        console.log('Inf. del autetificacion: ', auth);
      console.log()
        // 1. Metodo para traer la credenciales de firebase
            const  userCredential = await createUserWithEmailAndPassword(auth,email,password);
        // 2. Extraer el usuario creado
            const user = userCredential.user;
            console.log('Inf. de Primer role1 - Prof: ', user);
    
        // 3. Asociar la coleccion con las credenciales(base para profesor)
            const reference = doc(db,this.collectionNameR1, user.uid)
              await setDoc(reference, { email: user.email, uid_profesor: user.uid, status: 'active',});
    
        // 4. devolver el usuario con la coleccion 
              return user;
    }catch(error){
      console.error('[ProfileTeacherService]: Error al crear usuario de profesor con email y contraseña', error);
        throw error;
    }
  }
  /*------------------------------------------------
      Editar el Perfil del Alumno
    ------------------------------------------------
  */
  static async updateStudentProfile(id: string, data: Materiales<Profile>): Promise<void>{
    try{
        const ref = doc(db,this.collectionName,id);
        await updateDoc(ref,data);
    }catch(error){
      console.error('[ProfileStudentService]: Error al guardar la actualización del Alumno', error);
        throw error;
    }
  }

  static async mostrarCambiosAplicados(id: string, data: Materiales<Profile>): Promise<void>{
    try{ 
          // se actualiza la data de la base
         let changes = await this.updateStudentProfile(id,data); 
           // Se obtiene el perfil actualizado
          const update_Profile = await this.getStudentById(id,role);
         
         // si reflejamos los cambios en el objeto: se efectua la destructuracion 
            changes = {...data, update_Profile};

          return changes;
    }catch(error){
        console.error('actualizacion no aplicada', error);
         throw error;
    }
  }

  /*---------------------------------------
      [Nuevo] Eliminar el Pefil (2025/10/11)
    ---------------------------------------*/
  static async getDeleteById(id: string,role:'alumno'){
    try{
         const docRef = doc(db, this.collectionNameR1, id);
         // Obt. el perfil
      const docSnapDel = await getDoc(docRef);

        if (docSnapDel.exists()) {
          // Se elimino si existe
                await deleteDoc(docRef)
          return true;  // se elimino el documento
        }else{
          return false; // se elimino no existe
        }
    }catch(error){
      console.error('Perfil del ID: ',id, 'no fue Encontrado');
       throw error; //Lanzar error a nivel firebase
    }
  }
  /*------------------------------------------------
      Mostrar el Perfil del Alumno
    ------------------------------------------------
  */
  static async getStudentProfile(id:string):Promise<Profile| null>{
     try{
        const ref = doc(db,this.collectionNameR1,id);
         const snap = await getDoc(ref,data)
           if (docSnap.exists()) {
             return snap.data() as Profile;
           } 
              return null;
     }catch(error){
        console.error('[MaterialDeployService]: Error al obtener el  Perfil del Alumno', error);
          throw error;
     }
  }
  /* Login con Facebook e insersion automatica del perfil del Alumno*/
  static async signInAndSaveFBStudent() {
    const auth = getAuth();
    const provider_fb = new FacebookAuthProvider();

     try{
        const result = await signInWithPopup(auth,provider_fb);
        const user = result.user;

        /*generar usuario unico*/
        const name_usr =
          user.displayNamr?.toLowerCase().replace(/\s+/g, "_") || 
           user.email?.split("@")[0] ||
         `usuario_${Date.now()}`;

          const student_data = {
            uid: user.uuid,
            nombre: user.displayName?.split(" ")[0] || 'Sin nombre',
            apellido: user.displayName?.split(" ")[1] || "",
            email: user.email,
            name_usr,
            role: "alumno",
          };

          /*Guarda o actualiza información de Facebook en la Firestore*/
               const docRef = doc(db,this.collectionNameR2,user.uid);
               await setDoc(docRef,student_data,{merge: true});  //comprob de inf
                /*Advertimos al Sistema, la info Alumno se guardo **/
              console.log('[Servicio-Estudiante]El perfil del Alumno fue guardado exitosamente');
               return student_data;
     }catch(error){
         console.error('[Servicio-Estudiante]: Error en el Registro vía Facebook', error);
       throw error;
     }
  }

  /** Metodo Lógico_4 -> (29/09/2025)
   * Nuevo Met. de Cambio de Password: Cambiar la contrase del Rol de Estudiante -> [trasladado 29/09/25] */
  static async changePasswordAlumno(passwd, new_passwd){
    try{
       const user_current = auth.currentUser;
         if (user_current || user_current.email) {
           throw new Error("No hay usuario autenticado")
         }
         /*1. Obtener la reutenticacion de credenciales*/
         const crendential = EmailAuthProvider.crendential(user_current,passwd);
           await reauthenticateWithCredential(user_current, passwd);

          /*2. Actualizamos la contrasenia*/
           await updatePassword(user_current, new_passwd);
          // 2a Notificar al  usuario desde el Front-E
           alert('La nueva contraseña fue modificada correctamente');

    }catch(error){
       console.error('Error al cambiar la contraseña. Verifica que se cumplan los criterios de Autenticación');
        throw error;
    }
  }
  /*Se encarga de traer los datos del Alumno -> Metodo necesarios del Back-End [Metodo-L4] ->(29/09/2025)*/
  static async busquedaDelAlumnoPorNombre(nombre){
    try{
      // Paso 0: Conseguir la referencia del Alumno
      
      const consul_students = query(collection(db,this.collectionName),
                                  where('nombre', '===', nombre)
                                 );
              const snapshot = await getDocs(consul_students);
                // Si esta vacio, avisale                
                 if (snapshot.empty)  return null;
                // Si la consulta tiene mayor a 1,  devuelvela
                const doc_Snap = snapshot.docs[0];
                  return {id: docSnap.id, ...docSnap.data()};
    }catch(error){
        console.error('[Serv. de Perfil de Estudiante] - Error al Obtener la referencia por Nombre');
         throw error;
    }
  }
  /*Prop: Traer cualquier rol que inicie sesion y animarlo desde el componente ->'WelcomeUsers' >> Metodo-Animado-2 */
    static async loadUserProfile(email:string, password:string, role: 'alumno' |'profesor'){
      const loggin = await AuthService.login(email,password);
      try{
        if(!loggin){
           throw new Error(`No fue posible autenticar el Correo-Electrónico ${email}`);
        }

        /*2. Obtener los datos del usuario segun correponda el rol*/
         let curent_user = this.ProfesorUser | null;
           if (role=== 'alumno') {
                curent_user = await this.getDataPorCorreo2(email);
           }else if(role=== 'profesor'){
               curent_user = await this.getDataPorCorreo(email);
           }
            // Todo lo que no pertenezca a la reglas de asociacion de los roles
           if (!user_current) {
             throw new Error(`El Usuario no ha sido registrado en la colección ${role}`);
           }

          /*3. Obtener el perfil desde la Firestore(guardamos la coleccion de registros de ambos roles) */
           const profile = await this.getStudentProfile(curent_user,role);

           /*4. Construi una respuesta uniforme*/
            return {
              nombre: profile.nombre,
              apellido: profile.apellido,
              email: curent_user.email,
               // fullName: `${profile.nombre}+${ profile.apellido}`,
               role:role,
            };
        }catch(error) {
            console.error('[UserProfileService]: Error al cargar el perfil', error);
             throw error;
        }
    }

    // Metodo nuevo [15/11/2025]

       // Obtienen los datos del profesor por el correo Electroncio
      static async getDataPorCorreo(email: string): Promise<ProfesorUser| null> {
        try{
           if (!email  || email.value.trim()) {
             throw new Error('El Correo electrónico, requerido');
           }

           const profesoresRef = collection(db, 'registro_profesores');
           const q = query(profesoresRef, where('email', '==', email.value.toLowerCase().trim()));
           const querySnap = await getDocs(q);


           if (querySnap.empty) {
              console.warn(`[ProfileTeachersService]: No se encontró profesor con email: ${email}`);
           }
            // no puede buscar un correo que apenas fue registrado, entonces añadir esta f(n) a otra interaccion p/q desp que la agregue lo obtenga
           const docSnap = querySnap.docs[0];
           const data = docSnap.data();
           const uid = docSnap.id;  //id de la coleccion

            return {
               uid: uid,
               uid_prof: uid,
               username: data.email?.split('@')[0] || '', 
              name: data.nombre,
               lname: data.apellido,
               email: data.email,
               role: data.role,
               autorRole: data.role,
               numCuenta: data.numCuenta,
               area: data.area,
            }  as ProfesorUser;
        }catch (error) {
          console.error('[ProfileTeachersService]: Error al obtener profesor por correo', error);
          throw new Error(`No fue posible obtener los datos del profesor: ${error.message}`);
        }
    }

    static async getDataPorCorreo2(){
      console.log('Construyendo...');
    }
}