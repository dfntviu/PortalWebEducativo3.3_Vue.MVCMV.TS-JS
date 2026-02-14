
 import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, type User } from 'firebase/auth';
  import {doc, getDoc, setDoc, collection, query, getDocs, limit}  from '@/config/itializeFirebaseConf';
 import type {ProfileTeacher, ProfileStudent, UserRole } from '@/types/interfacesv2';

 /**
  * AuthService - Servicio de Autenticacion multiusuario
  * Maneja todas las operaciones de autenticacion sin Lógica de estado
  * Continua con el patron Services-Stores-Views*/

 	export class AuthService {
  	
  	 /**
  	  * Verifica si existe algún usuario en el Sistema
  	  * Útil para determinar si es la primera inicializacion
  	  * */
  	async anyUserExists(): Promise<boolean> {
  	  try{
  	 	 const teachersQuery = query(collection(db, 'teachers'), limit(1));
  	 	 const studentsQuery = query(collection(db, 'students'), limit(1));

	  	 	const [teacherSnapshot, studentsSnapshot] = await Promise.all([
	  	 	 	 getDocs(teachersQuery),
	  	 	 	 getDocs(studentsQuery)
			  ]);

				 return teacherSnapshot.empty || studentsQuery.empty;
  	  }catch(error){
  	      console.error('Error verificando existencia de usuarios', error);
  	      throw new Error('Error al verficar el Sistema');
      }
    }

    /**
  	  * Crea el primer usuario profesor del Sistema
  	  * Solo debe ejecutarse cuando el Sistema esta vacío
  	  * */
    async anyUserExists(): Promise<{
    	success: boolean;
    	email: string;
    	password: string;
    	message: string;
    }>{
        const intialEmail  =  'adm.teacher@teacher.uaemex.mx'
        const intialPasswd =  'Admin2025!';

        try{
        	  // Verificar si el sistema esta vacio
           	const userExist =  await this.anyUserExists();
       
           	if(userExist) {
           	 	return {
           	 	   success: false,
           	 	   email: '',
           	 	   password: '',
           	 	   message: 'El sistema cuenta con usuarios Registrados'
           	 	};
           	}
        
           		// Crear usuario en FirebaseAuth
    		 const userCredential =  await createUserWithEmailAndPassword(auth,
    		   intialEmail, intialPasswd);

    	   const teacherProfile: ProfileTeacher = {
        		uid: userCredential.user.uid,
        		name: 'Administrador',
        		apellido: 'Sistema',
        		email: initialEmail,
        		role: 'professor' as UserRole,
        		numCuenta: 'ADM-000',
        		area: 'Administración',
        		createdAt: new Date().toISOString()
      	};

      		await setDoc(doc(db, 'teachers', userCredential.user.uid), teacherProfile);

      		return {
      		  success: true;
      		  email: initialEmail,
      		  password: intialPasswd,
      		  message: 'Usuario administrador creado exitosamente'
      		}
    	}catch(error: any){
    		 console.error('Error al inicializar primer profesor:', error);
    		 throw new Error('Error al crear el usuario inicial: ' + error.message);
    	}
   }

    /**
     * Inicia Sesion med. credenciales
     * Devuelve el usuario de Firebase Auth*/
    async login(email: string, password: string){
    	try{
    		if (!email || !password) {
       		  throw new Error('Email y contraseña son requeridos');
      		}

      		const userCredential = await signInWithEmailAndPassword(auth, email, password);
      		return userCredential.user;
    	}catch(error: any){
    		console.error('Error en login', error);
    			// Mensajes de Error amigables
	    	if (error.code === 'auth/user-not-found') {
	          throw new Error('Usuario no encontrado');
	        } else if (error.code === 'auth/wrong-password') {
	           throw new Error('Contraseña incorrecta');
	        } else if (error.code === 'auth/invalid-email') {
	           throw new Error('Formato de email inválido');
	    	} else {
	    		throw new Error('Error al iniciar Sesion: '+ error.message);
	    	}
       }
	}

	/**
     * Cierra la Sesion actual
     * */
	async logout(){
		try{
			await signOut();
		}catch(error: any){
		    console.error('Error al cerrar la Sesión:',error);
		    throw new Error(('Error al cerrar sesión: ' + error.message);
		}
	}

	/**
     * Obtiene el Perfil del Profesor
     * */
	async getTeacherProfile(uid: string): Promise <ProfileTeacher| null> {
		try{
			 const docRef = doc(db,'teachers', uid);
			 const docSnap = await getDoc(docRef);

			 if (docSnap.exists()) {
			 	return docSnap.data() as ProfileTeacher;
			 }

			 return null;
		}catch (error: any) {
     	 console.error('Error al obtener perfil de profesor:', error);
      	   throw new Error('Error al cargar perfil de profesor');
		}
    }	

   	/**
     * Obtiene el Perfil del Estudiante
     * */
	async getStudentProfile(uid: string): Promise <ProfileStudent| null> {
		try{
			 const docRef = doc(db,'students', uid);
			 const docSnap = await getDoc(docRef);

			 if (docSnap.exists()) {
			 	return docSnap.data() as ProfileStudent;
			 }

			 return null;
		}catch (error: any) {
     	 console.error('Error al obtener perfil de estudiante:', error);
      	   throw new Error('Error al cargar perfil de estudiante');
		}
    }

    /**
     * Determina el perfil por completo del Usuario segun corresp
     * su Rol*/	 
    async getUserProfile(uid: string, role: UserRole): Promise<ProfileTeacher|ProfileStudent| null> {
    	try{
    		if (role === 'teacher') {
    			 return await this.getTeacherProfile(uid);
    		}else if (role === 'student') {
    			 return await this.getStudentProfile(uid);
    		}
    		 return null;
    	}catch (error: any) {
     	 console.error('Error al obtener perfil de profesor:', error);
      	  throw new Error('Error al cargar perfil de profesor');
    	}
    }

   /**
   * Valida el formato del email
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }	
    /**
   * Valida la fortaleza de la contrasena
   */
  validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      };
    }
    return {
      isValid: true,
      message: 'Contraseña válida'
    };
  }

}
export const authService = new AuthService();