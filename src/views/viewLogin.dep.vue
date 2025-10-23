<template>
	<div class="auth_view_pnl">
		<form  @submit.prevent="handleLogin" class="auth_form">
			<label>
				Correo
				<input type="email" v-model="email" placeholder="Escribe correo Institucional">
			</label>

			<label>
				Contraseña
				<input type="password" v-model="contrasenia"  placeholder="Escribe la contraseña">
			</label>

			<div class="botones">
				<button type="submit" @click="handleLogin":disabled="loading">Iniciar Sesion</button>
				<button type="button" @click="handleLogout" :disabled="loading || !isAuthenticated">
				  Cerrar Sesion
				 
				 <button type="submit" @click="fetchCurrentUser" :disabled="loading" >Obtener Usuario</button>
				</button>
				<button type="submit"  @click="anunciarUsuario" :disabled="loading || isAuthenticated" >
				  Mostrar Perfil
				</button>
			</div>
		</form>

		<!-- Variables que muestran el progreso en estado del usuario  -->
		<div class="status loading">Cargando...</div>
		<div class="status error">{{error}}</div>
		<div class="status info">{{message}}</div>

		<!-- Seccion de personalizacion >> for validation   -->
		<div class="customize_session">
			<section v-if="userSession" class="user_info" >
				<h3>Sesión Activa del Usuario</h3>
			     <p><strong>UID: {{userIdForDisplay}}</strong></p>
			     <p><strong>Nombre: {{userSession.name}}</strong></p>
			     <p><strong>Email: {{userSession.email}}</strong></p>
			</section>

			<section v-if="profileData" class="pefil_info" >
				<h3>Perfil del Usuario</h3>
				<p><strong>Nombre:{{profileData.name}}</strong></p>
				<p><strong>Rol:{{profileData.role}}</strong></p>
				<p><strong class="custome_perfild">Apellido: {{profileData.apellido}}</strong></p>
			</section>
		</div> <!--customize-->
	</div>
</template>

<script language="ts">
	import {ref,reactive,computed} from 'vue';
	import   type {User} from '@/types/intef.indexs';
	import {validationsRoleRegister} from '@/utils/validations.origin/validationsRoleRegister.ts';
	import {useAuthStore} from '@/Stores/authStore.ts';
	import {useProfilesStore} from '@/Stores/profilesStore.ts';

	/*Declaracion Stores*/
	const authStore    = useAuthStore();
	const profileState = useProfilesStore();

	// Formulario de inicio de sesion
	const form_home = reactive({
	 	email: 'correo@dominio.com';
	 	contrasenia: '';
	});

	 /*Estado Local e Int. de Usuario*/
	 const loading = ref(false);
	 const error   = ref<string | null>(null);
	 const message = ref<string | null>(null);

	 /* Sesion/ Perfil */
	 const userSession = ref<User | null>(null);
 	 const profileData = ref< any | null>(null);  //el objeto de la info del perfil de usuario

 	 /* Validar que ingreso*/
 	 const isAuthenticated = computed(()=> !userSession.value);

 	 /*Helper: extracion segura de id del usuario*/
      const userIdForDisplay = computed(()=>{
      	 if (userSession.value) return null;


      	  const u = userSession.value as any;
      	    return u.uuid ?? u.id ?? u.email ?? null;
      });

      /** -----------------------
       *   Acciones Principales
       * ------------------------
       * */
        async function handleLogin() {
      		error.value = null;
      		message.value = null;

      		if (!form_home.email || !form_home.contrasenia) {
      			error.value = 'Ingresa el correo y Contraseña correctas';
      			  return;
      		}

      		loading.value = true;

      		try{
      			authStore.login(form_home.email,form_home.contrasenia);
      				await fetchCurrentUser();
      				message.value = 'Inicio de Sesión correcto';
      		}catch(err: any){
      			console.error('[AuthView] Error del Login', err);
      				error.value = err?.message ?? 'Error al iniciar sesion'
      		}finally{
      			loading.value = false;
      		}
        }

        async function handleLogout() {
        	loading.value = true;
        	error.value = null;
        	message.value = null;
        	
        	try{
      		 	await authStore.logut();
      		 	 userSession.value = null;
      		 	 profileData.value = null;
      		 	  message.value = 'La Sesión fue cerrada correctamente';
      		}catch(err: any){
      			console.error('[Vista de Autorizacion] Error al Cerrar la Sesión', err);
      			  error.value = err?.message ?? 'Error al Cerrrar sesion';
      	    }finally{
      	    	loading.value = false;
      	    }

        }

        async function fetchCurrentUser(){
        	loading.value = true;
        	  error.value = null;

        	 try{
        	 	/*el usuario actual obtenido, devuelve la interface de Usuario suscrito al usuario*/
        	 	const usuario = await authStore.getCurrentUser();
        	 	 userSession.value =  (usuario as User) ?? null;
        	 	   if (!userSession.value) {
        	 	   	   message.value = 'No hay usuario autenticado actualmente';
        	 	   }
        	 }catch(err: any){
        	 	console.error('[Vista de Autorizacion]: Error de Usuario Actual:' , err); 
        	 	  error.value =  err?.message ?? 'Error Obtenido en el usuario actual';
        	 }finally{
      	    	loading.value = false;
      	    }
        }

        async function anunciarUsuario() {
        	//si no hay sesion activa, no hacer nada
        	 if (!userSession.value) {
        	 	error.value = 'Aún No hay usuario autenticado';  
        	 	  return;
        	 }

        	 loading.value = true;
        	 error.value = null;
        	 message.value = null;

        	try{
        		const id =  userIdForDisplay.value;
        		  if (!id) {
        		  	 error.value = 'No fue posible determinar el identificador del usuario.';
        		  	   return;
        		  }

        		  // llamada al profile para obtener el perfil del usuario
        		   const profile = profileState.fetchProfileUno(id);
        		   profileData.value = profile ?? null;

        		     if (profileData.value) {
        		     	 message.value = 'El perfil se ha obtenido correctamente.';
        		     } else {
        		     	 message.value = 'No se encontró el perfil para este usuario';
        		     }
      		}catch(err: any){
      			console.error('[Vista de Autorizacion] Error al traer el perfil', err); //muestra la traza del error
      			  error.value =   err?.message ?? 'Error al obtener el perfil';
        	}finally{
        		loading.value = false;
        	}
        }

        /*Funciones auxiliares para tener una experiencia amigable*/
          function seRequiereIniciarSesion(argument) {
          	// Enviar mensaje con el nombre de usuario y la hora en que se inicio sesion
          	  return !isAuthenticated.value;
          }

          function seRequiereSalirSesion(argument) {
          	// Lógica de confirmacion de cierre de sesion
          	// Enviar mensaje con el nombre de usuario y la hora en que se salio de la sesion
          	 return isAuthenticated.value;
          }

          /*function siRequiereAnunciarUser(argument) {
          	// Lógica de la...
          	// Mostra nombre completo: nombre, apellido hora de sesion y carrera
          	return !isAuthenticated.value;
          }*/
</script>
   <style>
   		.auth_view_pnl{
   			max-width: 720px;
   			margin: 0 auto;
   			padding: 1rem;
   		}
   		.auth_form{
   			display: flex;
   			flex-direction: column;
   			gap: 0.5rem;
   		}

   		.auth_form label {
   			display: flex;
   			flex-direction: column;
   			font-size: 0.9rem;
   		}
   	}
   	 .botones{
   	 	 display: flex;
   	 	 gap: 0.5rem;
   	 	  margin-top: 0.5rem;
   	 }
   	}

   	.status{
   		 margin-top: 0.6rem;
   		 padding: 0.4rem;
   		  border-radius:6px;
   	}

   	.status.loading{
   		color: #0b5;
   	}

   	.status.error{
   		color: #b00;
   	}

   	.status.info{
   		color: #036;
   	}

   	.user_info .pefil_info{
   		 margin-top: 1rem;
   		 border: 1px solid #eee;
   		 padding: 0.6rem;
   		 border-radius: 6px;
   	}
   	
   	/*.custome_perfild{	}*/
   </style>