/**
 * @file Servicio de Autentificacion
 * @decription Servicio de autentificación: Inicio, cierre y obtención del usuario actual
 *  **/

   import {ProfileStudentService} from  '@/services/ProfileStudentServ.ts';
   import {ProfileTeachersService} from '@/services/ProfileTeacherServ.ts';
    import { signOut, signInWithEmailAndPassword, getAuth} from "firebase/auth";
    import {ProfesorUser} from '@/types/interf.index.js';

   export class AuthService {
   	    static async login(email: string, password: string): Promise<ProfesorUser> {
   	  		try{
   	  	 	   //1. Autentificacion de Firebase(BackEnd)
	   	  	 	const userCrendential = await signInWithEmailAndPassword(auth,email,password);
	   	  	 	const user = userCrendential.user;

   	  	 	   // 2. Mapear dinamicamente correspondiente a los roles del Sitema
	   	  	 	 const roleServices: {role:Role, service: { getById: (id:string) => Promise<any> } } [] = [
	   	  	 	 	{role: 'profesor', service: ProfileStudentService},
	   	  	 	 	{role:   'alumno', service: ProfileStudentService}
	   	  	 	 ];

	   	  	 	 let profile: any = null;
	   	  	 	 let    role: Role | null = null;

	   	  	 	 // 3. Buscar en los servicios el perfil del usuario
	   	  	 	for(const access of roleServices){
	   	  	 	 	profile = await access.service.getById(user.uid);
   	  	 	 	  if (profile) {
   	  	 	 	  	 role = access.role;
   	  	 	 	  	  break;
   	  	 	 	  }
	   	  	 	}
	   	  	 	 	// 4. Validacion adicional, por seguridad
	   	  	 	 if (!profile || !role) {
	   	  	 	 	 throw new Error("El tipo de Usuario no corresponde o no ha sido registrado")
	   	  	 	 };

	   	  	 	 // 5. Crear el payload y preparar la sesión Fisica
	   	  	 	 const payload: User = 
	   	  	 	 {  user: profile.nombre || '', 
	   	  	 	 	 email: user.email || '',
	   	  	 	 	 uid: user.uuid || '',
	   	  	 	 apellido: profile.apellido || '',
	   	  	 	 	 role,
	   	  	 	  };
	   	  	 	  // 6. Guardar en el AuthService (la sesión del usuario)
	   	  	 	  // AuthService.setUser(payload);  el metodo es de authStore
	   	  	 	  
	   	  	 }catch(error: any){
	   	  	 	// Registro de error por el Sistema o personalizado
	   	  	 	throw new Error(error.message || 'Se registro Error en el Inicio de sesión');
	   	  	}
   	    }

   	    static async logout(): Promise<void> {
   	    	try{ 
   	    		 // Cerrar sesión con Firebase
   	    		await signOut(auth);
   	    		// Limpiar sesión del usuario almacenada en el AuthService
   	    		//AuthService.clearUser()     el metodo es de authStore ?
   	    	}catch (error: any) {
        		//  Registro de error por el Sistema o personalizado
                 throw new Error(error.message || "Error al cerrar sesión");	
   	    	}
   	    }

   		static async getCurrentUser(): Promise<User | null>{
   	    	try{
   	    	  const auth =  getAuth(); //obtiene la instancia de Firebase
   	    	   const currentUser = auth.currentUser;
   	    	    return currentUser;
   	    	}catch (error: any){
   	    		console.error(`Error la obtener: ${error}, el usuario actual`);
   	    		return null;
   	    	}
   	   }	
    	/* Identificar quién ha iniciado sesión en una aplicación mediante la autentificacion del Back*/
			static async signInUser(email: string, password: string): Promise<User | null> {
			    try {
			        const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
			        const userCredential = await signInWithEmailAndPassword(auth, email, password);
			        return userCredential.user; // Devuelve el usuario autenticado
			    } catch (error: any) {
			        console.error('Error al iniciar sesión:', error);
			        return null; // Si ocurre algún error, devuelve null
			    }
			}
   	    // New_function: 02/Nov/2025
	    static async fethUserRole(uid: string): Promise<User | null>{
	   	    	const db = getFirestore();
	   	    	const userDocRef = doc(db, 'register_alumnos', uid);
	   	    	
	   	    	try{
	   	    	  const docSnap =  await getDoc(userDocRef);  //Obt el documento del usuario por su UUID
	   	    	  if (docSnap.exists()) {
	   	    	  		const userData = docSnap.data(); //obtiene datos de la collect
	   	    	  		   return userData.role || 'default' //Dev. el rol  del usuario, segun su acceso o si no esta recibe defecto  
	   	    	  }else {
	   	    	  	 throw new Error('Usuario no encontrado'); // Si no hay nada
	   	    	  }
	   	    	}catch (error){
	   	    		 console.error('Error al obtener el rol del usuario:', error);
      		      throw new Error('Error al obtener el rol del usuario');
	   	    	}
	   	 }
   }
