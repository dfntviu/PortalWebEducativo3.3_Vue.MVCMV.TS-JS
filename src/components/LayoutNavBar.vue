 <template>
 	<!-- @component LayoutNavBar.vue
 	    @description NavBar unificado para roles Alumno & Profesor
	    REMPLAZA
 	     - LayoutNavBarRole1
 	     - LayoutNavBarRole2
   --> 
 	  <nav class="navbar" :class="`navbar-${role}`">
 	  	<!-- LOGO DE LA FI-UAEMEX -->
 	  	  <div class="navbar-container">
 	  	  	 <router-link to="/">
 	  	  	 	<span class="logo-icon">FI</span>
 	  	  	 	<span class="logo-text">Portal Web Educativo</span>
 	  	  	 </router-link>
 	  	  </div>

 	  	      <!-- ==================================================
            <!-	    	MEMU Tipo HAMBURGUESA	 -->
            <!-- ================================================== -->
             <button class="mobile-menu-toggle" 
             	 @click="mobileMenuOpen = !mobileMenuOpen"
             	 :arial-label="mobileMenuOpen ? 'Cerrar Menu': 'Abrir Menu' "
             >
							 <span class="hamburger-icon">
							 	{{ mobileMenuOpen ? '✕': '☰'}}
							 </span>             	
             </button>
              <!-- ==================================================
              <!-	    	LINKS DE NAVEGACION	 -->
              <!-- ================================================== -->
           <div class="navbar-links">
           	  <router-link to='/' class='nav-link'  @click="closeMobileMenu">
           	  	 <span class="nav-icon">🏚️</span>
           	  	 <span>Inicio</span>
           	  </router-link>

                <!-- Links Especificos para Rol -->
            	  <router-link to='/student/navbar-role-student' class='nav-link'  @click="closeMobileMenu">
            	  	 <span class="nav-icon">📊</span>
            	  	 <span>Mi Panel</span>
            	  </router-link>	

            	  <router-link to='/student/materials' class='nav-link'  @click="closeMobileMenu">
            	  	 <span class="nav-link">📚</span>
            	  </router-link>	

            	  <router-link to='/student/upload-materials' class='nav-link'  @click="closeMobileMenu">
            	  	 <span class="nav-link">✏️</span>
            	  </router-link>		


            	  <template v-else-if="role === 'teacher'">
            	    <router-link to="/teacher/navbar-role-r2" class="nav-link" @click="closeMobileMenu">
            	    	 <span class="nav-icon">📊</span>
            	    	<span>Mi Panel</span>
            	    </router-link>
            	  	 	
            	  	 	<router-link to="/teacher/review-materials" class="nav-link" @click="closeMobileMenu">
            	    	 <span class="nav-icon">📙|📗|📘</span>
            	    	 <span>Ver Materiales</span>
            	    </router-link>

            	    <router-link to="/teacher/moderate-materials" class="nav-link" @click="closeMobileMenu">
            	    		<span class="nav-icon">Moderar Materiales🔎</span>
            	    </router-link>

            	    <router-link to="/teacher/students" class="nav-link" @click="closeMobileMenu">
            	    	<span>Alumnos</span>
            	    </router-link>
            	  </template>	
            	<!-- </div> -->

            	<!--  ================================================== -->
            	<!--   ACCIONES DE USUARIO -->
            	<!--  ================================================== -->
            	<div class="navbar-actions">
            		 <!-- Notificaciones -->
            		  <button
            		    class="action-btn notifications-btn"
            		    @click="toggleNotifications"
            		    :title="unreadCount> 0 ? `${unreadCount} notificaciones sin Leer`: 'Notificaciones'"
            		  >
            		 		<span class="actio-icon">🔔</span>
            		 		<span v-if="unreadCount > 0" class="notification-badge">
            		 			{{ unreadCount> 9 ? '9': unreadCount}}
            		 		</span>
            		 </button>

            		 <!-- Perfil del Usuario -->
            		 <div class="user-menu" ref="userMenuRef">
            		 	 <button class="user-avatar" @click="userMenuOpen = !userMenuOpen" :arial-label="Menú +'userName'">
            		 	 		<span>{{userInitials}}</span>
            		 	 </button>

            		 	 <!-- Dropdown del Perfil -->
            		 	  <transition name="dropdown">
            		 	 	  <div v-if="userMenuOpen" class="user-dropdown">
            		 	 	 	   <div class="dropdown-header">
            		 	 	 	    		<div class="user-info">
            		 	 	 	    			<p class="user-name">{{userName}}</p>
            		 	 	 	    			<p class="user-email">{{userEmail}}</p>
            		 	 	 	    			  <span class="user-role-badge" :class="`badge-${role}`">
            		 	 	 	    			  		{{roleLabel}}
            		 	 	 	    			  </span>
            		 	 	 	    		</div>
            		 	 	 	    </div> 	
            		 	 	  </div>

            		 	 	  <div class="dropdown-divider"></div>
            		 	 	  
            		 	 	  <div class="dropdown-menu">
            		 	 	  	 <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
            		 	 	  	 		<span class="item-icon"></span>
            		 	 	  	 		 <span>Mí Perfil</span>
            		 	 	  	 </router-link>	

            		 	 	  	 <router-link to="/settings" class="dropdown-item" @click="closeUserMenu">
            		 	 	  	 		<span class="item-icon">🔩</span>
            		 	 	  	 		 <span>Mí Perfil</span>
            		 	 	  	 </router-link>	

            		 	 	  	<div class="dropdown-divider"></div>

            		 	 	  	<button class="dropdown-item logout-item" @click="handleLogout">
            		 	 	  		<span class="item-icon">🚪</span>
            		 	 	  		<span>Cerrar Sesión</span>
            		 	 	  	</button>
            		 	 	  
            		 	 	  </div>
            		 	 	</transition>
            		 </div>
            	</div>

            	<!--  ================================================== -->
            	<!--   PANEL DE NOTIFICACIONES -->
            	<!--  ================================================== -->
            	<transition name="slide">
            		 <div v-if="notificationsOpen" class="notifications-panel">
            		 	  <div class="panel-header">
            		 	 	  <h3>Notificaciones</h3>
            		 	 	     <button class="close-btn" @click="notificationsOpen = false">
            		 	 	     	 ✕ 
            		 	 	     </button>
            		 	  </div>

            		 	  <div class="panel-content">
            		 	  		<!-- Es Integrada la Barra de Notificaciónes -->
            		 	  	<p class="panel-placeholder">Panel de Notificaciónes</p>
            		 	  </div>
            		 </div>
            	</transition>
 	  </nav>
 </template>

<script setup lang="ts">
	import {ref, computed, onMounted, onUnmounted} from 'vue';
	import {useRouter} from 'vue-router';
	import  {useProfileStore} from '@/stores/profileStore';
	import {useNotificationStore} from '@/stores/profileStore';

	//  ====================================
	//   PROPS
	//  ====================================
	interface Props {
		role: 'student' | 'teacher';
	}	

	const props = defineProps<Props>();
	 //  ====================================
	 //   COMPOSABLE
	 //  ====================================
	 const router = useRouter();
	 const profileStore = useProfileStore();
	 const notificationStore = useNotificationStore();

	 //  ====================================
	 //   ESTADO LOCAL
	 //  ==================================== 
	 const mobileMenuOpen = ref(false);
	 const userMenuOpen = ref(false);
	 const notificationsOpen = ref(false);
	 const userMenuRef = ref<HTMLElement| null>(null);

	 //  ====================================
	 //   COMPUTED PROPERTIES(Props Computadas)
	 //  ====================================
	 
	 /** 
	  * Nombre del Usuario
	  * */
	 const userName = computed(()=>{
	 	if (profileStore.profile) return 'Usuario';
	 	   return profileStore.fullName ||  'Usuario';
	 });

	 /** 
	  * Email del Usuario
	  * */
	 const userEmail = computed(()=>{
	 	return profileStore.profile?.email || '';
	 });

	 /**
	  * Iniciales del usuario para el Avatar (texto)
	  * */
	 const userInitials = computed(()=>{
	 	 if (!profileStore.profile) return 'U';

	 	  const firstName = profileStore.profile.firstName || '';
	 	  const lastName = profileStore.profile.lastName || '';

	 	  return (firstName[0] || '') + (lastName[0]||'');
	 });


	 /** 
	  * Etiqueta de Rol en Español
	  * */
	 const roleLabel = computed(()=>{
	 	return props.role === 'teacher' ? 'Profesor': 'Alumno';
	 });

	 /** 
	  * Cantidad de Notificaciones sin leer
	  * */
	 const unreadCount = computed (()=>{
	 	const notifications = notificationStore.notifications || [];
	 	 return notifications.filter(n => !n.read).length;
	 });

	 //  ====================================
	 //   METDODOS
	 //  ====================================
	 
	 /**
	  * Cierra el Menu Movil
	  * */
	function closeMobileMenu() {
		mobileMenuOpen.value = false;
	}

	/**
	  * Cierra del menú de usuario
	  * */
	function closeUserMenu() {
		userMenuOpen.value = false;
	}
    /**
     *Alterna paneles de notificacione
	  * */
	function toggleNotifications() {
		notifications.value = !notificationsOpen.value;
		 if (notificationsOpen.value) {
		 	userMenuOpen.value = false;
		 }
	}
	/**
	* Controla el cierre de la Sesion
	  * */
    async function handleLogout() {
     	try{
     		await profileStore.logout();
     		router.push('/login');
     	}catch(error){
     		 console.error('[LayoutNavBar] Error al cerrar sesión:', error);
     	}
    }

     /**
	   * Cierra los menus al clickear afuera
	   * */
    function handleClickOutside(event: MouseEvent){
     	if (userMenuRef.value && userMenuRef.value.contains(event.target as Node)) {
     		userMenuOpen.value = false;
     	}
    }
      //  ===============================
   	 //   CICLOS DE VIDA - VUE 3.0
	   //  ================================
     onMounted(()=>{
     	 document.addEventListener('click',handleClickOutside );
     });

     onUnmounted(()=>{
     	 document.removeEventListener('click',handleClickOutside );
     });

</script>

 <style scoped>
 		.nav-bar{
 			 background: white;
 			 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 			 position: sticky;
 			 top: 0;
 			 z-index: 1000;
 		}

 	  .navbar-container{
 	  	  max-width: 1400px;
 	  	  margin: auto;
 	  	  padding: 1rem 2rem;
 	  	  display: flex;
 	  	  justify-content: space-between;
 	  	  align-content: center;
 	  	  gap: 2rem;
 	  }
  	/* ===============================*/
   	/*   THEM FOR ROLE - VUE 3.0*/
	  /*  ================================*/
	  .navbar-student{
	  	 border-bottom: 3px solid #3182ce;
	  }

	  .navbar-teacher{
	  	 border-bottom: 3px solid #9f7aea;
	  }

	  /* ===============================*/
   	/*   LOGO*/
	  /*  ================================*/
	  .navbar-brand{
	  	 flex-shrink: 0;
	  }

	  .logo{
	  	 display: flex;
	  	 align-items: center;
	  	 gap: 0.75rem;
	  	  text-decoration: none;
	  	  color: #2d3748;
	  	  font-weight: 700;
	  	  font-size: 1.25rem;
	  	  transition: color 0.2s;
	  }

	  .logo: hover {
	  	 color: #667eea;
	  }

	  .logo-icon {
	  	font-size: 1.75rem;
	  }
    
    .logo-text {
    	 display: none;
    }

    @media (min-width: 768px){
    	 .logo-text{
    	 	  display: inline;
    	 }
    }

    /* ============================== */
    /* 	MENÚ MÓVIL */
    /*============================== */

    .mobile-menu-toogle {
    	 display: flex;
    	 align-items:  center;
    	 justify-content: center;
    	  width: 40px;
    	  height: 40px;
    	  border: none;
    	  background: none;
    	  font-size: 1.5rem;
    	  cursor: pointer;
    	  color: #2d3748;
    }

    @media (min-width: 768px) {
    		.mobile-menu-toogle{
    		 	  display: none;
    		}
    }

    /* ======================*/
   	/*   LINKS DE NAVEGACION  */
	  /*  ======================*/

	  .navbar-links{
	  	  display: none;
	  	  flex-direction:  column;
	  	  position:  absolute;
	  	  top: 100%;
	  	  left: 0;
	  	  right: 0;
	  	  background: white;
	  	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	  	  padding: 1rem;
	  	   gap: 0.5px;
	  }

	  .navbar-links .mobile-open{
	  	 display: flex;
	  }

	  @media (min-width: 768px) {
	  		.navbar-links {
	  			  display: flex;
	  			  flex-direction: row;
	  			  position: static;
	  			  box-shadow: none;
	  			   padding: 0;
	  			   flex: 1;
	  			   gap: 0.25rem;
	  		}
	  }
	  
	  .nav-link{
	  	  display: flex;
	  	  align-items: center;
	  	  gap: 0.5rem;
	  	  padding: 0.75rem 1rem;
	  	  border-radius:  6px;
	  	  text-decoration:  none;
	  	  color:  #4a5568;
	  	  font-weight: 500;
	  	  transition:  all 0.2s;
	  }

	  .nav-link: hover {
	  		background: #f7fafc;
		    color: #2d3748;
	  }

	   .nav-link.router-link-active{
	   	 background: #667eea;
					color: white;
	   }

	   .nav-icon{
	   	 font-size: 1.25rem;
	   }

	   /**==============================
	    *  ACCIONES DEL USUARIO
	    * ============================== */
	   .navbar-actios {
	   	 display: flex;
	   	 align-items: center;
	   	 gap:  1rem;
	   }

	   .action-btn {
	   	 display: relative;
	   	 width: 40px;
	   	 height:  40px;
	   	 background: #f7fafc;
	   	 border-radius: 50%;
	   	 align-items: center;
	   	 cursor: pointer;
	   	 transition: all 0.2s;
	   }

	   .action-btn: hover {
	   	 background: #edf2f7;
	   }

	   .action-icon {
	   	 font-size: 1.25rem;
	   }

	  .notification-badge{
	   	  position: absolute;
	   	  top: -4px;
	   	  right: -4px;
	   	  background: #e53e36e;
	   	  color: white;
	   	  border-radius: 12px;
	   	  padding: 0.125rem 0.375rem;
	   	  font-size: 0.7rem;
	   	  font-weight: 700;
	   	  min-width: 18px;
	   	  text-align: center;
	  }

	  /**==============================
	    *  MENU DEL USUARIO
	    * ============================== */
	    .user-menu {
	   	  position:relative;	   
	   	}

	   	.user-avatar{
	   		width: 40px;
    	  height: 40px;
	  	  border-radius:  50%;
	  	  text-decoration:  none;
	  	  background: linear-gradient(135deg, #667eea, #764ba2, 100%);
	  	  border: none;
	  	  display: flex;
	  	  align-items: center;
	  	  justify-content: center;
	  	  cursor: pointer;
	  	  font-weight: 600;
	  	  transition:  transform 0.2s
	   	}

	   	.user-avatar : hover {
	   		 transform: scale(1.05);
	   	}

	   	.user-dropdown{
	   		position: absolute;
	   		 top: calc(100% + 0.5rem);
	   		 right: 0;
	   		 width: 280px;
	   		 background: white;
	   		 border-radius: 12px;
	   		 box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	   		 overflow: hidden;
	   	}

	   	.dropdown-header{
	   			padding: 1.5rem;
	   			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	   			color: white;
	   	}

	   	.user-info{
	   		 display: flex;
	   		 flex-direction: column;
	   		 gap: 0.25rem;
	   	}

	   	.user-name{
	   		 display: 600;
	   		 font-size: 1rem;
	   		 margin: ;
	   	}
	   	
	   	.user-email{
	   		 font-size: 0.85rem;
	   		 opacity: 0.9;
	   		 margin: 0;
	   	}

	   	.user-role-badge{
	   		 display: inline-block;
	   		 margin-top: 0.25rem;
	   		 padding: 0.25rem 0.75rem;
	   		 font-weight: 600;
	   		 width: fit-content;
	   	}

	   	.badge-student{
	   		background: rgba(49, 130, 206, 0.2);
	   	}
	   	.badge-teacher{
	   		background: rgba(159, 122, 234, 0.2);
	   	}

	   	.dropdown-divider{
	   		height: 1px;
	   		background:  #e2e8f0;;
	   	}

	   	.dropdown-menu{
	   		 padding: 0.5rem;
	   	}

	   	.dropdown-item{
	   			width: 100%;
	  	  display: flex;
	  	  align-items: center;
	  	  gap: 0.75rem;
	  	  padding: 0.75rem 1rem;
	  	  border: none;
	  	  background: none;
	  	  border-radius:  6px;
	  	  text-decoration:  none;
	  	  color: #2d3748;
	  	  cursor: pointer;
	  	  transition:  transform 0.2s;
	  	  font-size: 0.95rem;
	   	}

	   	.dropdown-item: hover {
	   		background: $f7fafc;
	   	}

	   	.item-icon {
	   		font-size: 1.25rem;
	   	}

	   	.logout-item{
	   		 color: #e53e36;
	   	}

	   	.logout-item: hover {
	   		color: #fff5f5;
	   	}

	   	/** ==========================
	   	 *  PANEL DE NOTIFICACIONES */
	   	 * ===========================/ */
	   	 .notification-panel{
	   	 	 position: fixed;
	   	 	 top: 70px;
	   	 	 right: 1rem;
	   	 	 max-width:  calc(100vw - 2rem);
	   	 	 background: white;
	   	 	 border-radius: 12px;
	   	 	  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	   	 	  max-height: 600px;
	   	 	  overflow: hidden;
	   	 	  display: flex;
	   	 	  flex-direction: column;

	   	 }

	   	.panel-header {
	   	 	 display: flex;
	   	 	 justify-content: space-between;
	   	 	 align-items: center;
	   	 	 padding:  1rem 1.5rem;
	   	 	 border-bottom: 1px solid #e2e28f0;
	   	}

	   	.panel-header h3 {
	   		margin: 0;
	   		font-size: 1.125rem;
	   		color: #2d3748;
	   	}

	   	.close-btn{
	   		 background: none;
	   		 border: none;
	   		 color: #718096;
	   		 cursor: pointer;
	   		 padding: 0;
	   		 width: 30px;
	   		 height: 30px;
	   		 display: flex;
	   		 align-items: center;
	   		 justify-content: center;
	   		 border-radius:  4px;
	   		 transition: all 0.2s;
	   	}

	   	.close-btn: hover{
	   		  background: #f7fafc;
	   		  color: #2d3748;
	   	}
      
      .panel-content{
      	flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .panel-placeholder{
      	text-align: center;
      		color: #a0aec0;
      		padding: 2rem;
      }
      /** ====================
       *  	 ANIMACIONES 
       *  ==================== **/
       .dropdown-enter-active,
       .dropdown-leave-active{
       	  transition: all 0.2s;
       }

       .dropdown-enter-from{
       		opacity: 0;
       		transform: translateY(-10px);
       }

       .slide-enter-active
       .slide-leave-active{
       	  transition: all 0.3s;
       }

      .slide-enter-from{
      	 opacity: 0;
      	 transform: translateY(20px);
      }

      .slide-leave-to{
      	 opacity: 0;
      	 transform: translateY(20px);
      }
 </style>	