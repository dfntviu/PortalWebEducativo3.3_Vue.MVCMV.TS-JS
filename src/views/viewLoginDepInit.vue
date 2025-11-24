<!-- viewLogin.dep.vue (origin) -->
<template>  
	<div class="auth_view_pnl">
		  <h2>Inicar Sesión</h2>
		  <button @click="inicializarSistema":disabled="loading">Crear</button>
		<form  @submit.prevent="handleLogin" class="auth_form">
			<label>
				Correo
				<input type="email" v-model="teacherStore.email" placeholder="Escribe correo Institucional">
			</label>

			<label>
				Contraseña
				<input type="password" v-model="teacherStore.password"  placeholder="Escribe la contraseña">
			</label>
				 <p v-if="teacherStore.esAuthenticado" style="color: green;">
           Usuario inicial cargado desde el backend.
       </p>
		<div class="user_role">
			<label>
				<!-- Determina el Rol correspondiente -->
				<input type="radio"  value='professor' v-model="form_home.role">
				Profesor
			</label> 
			<label>
				<input type="radio"  value='alumno' v-model="form_home.role">
				Estudiante
			</label> 			
		</div>

			<div class="botones">
				<button type="submit" @click="handleLogin":disabled="loading">Iniciar Sesion</button>
				<!-- <button type="button" @click="handleLogout" :disabled="loading || !esAuthenticado">
				  Cerrar Sesion 
				</button> -->
				 <button type="button" @click="fetchCurrentUser" :disabled="loading" >
				  Obtener Usuario
				</button>
				
				<!-- <button type="button"  @click="anunciarUsuario" :disabled="loading || esAuthenticado" >
				  Mostrar Perfil
				</button> -->
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
<script setup lang="ts">  /*here*/
   import {ref,reactive,computed, onMounted,nextTick} from 'vue';  
   import {useAuthStore} from '@/stores/authStore2.ts';
   import {useRouter} from 'vue-router';				//+(x1) 
   import type {ProfileTeacher, ProfileStudent} from '@/types/interfacesv2.ts';
	// import {validationsRoleRegister} from '@/utils/validations.origin/validationsRoleRegister.ts';
    // # Habilitar ln 73, cuando se tenga el acceso total#

	/* Declaracion de Stores */
    const teacherStore = useAuthStore();
    const       router = useRouter();
	
	// Formulario de inicio de sesion
   const form_home = ref({  //here
      email: '',
      contrasenia: '',
      role: '',
   });
	   console.log('Rol: ', form_home.role);
      /*Estado Local e Int. de Usuario*/
    const error   = ref<string | null>(null);
    const message = ref<string | null>(null);
    const loading = computed(() => teacherStore.loading);
	 const esAuthenticado = computed(()=> teacherStore.isAuthenticated);
	      
	async function inicializarSistema() {
	   const resultados = await teacherStore.initFirstTeacher();

	   if (resultados.success) {
	       teacherStore.email = resultados.email;
	       teacherStore.contrasenia = resultados.password;

	    	 form_home.email       =  resultados.email;
	    	 form_home.contrasenia = resultados.password;
	    	      console.log('Credenciales inciales cargadas: ', resultados.email);
	    	      // console.log('Resultados: ',form_home.email);
	   }	

	    	 	 // const credent1 = credentials.user.email.value; 
	};

   async function handleLogin() { 
         // Inicializa los estados locales
        error.value = null;
  		message.value = null;
  			// Validacion escensial
		  /*if (!form_home.email || !form_home.contrasenia) {
		    error.value = 'Ingresa el correo y Contraseña correctas';
		    return;
		  }*/
 
 		  teacherStore.loading = true;

		try {
		  	console.log('Intentando el Inicio de Sesion...');

		  	   const resultado_loggin = await teacherStore.login(
		  	  	    form_home.value.email,
		  	  	    form_home.value.contrasenia
		  	   );    

		  	  const systemEmpty = !(await teacherStore.anyUserExist());
		  	   // console.log('Mapping Second Method..');

	  	   if (systemEmpty) {
	    			const resultado = await teacherStore.initializerTeacherUser();
	    				console.log('Resultado-creacion: ', resultado);
	    					console.log('boolean acces: ',resultado.success);
	    					console.log('Store for Acess: ', teacherStore.isAuthenticated);
	    					// console.log('Rol sel: ', form_home.role);
 			   if (resultado.success && teacherStore.isAuthenticated) {  //review
 				   console.log('Credenciales del Usuario:', resultado.credentials);
						message.value = resultado.message;
							 await nextTick();
							 // console.log('Accedi al test de redireccion'); 
 			              const value_routing = await router.push({name: 'viewRegisterTeacher1'}); 
 			              console.log('Esqueleto de Ruteo: ', value_routing);
 			              console.log('Ingrese a la vista de Registro Existosamente...');
 			   } else {
 				  error.value = resultado.message;
 			   }
	    		 return;
         }
			  // inicio normal
			// const result_login = await teacherStore.login(form_home.email,  form_home.contrasenia );

		 /*if (this.resultado.succes && teacherStore.esAuthenticado){
		   		const role = teacherStore.role;
		   		message.value = 'La Sesion fue exitosa';

				if (teacherStore.role=== 'profesor') {
		 	      router.push({name:'view-bienvenida-teachers'});  
		 	  } else if(teacherStore.role=== 'alumno') {
		 	       router.push({name:'view-bienvenida-students'});
			  } else {
					 router.push('/view-login-dep-init');
		   }
		} else {
			  error.value = this.resultado.message;
		}*/

      }catch (err: any) {
		   error.value=err.message || 'Error de Inicio de Sesión.';
		} finally {
			 teacherStore.loading = false;
		}
   } 
	    
	   onMounted(async()=>{
	    	await inicializarSistema();
	   });

      /** async function handleLogout() {
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

        }  **/

        /*async function anunciarUsuario() {
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
        		   const profile = profileState.fetchProfiles(id); //fetchProfileUno, organice y refactorice la logic 
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
        }*/

  </script>

   <style scoped>
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
   	/*}*/
   	 .botones{
   	 	 display: flex;
   	 	 gap: 0.5rem;
   	 	  margin-top: 0.5rem;
   	 }
   	/*}*/

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