<template>
	<div class="moderate_panel">
		<!-- Integracion de los comentarios -->
		<ComentariosActuales/>
	    <ComentariosDestacados/>
	</div>
</template>

<script setup lang="ts">
	import {ref, computed} from 'vue';
	import {useModerationStore} from '@/stores/moderateStore.ts';

	/*minilibrria de componentes Base*/
  import {ComentariosActuales}  from '@/components/ComentariosActuales.vue';
  import {ComentariosDestacados} from '@/components/ComentariosDestacados.vue'; 
  // import {materialValidationsNotify} from '@/utils/validations.origin/validationsModerationNotifications.ts';
	   import type {Material} from '@/types/interf.index.ts';

	 const store_moderate =  useModerationStore();
	 const modoModeration = ref("all_mats");
	 /*A corregir y entender la relacion que juega desde la 19*/
	 // en donde se ocupa?
	const form_send = ref({
	 	uid_alumno: '',
	 	lname: '',
	 	titulo: '',
	 	contenido: '',
	 	fecha_actual: '',
	 	uid_material: ''
	});
	 	// ? que se hace con las variables
	 const tipo_respuesta = ref();
	 const alls = ref([]);

	 /*Metodo  para el listado de lo materiales desaprobados(rechazados) */

	 
</script>