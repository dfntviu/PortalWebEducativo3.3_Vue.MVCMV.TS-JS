<!-- Dar la Bienvenida a los Alumnos en forma animada utilizando 
  animaciones intermedias de CSS, esta informacion es obtenida de la Firestore 
  del Back. -->
<template>
	<div class="welcome-container">
		<div class="fade-slide">
			<div v-if="profile && profile.name && profile.apellido" class="welcome-message">
			  <h2 class="welcome-title">Bienvenido:{{profile.name}} - {{profile.apellido}} </h2>
		        <p class="carrer-text role-text">{profile.role} - {{profile.carrera}} </p>
		</div>
	</div>
</template>

	  <!-- // Es el Metodo-Animado-2 ya con Bak-End NoSQL incluido -->
<script setup lang="ts">
	/* El Componente es depurado el día: 08 de Octubre del 2025 */
	import { ref, onMounted} from 'vue';
	import { ProfileStudentService } from '@/services/ProfileStudentServ.ts';

		const profile1 = ref({
			name = '';
			apellido = '';
			carrera = '';  
	        role = 'alumno' as 'alumno' | 'profesor'; // profesor es predeterminado
		});
		// Definicion de las props del componente hijo
		const props = defineProps({
			role: {
				type: String,
				requried: true,
			},
		});

	    async function seeWelcomeTextRole(email: string, password: string, role: 'alumno' | 'profesor'){
	   	    try{
	   	    	   	 /* Se consume el servicio para  carga el Perfil del Estudiante*/		
	   	    	  const loaded_profile =  ProfileStudentService.loadUserProfile(email,password,role);
	   	    	
	   	    	// Asignar los valores del perfil cargado al objeto profile1
	   		profile1.value = {profile.role;
	   		    	   	 name = loaded_profile.name || '',
	   		    	     apellido = loaded_profile.apellido || '' ,
	   		    	   	  carrera = loaded_profile.carrera || '',
	   		    	   	   role: loaded_profile || 'alumno'  // sino encontro el role predefinido
	   		    	   	}
					
	   	    	   		console.log(`Bienvenido ${profile1.value.name}, con El Rol: ${profile1.value.role}`);
	   	    }catch(error){
	   	   	   console.log('Error al cargar la animación de Texto de Bienvenida',error);
	   	    }
	    }

	    onMounted(()=>{
	   	  seeWelcomeTextRole('correo@ejemplo.com','54321', props.role );
	    });

</script>

<style scoped>
    /** UserExperience->UX **/
  .welcome-container{
 	@apply flex items-center justify-center h-screen w-full;

 	 background: linear-gradient(
 	  	135deg,
 	  	#ffd700/*Color doraddo*/
 	  	#0057b7  /*azul rey*/
 	  	#ffffff /*blanco*/ 
 	 );

 	 background: 400%  400%;
 	 animation: gradientShif 8s ease-in-out forwards;
  }

 @keyframes gradientShif {
 	0% {background-position: left;}
 	50% {background-position: center;}
 	100% {background:#ffffff }
 }

 .welcome-message{
	text-align: center;
	animation: fadeInUp 2s ease forwards;
 }

 .welcome-title{
   	  font-size: 2.5rem;
     font-weight: bold;
    color: gold;
    -web-text-stoke: 1px black;
    margin-bottom:0.5rem;
 }

 /*animacion simular luz*/
 .highlight {
 	color:0057b7;
 	color: #333;
 	 opacity: 0.9; /*muestra leve salida d cambio de color*/
 }
 /*carrera que estudia el alumno en gris obscuro*/
 .carrer-text{
 	font-size: 1.25rem; /*1rem === 10px*/
 	color: #333; /** (gris semi-obs) variar color uaemex */
 	opacity: 0.9s;
 }
 /*nombre del alumno en semigris*/
 .role-text{
 	font-size: 1.25rem; /*1rem === 10px*/
 	color: #222; /** gris obscuro */
 	opacity: 0.9s;
 }


 @keyframes fadeInUp {
 	from { opacity: 0; transform: translateX(30px); }
 	to {opacity: 1; transform: translate(0px);}
 }

 /*transiciones entre contenedores internos*/
   /*Activacion de los barridos de las transiciones*/
   .fade-slide-enter-active,
   .fade-slide-leave-active{
   	  transition:  all 1s ease;
   }
      /*Moviento Destino*/
  .fade-slide-enter-from{
  	opacity: 0;
  	transform: translateY(20px);
  }
  /*Moviento Origen*/
  .fade-slide-leave-to{
  	opacity: 0;
  	transform: translateY(-20px);
  }
</style>