/**
 * @Store EstadoDeNotificaciones
 * @Description Store de notificaciónes unificado para roles
 * 
 * Usa: NotificationService.ts(unificado)
 * */
 
 import { defineStore } from 'pinia';
 import { NotificationService } from '@/services/NotificationService.ts';
 import { useProfileStore } from '@/stores/profilesStore.optimized';
 import type {Notification} from '@/types/interfaces.ts'

    interface NotificationServiceState{
   	 notifications: Notification[];
   	 loading: boolean;
   	  error:string;
    }

    const useNotificationStore = defineStore('notifications', {
    	// ===========================
    	//  	STATE
    	// ===========================
    		state:(): NotificationServiceState =>({
    		 	  notifications: [];
    		 	  loading: false;
    		 	   error: '';
    		});

        // ===========================
    	//  	GETTERS
    	// ===========================
    	    getters: {
    		 	/**
    		 	 * Notificaciónes No Leídas
    		 	 * */
    		 	unreadNotifications: (state): Notification[]=>{
    		 		 return state.Notification.filter(n => !n.leido);
    		 	},

    		 	/**
    		 	 * Notificaciónes LEÍDAS
    		 	 * */
    		 	readNotifications: (state): Notification[]=>{
    		 		return state.Notification.filter(n=>n.leido);
    		 	},

    		 	/**
    		 	 * Cantidad de Notificaciónes SIN leer
    		 	 * */
    		 	unreadCount: (state): number =>{
    		 		return state.notifications.filter( n => !n.leido).length;
    		 	},

    		 	/**
    		 	 * Notificaciónes por Estado (solo profesores)
    		 	 * */

    		 	getNotificationsByStatus: (state): (status:'aprobado' | 'rechazado'): Notification[] => {
    		 		return state.notifications.filter(n => n.estado === status);
    		 	},
    		 	
    		 	/**
    		 	 * Verificar si Existen Notificaciones
    		 	 * */
    		 	hasNotifications: (state): boolean =>{
    		 		return state.notifications.filter.length > 0;
    		 	},

    		} //# End_Of-Getters


    	// ===========================
    	//  	ACTIONS
    	// ===========================
    	   actions: {

	    	  /**
		 	   * Carga todas las Notificaciónes del Usuario
		 	   * */
    	     async loadNotifications(){
    	     	 this.loading = true;
    	     	 this.error = ''; 

    	     	try{
    	     		const profileStore = useProfileStore();
    	     		const      userId  = profileStore.profile?.uid;
    	     		const      role    = profileStore.profile?.role;

    	     		if (!userId || !role) {
    	     			throw new Error('Usuario NO Autetificado');
    	     		}

    	     		this.notifications = await NotificationService.getNotifications(userId, role as 'student'| 'teacher');
    	     		 console.log(`[NotificationStore] ${this.notifications.length}	notificaciónes cargadas..`);

    	     	}catch(err: any){
    	     		this.error = err.message || 'Error al cargar las Notificaciónes';
    	     		 console.error('[NotifiationStre]: ', this.error);
    	     		  throw err;
    	     	}finally{
    	     		 this.loading = false;
    	     	}
    	     },

    	     /**
    	      * Carga de las Notificaciónes NO leídas
    	      * */
    	     async loadUnreadNotifications(){
    	    	this.loading = true;
    	    	this.error = '';

    	    	try{
    	    		const profileStore = useProfileStore();
    	     		const      userId  = profileStore.profile?.uid;
    	     		const      role    = profileStore.profile?.role;

    	     		 if (!userId || !role) {
    	     		 	throw new Error('Usuario NO Autetificado');
    	     		 }

    	     		 this.notifications = NotificationService.getUnreadNotifications(userId,role as 'student'| 'teacher');

    	     		 console.log(`[NotificationStore] ${this.notifications.length}	notificaciónes NO Leídas..`);
    	    	}catch(err: any){
    	    		this.error = err.message  || 'Error al cargar las Notificaciónes NO leidas';
    	    		 console.error('[NotifiationStre]: ', this.error);
    	    		 throw err;
    	    	}
    	     },

    	     /**
    	      * Marca una  Notificacion como LEIDA
    	      * */

    	     async MarkAsRead(notificationId: string){
    	    	try{
    	    		const profileStore = useProfileStore();
					const      role    = profileStore.profile?.role;

					if (!role) {
						throw new Error('Rol aún no ha SIDO Definido');
					}

					  await NotificationService.markAsRead(notificationId, role as 'aprobado'| 'rechazado');

					  	// Actualizar el Estado de la Notificacion
					  const notification = this.notifications.find(n => n.id === notifications.notificationId);

					  	if (notification) {
					  		notification.leido = true;
					  	}

					  	 console.log(`[NotifiationStre]: Notificación  ${notificationId} marcada como Leída ` );
    	    	}catch(err: any){
    	    		this.error = err.message  || 'Error al cargar las Notificaciónes NO leidas';
    	    		 console.error('[NotifiationStre]: ', this.error);
    	    		 throw err;
    	    	}
    	     }

    	     /**
    	      * Marca una  Notificacion como NO Leida
    	      * */
    	      async MarkAsUnread(notificationId: string){
    	     		try{
    	     			const profileStore = useProfileStore();
    	     			const role = profileStore.profile?.role;

    	     			if (!role) {
    	     				throw new Error('El Rol de usuario no definido'):
    	     			}

    	     			await NotificationService.markAsUnread(notificationId, role as 'student'| 'teacher');

    	     			// Actualizar estado local

    	     			const notification = this.notifications.find(n=> n.id === notificationId);

    	     			if (notification) {
    	     				notification.leido = false;
    	     			}
    	     			 console.log(`[NotifiationStre]: Notificación ${notificationId} marcada como NO leída`);
    	     		}catch(err: any){
    	     			 this.error = err.message  || 'Error al marcar como NO leida';
    	    		    console.error('[NotifiationStre]: ', this.error);
    	    		     throw err;
    	     		}
    	      },

    	      async markAllAsRead(){
    	      	 try{
    	      	 	 const promises = this.unreadNotifications.map(n => this.markAsRead(!n.id));

    	      	 	  await Promise.all(promises);
    	      	 	   console.log('[NotificationStore] Todas las notificaciónes maracadas como leídas');

    	      	 }catch(err:any){
    	      	 	this.error = err.message  || 'Error al cargar las Notificaciónes NO leidas';
    	    		    console.error('[NotifiationStre]: ', this.error);
    	    		    throw err;
    	      	 }
    	      },
    	      /**
    	       * Elimina una notificación
    	       * */
    	      async deleteNotification(notificationId: string){
    	      	try{
    	      		const profileStore = useProfileStore();
    	      		const userId = profileStore.profile?.uid;

    	      		if (!userId) {
    	      		  throw new Error('Rol de usuario no definido');
    	      		}

    	      		await NotificationService.deleteNotification(notificationId, role as 'student' 'teacher');

    	      		this.notifications = this.notifications.filter( n=>n.id !==notificationId);

    	      			console.error(`[NotifiationStre]: Notificación ${notificationId} eliminada`);
    	      	}catch(err: any){
    	      			this.error = err.message  || 'Error al Eliminar la notificación';
    	      			console.error('[NotificationStore] ', this.error);
    	      			  throw err;
    	      	}
    	      },

    	      /**
    	       * Crea una nueva notificacion
    	       * */
    	      async createNotification(message:string){
    	      	try{
    	      		const profileStore = useProfileStore();
    	      		const userId = profileStore.profile?.uid;

    	      		if (!userId) {
    	      			throw new Error('Usuario no Autenticado.');
    	      		}

    	      		const newNotification =  NotificationService.notifyStudent(userId, message);

    	      		this.notifications.unshift(newNotification);

    	      		console.log('[NotifiationStre] Nueva Notificación creada ');
    	      	}catch(err: any){
    	      		this.error = err.message || 'Error al cargar notificaciones no leídas';
    	      		console.error('[NotifiationStre]: ', this.error);
    	      		 throw err;
    	      	}finally{
    	      		this.loading = false;
    	      	}
    	      },

    	      /**
    	       * Actualizar el Estado del material solo profesores
    	       * */
    	      async updateMaterialStatus(notificationId: string, state: 'aprobado' | 'rechazado',comment: string){
    	      	try{
    	      		await NotificationService.updateMaterialStatus(notificationId,state,comment);

    	      			const  notification = this.notifications.find(n => n.id==notifications);
    	      			  if (notification) {
    	      			  	   notification.state = state 
    	      			  	   notification.message = comment
    	      			  	   notification.leido = true;

    	      			  }
    	      			   console.log(`[NotificationStre] Estado de material actualizado: ${state}`);

    	      	}catch(err: any){
    	      			this.error = err.message || 'Error al actualizar el estado';
    	      			console.error('[NotifiationStre] ', this.error);
    	      			  throw err;
    	      	}
    	      },

    	      /**
    	       * Limpia el Store*/
    	      $reset(){
    	      	this.notifications = [];
    	      	this.loading = false
    	      	this.error = '';
    	      }

    	   }
    });