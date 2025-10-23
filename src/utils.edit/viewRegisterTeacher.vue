<template>

	 <div class="container_types_register">
	 	 <!-- Registro Social: Registra por Meta(FB)  -->
	 	<div class="session_register_facebook">
	 		<input type="text" placeholder="Esc. la contraseña actual">action</input>
	 		<input type="text" placeholder="Esc. la contraseña Nueva">action</input>

	 		<buuton type="input">Modificar</buuton>
	 	</div>

	 	     <!-- Registro Habitual: Formulario Tradicional -->
	 	  <div  v-if="facebook" class="session_register_traditional">
	 		   <h5>Categorías del Profesor</h5>
		 	 <div v-if="" class="card-regist-teacher">
		 	 	 <p><strong>Nombre:</strong></p>
		 	 	 <p><strong>Apellido Paterno:</strong></p>
		 	 	 <p><strong>Apellido Materno:</strong></p>
		 	 	 <p><strong>Dirección:</strong></p>
		 	 	 <p><strong>Teléfono:</strong></p>
		 	 	 <p><strong>Correo Institucional:</strong></p>
		 	 </div>
		 	 
		 	 <div>
		 	 	 <h2> sección académica</h2>
		 	 	 <p><strong>Núm. de Cta:</strong></p>
		 	 	 <p><strong>Grado:</strong></p>
		 	 	 <p><strong>Título Profesional:</strong></p>
		 	 	 <p><strong>Areá Académica:</strong></p>
		 	 </div>

		 	  <div>
		 	 	 <h1>sección de sesión</h1>
		 	 	  <h2>Datos de Sesión</h2>
		 	 	 <p><strong>Fecha de Ingreso:</strong></p>
		 	 	 <p><strong>Núm. de Aportaciones: </strong></p>
		 	 </div>

		 	 <div>
		 	 	 <h2>sección de trabajo</h2>
		 	 	 <p><strong>Núm. de Cta:</strong></p>
		 	 	 <p><strong>Fecha de Ingreso</strong></p>
		 	 	 <p><strong>Areá Académica:</strong></p>
		 	 	 <p><strong>Núm. de Materias</strong></p>
		 	 </div>

		 	 <div v-if="error" class="alert-warning">
		 	  {error}
		 	 </div>
		  </div>
		  	<!-- Registro Social: Registra por Google -->
		  <div v-if class="session_register_gmail">
		 		<input type="text" placeholder="Esc. la contraseña actual">action</input>
		 		<input type="text" placeholder="Esc. la contraseña Nueva">action</input>
		  </div>
	 </div>


		 <!-- <div class="session_register_traditional">
		 		<input type="text" placeholder="Esc. la contraseña actual">action</input>
		 		<input type="text" placeholder="Esc. la contraseña Nueva">action</input>
		  </div> -->
</template>

<script setup lang="ts">
	import {useProfileStore} from '@/stores/profileStore.ts';
	import {useAuthStore} from '@/stores/authStore.ts';
   
    /*Declaracion Stores*/
	const authStore    = useAuthStore();  
    const store_social = useProfileStore();

	/*1.  Validar que tipo de registro es:  */
	  // 1a. Registro mediante Google

      // 1b. Registro mediante Facebook

      // 1c. Registro Tradicional


	/*2. crear metodos de flecha para cada tipo de registro del paso 1*/

	

	/*3. Cargar funciones antes, de que Vue cargue el DOM de opciones de registro*/



	/*4. Animar de forma diferente mediante clases dinamicas cada tipo de Panel CSS: Disparar animacion
	segun corresponda el tipo d Registro*/
</script>
	 	 	 <!-- <p><strong>Genéro:</strong></p>
	 	 	 <p><strong>Institución de Egreso:</strong></p>
	 	 	 <p><strong>Formato de Trabajo</strong></p>
	 	 	 <p><strong>Formato de Trabajo:</strong></p> -->