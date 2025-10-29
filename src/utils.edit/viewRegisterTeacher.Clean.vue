<!-- se remplazara en lugar del no_limpio, pues el codigo es refactorizado, anidir CSS(style) 
   uso composable -->
  <template>
  			<!-- Botones -->
  		<div class="selector-tipos">
  			<button  @click="tipoRegistro='tradicional' ">Registro Tradicional</button>	
  			<button  @click="tipoRegistro='facebook' ">Registro Tradicional</button>	
  			<button  @click="tipoRegistro='google' ">Registro Tradicional</button>	
  		</div>
  			<!-- Estados -->
 		<div class="status info" v-if="store_profile.message" >{{store_profile.message}}</div>
  		<div class="status error"  v-if="store_profile.error" >{{store_profile.error}}</div>
  		<div class="status loading" v-if="store_profile.loading" >Cargando...</div>

  		<!-- Tipos de Registro de cuenta -->
  		<section :key="tipoRegistro">
  			<!-- Registro Tradicional  [mediante composable]-->
	  		<form v-if="tipoRegistro === 'tradicional'" @submit.prevent="handleSumbit" class="panel panel_tradicional"> 
					     <h3>Registro Profesor</h3>
							<label>Nombre<input type="text"></label>
								<label>Nombre     <input v-model="tradicional.nombre" type="text" required></label>
								<label>Apellido   <input v-model="tradicional.apellido" type="text" required></label>
								<label>Correo Institucional<input  v-model="tradicional.email" type="text" required></label>
								<label >Contrasenia	<input v-model="tradicional.password" type="text" required></label>
						<div class="academico">
							<h1>Datos Académicos</h1>
							 <label >Num. Cta</label>
							 <input type="text"  v-model="tradicional.numCuenta">
							 <label >Areá Académica</label>
							 <input type="text" v-model="tradicional.area">
							 <label >Rol:
								<select v-model="tradicional.role">
								 	<option value="alumno"></option>
								 	<option value="profesor"></option>
								</select>
							</label>
						</div>
							
						<button  :disabled="store_profile.loading">Registrar</button>
			</form>

			<!-- Registro de Facebook -->
			 <div  v-else-if="tipoRegistro === 'facebook'" class="register_2">
			  	<h3>Registro Profesor con Facebook</h3>
			  	<button  @click="store_profile.signInWithFacebook">Facebook</button>
			  	<button  @click="store_profile.clearSocial">Cancelar</button>
			 </div>

			<!-- Registro de Gmail -->
			<div  v-else-if="tipoRegistro === 'google' " class="register_3">
			  	  <h3>Registro Profesor con Gmail</h3>
			  		<button  @click="store_profile.signInWithGoogle">Google</button>
			  		<button  @click="store_profile.clearSocial">Cancelar</button>

			</div>
  		</section>
  		<!-- Despliegue del Perfil -->
  		<section v-if="store_profile.profile" class="profile_teacher">
			  	  <!-- Penel: Perfil Tradicional - [Teacher] -->
  			<form v-if="" @submit="handleSumbit" class="panel profile_traditional"> 
					     <h3>Perfil Del Profesor</h3>
							<label>Nombre<input v-model="store_profile.profile.nombre" type="text"></label>
								<label>Apellido     <input v-model="store_profile.profile.apellido" type="text" required></label>
								<label>Correo Institucional   <input v-model="store_profile.profile.email" type="text" required></label>
								<label>Contrasña	<input  v-model="store_profile.profile.password" type="text" required></label>
						<div class="academico">
							<h1>Datos Académicos</h1>
							 <label >Num. Cta</label>
							 <input type="text"  v-model="store_profile.profile.numCuenta">
							 <label >Areá Académica</label>
							 <input type="text" v-model="store_profile.profile.area">
							 <label >Rol:
								<select v-model="store_profile.profile.role">
								 	<option value="alumno"></option>
								 	<option value="profesor"></option>
								</select>
							</label>
						</div>
							
					<!-- Botones de Acciones -->
			    <button type="button" @click="composableProfileStudent.deleteProfile">Eliminar</button>
			    <button type="button" @click="composableProfileStudent.EditarAlumno">Editar</button>
			   <button  @click="store_profile.clearSocial">Cancelar</button>
 			    	<!-- Controladora de acciones del perfil del Usuario -->
			     <input type="submit" style="display: none;">
			</form>
  		</section>

  		<!-- <div v-else>
    	   <-- El contenido se muestra directamente tras la carga -
    	  <ProfileForm v-if="profileStore.profile" :data="profileStore.profile" />
  	   </div>-->  
   </template>

 <script setup lang="ts"> 
  	import { reactive, watchEffect,onMounted} from 'vue';
  	import { useAuthStore } from '@/stores/authStore.ts';
  	 // import {composableProfileStudent} from '@/composable/composableProfileStudent.js'; [def en composable]
  	   import { useProfileStore } from '@/stores/profileStore.ts'; //

	        const tipoRegistro = ref<'tradicional'| 'facebook'| 'google' >('tradicional');
	       const {handleSumbit,EditarAlumno,deleteProfile} = composableProfileStudent();
		const      authStore =  useAuthStore();
		const store_perfilId = useProfileStore();

		const tradicional = reactive({
		 	nombre:   '',
		 	apellido:'',
		 	email:'',
		 	password:'',
		 	numCuenta: '' ,
		 	area: '',
		 	role: 'alumno',
		});	

		const socialProfile = reactive({
	 	  name: '',
	 	  apellido:'',
	 	  email:'',
	 	  role: 'alumno',
	   });

		const socialUser = ref<any | null>(null);

		watchEffect(async ()=> {
			 const currentUser = authStore.user;

			if (currentUser?.uid) {
				// Obtenemos el proveedor desde providerData
				const providerId = currentUser.providerData?.[0].providerId;

		
			  	 let perfilR2 = {};

			  	if (tradicional.value.email && socialUser.value) {
			  		if (providerId === 'facebook.com'){
				  	 	 perfilR2 = {
				  	 	 	name: tradicional.value.name,
				  	 	 	apellido: tradicional.apellido,
				  	 	 	email: tradicional.value.email,
				  	 	 	numCuenta: tradicional.value.num_cuenta,
				  	 	 	area: tradicional.value.area
				  	 	 };
						console.log('El Usuario fue autenticado con: Facebook ');
			  		}
			  	}
			  	 else if (socialUser.value) {
					if (providerId === 'google.com'){
					  	 	perfilR2 = {
					  	 		name: socialProfile.value.name,
					  	 		apellido: socialProfile.value.apellido,
					  	 		email:socialProfile.value.email
					  	 	};
						console.log('El Usuario fue autenticado con: Google ');
					}
			  	}

			  	try{
			  		 await store_profile.saveProfile(currentUser.uid,perfilR2);
			  		 console.log('El perfil actualizado y actualizado correctamente');

			  		  await store_profile.fetchProfiles(providerId.uid)
			  		  console.log('El perfil cargado correctamente desde Firestores');
			  	}catch(err){
			  		console.log('Error al cargar el perfil o cargarlo',err);
			  	}
			}
		});

		onMounted(async()=>{
			// Inicializa por defecto
			composableProfileStudent.EditarAlumno();
			if (currentUser?.uid) {
				await store_profile.fetchProfiles(providerId.uid);
			}
		});
  	        // const  profileStore =  usestore_profile();
 </script>