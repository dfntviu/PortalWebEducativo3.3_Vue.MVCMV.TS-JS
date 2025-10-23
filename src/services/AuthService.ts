/**
 * @file Servicio de Autentificacion
 * @decription Servicio de autentificación: Inicio, cierre y obtención del usuario actual
 *  **/

   import {ProfileStudentService} from  '@/services/ProfileStudentServ.ts';
   import {ProfileTeachersService} from '@/services/ProfileTeacherServ.ts';
    import { signOut, signWithEmailAndPassword, getAuth} from "firebase/auth";
    import {User} from '@/types/interf.index.js';

   export class AuthService {
   	    static async login(email: string, password: string): Promise<User> {
   	  		try{
   	  	 	   //1. Autentificacion de Firebase(BackEnd)
	   	  	 	const userCrendential = await signWithEmailAndPassword(auth,email,password);
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
	   	  	 	 	 u uid: user.uuid || '',
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

   	    static async logout(): Promise <void> {
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
   	    
   }

    /*static async getCurrentUser(): Promise<User | null>{
   	    	try{
   	    	  const answer =  await  //fn firebase
   	    	}catch (error: any){
   	    		return null;
   	    	}
   	 }*/