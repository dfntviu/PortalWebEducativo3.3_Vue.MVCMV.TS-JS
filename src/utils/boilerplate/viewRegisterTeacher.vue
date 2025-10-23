<template>
	<div class="auth_view_pnl register-view">
		<h2>Registro de Usuario</h2>
		<!-- Seleccion Tipo Reg -->
		<div class="selector-tipos">
			<button  :class="active: tipoRegistro==='tradicional'" 
					  @click="seleccionarRegistro('tradicional')" type="button">
					Registro Tradicional
		    </button>	
		    <button :class="active: tipoRegistro==='facebook'"
		    		 @click="seleccionarRegistro('facebook')" type="button">
		    		 	Facebook
		    </button>
		    <button :class="active: tipoRegistro==='google'"
		     		@click="seleccionarRegistro('tradicional')" type="google">
		    		 Google
		    </button>
		</div>
		<!-- Mensajes generales -->
		<div class="status info"  v-if="message">{{message}} </div>
		<div class="status error" v-if="error">{{error}}</div>
		<div class="status loading" v-if="loading"> {{loading}}</div>

		<!--Contenedores de Paneles-->
		<transition class="panel-fade" mode="out-in">
			<section  :key="tipoRegistro" class="panel_container">
			  	  <!-- Penel: Registro Tradicional  -->
				  <form v-if="tipoRegistro === 'tradicional'" class="panel panel_tradicional"
				   @submit="onSumbitTradicional"> 
				     <h3>Registro Tradicional</h3>
						<label>Nombre<input type="text"></label>
							<label>Nombre     <input v-model="" type="text" required></label>
							<label>Apellido   <input v-model="" type="text" required></label>
							<label>Correo Institucional<input  v-model="" type="text" required></label>
							<label >Contrasenia	<input v-model="" type="text" required></label>
					<div class="academico">
						<h1>Datos Académicos</h1>
						 <label >Num. Cta</label>
						 <input type="text"  v-model="">
						 <label >Areá Académica</label>
						 <input type="text" v-model="">
						 <label >Rol:
							<select >
							 	<option value="alumno"></option>
							 	<option value="profesor"></option>
							</select>
						</label>
					</div>
					<div class="botones">
						<button type="submit" :disabled="loading">Registrar</button>
						<button type="button" @click="resetTradicional" :disabled="loading">Limpiar</button>
					</div>
				</form>

				  <!-- <form v-if="tipoRegistro === 'tradicional_profile'" class="panel panel_tradicional"
			  	  <-- Penel: Perfil Tradicional  --
				   @submit="handleSumbit"> 
				      <h3>Registro Tradicional</h3>
								<label>Nombre<input type="text"></label>
									<label>Nombre     <input v-model="" type="text" required></label>
									<label>Apellido   <input v-model="" type="text" required></label>
									<label>Correo Institucional<input  v-model="" type="text" required></label>
									<label >Contrasenia	<input v-model="" type="text" required></label>
								<div class="academico">
									<h1>Datos Académicos</h1>
									 <label >Num. Cta</label>
									 <input type="text"  v-model="">
									 <label >Areá Académica</label>
									 <input type="text" v-model="">
									 <label >Rol:
										<select >
										 	<option value="alumno"></option>
										 	<option value="profesor"></option>
										</select>
									</label>
								</div>
								<div class="botones">
									<button type="button" @click="action='edit'" :disabled="loading">Editar Perfil</button>
									<button type="button" @click="action='delete'" :disabled="loading">Eliminar Perfil</button>

									<input type="submit" style="display: none;">
								</div>
					</form> -->

				<div  v-if="tipoRegistro==='facebook'" class="panel panel-facebook">
						<h3>Registro de Facebook</h3>
						<p class="classs-helper">Utiliza Facebook para autenticar y posterior completa y Edita tú Perfil anges de guardar</p>

						<div class="fb-actions">
							<button type="button" @click="onFacebookSignIn">Iniciar Sesión con Facebook</button>
							<button type="button" @click="onFetchProfile('facebook')">Cargar Perfil Facebook</button>
						</div>

						<form v-if="socialUser" @submit.prevent="onSubmitSocial('facebook')" class="social-form">
							<label >
							  Nombre
							   <input type="text">
						     </label>
							<label >
							  Apellido
							 <input type="text">
							</label>
							<label >
							  Correo
							   <input type="text">
						     </label>

						     <label >Rol:
								<select v-model="">
								 	<option v-model="socialProfile.role">Alumno</option>
								 	<option value="profesor">Profesor</option>
								</select>
							</label>

							<div class="botones">
								<button type="button" :disabled="loading">Guardar Perfil</button>
								<button type="button" @click="clearSocial('facebook')">cancelar</button>
							</div>
						</form>
				</div>

				<div  v-if="tipoRegistro==='google'" class="panel panel-google">
						<h3>Registro de Google</h3>
						<p class="classs-helper">Usa Google para autenticar y posterior completa o Edita tú Perfil, antes de Guardar.</p>

						<div class="fb-actions">
							<button type="button" @click="onGoogleSignIn" disabled="loading">Iniciar Sesión</button>
							<button type="button" @click="onFetchProfile('google')">Cargar Perfil</button>
						</div>

						<form v-if="socialUser" @submit.prevent="onSubmitSocial('google')" class="social-form">
							<label>
								Nombre
							   <input v-model="" type="text">
							</label>
							<label>
								Apellido
							   <input v-model="" type="text">
							</label>
							   Correo
							  <input  v-model="" type="text">
							<label >Rol:
								<select v-model="">
								 	<option value="alumno"></option>
								 	<option value="profesor"></option>
								</select>
							</label>
								<div class="botones">
									<button type="submit" :disabled="loading">Guardar Perfil</button>
									<button type="button" @click="clearSocial('google')" :disabled="loading">Cancelar</button>
							    </div>
						</form>
				</div>
				<!-- Instrucción si no hay seleccion -->
				<div  v-else class="panel panel-empty">
					<p>Selecciona un tipo de Registro para comenzar.</p>
				</div>
		    </section>
		</transition>
				<!-- <div  v-if="tipoRegistro==='facebook'" class="panel panel-facebook">
				 </div> -->s
    </div><!--end_contain -->
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted} from 'vue';
	import { useAuthStore } from '@/stores/authStore.ts';
	import { useProfileStore } from '@/stores/profileStore.ts';
	import {onFetchSocialProfile, clearSocial} from '@/composable/fetchSocialProfile';
	  import {composableProfileStudent} from '@/composable/composableProfileStudent.js';

	/*Instanciar stores*/
	 const authStore =  useAuthStore();
	 export const  profileStore =  useProfileStore();

	 /*Estado local de vars*/
	 const tipoRegistro = ref<string>('');
	 export const loading = ref<boolean>(false);
	 export const error = ref<string| null>(null);
	 export const message = ref<string| null>(null);

	 // Declaracion de Formularios
	const tradicional = reactive({
	 	nombre:   '',
	 	apellido:'',
	 	email:'',
	 	password:'',
	 	numCuenta: '' ,
	 	area: '',
	 	role: 'alumno',
	});	

	 /* Datos que provienen de Redes Sociales */
	 export const socialUser = ref<any | null>(null);
	  export const socialProfile = reactive({
	 	  name: '',
	 	  apellido:'',
	 	  email:'',
	 	  role: 'alumno',
	  });

		 /*Definicion trasladad de Algoritos a Codigo*/
	  function seleccionarRegistro(tipo: string){
	  	error.value = null;
	  	message.value = null;
	  	tipoRegistro.value = tipo

	  	// Resetear datos sociales cuando cambia el panel
	  	 socialProfile.value = null;
	  	 socialProfile.name = '';
	  	 socialProfile.apellido = '';
	  	 socialProfile.email = '';
	  }

	  /*---------------- Registro: Tradicional mediante email y password ----------------*/

	  async function onSumbitTradicional(){
	  	error.value = null;
	  	message.value = null;
        	  	if (!tradicional.email || !tradicional.password || !tradicional.nombre){
        	  	      error.value = 'Completa todos los campos requeridos(nombre, correo y contraseña).';
        	  	       return;
        	  	}
        	loading.value = true;

        	try{
    	  		// 1) Registrar el usuario en auth(store manip. la logica real)
    	  		  const user =  authStore.credencialesDeSession(tradicional.email,tradicional.password);
        
        	  		  // 1.1) si no fue posible acceder se intenta con Login Tradicional (a comentar)
        	  		  const createdUser =  user ?? authStore.login?.(tradicional.email,tradicional.password);
        
    	  		 if(!createdUser || !createdUser.uid && !createdUser.id){
    	  		 	throw new Error('Error no se obtuvo el identificador del registro');
    	  		 }
        
        	  		 // 2) Preparar el perfil para guardar (estructura del profile)
  
    	  		 const uuid = createdUser.uid ?? createdUser.id ?? createdUser.email;
    	  		  const perfilR2 = {
    	  		  	name: tradicional.name,
    	  		  	apellido	:tradicional.apellido,
    	  		  	email	:tradicional.email,
    	  		  	numCuenta: tradicional.numCuenta,
    	  		  	area: tradicional.area
    	  		  } as any;
    
    	  		  // 3) Invocar al metodo del store para guardar el perfil en Firestoe
    	  		   	profileStore.whyProfileToSave(uid,perfilR2);
        
        	  		 message.value = 'Registro completado y perfil guardado correctamente.';
        
    	  		   	/*Limpiar el formulario tradicional*/
    	  		   	resetTraditionalForm();
        	}catch(err: any){
        		console.error('Vista Registro:', err);
        		error.value = err?.message ?? 'Error al registrar el usuario';
        	}finally{
        		loading.value = false;
        	}
	  }

	  function resetTraditionalForm(){
	  	tradicional.nombre = '';
	  	tradicional.apellido = '';
	  	tradicional.email = '';
	  	tradicional.password = '';
	  	tradicional.numCuenta = '';
	  	tradicional.area = '';
	  	tradicional.role = 'profesor';
	  }

	  /*---------------- Social: Red Social Facebook ----------------*/
	  async function onFacebookSignIn(){
	  		error.value = null;
	  	    message.value = null;
	  	    loading.value = true;

	  	   try{
	  	   	 const user = await authStore.selectedEmailOrFacebook?.();
	  	   	   if (!user) throw Error('No se obtuvo ningún usuario de Facebook');

	  	   	   socialUser.value = user;

	  	   	   /* Auto-mapeo(automapping) incial de socialProfile para edición inmediata */
	  	   	   socialProfile.name = user.displayName ?? user.name ?? '';
	  	   	   socialProfile.apellido = user.displayName ??  '';
	  	   	   socialProfile.email = user.email ??  '';

	  	   	   message.value = 'La sesion al Portal Web Educativo se inicio mediante Facebook. Edita la información que deseas y guarda el perfil';
	  	   }catch(err: any){
	  	   	 console.error('[Incio por Facebook/Portal Educativo]', err);
	  	   	  err.value = err?.message ?? 'Error al intentar acceder a tu cuenta de Estudiante med. Facebook';
	  	   }finally{
	  	   	loading.value = false;
	  	   }
	    }//# End de InicioDesesionFacebook

	    /**---------------- Inicio de Sesion: Por Gmail(Google) ----------------- */
	    function onGoogleSignIn(/*argument*/) {
	    	// cargar vals stores tal cual
	    	error.value = null;
	    	message.value = null;
	    	loading.value = null;

	    	try{
	    		const user = await authStore.selectedEmailOrFacebook?.();
	    		 if (!user) throw Error('No se obtuvo ningún usuario de Gmail');

	    		 socialUser.value = user;
	    		 socialProfile.name = user.displayName ?? user.name ?? '';

	    		 socialProfile.value = ''
	    		 socialProfile.name = user.displayName ?? user.name ?? '';
	    		 socialProfile.apellido = user.lastName ?? '';
	    		 socialProfile.email = user.email ?? '';

	    		  message.value = 'La sesion al Portal Web Educativo se inicio mediante Gmail. Edita la información que deseas y guarda el perfil';	
	    	}catch(err: any){
	    		console.error('[Incio de Sesion x Google]', err);
	  	   	  err.value = err?.message ?? 'Error en  auntenticacion al Portal por Google';
	    	}finally{
	    		loading.value = false;
	    	}
	    }//# End de InicioDesesionGoogle

	    const provedor: 'Facebook' ||  'google'
	    // Incializamos del composable (1)
	     onFetchSocialProfile(provedor);
	    // Incializamos del composable (2)
	     clearSocial();

	    /*---------------- Perfil: Inicio_Tradicional mediante formulario ----------------*/
				// Trasladar  al composable 
	     	// Metodo para manipular la edicion y manipulacion del Perfil de Profesor
	      composableProfileStudent();
	       // Previamente estaba el  codigo completo
			/*---------------- Perfil: Fin_Tradicional mediante formulario ----------------*/
	    onMounted(()=>{
	     	 tipoRegistro.value = 'tipo';
	    });
	     	/*El Codigo es muy extenso, se recomienda dividir en tres componentes por c/tipo de registro*/
	    // Funcion auxiliares

</script>

 <style scoped>

 	.auth_view_pnl{
 	  max-width: 920px;
 	   margin: 0 auto;
 	  padding: 1rem;
 	  font-family: 'Segoe-UI' Roboto, 'Helvetica Nue', Arial;
 	}

 	.selector-tipos{
 	  display: flex;
 	  gap: 0.5rem;
 	  margin-bottom: 1rem;
 	}

 	.selector-tipos button{
 		padding: 0.5rem 0.9rem;
 		border-radius: 8px;
 		border: 1px solid #ddd;
 		background: #fff;
 		cursor: pointer;
 		transition: background-color 0.3s ease, transform: 0.3s ease;
 	}

 	.selector-tipos button.active{
 		background: linear-gradient(90deg,#0366d6,#0a84ff);
 		color: white;
 		 border-color: rgba(0,0,0,0.08);
 	}

 	.panel_container{
 	   min-height: 240px;
 	}
 	
 	.panel{
 		padding: 1rem;
 		border-radius: 8px;
 		box-shadow: 0.6px 18px rgba(0, 0, 0, 0.06);
 	}

 	.panel_tradicional{
 		 background: #fbfbff; 
 		 border-left: 6px solid #5060ff;
 	}

 	.panel-facebook{
 		 background: #f6fbff; 
 		 border-left: 6px solid #1877f2;
 	}

 	.panel-google{
 		 background: #fff8f6; 
 		 border-left: 6px solid #db4437;
 	}

 	.panel-empty{
 		text-align: center;
 		color: #666;
 		padding: 2rem;
 	}

 	input[type="text"],
 	input[type="email"],
 	  select{
 	    padding: 0.45rem 0.45rem;
 	    border-radius: 6px;
 	    border: 8px solid #ddd;
 	  }

 	.botones{
     display: flex;
     flex-direction: column;
     gap: 6px;   /** ?? */
     margin-bottom: 0.6rem;
     font-size: 0.95rem;
 	}

 	.botones button{
 	 	padding: 0.5rem 0.9rem;
 	 	border-radius: 8px;
 	  cursor: pointer;
 	}

 	.status{
 		margin-top: 0.6rem;
 		padding: 0.4rem;
 		border-radius: 6px;
 	}

    .status.loading{ color: #0b5; }
    .status.error{ color: #b00; }
    .status.info{ color: #036; }

    .helper{
    	margin: 0.6rem;
    	 color: #444;
    }
      /** Animación entre Paneles **/
    .panel-fade-enter-from, .panel-fade-leave-active{
     	 transition: opacity: 240ms easae, transform 240ms ease;
    }

    .panel-fade-enter-from, .panel-fade-leave-to {	
      opacity: 0;
     	transform: translate(8px);
    }
 </style>