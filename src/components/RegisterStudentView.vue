<template>
	 <h2 class="b-b-examp1">Registro de Estudiantes</h2>
	 
	 <button @click="mostrarRegistro">Registro Alumno</button>

	    <section class="registro" :class="{activo: modoVista === 'registro' } ">
			<form @submit.prevent="registrarAlumno">  <!-- error 1-->
				<input type="text" placeholder="Escribe tú Nombre"   v-model="form_send.name"> <!-- error2-->
				<input type="text" placeholder="Escribe tú Apellido" v-model="form_send.lname">  <!-- error2-->
				<label for="carrera">Elige tú Carrera</label>
				<select  v-model="form_send.carrera" >
					<option value="">ICO</option>
					<option value="">IME</option>
					<option value="">ICI</option>
					<option value="">IEL</option>
					<option value="">IIA</option> <!--nueva-->
					<option value="">ISES</option>
				</select>
				<input type="text" placeholder="Escribe tú Materia"  v-model="form_send.materia"> <!-- error2-->
				<input type="date" placeholder="Selecciona Fecha de Registro" v-model="datosPerfil.fechaDeRegistro"> <!-- error2-->
				<input type="number" placeholder="Digita tú Edad" v-model="datosPerfil.age"> <!-- error2-->

				<!-- Lo omiti, enviar informacion al Store(estado) -->
				<button type="submit">Registrar</button>
				<button type="button" @click="actualizacionAlumno">Actualizar</button>
			</form>
		</section>
</template>

<script setup lang="ts">
	import {  ref, computed} from 'vue';
	import { useProfileStore } from '@/stores/profileStore.rules.arch.ts';
	import type { MaterialRenovado, User  } from '@/types/interf.index.ts';

	const store = useProfileStore();
	const usuario = ref<User | null >(null);

	// Formulario de Registro
		const form_send =computed(() =>{
		      nombre : name.value;
		    apellido : lname.value;
		     carrera : carrera.value; // 
		       curso : materia.value;
		        edad : age.value;
		//  fechaDeRegistro : fecha.value.date  	     
	    });
	      // Datos Estructurados que recibe el Store
		const datosPerfil = computed(()=>({
			nombre: form_send.value.name,
			apellido: form_send.value.lname,
			carrera: form_send.value.carrera,
			curso: form_send.value.subject,
			edad: form_send.value.age,
			fechaDeRegistro: form_send.value.date
		}));
	
	async function registrarAlumno(){
		if (!usuario.value) return;
		   await store.whyProfileToSave(usuario.value,datosPerfil.value);  //error 5.1
		 alert('El registro del Alumno ha terminado correctamente');
	}	

	const actualizacionAlumno = async()=> {
		if (!form_edit.value) {
		  	 console.error('El Objeto de edición del Alumno no existe');
		}else{
		  	  await store.updateStudentProfile(usuario.value, MaterialRenovado);
		}
	}
	// Todo se sumariza a que la lógica del componente actual. Si es posible refactorizarse aun mas
	//  utilizando le tecnica de composable. Las 38 Lineas del componente actuales son reducidas 
	// significativamente a 4 lineas
  
</script>

<style>
	 /* Botones del formulario */
	form button[type="submit"] {
	  background-color: #198754; /* Bootstrap success */
	  color: white;
	  border: none;
	  padding: 0.6rem;
	  border-radius: 5px;
	  font-weight: bold;
	  transition: background-color 0.3s;
	}

	form button[type="submit"]:hover {
	  background-color: #157347;
	}

	form{
	 	display: flex;
	 	flex-direction: column;
	 	gap: 1rem;
	 }

	 /*Entradas y Selector*/
	form input,
	form select {
	 	padding: 0.6rem;
	 	font-size:  1rem;
	 	border-radius: 5px;
	 	border: 1px solid #ced4da;
	 	width: 100%;  /** la magica **/
	}
	/*section {  
	 	background-color: #f8f9fa;
	 	border-radius: 8px;
	 	padding: 2rem;
	 	width: 100%;
  		max-width: 600px;
  		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}*/
</style>