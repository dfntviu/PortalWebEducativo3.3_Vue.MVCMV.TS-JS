<template>
  	<section class="profesor-notifications space-y-8">
  	 	<!-- Gestion de las notificaciones -->
  	 	<div class="bg-gray-50  p-4 rounded-xl shadow">
  	 	  <h2>Panel de Notificaciónes - Profesor</h2>
  	 	 	<form @submit.prevent="guardarNotificacion" class="space-y-2">
  	 	 	 	 <input  v-model="nuevaNotificacion.titulo" type="text"
  	 	 	 	  placeholder="Título"
  	 	 	 	  class="w-full border rounded p-2" />
  	 	 	 	  <textarea  v-model="nuevaNotificacion.mensaje"
  	 	 	 	   placeholder="Esc contenido del mensaje de tu Notificación"
  	 	 	 	   class="w-full border rounded p-2">
  	 	 	 	   	
  	 	 	 	   </textarea>

  	 	 	 	   <div class="flex gap-2">
  	 	 	 	   	 <button type="submit" class="px-4 py-4 bg-blue-600 text-white rounded">
  	 	 	 	   	   {{editando ? "Actualizar" : "Crear"}} 

  	 	 	 	   </div>
  	 	 	</form>
  	 	</div>
  	 	 <!-- NOTIFICACIONES NO leidas -->
  	 	<div>
  	 	 	<h2>Notificaciónes No Leídas</h2>
  	 	 	 <ul>
  	 	 	 	<li v-for="n in unreadNotifications" :key="n.id"
  	 	 	 	 class="p-2 border-2 flex justify-between items-center">
  	 	 	 		
  	 	 	 	    <span> {{n.titulo}} </span>
	  	 	 	 	<div class="flex gap">
	  	 	 	 	 	 <button @click="toggleRead(n.id,n.read)" class="text-sm text-yellow-500">
	  	 	 	 	 	 	Marcar como Leida
	  	 	 	 	 	 </button>

	  	 	 	 	 	 <button @click="prepararEdicion(n)" class="text-sm text-yellow-500">
	  	 	 	 	 	 	Editar
	  	 	 	 	 	 </button>
	  	 	 	 	 	 <button @click="eliminarNotificacion(n.id)" class="text-sm text-red-500">
	  	 	 	 	 	 	Eliminar
	  	 	 	 	 	 </button>
	  	 	 	 	</div>
	  	 	 	</li>
	  	 	 </ul>
  	 	</div>


  	 	  <!-- NOTIFICACIÓNES Leidas -->
  	 	<div>
  	 	 	<h2>Notificaciónes Leídas</h2>
  	 	 	<ul>
  	 	 		<li v-for="n in readNotifications" :key="n.id" 
  	 	 		 class="p-2 border-b flex justify-between items-center">
  	 	 		 	<span> {{n.titulo}} </span>

  	 	 		 	<div class="flex gap">
  	 	 		 		<button @click="toggleRead(n.id,n.read)" class="text-sml text-orange-500">
  	 	 		 			Marcar como NO Leída
  	 	 		 		</button>
  	 	 		 		<button @click="prepararEdicion(n.id,n.read)" class="text-sml text-orange-500">
  	 	 		 			Editar
  	 	 		 		</button>
  	 	 		 		<button @click="eliminarNotificacion(n.id)" class="text-sm text-red-500">
	  	 	 	 	 	 	Eliminar
	  	 	 	 	 	 </button>
  	 	 		 	</div> <!--exit_container-->
  	 	 		</li><!--salir de los elementos-->
  	 	 	</ul><!--salir del listado-->
  	 	</div> <!--exit_panel (Not Read)-->

  	 	 <!-- NOTIFICACIÓNES Recientes -->
  	 	<div>
  	 	 	<h2 class="text-lg font-bold text-yellow-600">Notificaciónes RECIENTES</h2>
 		 	 <ul>
 		 		 <li v-for="n in recentNotifications" :key="n.id"  class="p-2 border-b">
 		 			 <span> {{n.titulo}} </span>
 		 	 	 </li>
 		 	 </ul>
  	 	</div> <!--exit_option(No Reciente)-->

  	</section>
</template>

<script setup lang="ts"> 
	import { computed, onMounted, ref } from "vue";
	import {useNotificationStore} from '@/stores/notificationStore.ts';

	/*Acceso al store de Profesores*/
	 const store_profesor = useNotificationStore();

	 // Estado local para crear o editar (? las notificacion)
	 const  nuevaNotificacion = ref({titulo: "", mensaje: ""});
	  const editando =  ref<string | null>(null);

	  /*Cargar las notificaciónes al montar: Cada categoria esta separada por su propio computed.*/
	    onMounted(()=>{
	   	 store_profesor.consummerNotifications();
	    });	
	 
	    const unreadNotifications = computed(()=>{
	   		 store_profesor.filter((n) => !n.read);
	    });

	    const readNotifications = computed(()=>{
	   		 store_profesor.filter((n) => n.read);
	    });


	    const recentNotifications =  computed(()=>{
	   		store_profesor.notifications.filter((n)=>{
	   	 	 const now = Date.now();
	   	 	 const fecha = new Date(n.fecha).getTime();

	   	    });
	   	});

	    const toggleRead = async (id:string, estado: boolean)=>{
	   	 	store_profesor.readingType(id, !estado);
	    };

	   /* Acciónes del estado */	
	    const guardarNotificacion(idNotify: string) = async()=>{
	   	    if (editando.value) {
	   	 	   await store_profesor.updateMaterialStatus(idNotify, editando.value, nuevaNotificacion.value);
	   	 	     editando.value = null;
	   	  }else{
	   	 	 store_profesor.addNotification(nuevaNotificacion.value);
	   	   }
	   	      nuevaNotificacion.value = {titulo: "", mensaje: ""};
	    } 

	    const eliminarNotificacion = async(id: string)=>{
	   	  await store_profesor.deleteNotification(id);
	    };

	   	const prepararEdicion= (notification: any)=>{
	   		nuevaNotificacion.value =  {titulo: notification.titulo, mensaje: notification.mensaje};
	   		 editando.value = notification.id;
	   	}
</script>

	<style scoped>
	 	.profesor-notifications{
	 		@apply p-4 bg-white rounded-xl shadow-md;
	 	}

	 	button{
	 		transition: background-color 0.3s ease, color 0.3s ease;
	 	}

	 	li{
	 		 transition: transform 0.3s  ease-in-out, background-color 0.3s ease;
	 	}

	 	li: hover{
	 	  transform: border-color 0.3s ease;
	 	}

	 	input:focus, textarea: focus {
	 		border-color: #4A90E2;
	 	}

	 	section{
	 	  transition: background-color 0.3s ease;
	 	}

	 	section: hover{
	 		background-color: #f9f9f9;	
	 	}
	</style>