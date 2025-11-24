<template>
	<div class="vista-welcome_profesores">
		<WelcomeUsers  v-if="profesor" :role="'profesor'"/>

	</div>
</template>
 <script setup lang="ts">
 	/*Realizado el 08 de Octubre del 2025*/
 	import {ref, onMounted} from 'vue';
 	import {ProfileStudentService} from '@/services/ProfileStudentServ.ts';
 	import {searchValidations} from '@/utils/validations.origin/validationsSearch.js';
 	import WelcomeUsers from '@/components/WelcomeUsers.vue'; //# Cualquiera de los 2 Roles

 	const email  = ref('')
 	const password =  ref('');
 	const profesor = ref(false);
 	
 	const component_bienvenida = ref<InstanceOf<typeof WelcomeUsers> | null>(null);

 	async function animarBienvenidaRole(email: string, password: string, role: 'profesor'){
 		try{
 				const cargar_perfil2 = await ProfileStudentService.loadUserProfile(email,password,role);

 			if (cargar_perfil2 && cargar_perfil2.value === 'profesor' ) {
 				profesor.value = true;
 			}
 		}catch(error){
 			console.error('No fue posible animar la sesion de Profesor', error)
 		}
 	}

 	onMounted(async()=>{
 		// Cargar la animacion del perfil que correp
 		animarBienvenidaRole(email,password,'profesor');

 		if (component_bienvenida.value) {
 		  component_bienvenida.seeWelcomeTextRole(email,passwd,'profesor');
 		}
 	});

 </script>