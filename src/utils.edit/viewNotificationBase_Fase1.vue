<!-- SCRIPTS, QUE ESTAN EN CASE DE MEJORA CONSTANTE
  Código Base(Vta-Base): Invoca a los 2 componentes para
   obtener la funcionalidad total, se distribuyeron en 2 componentes
   con el proposito de organización, claridad pero sobre todo de division
   de responsabilidades por su criterio -->
<template>
	<div class="base-containter">
		<h2>Panel de Notificaciónes</h2>
		    <CategoriesNotification v-if="role === 'profesor'" class='categories-notifications'>
		  	<LectureNotifications v-else :notificaciones="allNotifications"  
		  	  @toogle-read="toggleRead" class="lecture-notifications" >
		  <!-- </div> -->
	</div>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
    import {  useNotificationStore } from '@/stores/useNotificationStore.ts';
    import { CategoriesNotifications } from '@/components/CategoriesNotifications.vue';
    import {    LectureNotifications } from '@/components/LectureNotifications.vue';

	const store_base = useNotificationStore();

	 // # Definir el rol dinamicamente
	const role = ref<'profesor' | 'alumno'>('profesor');

	const allNotifications = ref(store_base.notifications);

	     // Alternar la lectura de las Notificaciones
	    const toggleRead = async (notificationId: string, read: boolean) =>{
	  	  await store_base.readingType(notificationId,read);
	    }
	
</script>

<style scoped>
	 /* BaseNotification.vue */
	div {
	  font-family: Arial, sans-serif;
	  padding: 1rem;
	}

	h2 {
	  font-size: 1.2rem;
	  margin-bottom: 0.5rem;
	}

	/* Contenedor flexible para los componentes hijos */
	.categories-notifications,
	.lecture-notifications {
	  margin-top: 1rem;
	}

	/* Estilos mínimos para listas de notificaciones */
	ul {
	  list-style: none;
	  padding: 0;
	  margin: 0;
	}

	li {
	  display: flex;
	  justify-content: space-between;
	  padding: 0.5rem;
	  border-bottom: 1px solid #eee;
	}

	 /* Botones básicos */
	button {
	  padding: 0.25rem 0.5rem;
	  cursor: pointer;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	  background: #f9f9f9;
	}

	button:hover {
	  background: #e0e0e0;
	}

    /* Lectura básica */
	span.read {
	  opacity: 0.7;
	  text-decoration: line-through;
	}
	/*Cambiarlo con respecto aumente los margenes izquiero y de arriba, y efectue una especie de transicion por 6 segs (x)
	 .base-containter{
		margin-top: 2rem;
		margin-let: 2rem;
		background-color: cyan;
	}*/

	/*.categories-notifications{
		background-origin: padding-box;
		padding: auto;
		border: 3px;
	} */	
</style>