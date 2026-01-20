<template>
	<div class="bg-gradient-to-br min-h-screen from-gray-50">
		<div class="max-w-6xl max-auto">
			<div class="mx-auto max-w-6xl">
				<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
					<div class="flex flex-col sm-flex-row justify-between items-start sm:items-center gap-3">
						<div>
							<h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
								<span class="text-4xl">Notificaciónes</span>
							</h1>
							<p class="text-gray-600 dark:text-gray-400 mt-1">
							   {{unReadCount}}Sin Leer de {{totalNotifications}}
							</p>
						</div>

						<div class="flex gap-3">
							<button v-if="unReadCount>0" class="px-4 py-2 blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
								@click="controllMarkAllAsRead">
								<span class="text-lg">✓</span>
							</button>
							<button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200 flex.items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
								<span  :class="{'animate-spin': loading}" class="text-lg">
									🔄️
								</span>
							</button>
						</div>
						<!-- Alerta con Error -->
						<div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<div class="flex items-start gap-3">
								<span class="text-2xl">☢️</span>
								<div class="flex-1"></div>
								<h3>Error</h3>
								<p>{{error}}</p>
							</div>
							<button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
								 ✕
							</button>
						</div>
					</div>
				</div>
				<!--Tabs de Filtrado  -->
				<div class="bg-withe shadow-xl mb-6 p-6">
					<div class="flex flex-wrap gap-2">
						<button>
						   <span class="text-xl">
						    {{tab.icon}}{{tab.label}}
					       </span>
					  	</button>
					</div>
				</div>
				<!-- Noti -->
				<div class="space-y-4">
					<div class="bg-white rounded-xl text-center">
						<div class="inline-block w-16 h-16 border-4">
							<p class="mt-4 text-gray-600 font-medium">
							Cargando Notificaciónes
						    </p>
						</div>
						<!-- Estado vacio -->
						<div class="bg-white shadow-xl p-12">
							<div class="text-8xl mb-4">
								<div class="text-8xl mb-4"></div>
								<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								  No hay Notificaciónes.
								</h3>
							    <p class="text-gray-600 dark:text-gray-400">
							      {{getEmptyMessage()}}
							  </p>
							</div>

							<!-- Notificacioens -->
							<TransitionGroup name="notification-list" class="space-y-4">
								<div>
									<div class="p-6">
										<div class="flex items-start justify-between mb-4">
											<div class="flex items-start gap-4 flex-1">
												<!-- Indicador del Estado -->
												<div :class="['w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
													notification.leido ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 animate-pulse' ]">
												</div>
												
												<div class="flex-1 min-w-0">
													<!-- Mensaje -->
													<p class="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
														{{notification.mensaje}}
													</p>
													<div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
														 <span class="flex items-center gap-1">
														    🕧 {{formDate(notification.timestamp) ||
														 	   notification.fecha }}
														 </span>	
														 	<span class="nme1 nme2 nme3">
														 		{{notification.estado === 'aprobado' ? '✓ Aprobado' : '✕ Rechazado' }}
														 	</span>
														 	 <span class="px-3 py-1 rounded-full text-xs">📫</span>
													</div>
												</div>
											</div>

											<!-- Menu de Acciones -->
											<div class="relative ml-4">
												<button @click="toggleMenu(notification.id)" class="p-2 hover-gray-100 transitions-colors dark:hover:bg-gray-700">
													<span class="text-xl">:</span>
												</button>

												<!-- Dropdown Menu -->
												  <Transition name="menu">
												  	<div class="absolute right-0">
												  		<button class="w-full px-4 py-3 text-left">
												  			<span class="text-lg">✓</span>
												  			Marcar como leída
												  		</button>
												  			<button
												  				  v-if="isTeacher && notification.estado"
												  				  @click="openStatusModal(notification)"
												  			   class="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600" 
												  			 >
												  				Marcar como NO leída
												  			</button>

												  		<button @click="confirmDelete(notification.id) " class="w-full px-4 py-3 text-left hover:bg-red-50
												  		dark:hover:bg-red-900/20 flex items-center gap-3 transitions-colors text-red-600 dark:text-red-400">
												  			<span class="text-lg">🗑️</span>
												  			 Eliminar
												  		</button>
												  	</div>
												  </Transition>
											</div>
										</div>
									</div>
								</div>
							</TransitionGroup>
						</div>
						<!-- Moda del Confirmación de Eliminación -->
						<Teleport to="body">
							<Transition name="modal">
								<div v-if="showDeleteModal" class="fixed inset-0 items-center">
									  <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
									  	 <div class="text-center mb-6">
									  	 	<div class="text-6xl mb-4">☢️</div>
									  	 	<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									  	 	 ¿Deseas Eliminar Notificación?
									  	  </h3>
									  	   <p class="text-gray-600 dark:text-gray-400">
									  	     Está acción no se puede deshacer
									  	   </p>
									  	 </div>

									  	 <div class="flex gap-3">
									  	 	 <button class="flex-1 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all-colors">Cancelar</button>
									  	 	 <button class="flex-1 px-4 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transitions-colors"> Eliminar
									  	 	 </button>
									  	 </div>
									  </div>
								</div>
							</Transition>
						</Teleport>

						<!-- Moda de Actualizacíon de Estado (Profesores) -->
						<Teleport>
							<Transtion>
								<div class="fixed inset-0 bg-black-50 backdrop-blur-sm flex items-center">
									<div class="bg-white dark:bg-gray-800 rounded-2xl">
										<h3 class="text-2xl font-bold text-gray-900">
											<span class="text-3xl">📝</span>
											 Actualizar Edo Material
										</h3>

										<!-- subapartado del Estado -->
										<div class="space-y-4 mb-6">
										 	<div>
										 		<label for="" class="block text-sm font-medium text-gray-700">Estado</label>
										 		<div class="flex gap-3">
										 			<button
										 				@click="statusForm.estado=== 'aprobado'"
										 				:class="['flex-1 px-4 py-3 rounded-lg font-medium transition-all',
										 					  statusForm.estado=== 'aprobado'
										 					   ? 'bg-green-600 text-white shadow-lg'
										 					   :  'bg-gray-100 dark:bg-gray-700 text-gray-700'
										 					     +'dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
										 				]"
										 			 > ✓  Aprobar</button>
										 			<button
 														@click="statusForm.estado=== 'rechazado'"
 														:class="[
										 					'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
										 					  statusForm.estado=== 'rechazado'
										 					   ? 'bg-green-600 text-white shadow-lg'
										 					   :  'bg-gray-100  dark:bg-gray-700 text-gray-700'
										 					     +'dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
										 				]"
										 			 >Rechazar</button>
										 		</div>
										 	</div>
										 	<!-- Comentario -->
										 	<div>
										 		<label for="" class="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">Comentario</label>
										 		<textarea v-model="statusForm.cometario"
										 		 rows="4" 
										 		 placeholder="Escribe un comentario, acerca de tú desición..."
										 		 class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
										 		 			  bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500
										 		 			  focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"  
										 		>
										 		</textarea>
										 	</div>
										</div>

										<div class="flex gap-3">
											<button
												@click="showStatusModal"
											  class="flex-1 px-4 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transitions-colors">Cancelar
										  </button>
										  <button 
										  	 @click="controllUpdateStatus"
										  	 :disabled="!statusForm.estado || !statusForm.cometario"
										    class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium
										   transitions-colors disabled:opacity-50 disabled:cursor-not-allowed">
										    Actualizar</button>
									 </div>

									</div>
								</div>
							</Transtion>
						</Teleport>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted} from 'vue';
  import {useNotificationStore} from '@/stores/notificationStore.ts';
  import { useProfileStore} from '@/stores/notificationStore.ts';
  import type { Notifications} from  '@/interfaces/sysinterfaces.ts';

   // =====================
   // 	   	 STORES
   // =====================
   const notificationStore = useNotificationStore();
   const profileStore = useProfileStore();
   
   // =====================
   // 	   	 STATES
   // =====================
   const activeTab = ref<'all' | 'unread' | 'read' | 'approved' | 'rejected'>('all');
   const activeMenu = ref<string | null>(null);
   const showDeleteModal = ref(false);
   const showStatusModal = ref(false);
   const notificationToDelete = ref<string| null>(null);
   const selectedNotification = ref<Notifications | null>(null);

   const statusForm = ref({
   	 estado: '' as 'aprobado' | 'rechazado' | '',
   	 cometario: ''
   });

   // ================
   // 	  COMPUTED
   // ================
   const loading = computed(()=> notificationStore.loading);
   const error = computed(()=> notificationStore.error);
   const unReadCount =  computed(()=> notificationStore.unreadCount);
   const totalNotifications = computed(()=> notificationStore.notifications.length);
   const isTeacher = computed(()=> notificationStore.profile?.role === 'teacher');

    const availableTabs = computed(()=> {
   	  const tabs = [
   	  	{
   	  		  id: 'all' as const;
   	  		label: 'Todas',
   	  		icon:  '📋',
   	  		count: notificationStore.notifications.length
   	  	},
   	  	{
   	  		  id: 'unread' as const,
   	  		label: 'No Leídas'
   	  		icon:  '📫',
   	  		count:  notificationStore.unreadCount
   	  	},
   	  	{
   	  		  id:  'read' as const,
   	  		label: 'Leídas',
   	  		icon:  '✅'
   	  		count: notificationStore.readNotifications.length
   	  	}
   	  ];

   	    if(isTeacher.value){
   	  	    tabs.push({
	   	  	 	{
	   	  	 		id: 'approved' as const,
	   	  	 		label: 'Aprobadas',
	   	  	 		icon: '✓',
	   	  	 		count:
	   	  	 		notificationStore.getNotificationsByStatus('aprobado').length
	   	  	 	},
	   	  	 	{
	   	  	 		id: 'rejected' as const,
	   	  	 		label: 'Rechazadas',
	   	  	 		icon: '✕',
	   	  	 		count:
	   	  	 		count: notificationStore.getNotificationsByStatus('rechazado').length
	   	  	 	}
   	  	    });
   	    };
   	    return tabs;
    });

    const filteredNotifications = computed(()=>{
     	switch(activeTab.value){
     	    case 'unred':
     	  	 return notificationStore.unreadNotifications;
     	  	  break;
     	    case 'red':
     	  	   return notificationStore.readNotifications;
     	  	    break;
     	    case 'approved': 
     	  	   return notificationStore.getNotificationsByStatus('aprobado');
     	  	    break;
     	    case 'rejeccted': 
     	  	 return notificationStore.getNotificationsByStatus('rechazado');
     	  	   break;
     	}
    });

    // ===============
   // 	  METHODS
   // ================
    const loadingNotifications = async () =>{
     	try{
     		await notificationStore.loadNotifications();
     	}catch(error){
     		console.errror('Error al cargar de Notificaciónes:', error);
     	}
    };

    const controllMarkAsRead   = async(notificationId: string)=>{
    	try{
    		await notificationStore.markAsRead(notificationId);
    		 activeMenu.value = null;
    	}catch(error){
    		console.error('Error al marcar como leída: ', error);
    	}
    };

    const controllMarkAsUnread = async(notificationId: string) =>{
    	try{
    		await notificationStore.controllMarkAsUnread(notificationId);
    		activeMenu.value = null;
    	}catch(error){
    		console.error('Error al marcar como leída:', error);
    	}
    };

    const controllMarkAllAsRead = async ()=>{
    	try{
    		await notificationStore.controllMarkAllAsRead();
    	}catch(error){
    		console.error('Error al marcar todas como leídas:',error);
    	}
    };

    const confirmDelete = (notificationId: string)=>{
    	notificationToDelete.value = notificationId;
    	showDeleteModal.value = true;
    	activeMenu.value = null;
    };

    const controllDelete = async ()=>{
    	if(!notificationToDelete.value) return;

    	try{
    		await notificationStore.deleteNotification(notificationToDelete.value);
    		 showDeleteModal.value = false;
    		 notificationToDelete.value = null;
    	}catch(error){
    		console.error('Error al eliminar la notificacion:',error);
    	}
    };

    const openStatusModal = (notification: Notification) =>{
    	selectedNotification.value = notification;

    	statusForm.value = {
    		 estado: '',
    		 comentario: ''
    	};
    	showStatusModal.value = true;
    	activeMenu.value = null;
    };

    const controllUpdateStatus = async ()=>{
    	if(!selectedNotification.value || !statusForm.value.estado || 
    		!statusForm.value.cometario){
    		 return;
    	}

    	try{
    		await notificationStore.updateMaterialStatus(
    				selectedNotification.value.id,
    				statusForm.value.estado,
    				statusForm.value.cometario
    			   );
    		showStatusModal.value = false;
    		selectedNotification.value = null;
    	}catch(error){
    		console.error('Error al actualizar estado:', error);
    	}
    };     
         
    // --> box Inexistent        // compElectricos = null
    const toggleMenu = (notificationId: string) => {
    	activeMenu.value = activeMenu.value === notificationId ? null : notificationId;
    };

    const formDate = (date: any): string => {
    	if(!date) return 'Fecha no disponible';

    	try{
    		const d = date.toDate ? date.toDate() : new Date(date);
    		const now = new Date();
    		const diff = now.getTime() - d.getTime();
    		const minutes = Math.floor(diff/60000);
    		const hours = Math.floor(diff/3600000);
    		const days = Math.floor(diff/86400000);

    		if(minutes < 1) return 'Justo Ahora';
    		if(minutes < 60) return `Hace ${minutes} min`;
    		if(hours < 24 ) return `Hace ${hours} horas`;
    		if(minutes < 7) return `Hace ${days} días`;

    		return d.tolocaleDateString('es-MX',{
    			day: 'numeric',
    			month: 'short',
    			year: 'numeric'
    		});
    	}catch(error){
    		 return 'Fecha Inválida';
    	}
    };

    const getEmptyMessage = (): string =>{
    	switch(activeTab.value){
    	 	case 'unread':
    	 	  return 'No tienes notificaciones sin leer';
    	 	case 'read':
    	 	  return 'No tienes notificaciónes Leídas';
    	 	case 'approved':
    	 		return 'No hay materiales Aprobados';
    	 	case 'rejected':
    	 	   return 'No hay materiales Rechzados';

    	 	default: 
    	 		return 'Todavía, No tienes notificaciones';
    	}
    };

    const controllClickOutside = (event: MouseEvent) =>{
    	const target = event.target as HTMLElement;
    	 if(target.closet('.relative')){
    	 	 activeMenu.value = null;
    	 }
    };
    // ============================
    // 	  CICLO DE VIDA - MONTAJE
    // ============================

    onMounted(async ()=> {
    	await loadingNotifications();
    	document.addEventListener('click', controllClickOutside);
    });	

     // CleanUp
    onBeforeUnmount(()=>{
     	document.removeEventListener('click', controllClickOutside);
    });

     /* const confirmDelete = (notificationId: string)=>{
    	notificationToDelete.value = notificationId;
    	showDeleteModal.value = true;
    	activeMenu.value = null;
     };*/

    //   REP MENTAL				TECHNICAL EXAMPLE(TECHNICAL REP)
         //___________ 						=> -- 0 ,1 ,2 ,3 ,4
    // --> |x x x x x|  -> const compElectricos = ['led','resistencia','capacitor','pulsador','Transitor']
    //     ___________
    //     __
    // -> |_|   			     // compElectricos = ['','', '', '', '']
</script>
<style scoped>
	/* Animaciones para lista */
	.notification-list-enter-active,
	.notification-list-leave-active {
		  transition: all 0.3s ease;
	}

	.notification-list-enter-from {
		 opacity: 0;
		 transform: translateY(100px);
	}

	/*Animacion del menú dropdown  */
	.menu-enter-active,
	.menu-leave-active{
		 opacity: 0;
		 transform: translateY(-10px);
	}

	.modal-enter-from,
	.modal-leave-to {
		 opacity: 0;
	}

	.modal-enter-from > div,
	.modal-enter-to > div {
		 transform:  scale(0.9);
	}
</style>