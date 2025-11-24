 import {initializeFirebaseStorage} from '@/public/initializeFirebaseConf.js';   //*
 import   { createUserWithEmailAndPassword,signInWithEmailAndPassword,deleteUser} from 'firebase/auth';  
 import { query,collection,where,doc,addDoc,setDoc,getDocs } from 'firebase/firestore';
 import  type {ProfileStudent,ProfileTeacher} from '@/types/interfacesv2.ts';

     const { auth,db } = initializeFirebaseStorage(); 

     const COLLECT_TEACHER = 'teachers_register'
    
    // console.log('Inf d Instancia- ',db);
     
    interface NameCheckResult{
    	exact: boolean;
    	nameMatch: boolean;
    }

    interface ServiceResult<T=any>{
    	 success: boolean;
    	 message: string;
    	  user?: T;    //new_Invoke on the generic Int.
    	  credentials?: {email:string, password: string};  //new_02, evitar la duplicidad
    	  nuevo_usuario?: any; 
    }

  export class TeacherFirstUsingService {
  		 // ==============================================================
  	   // 0. F(n) Auxiliar: Retorna al objeto base del primer usuario(objeto centralizada)
  		 // =============================================================

  	static  getInitUser(): ProfileTeacher {
  		  return {
  		 	  uid: '007',
		  	  username: 'user_admin',
   				name: 'Adal',
   				lname: 'Marquez',
   				email: 'amarquez@profesor.mx',
   				password_pr: 'test07', 
   				acct_number: '100007',
   				role: 'profesor',
   			  area: 'Sociologia',
  		  };
  	}
  	/** ========================================================
     *  Verifica si ya existen usuarios registrados
     * ======================================================== */
  	 static async getInitCredentials(): Promise<{email: string, password:string} >{
  	 	  const initUser =  this.getInitUser();
  	 	  const credentials =  {
  	 	  	email: initUser.email,
  	 	  	password: initUser.password_pr,
  	 	  };
  	 	  console.log('[F(n) Intermediaria]: Enviando credenciales por defecto', credentials);

  	 	  return credentials;
  	 	  // console.log('Final-Result ', credentials);
  	 }
  	 /**===========================================
     *   Verifica duplicado de Nombre y Apellido
     * ==============================================*/
		static  async nameDuplicatedCheck(name:string, lname: string): Promise <NameCheckResult> {
			const q = query(collection(db, COLLECT_TEACHER), where('name', '==', name));
			const save_snapshot = await getDocs(q);

			let     exact = false;
			let nameMatch = false;

			save_snapshot.forEach(docSnap => {
				 const data = docSnap.data();
				  if (data.lname===lname) {
				  	exact = true;
				  }else{
				  	nameMatch = true
				  }
			});

		      // console.log("Usuario agregado correctamente:", save_snapshot);
			 return {exact, nameMatch};
		}
		/** ========================================================
     *  Verifica si ya existen usuarios registrados
     * ======================================================== */
	  static async anyUserExist(email:string){	
	  	// console.log('¿Hay Usuarios?: ', anyUserExist);
   	  const usersSnapShot = await getDocs(collection(db,COLLECT_TEACHER));
   	  // console.log('Verificando coleccted -',usersSnapShot);
   	    return !usersSnapShot.empty;
    }

    /** ========================================================
   *   Crea un nuevo usuario (Auth + Firestore)
   * ======================================================== */
		static async createdUser(user: Omit<ProfileTeacher| ProfileStudent, 'email'>,email:string, password: string): 
		  Promise<ServiceResult<ProfileTeacher | ProfileStudent>>{
			try{
				 // console.log('f(n) visitada...');
			    // Crear usuario en FirebaseAuth y registrarlo en Firestore 
		      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		      	// console.log('Credenciales Guardadas: ',userCredential);
		    const userDocRef = doc(db,COLLECT_TEACHER,userCredential.user.uid); //#
		    	// Verificar si existe el documento
          // console.log('Aqui va mi coleccion referenciada: ', userDocRef);
		      // Si no existe crear documento 
		     	 await setDoc(userDocRef,{...user,uid: userCredential.user.uid,email});

		     	 // console.log('Coleccion creada correctamente');

		     	return{ 
		     	    success: true,
		     	    message:'Usuario creado correctamente',
		     	    user:{ ...user, email, uid:userCredential.user.uid },
		     	};

			}catch(error: any){
				return{ 
		     	    success: false,
		     	    message:error.message
		     	 }; //#e_return
			}// #catch
		}
      
		/** ========================================================
     *   Envias las credenciales del primer usuario(solo lectura) >> 07 de Nov del 2025
     * ======================================================== */
    static async sendCredentials(router: any, nextTick:()=> Promise<void>){ 

          // console.log('Inicializacion ', credentials);
      try{
       	  // acceso al metodo Intermediaria pre-centralizado
       	  const credentials = await this.getInitCredentials();
       	  console.log('incializar sess: ', credentials);
            // if (credentials.success) {
            	    /*const  credential1 = credentials.user.email
            	    const  credential2 = credentials.user.password_pr*/
            	       // console.log('referencias obtenidas',credential1,credential2);
            	   
               return {
               	success: true,
               	email: credentials.email,
               	password: credentials.password,
               };   // console.log('1: ', email,'2:', password)
           /*}else{*/
           	 // console.warn('Error al intentar obtener las primeras credentials de Firestore',credentials.message);
           	  // return {success: false, message: credentials.message};
           // }
      }catch(error: any){
      	  console.log('Error en SendCreandialts: ', error.message);
      	  return {success: false, message: error.message};
      }
    }
    /** ========================================================
    *     Inicializa el Primer uso del Sistema
    *  ======================================================== */
    static async initialingFirstUse(): Promise <ServiceResult<ProfileTeacher>> {
        try{

    	  console.log('[InitUserService] Verificando si existen usuarios...');
    	      //  # Existen usuarios
    	    if (await this.anyUserExist()) {

    		    return{
    		 	   success: false,
    			   message: 'El Sistema tiene usuarios registrados. No se puede crear el primer usuario',
    		    };
    	    }

               // console.log('Siguiendo la ejecucion..');
    	   		const credentials =  await this.getInitCredentials();
            const    initUser = this.getInitUser();   //GPT olvido llamarlo

		         const 	verificarNombre = await this.nameDuplicatedCheck(initUser.name, initUser.lname);

	    	    console.log('d1 ',credentials.email);
	    	    console.log('d2 ',credentials.password);
             
            console.log('coleccion Total: ', initUser);

    	       // Definir las credenciales del primer usuario antes de crear
			if (verificarNombre.exact) {
			  	return{
			  	 success: false,
    			 message: 'Existe un mismo usuario con el mismo nombre u Apellido. Cambia alguno dato básico',
			    };
			} else if(verificarNombre.nameMatch) {
			    console.warn('Nombre Idéntico pero Apellido distinto. Se permite la creación.');
		  }	 
		  	  console.log('Credencializacion: ',initUser.uid, initUser.email);
			     // Alm. el obj en constante p/trasladarla al a_store2
          const nuevo_usuario = await this.createdUser(initUser,initUser.email,initUser.password_pr);
           
          if (!nuevo_usuario.success) {
          	  return nuevo_usuario;
          }			
                // Autenticar temporalmente y eliminar la sesión
              const temporal_user = await signInWithEmailAndPassword(auth, initUser.email,initUser.password_pr);

          if (temporal_user?.user) {
              await deleteUser(temporal_user.user);
               console.log('Usuario anterior eliminado de Auth.');
          }
              // Regresar todo lo que se necesite
			  return {
			 	  success:true,
			 	  message: `El primer usuario: ${initUser} creado y autenticado correctamente.`,
			 	  user: initUser,
			 	  credentials:{  // enviar datos para login >> [obtenidas de la f(n) aux]
			 	  	 email: initUser.email,
			 	  	 password: initUser.password_pr,
			 	  },     
			 	  nuevo_usuario,   //  dato, que guardo la coleccion en Firebase
			  };

		  } catch(error: any){
			   console.log('Error al crear al usuario', error.message);
			     alert('Error creando usuario: ' + error.message);	
		  }
  }
		/***/
}