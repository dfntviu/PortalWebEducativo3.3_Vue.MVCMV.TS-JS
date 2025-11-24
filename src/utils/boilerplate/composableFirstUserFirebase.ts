import {ref} from 'vue';
import {useAuthStore} from '@/stores/authStore.ts';
import  type {ProfileStudent,ProfileTeacher} from '@/types/interfacesv2.ts';  
	// Store de autentificacion
const userAuthStore = useAuthStore(); 

  // Usuario temporal por incializacion
 const initUser = ref<ProfileTeacher | null>(null);

	  user =  ref({
                	 uid: id.uuid,
        		username: username.value,
        			name: nombre.value,
            	   lname: apellido.value,
            	   email: email.value,
             acct_number: numCuenta.value,
             password_pr: password.value,
             	  role:  as ProfileStudent,
             	  area:  as ProfileTeacher,
            });

const systemInitUser = (user)=>{
	// Verificar si existen usuarios en el sistema
	const usersExist =  userAuthStore.auth().currentUser.getIdToken();

	if (usersExist) {
		alert('ERROR: Se ha registrado usuarios en el Sistema');
	     return;
	}

        initUser.value = {
		  	   	 uid: '001',
		  	   	 username: 'user_admin'
   				 name: 'Ernesto',
   				 lname: 'Ferra',
   				 email: 'eferra@teacher.mx',
   				password_pr: '', 
   				acct_number: '100001',
   					role: 'profesor',
   					area: '',
		};
		  	console.log('Usuario: 'user.username,'Fue creado', 'Llamado:  ',user.name);
    
    const exists = await userAuthStore.userExists(initUser.value.email);

     if (exists) {
     	 alert('El usuario ya ha sido creado, NO es posible registrarlo nuevamente');
     	   return;
     }

     // Validar coincidencias de nombre y apellido
     const duplicateName = await userAuthStore.checkNameDuplicate(
     	initUser.value.name,
     	initUser.value.lname
     );

        if(duplicateName.exact){
            alert('Nombre y apellido identicos a otro Registro. Modifica tú apellido');
        	   return;
 
        } else if(duplicateName.nameMatch){
        		alert('Nombre Identico. Pero apellido diferente. Proceder al registro');
        }

        // Crear usuario en Firebase-Auth y registrar en Firestore
        const createdUser = await userAuthStore.createUser({
        	uid: initUser.value.uuid,
        	email: initUser.value.email,
        	password: initUser.value.password_pr,
        	profile: initUser.value,  //lo guarda seg su interfaz
        });

        if (createUser) {
        	console.log(`Usuario: ${createdUser.username} creado correctamente`);
        	  alert('Primer usuario inicializado. Redirigiendo al Inicio de sesion...');

        	 	// Regirigir al login
        	  useAuthStore.redirectToLogin();
        }
    }; 
        	/*if (user.username.value===current && user.lname.value===current) 
        		alert('El apellido se modifico a: ', new_apellido);*/