
 import {initializeFirebaseStorage} from '@/public/initializeFirebaseConf.js';
 import   { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';  
 import { query,collection,where,doc,setDoc,getDocs } from 'firebase/firestore';
 import  type {ProfileStudent,ProfileTeacher} from '@/types/interfacesv2.ts';
  
  // Destructuracion de variabls de la configuracion
 const { auth,db } = initializeFirebaseStorage(); 

  // Dec. de Interfaces
    interface NameCheckResult{
    	exact: boolean;
    	nameMatch: boolean;
    }

    interface ServiceResult {
    	 success: boolean;
    	 message: string;

    	 user?: ProfileTeacher | ProfileStudent;
    }

 export class TeacherFirstUsingService {
		// Valida duplicados de nombre y apellido del Perfil-2
	static  async nameDuplicatedCheck(name:string, lname: string): Promise <NameCheckResult> {
		const q = query(collection(db, 'reg_teachers'), where('name', '===', name));
		const snapshot = await getDocs(q);

		let exact = false;
		let nameMatch = false;
		snapshot.forEach(docSnap => {
			 const data = docSnap.data();
			  if (data.lname===lname) {
			  	exact = true;
			  }else{
			  	nameMatch = true
			  }
		});

		return {exact, nameMatch};

	}
		// Crear un usuario en FirebaseAuth y  registrarlo en Firestor
	static async createdUser(user: Omit<ProfileTeacher| ProfileStudent, 'email'>,email:string, password: string): Promise<ServiceResult>{
		try{
		    // Crear usuario en FirebaseAuth y registrarlo en Firestore 
	      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

	    const userDocRef = doc(db,'form_register-profesores',userCredential.user.uid); //se detiene
	    console.warn('coleccion: ',userDocRef);  // no
	     const procesar_colect =await setDoc(userDocRef,{...user, uid:userCredential.user.uid});
	     	// console.warn('Estado de la colección: ', procesar_colect);
	     	return{ 
	     	    success: true,
	     	    message:'Usuario creado correctamente',
	     	    user:{
	     	    	...user,
	     	    	email,
	     	    	uid:userCredential.user.uid,
	     	    },
	     	};

	     	// Comprobar inmediatamente si se agregó
      /* const savedUser = await getDoc(userDocRef);
	    if (savedUser.exists()) {
	      console.log("Usuario agregado correctamente:", savedUser.data());
	      return { success: true, user: savedUser.data() };
	    } else {
	      console.log("Error: el usuario no se pudo agregar.");
	      return { success: false };
	    }*/

		}catch(error: any){
			return{ 
	     	    success: false,
	     	    message:error.message
	     	 }; //#e_return
		}// #catch
	}

		// Verifica si existen usuarios en la Firestore
    static async anyUserExist(email:string){	
    	console.log('1° Validadcion');
   	  const usersSnapShot = await getDocs(collection(db,'form_register-profesores'));
   	  console.log('leyen..',usersSnapShot);  //no
   	    return !usersSnapShot.empty;

    };
      /* Inicializa el primer Usuario: El Sistema esta vacio*/
    static async initialingFirstUse(correo:string): Promise <ServiceResult> {
    	console.log('Consumiendo el Servicio de Inicialización del User..');
    	// Verificar si existen usuarios
    	if (await this.anyUserExist(correo)) {
    		conole.log(':',anyUserExist(correo));
    		 return{
    		 	 success: false,
    			 message: 'El Sistema tiene usuarios registrados. No se puede crear el primer usuario'
    		  };
    	}

    	  // Crear forma autonoma el primer usuario inicial
        const initUser: ProfileTeacher = {    //## ?? ##
		  	   	 uid: '001',
		  	   	 username: 'user_admin',
   				 name: 'Ernesto',
   				 lname: 'Ferra',
   				 email: 'eferra@teacher.mx',
   				password_pr: '4321', 
   				acct_number: '100001',
   					role: 'profesor',
   					area: '',
	    	};
   
		const verificarNombre = await nameDuplicatedCheck(initUser.name, initUser.lname);

			if (verificarNombre.exact) {
			  	return{
			  	 success: false,
    			 message: 'Existe un mismo usuario con el mismo nombre u Apellido. Cambia alguno dato básico',
			    };
			} else if(verificarNombre.nameMatch) {
			   alert('Nombre Identico, pero Apellido distinto. Se puede crear');
		  }	

          const nuevo_usuario = await createdUser(initUser,initUser.password_pr);

          if (nuevo_usuario.success) {
          	return{
          		nuevo_usuario,
          		message: `Usuario: ${initUser.value.username} creado correctamente`
          	}
          }
			 // Crear Usuario
		   try{
              // alert(`Usuario: ${initUser.value.username} creado correctamente`);
                // Inicio de Sesión automaticamente
              await signInWithEmailAndPassword(auth, initUser.email,initUser.password_pr);
               // Enviar al Inicio (por medio de vue-router)
		  }catch(error: any){
			   console.log('Error al crear al usuario', error.message);
			     alert('Error creando usuario: ' + error.message);	
		  }
		 
		  return {
		 	 success:true,
		 	 message: 'El primer usuario creado e inicio de sesión realizado',
		 	 user:initUser
		  };
    }
  }