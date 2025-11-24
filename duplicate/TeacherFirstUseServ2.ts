import {initializeFirebaseStorage} from '@/public/initializeFirebaseConf.js';
 import   { createUserWithEmailAndPassword,signInWithEmailAndPassword,deleteUser} from 'firebase/auth';  
 import { query,collection,where,doc,addDoc,setDoc,getDocs } from 'firebase/firestore';
 import  type {ProfileStudent,ProfileTeacher} from '@/types/interfacesv2.ts';

  // Destructuracion de la configuracion de Firebase
 const { auth,db } = initializeFirebaseStorage(); 

   // Nombre de coleccion de profesores
     const COLLECT_TEACHER = 'teachers_register'
    
    // console.log('Inf d Instancia- ',db);
     
  //  Interfaces Auxiliares
    interface NameCheckResult{
    	exact: boolean;
    	nameMatch: boolean;
    	credentials;
    }
    interface ServiceResult {
    	 success: boolean;
    	 message: string;

    	 user?: ProfileTeacher | ProfileStudent;
    }

  export class TeacherFirstUsingService {
		// Verifica si existe profesor duplicado con los mismos datos
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

		      console.log("Usuario agregado correctamente:", save_snapshot);
			 
			return {exact, nameMatch};

		}

	  static async anyUserExist(email:string){	
	  	// console.log('¿Hay Usuarios?: ', anyUserExist);
   	  const usersSnapShot = await getDocs(collection(db,COLLECT_TEACHER));
   	  console.log('Verificando coleccted -',usersSnapShot);
   	    return !usersSnapShot.empty;
    }

		static async createdUser(user: Omit<ProfileTeacher| ProfileStudent, 'email'>,email:string, password: string): 
		  Promise<ServiceResult<ProfileTeacher | ProfileStudent>>{
			try{
				 console.log('f(n) visitada...');
			    // Crear usuario en FirebaseAuth y registrarlo en Firestore 
		      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		      	console.log('Credenciales Guardadas: ',userCredential);
		    const userDocRef = doc(db,COLLECT_TEACHER,userCredential.user.uid); //se detiene
		    	// Verificar si existe
		     // const docSnap = getDoc(userDocRef);
          console.log('Aqui va mi coleccion referenciada: ', userDocRef);
		      // Si no existe crear documento 
		     	 await setDoc(userDocRef,{...user,uid: userCredential.user.uid,email,});

		     	 console.log('Coleccion creada correctamente');

		     	return{ 
		     	    success: true,
		     	    message:'Usuario creado correctamente',
		     	    user:{
		     	    	...user,
		     	    	email,
		     	    	uid:userCredential.user.uid,
		     	    },
		     	};

			}catch(error: any){
				return{ 
		     	    success: false,
		     	    message:error.message
		     	 }; //#e_return
			}// #catch
		}
      // 07 de Nov del 2025
    static async sendCredentials(router: any, nextTick:()=> Promise<void>){ 
       	  const credentials = await this.initialingFirstUse();

          console.log('Inicializacion ', credentials);
      try{
            if (credentials.success) {
            	     const  credential1 = credentials.user.email
            	     const  credential2 = credentials.user.password_pr
            	    // console.log('referencias obtenidas');
            	   
               return {
               	success: true,
               	email: credential1,
               	password: credential2,
               }

           }else{
           	 console.warn('Error al intentar obtener las primeras credentials de Firestore',credentials.message);
           	  return {success: false, message: credentials.message};
           }
      }catch(error: any){
      	  console.log('Error en Setcreanditls: ', error.message);
      	  return {success: false, message: credentials.message};
      }
       
    }
    						/*Def. de f(n) Intermediaria(Pivote): No toca datos vitales en el Primer Uso, es la semilla */
    static async initialingFirstUse(): Promise <ServiceResult<ProfileTeacher>> {
        try{

    	  console.log('[InitUserService] Verificando si existen usuarios...');
    	   // Verificar si existen usuarios
    	     if (await this.anyUserExist()) {
    		// console.log(':',anyUserExist(correo));
    		    return{
    		 	   success: false,
    			   message: 'El Sistema tiene usuarios registrados. No se puede crear el primer usuario'
    		    };
    	   }
             console.log('Siguiendo la ejecucion..');

    	     // Definir las credenciales del primer usuario antes de crear
            const initUser: ProfileTeacher = {    //## ?? ##
		  	   	      uid: '007',
		  	   	  username: 'user_admin',
   				    name: 'Adal',
   				    lname: 'Marquez',
   				    email: 'amarquez@profesor.mx',
   				   password_pr: 'test07', 
   				   acct_number: '100007',
   				    	role: 'profesor',
   			   		  area: 'Sociologia',
   			   		   // email:  `admin_test${Date.now}@teching.mx`,
	    	    };

	    	     // Guardar las credenciales aquí
	    	    const credentials = {
	    	    	     email: initUser.email,
	    	    	  password: initUser.password_pr,
	    	    };

	    	    console.log('d1 ',credentials.email);
	    	    console.log('d2 ',credentials.password);

            console.log('coleccion Total: ', initUser);

		     const verificarNombre = await this.nameDuplicatedCheck(initUser.name, initUser.lname);

			if (verificarNombre.exact) {
			  	return{
			  	 success: false,
    			 message: 'Existe un mismo usuario con el mismo nombre u Apellido. Cambia alguno dato básico',
			    };
			} else if(verificarNombre.nameMatch) {
			   alert('Nombre Identico, pero Apellido distinto. Se puede crear');
		  }	 
		  	  // console.log('Credencializacion: ',initUser.uid, initUser.email);
			 // Crear Usuario
          const nuevo_usuario = await this.createdUser(initUser,initUser.email,initUser.password_pr);
           
          if (!nuevo_usuario.success) {
          	  return nuevo_usuario;
          }	
              const temporal_user = await signInWithEmailAndPassword(auth, initUser.email,initUser.password_pr);
              if (temporal_user?.user) {
              	await deleteUser(temporal_user.user);
              	console.log('Usuario anterior eliminado de Auth.');
              }
               // Enviar al Inicio (por medio de vue-router)
			  return {
			 	 success:true,
			 	 message: `El primer usuario: ${initUser} creado y autenticado correctamente.`,
			 	 user: initUser,
			 	 nuevo_usuario,  //new para login para ingreso
			 	 credentials,     //settear datos para login
			  };

	    
		  }catch(error: any){
			   console.log('Error al crear al usuario', error.message);
			     alert('Error creando usuario: ' + error.message);	
		  }
		 
    }
		
		static async getInitCredetials(): Promise <{email: string, password: string}>{
	  	 const credentials = {
	    	    	     email: initUser.email,
	    	    	  password: initUser.password_pr,
	    	    };
	    	    	console.log('[F(n) Intermediaria] Enviando credenciales por defecto', credentials);
	    	 return credentials;
	  }
 }