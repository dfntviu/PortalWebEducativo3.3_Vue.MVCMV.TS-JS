<!-- Subcomponente simetrico: Misma Lógica solo que a la inversa. 
    El rol profesor envia las notificaciónes -->

 <template>
 	<div class="notifications-container">
 		<h2>Notificaciónes Enviadas: </h2>
        <!-- Filtros -->
 		<div class="filters">
 			<label >Filtar por estado:</label>
 			<select v-model="filtroSeleccionado" @change="aplicarFiltro">
 				<option value="all">Todas</option>
 				<option value="unread">No Leídas</option>
 				<option value="read">Leídas </option>
 			</select>

 			 <button @clik="classifyByDate">Ordenar Por Fecha</button>
 		</div>

 		<!-- Listado -->
 		<ul  v-if="store_notify.notifications.length"  >
 			<li v-for="notif in store_notify.notifications" :key="notif.id" class="notif-item">
 				<div>
 					<p><strong>{{notif.message}}</strong></p>
 					  <small> {{notif.fechaEnvio}} </small>

		 		  <!-- Acciónes de Gestión -->
			 	  <div class="actions">
			 			<button @click="store_notify.deleteNotification(notif.id)">Eliminar</button>
			 			<button @click="ediciondelMensaje(notif)">Reenviar</button>
			 			<button @click="store_notify.sendNotifications(notif)">Editar</button>
			 	  </div>
 				</div>
 			</li>
 		</ul>

 	      <p v-else >No hay Notificaciónes.</p>
		 		  
		 		  <!-- Modal de Edición -->
		 	<div  v-if="editando">
		 	   <h3>Editar Notificacióne: </h3>
	 			<textarea @click="nuevoMensaje"></textarea>
	 			<button @click="guardarEdicion">Editar</button>
	 			<button @click="cancelarEdicion">Editar</button>
			</div>
 	</div>
 </template>

 <script setup lang="ts">
 	 import {ref, computed} from 'vue';
 	 import {useNotificationStore} from '@/store/notificationStore.ts';

 	  // Instancia al store generico(2 roles)
 	 const store_notify = useNotificationStore();

 	 // Dec. de variables reactivas para cada uno de sus métodos
 	  const editando = ref(false);
 	  const notify_actual  = ref<any>(null); 
 	  const nuevoMensaje = ref('');

     async function guardarEdicion() {
     	//logica de guardado de notific
     	if (notify_actual.value) {
     	 	 await store_notify.editNotification(notify_actual.value.id, nuevoMensaje.value);
     	 	  editando.value = false;
     	 	  notify_actual.value = null;
     	}
     }

    function ediciondelMensaje(notify: any) {
     	notify_actual.value = notify;
     	 nuevoMensaje.value = notify.message;
     	  editando.value = true;
    }

     async function cancelarEdicion() {
     	//logica de guardado de notific
     	 	  editando.value = false;
     	 	  notify_actualv.value = null;
    }
 	 	/*Estado Local Simulado*/
 	  /*const notifications = ref([
 	  	{id: 1, message: 'Examen mañana', read: true, fechaEnvio: '2025-09-30', leidos: 15, totalAlumnos: 20 },
 	  	{id: 2, message: 'Entrega de tarea', read: false, fechaEnvio: '2025-09-28', leidos: 10, totalAlumnos: 18 }
 	  ]);*/
 </script>
  <style scoped>
  		body{
  			font-family: 'Arial', sans-serif;
  			background: #f5f5f5;
  			margin: 0;
  			padding: 0;
  			display: flex;
  			justify-self: center;
  			align-items: center;
  			height: 100vh;
  		}
  		.notificatios-container{
  			background: linear-gradient(135deg,#637bff, #7bb4ff);
  			border-radius: 10px;
  			padding: 20px;
  			width: 80%;
  			max-width: 800px;
  			box-shadow: 0 8px 16px rgba(0,0,0, 0.2);
  			animation: fadeIn 1s ease-in-out;
  		}

  		h2{	
  		  color: #fff;
  		  text-align: center;
  		  margin-bottom: 20px;
  		  font-size: 24px;
  		}

  		/*Filtros de Notificaciónes */
  		.filters{
  		 	display: flex;
  		 	justify-content: space-between;
  		 	align-items: center;
  		 	margin-bottom: 20px;
  		 	background-color: rgba(255, 255, 255, 0.8);
  		 	padding: 10px;
  		 	border-radius: 5px;
  		 	/*cursor: pointer;
  		 	transition: background-color 0.3s ease, transform 0.2 ease;*/
  		}

  		.filters select {
  		 	 padding: 8px;
  		 	 border-radius: 5px;
  		 	 border: 1px solid #ccc;
  		 	 font-size: 16px;
  		 	 margin-right: 10px;
  		 	 transition: border-color 0.3s ease;
  		}

  		.filters select: hover{
  		  	 border-color: #6e7bff;
  		}

  		.filters button{
  		  padding: 8px 16px;
  		  background-color: #6e7bff;
  		  color: white;
  		  border: none;
  		  border-radius: 5px;
  		  cursor: pointer;
  		  transition: background-color 0.3s ease, transform 0.2s ease;

  		}

  		.filters button:hover {
  		 	 background-color: #5a69e6;
  		 	 transform: translateY(-3px);
  		}
  		 /* Listado de Notificaciones */
  		 ul {
  		   list-style-type: none;
  		   padding: 0;
  		   margin: 0;
  		 }

  		.notif-item{
  		   background-color: white;
  		   padding: 15px;
  		   margin:  10px 0;
  		   border-radius: 8px;
  		   box-shadow: 0 4px 10px rgba(0,0,0, 0.1);
  		   transition: transform 0.3s ease, box-shadow 0.3s ease;
  		}

  		.notif-item: hover{
  		    transform: translateY(-5px);
  		    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  		}

  		.notif-item div {
  		   display: flex;
  		   justify-content:  space-between;
  		   align-items: center;
  		}

  		.notif-item p {
  		  	 font-size: 16px;
  		  	 font-weight: bold;
  		  	 color: #333;
  		}

  		.notif-item small{
  		  	 color: #777;
  		  	 font-size: 14px;
  		}

  		.notif-item button{
  		   padding: 6px 12px;
  		   background-color:  #ffa500;
  		   color: white;
  		   border: none;
  		   border-radius: 5px;
  		   cursor: pointer;
  		   font-size:  14px;
  		   margin-left: 5px;
  		   transition: background-color 0.3s ease, transform 0.2s ease;
  		}

  		.actions button:hover{
  		   background-color: #5a696e;
  		   transform: translateY(-3px);
  		}
	    p {
	   	 color: #666;
	   	 text-align: center;
	    }

  		.editando{
  		  background-color: rgba(0,0,0,0.5);
  		  position: fixed;
  		  top: 0;
  		  left: 0;
  		  right: 0;
  		  bottom: 0;
  		  display: flex;
  		  justify-content: center;
  		  align-items: center;
  		  z-index: 999;
  		}

  		.editando div {
  		 	 background-color: white;
  		 	 padding: 20px;
  		 	  border-radius: 8px;
  		 	  width: 70%;
  		 	  max-width: 500px;
  		 	  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  		}

  		.editando h3{
  		 	margin-bottom: 10px;
  		 	font-size: 20px;
  		 	color: #333;
  		}

  		.editando textarea {
  		  width: 100%;
  		  padding: 10px;
  		  border-radius: 5px;
  		  border: 1px solid #ccc;
  		  height: 150px;
  		  resize: none;
  		  font-size: 16px;
  		  margin-bottom: 20px;
  		   transition: border-color 0.3s ease;
  		}

  		.editando textarea: focus {
  		    border-color: #6e7bff;
  		}

  		.editando button {
  		    padding: 10px 20px;
  		    background-color: #6e7bff;
  		    color: white;
  		    border: none;
  		    border-radius: 5px;
  		    cursor: pointer;
  		    transition: background-color 0.3s ease, transform 0.2s ease;
  		    margin-right: 10px;
  		}

  		.editando button:hover{
  		    background-color: #5a696e;
  		   	transform: translateY(-3px);
  		}

  		    /* Animaciónes */
  		  @keyframes fadeIn {
  		      from{
  		    	  opacity: 0;
  		      }
  		      to{
  		    	  opacity: 1;
  		      }
  		  }

  		  @keyframes slideIn {
  		     from {
  		    	 transform: translateY(100%);
  		     }
  		     to{
  		    	 transform: translateY(0);
  		     }
  		  }
  </style>
 					  <!-- <p>Estado:</p>
 					    <span :class= "{read: notif.read,  unread: !notif.read}">
 					    	 {notif.read ? : 'Leida' 'No Leida'}}
 					    </span> -->
 					  <!-- <small> {notif.leidos}}  / {notif.totalAlumnos}} </small> -->

 					<!-- <p><strong>{notif.message}}</strong></p>
 					  <small> {notif.fechaEnvio}} </small> -->
		 	    <!-- </div>
 				<div> -->