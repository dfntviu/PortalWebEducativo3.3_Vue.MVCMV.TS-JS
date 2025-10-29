<template>
	<div class="vista-welcome_profesores">
		<WelcomeUsers  v-if="profesor" :role="'profesor'"/>

	</div>
</template>
 <script setup lang="ts">
 	/*Realizado el 08 de Octubre del 2025*/
 	import {ref, onMounted} from 'vue';
 	import {searchValidations} from '@/utils/validations.origin/validationsSearch.js';
 	import {WelcomeUsers} from '@/components/WelcomeUsers.vue'; 

 	const email  = 'correo@profesor.instituto.mx'
 	const passwd =  '654321';

 	const profesor = ref(false);

 	onMounted(()=>{
 		seeWelcomeTextRole(email,passwd,'profesor');
 	});

 	async function animarBienvenidaRole(email: string, password: string, role: 'profesor'){
 		try{
 				const cargar_perfil2 = ProfileStudentService.loadUserProfile(email,passwd,role);

 			if (cargar_perfil2 && cargar_perfil2.value === 'profesor' ) {
 				profesor.value = true;
 			}
 		}catch(error){
 			console.error('No fue posible animar la sesion de Profesor', error)
 		}
 	}


 </script>