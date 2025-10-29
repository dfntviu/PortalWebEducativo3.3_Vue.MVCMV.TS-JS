<!-- Subcomponente Padre de Notificaciones: 
    Proposito: Efectuar el trabajo en conjunto entre el componente hijo
    LectureNotifications para obtener las clasificaciones las notificaciones 
    Ademas de invocarse en la lógica base ubicada en la ruta de vistas en 
    viewNotificationBase  -->
<template>
	<div class="categories-notifications">
		 <!-- Tabs: Mis/ Todas las categorias de notificaciónes-->
		<div class="tabs">
			<button :class="{active: showMyNotifications}" 
			        @click="showMyNotifications=true; updateURL()" >
				       Notificaciónes forma Individual
			</button>

			<button :class ="{active: !showMyNotifications}" 
			        @click ="showMyNotifications=false; updateURL()" >
				       Todas las Notificaciónes 
			</button>

			<!-- Enviar las notificaciones al Alumno/ -->
			<div class="send-notification">
				<input type="text" v-mode="message" placeholder="Mensaje de Notificación Enviado">
				 <button @click="sendMesagge">Enviar</button>
			</div>

			<!-- Subcomponente: Prop: Objetivo Listar las lecturas de Notificaciónes-->
			 <LectureNotifications	
			   :notifications="filteredNotifications"
			    @togle-read="toogleRead"
			 />
		</div>
	</div>
</template>

<script setup  lang="ts">
	import {ref, computed, watch} from 'vue';
	import  {useNotificationStore} from '@/stores/notificationStore';
	import {LectureNotificationsAlumno} from '@/components/LectureNotificationsAlumno.vue';
	import {useRouter,useRoute} from 'vue-router';

	const storeNotify = useNotificationStore();
	const route  = useRoute();
	const router = useRouter();

	const message = ref('');
	const showMyNotifications = ref(true);
	 const userId = ''; //ajustar con respect al uid de la firestore

	 // Incializar desde la URL --> una URL parametrizada

	  if (route.query.my !== undefined) {
	  	 showMyNotifications.value = route.query.my === 'true';
	  }

	  // Se Obtienen todas las notificaciones
	   storeNotify.consummerNotifications(userId);

	   // Filtro Reactivo de Notificaciones
	   const filteredNotifications = computed(()=>{
	   		storeNotify.notifications.filter(n => showMyNotifications.value ? n.ownerId === userId: true)
	   });

	   // Sera enviada la notificacion
	    const sendMessage = async(){
	    	if(message.value.trim()) return;
	    	  await storeNotify.sendNotifications(userId, message.value);
	    	    message.value = ''; //clean msg
	    }

	    // Actualizar la URL parametrizada
	     const updateURL = (){
	     	 router.replace({ query: { ...route.query, showMyNotifications.value}});
	     }

	     // Recargar reactivamente si cambia el store (observer de JS)
	     watch(() storeNotify.notifications, () => { } {deep: true});

	     /*Crear logica para Clasificar las  Notificaciones del Alumno*/

	     // Pensar el como?  -> El algoritmo de Categorias(clasificiación) de Notificaciones Alumno(Design) 
		
</script>
  <style scoped>
  	.categories-notifications{
      	margin-top: 1rem;
     }
  	 .tabs{
  	 	display: flex;
  	 	gap: 1em;
  	 	margin-bottom: 1rem;
  	 }
  	 .tabs button {
  	 	padding: 0.5rem 1rem;
  	 	border:  none;
  	 	border-bottom: 2px solid transparent;
  	 	background-color:  none;
  	 	cursor: pointer;
  	 }

  	 .tabs button.active {
  	 	 border-bottom: 2px solid #2196f3;
  	 	 font-weight: bold;
  	 }
  	 
  	 .send-notification {
  	 	 display: flex;
  	 	 gap: 0.5rem;
  	 	 margin-bottom: 1rem;
  	 }

  	 .send-notification input{
  	 	flex: 1;
  	 	padding: 0.5rem;
  	 }

  	 .send-notification button{
  	 	padding: 0.5rem 1rem;
  	 	background-color: #21296f3;
  	 	 color:  white;
  	 	 border: none;
  	 	 cursor: pointer;
  	 	 border-radius: 4px;
  	 }
  </style>