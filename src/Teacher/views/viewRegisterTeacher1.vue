<template>
	<div class="auth_view_pnl register_view">
		<h2>Registro de Usuario</h2>
		
		<div class="selector-tipos">
			<buttton @click="tipoRegistro='tradicional'">Reg. Tradicional</buttton>
			<buttton @click="tipoRegistro='facebook'">Facebook</buttton>
			<buttton @click="tipoRegistro='google	'">Google</buttton>
		</div>

		<section :key="tipoRegistro" class="panel_container">
			<!-- Rg. Tradicional -->
			<form  v-if="tipoRegistro === 'tradicional'" @submit.prevent="onSumbitTraditional" class="panel panel_tradicion">
			 <h3>Registro del Profesor</h3>
			   <input 	v-model="tradicional.name"	 placeholder="Escriba su Nombre"   required>
			   <input 	v-model="tradicional.lname"	 placeholder="Escriba su Apellido"  required> 
			   <input 	v-model="tradicional.email"	type="email" placeholder="Escriba su Correo institucional" required>
			   <input 	v-model="tradicional.password"	type="password" placeholder="Escriba su Contraseña"required >
				<div class="academico">
					<input v-model="tradicional.numCuenta" placeholder="Esc. su Numero de Cuenta" type="text">
					<input v-model="tradicional.area"  placeholder="Esc. El Área académica " type="text">
					<select  v-model="tradicional.role">
						<option value="alumno">Alumno</option>
						<option value="profesor">Profesor</option>
					</select>
				</div>
				 <button :disabled="store_profile.loading">Registrar</button>
			</form>

			<!-- Facebook -->
			<div  v-else-if="tipoRegistro === 'facebook'" class="register_2">
				<h3>Registro Profesor - Facebook</h3>
				  <button @click="store_profile.signInWithFacebook" :disabled="store_profile.loading">Iniciar con Facebook</button>
				  <button @click="store_profile.clearSocial">Cancelar</button>
			</div>

				<!-- Google -->
			<div  v-else-if="tipoRegistro === 'google'" class="register_3">
				<h3>Registro Profesor - Gmail</h3>
				  <button @click="store_profile.signInWithGoogle" :disabled="store_profile.loading">Iniciar con Google</button>
				  <button @click="store_profile.clearSocial">Cancelar</button>
			</div>
		</section>
		
		<section  v-if="store_profile.profile" class="profile_teacher">
			<form @sumbit.prevent="onSubmitProfile" class="panel_edicion">
				<h3>Perfil del Profesor</h3>
				<input v-model="localProfile.name" type="text"  placeholder="Nuevo Nombre">
				<input v-model="localProfile.lname" type="text" placeholder="Nuevo Apellido" >
				<input v-model="localProfile.email" type="email" placeholder="Nuevo Correo institucional" >
				<div class="academico">
					<input v-model="localProfile.numCuenta" type="text">
					<input v-model="localProfile.area" type="text">
					<select v-model="localProfile.role" >
						<option value="alumno"></option>
						<option value="profesor"></option>
					</select>
				</div>

				<div class="botones">
					<button type="buttton" @click="onDeleteProfile">Eliminar</button>
					<button type="buttton" @click="onEditProfile">Editar</button>
					<button type="buttton" @click="store_profile.clearSocial">Cerrar</button>
				</div>
			</form>
		</section>
<!-- <transition name='fade'>
			
		 </transition> -->
	</div>
</template>

<script setup lang="ts">
	import	{ref,reactive, watchEffect, onMounted} from 'vue';
	import	{useRouter} from 'vue-router';
	import { useAuthStore   } from '@/stores/authStore.ts';
  import { useProfileStore} from '@/stores/profileStore.optimized.ts'; 
  // import {validacionesProfesores} from '@utils/validacions.origin/validationsFirestoreForm.js';
  // import {validacionesPerfilAlumno} from '@/utils/notifications.origin/validacionsProfileAlumno.js';

  // definiton of Stores
  const     authStore = useAuthStore();
  const store_profile = useProfileStore();
  
  const router = useRouter();
  /*UI State*/
  const tipoRegistro = ref<'tradicional'| 'facebook'|  'google'>('tradicional');

  const tradicional = reactive({
  	name: '',
  	lname: '',
  	email: '',
  	password: '',
  	numCuenta: '',
  	area: '',
  	role: 'profesor' as 'profesor' | 'alumno',
  });

  // local identico a la declaracion de atributos de la firestore
  const localProfile = reactive({
	  name: '',
	  apellido: '',
	  email: '',
	  numCuenta: '',
	  area: '',
	  role: 'profesor' | 'alumno' | ('profesor')   // god > role: 'example1' as Role / bad > 'profesor' as 'alum'
  });
	// Sincroniza localProfile con store_profile cuando cambie
  	watchEffect(() => {		 
  	 const p = useProfileStore.profile; 			

	  	if (p) {
	  	 	localProfile.name = (p as any).name ?? (p as any).nombre ?? '';
	  	 	localProfile.apellido = (p as any).apellido ?? (p as any).lastName ?? '';
	  	 	localProfile.email = (p as any).email ?? '';
	  	 	localProfile.numCuenta = (p as any).numCuenta ?? '';
	  	 	localProfile.area = (p as any).area ?? '';
	  	 	localProfile.role = (p as any).role ?? 'profesor';
	  	}
  	});

  	// --------------------------------Cycle de V:WEffect se dispara automaticamente sin botón visible-------------------------------------
  	  // ## Observa authStore.user y store_profile.socialUser, cuando user.uid intenta guardar el perfil ##
  	 let autoSaving = false;   //bandera, p/evitar reentradas

  	watchEffect(async ()=>{
  	 	const currentUser = authStore.user;

  	 	if (!currentUser?.uid) return;
  	 	if (store_profile.typeUser?.uid ===currentUser.uid) return;
  	 	 // si ya hay profile con store y coincide, no duplicar
  	 	if (autoSaving || store_profile.loading) return;

  	 	autoSaving = true;

  	 	try{
  	 		// si viene de login social (store_profile.socialUser) se iniciara dicho provider
  	 		const providerData = currentUser.providerData?.[0]?.providerId ?? null;
  	 		    const provider = providerData === 'google.com' ? 'gmail' : providerData === 'facebook.com' ? 'facebook' : 'tradicional';

  	 		 // Obtener el payload desde local o el formulario, o bien socialProfile
  	 		 let payload: any = {};

  	 		 if (provider === 'facebook') {
  	 		      payload = store_profile.socialProfile ?? {name: currentUser.displayName ?? '', email: currentUser.email ?? ''};
  	 		 } else if(provider === 'gmail'){
  	 		 	payload = store_profile.socialProfile ?? {name: currentUser.displayName ?? '', email: currentUser.email ?? ''};
  	 		 } else {
  	 		 	// Si es el reg. tradicional se intenta usar los campos del formulario
  	 		 	payload = {
  	 		 		nombre: tradicional.nombre || currentUser.displayName || '',
  				   apellido: tradicional.apellido || '',
  				   email: tradicional.apellido || '',
  				   numCuenta: tradicional.numCuenta||'',
  				   area: tradicional.area || '',
  				   role: tradicional.role || 'profesor',
  	 		 	};
  	 		}
  	 		// Llamada unica silenciosa al store
  	 			await store_profile.saveProfile(provider as any, currentUser.uid, payload);
  	 			// forzar carga del perfil guardado
  	 			await store_profile.fetchProfiles(currentUser.uid);

  	 	}catch(err){
  	 		console.log('Error en el autoguardado: ',err);
  	 	}finally{
  	 		autoSaving = false;
  	 	}
  	});

  	 // --------------------------------Manejador para UI(delega al store) -------------------------------------
  	async function onSumbitTraditional() {
  		console.log('[Vista] Cargando registro del profesor en  la Firestore');
  	 	// Validaciones minimas
  	 	if (!tradicional.name || !tradicional.email || !tradicional.password) {
  	 		store_profile.error = 'Completa el nombre, correo y contraseña';
  	 		 return;
  	 	}

  	 	if (!tradicional.role){ 
		  store_profile.error = 'Selecciona un rol';
		   return;
		}

  	 	try{  
  	 		console.log('Logic del Negocio..');
  	 		 // Recibimos el Objeto completo al Store
  	 		/*const created = */ await store_profile.registerTradicional(tradicional);
  	 		   console.log('[Vista] Registro Exitoso, Role Profesor.');
  	 		
  	 		const layout_route = tradicional.role === 'profesor' ? '/view-bienvenida-teachers' : '/bienvenida-students';
  	 			router.push(layout_route);
  	 		 //const     uid = created?.uuid;    #error_3

		/* if (!uid) throw new Error('Lo sentimos no se creo el usuario (uid):',uid, 'corresp al E-mail:',tradicional.email);

  	 		  await store_profile.saveProfile('tradicional', uid,{
  	 		  	nombre: tradicional.nombre,
				apellido: tradicional.apellido,
				email: tradicional.email,
				numCuenta: tradicional.numCuenta,
				area: tradicional.area,
				role: tradicional.role,
  	 		  });    // el antepenultimo y el penultimo del payload, el ultimo de la f(n)

  	 		  await store_profile.fetchProfiles(uid);	*/
  	 	}catch(err: any){
  	 		store_profile.error = err?.message || 'Error: En el registro desde Formulario';
  	 	}
  	}
  	 
  	async function onSubmitProfile() {
  	 	const uid = store_profile.typeUser?.uid; 
  	 	 if (!uid) return;

  	 		  const payload = {
				    name: localProfile.name,
				    apellido: localProfile.apellido,
				    email: localProfile.email,
				    numCuenta: localProfile.numCuenta,
				    area: localProfile.area,
				    role: localProfile.role,
 				  };

  	 	try{
  	 	 	await store_profile.editProfile(uid,{name:localProfile.name,apellido: localProfile.apellido, email:localProfile.email, numCuenta: localProfile.numCuenta, area: localProfile.area, role: localProfile.role});

  	 	 	await store_profile.fetchProfiles(uid);
  	 	 	store_profile.message = 'Se guardo y actulizo correctamente';
  	 	}catch(err){
  	 		store_profile.error = err?.message || 'Error al cargar el perfil';   //camb. '||' por '??'
  	 	}
  	}

  	async function onDeleteProfile() {
  		const uid = store_profile.typeUser?.uid;
  		if (!uid) return;

  	   try{
  	   	 await store_profile.deleteProfiles(uid);
  	   }catch(err){
  	   	  console.error('F(n) deleteProfile.Existe un error, trazando: ',err);
  	   }
  	}

  	async function onEditProfile() {
  	 	const uid = store_profile.typeUser?.uid; 
  	 	 if (!uid) return;

  	 	try{
  	 	 	const edicion = await store_profile.editProfile(uid,{name:localProfile.name,apellido: localProfile.apellido, email:localProfile.email, numCuenta: localProfile.numCuenta, area: localProfile.area, role: localProfile.role});
  	 	 	// return true;
  	 	}catch(err){
  	 	 	console.error('F(n) editProfile.Existe un error, trazando: ',err);
  	 	 	// return false;
  	 	}
  	}
  		
  		// Ciclo de vida de carga previa, automatica
  	onMounted(()=>{
  		// Si hay(existe) sesion persistente, cargar el perfil
  		const uid = authStore.user?.uid;
  		if (uid) {
  			store_profile.fetchProfiles(uid).catch((e)=> console.error(e));
  		}
  	});

</script>

<style scoped>
	.panel_container{ 
		transition: all .25s ease;
	}

	.panel{
		background: #fff;
		padding:  1rem;
		border-radius: 8px;
		box-shadow: 0 6px  rgba(0, 0, 0, 0.6);
	}

	.status.loading{
		color: #0a74da;
	}

	.status.error{
		color: #053030;
	}
	.status.info{
		color: #2d33748;
	}

	/*discreta, animacion de entrada*/
	.panel_container[role='tbpanel']{ transform-origin: top center; }

	.panel_container .panel{
		transition: transform .18s ease, opacity .18s ease;
	} 
	  /*.modo-registro{ background-color:#e3f2fd ; } .modo-perfil{  background-color: #e8f5e9; }*/
</style>