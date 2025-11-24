<template>
	<!-- Edición del Perfil de Usuario: Alumno -->
	<section class="edicion refresh" :class="{activo: modoVista==='edicion'}">
		<h2 class="b-b-examp1">Edición del Perfil</h2>
		<form @submit.prevent="handleSumbit"> <!-- error 1-->
			<input type="text" placeholder="Esc. tú nuevo Nombre"  v-model="form_edit.name">
			<input type="text" placeholder="Esc. tú nuevo Apellido" v-model="form_edit.lname">
			<label>Elige tú Carrera</label>
			<select  v-model="form_edit.carrera">
				<option value="">ICO</option>
				<option value="">IME</option>
				<option value="">ICI</option>
				<option value="">IEL</option>
				<option value="">IIA</option> <!--Cambiar-->
				<option value="">ISES</option>
			</select>
			<input type="text" placeholder="Cambia la Materia" v-model="form_edit.subject">
			  <!-- <input type="text" placeholder=" Esc. Nueva  Fecha de Registro"> -->
			<input type="text" placeholder="Esc. Nueva Edad" v-model="form_edit.age">
			  <!-- Botónes de Accion -->
			<button type="button" @click="action= 'edit'">Editar</button>
			<button type="button" @click="action= 'delete'">Eliminar</button>

				   <!-- Se aniadio hidden input para manejar el submit -->
			 <input type="submit" style="display: none;">
			 <!-- En action se guarda la accion a ejecutarse -->
			   <!-- Botones de Acciones -->
		    <button type="button" @click="action= 'delete'">Eliminar</button>
		    <button type="button" @click="action= 'edit'">Editar</button>
		    	<!-- Controladora de acciones del perfil del Usuario -->
		    <input type="submit" style="display: none;">
		</form>
	</section>
</template>

<script setup lang="ts">
   // me costo mucho, para evitar problemas todo las entradas en el component, solo lo que conlleve un proceso de carga aqui, lo que sea secuencial en el composable
	 import { useProfileStore } from '@/stores/profileStore.optimized.ts'; 
	import {ref, onMounted} from 'vue';
	 import type {User} from '@/types/interf.index.ts';
	 import {composableProfileStudent} from '@/composable/composableProfile.js';
      
      
      const store_profile = useProfileStore();
	    const       usuario = ref<User | null >(null);

	//here generate with error of  'Uncaught Error: [🍍]: "getActivePinia()".was called but there was no active Pinia'
       // const   usuario = ref<User | null >(null);

	 // Metodo para manipular la edicion y manipulacion del Perfil de Profesor
	 const {handleSumbit,form_edit} = composableProfileStudent();
	const handleDelete = async () => {
		if (usuario.value) {
		   await handleSubmit();  // Llamamos al handleSubmit del composable
 	    } else {
		 alert('No hay usuario para eliminar');
 	    }
	};

	onMounted(async()=>{
       await handleDelete();
	})
</script>