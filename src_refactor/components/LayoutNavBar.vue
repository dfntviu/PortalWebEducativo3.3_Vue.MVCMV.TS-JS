<template>
	<!-- 
 	 @componet LayoutNavBar.vue
 	 @description Es el NavBar unificado para roles ambos roles
 	 @replace 
 	   - NavegacionAlum
 	   - NavegacionProf
 	   - NavBarTeacher
 	   - NavBarStudent
	  @integrates
	    - Sistema de Persmiso
	    - Sistema de Rutas
	    - Sistema de Autenticacion
	    - Tema Tailwind(codigo de colores por Rol)
	 -->

	<nav class="nav-bar">
	 	<div class="navbar-container">
	 		<div class="navbar-brand">
	 			<router-link to="/" class="logo"  />
	 			<span class="logo-icon">FI-UAEMex</span>
	 			<span class="logo-text">Portal Web Educativo</span>
	 		</div>
	 	</div>
	 	
	 	<!-- ================================================== -->
        <!-- MENÚ HAMBURGUESA (MOBILE) -->
        <!-- ================================================== -->
		<button 
	        class="mobile-menu-toggle" 
	        @click="mobileMenuOpen = !mobileMenuOpen"
	        :aria-label="mobileMenuOpen ? 'Cerrar Menú' : 'Abrir Menú'"
	      >
	        <span class="hamburger-icon">
	          {{ mobileMenuOpen ? '✕' : '☰' }}
	        </span>
      	</button>

        <div class="navbar-links" :class=" 'mobile-open': mobileMenuOpen">
      		<router-link to="/" class="nav-link" @click="closeMobileMenu" />
				<span class="nav-icon">🏠</span>
				<span>Inicio</span>
			</router-link>

	        <!-- ========================================== -->
	         <!-- LINKS ESPECÍFICOS PARA ESTUDIANTES -->
	        <!-- ========================================== -->

			<template v-if="role === 'student'">
	            <!-- Dashboard Estudiante -->
	          <router-link 
	            to="/bienvenida-students" 
	            class="nav-link" 
	            @click="closeMobileMenu"
	          >
	            <span class="nav-icon">📊</span>
	            <span>Panel Estudiantes</span>
	          </router-link>

	           <!-- Administrar Materiales -->
	          <router-link 
	            to="/view-student-adm-matls" 
	            class="nav-link" 
	            @click="closeMobileMenu"
	          >
	            <span class="nav-icon">📚</span>
	            <span>Mis Materiales</span>
	          </router-link>

	           <!-- Subir Material -->
	          <router-link 
	            to="/view-upload-materials" 
	            class="nav-link" 
	            @click="closeMobileMenu"
	          >
	            <span class="nav-icon">📤</span>
	            <span>Subir Material</span>
	          </router-link>

	            <!-- Ver Material Individual -->
	          <router-link 
	            to="/view-mater-individual" 
	            class="nav-link" 
	            @click="closeMobileMenu"
	          >
	            <span class="nav-icon">📄</span>
	            <span>Explorar</span>
	          </router-link>
	        </template>
	         <!-- ========================================== -->
	           <!-- LINKS ESPECÍFICOS PARA PROFESORES -->
	         <!-- ========================================== -->

		    <template v-if="role === 'teacher'">
		    	 <router-link 
		            to="/view-bienvenida-teachers" 
		            class="nav-link" 
		            @click="closeMobileMenu"
		          >
		            <span class="nav-icon">📊</span>
		            <span>Mí Panel de Actividades </span>
		        </router-link>

		        <router-link 
	             to="/view-teacher-adm-materials" 
	             class="nav-link" 
	             @click="closeMobileMenu"
	             >	
	          		<span class="nav-icon">📚</span>
		           <span>Mostrar Materiales</span>
	          	 </router-link>

	            <!-- Gestionar Materiales -->
	 			<router-link 
	             to="/view-materials-moderate" 
	             class="nav-link" 
	             @click="closeMobileMenu"
	            >
	             <span class="nav-icon">🔩</span>
		           <span>Moderar Materiales</span>
	           <router-link/>

	            <!-- Evaluar Comentarios -->
	 			<router-link 
	             to="/view-analyze-mod-comments" 
	             class="nav-link" 
	             @click="closeMobileMenu"
	            >
	               <span class="nav-icon">💬</span>
		           <span>Analisis de Comentarios</span>
	            <router-link/>

	             <!-- Ver  Materiales Personale -->
	 			<router-link 
	             to="/view-teacher-adm-materials" 
	             class="nav-link" 
	             @click="closeMobileMenu"
	            >
	              <span class="nav-icon">👥</span>
		          <span>Admin. Alumnos</span>
	           <router-link/>
		    </template>
		</div>

	    <div class="navbar-actions desktop-only">
	    	 <!-- Botón de Notificaciones -->
	         <button
	            class="action-btn notifications-btn"
	            @click="toggleNotifications"
	            :title="unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Notificaciones'"
	          >
	            <span class="action-icon">🔔</span>
	            <span v-if="unreadCount > 0" class="notification-badge">
	              {{ unreadCount > 9 ? '9+' : unreadCount }}
	            </span>
	        </button>

	          <!-- Menú de Usuario -->
	        <div class="user-menu" ref="userMenuRef">
	            <button 
	              class="user-avatar" 
	              @click="userMenuOpen = !userMenuOpen"
	              :aria-label="`Menú de ${userName}`"
	            >
	              <span>{{ userInitials }}</span>
	            </button>

	            <!-- Dropdown del Perfil -->
	            <transition>
	            	<div class="user-dropdown">
	            		<div class="dropdown-header">
	            			<div class="user-info">
	            				<p class="user-name">{{userName}}</p>
	            				<p class="user-email">{{userEmail}}</p>  
	            				<span class="user-role-badge"  .class="`badge-${role}`">
	            				{{roleLabel}}
	            			</span>
	            			</div>
	            		</div>
	            	</div>

	            	<div class="dropdown-divider"></div>

	            		<div class="dropdown-menu">
	            			<router-link class="dropdown-item">
	            				<spam class="item-icon">👤</spam>
	            				<span>Mí Perfil</span>
	            			</router-link>
	            			<!-- Settings(Ajustes) -->
	            			 <router-link to="/settigs" class="dropdown-item" @click="closeUserMenu" >
	            			   <span class="item-icon">⚙️</span>
	            			   <span>Configuración</span>
	            			 </router-link>

	            			<div class="dropdown-divider"></div>
		            			 <!-- Cerrar Sesión -->
		            			 <button class="dropdown-item logout-item">
		            			 		<span class="item-icon">🚪</span>
		            			 		<span>Cerrar Sesión</span>
		            			 	</span>
		            			</button>
	            	    </div>
	            	<!-- </div> -->
	            <transition/>
	    	</div>

	    <!-- ====================================== -->
	    <!--     	ACCIONES DE USUARIO (MOBILE)     -->
	    <!-- ====================================== -->

	    <div class="navbar-actions mobile-only">
	        <button
	          class="action-btn notifications-btn"
	          @click="toggleNotifications"
	          :title="unreadCount > 0 ? `${unreadCount} notificaciones` : 'Notificaciones'"
	        >
	          <span class="action-icon">🔔</span>
	          <span v-if="unreadCount > 0" class="notification-badge">
	            {{ unreadCount > 9 ? '9+' : unreadCount }}
	          </span>
	        </button>

	        <div class="user-menu" ref="userMenuMobileRef">
	          <button 
	            class="user-avatar" 
	            @click="userMenuOpen = !userMenuOpen"
	            :aria-label="`Menú de ${userName}`"
	          >
	            <span>{{ userInitials }}</span>
	          </button>
	        </div>
      	</div>


	    <!-- ====================================== -->
	    <!--     	PANEL DE NOTIFICACIONES         -->
	    <!-- ====================================== -->
	    <transition name="slide">
	    	<div v-if="notificationsOpen" class="notifications-panel">
	    		<div class="panel-header">
	    			<h3>Notificaciónes</h3>
	    			<button class="close-btn">X</button>
	    		</div>
	    	</div>

		    <div class="panel-content">
		    	<!-- Integración con el Areá de Notificaciónes -->
		    	<div  v-if="notifications.length === 0" class="panel-placeholder">
		    		<span class="placeholder-icon">🔔</span>
		    		<p>No tienes Notificaciónes</p>
		    	</div>

		    	<!-- Lista de Notificaciónes -->
		    	<div class="notifications-list">
		    		<div v-for="notification in notifications"
		    			 :key="notification.id"
		    		  class="notification-item"
		    		  :class="{ 'unread': !notification.read }"
		    		  >
		    		  <div class="notification-content">
				    			<p class="notification-title">
				    				{{notification.title}}
				    			</p>
				    			<p class="notification-message">
				    				{{notification.message}}
				    			</p>
		    			 	 <span class="notification-time">
		    					{{notification.time}}
		    			  	</span>
		    		  </div>
		    		</div>
		    	</div>
		    </div>
		</transition>
	</nav>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore2';
  // import { useNotificationStore } from '@/stores/notificationStore';
 
  // ====================================
	// PROPS
	// ====================================
	interface Props {
	  role: 'student' | 'teacher';
	}

	// ====================================
	// COMPOSABLES
	// ====================================
	const router = useRouter();
	const authStore = useAuthStore();
	 // const notificationStore = useNotificationStore();

	// =======================
	//    ESTADO LOCAL
	// =======================
	const mobileMenuOpen = ref(false);
	const userMenuOpen = ref(false);
	const notificationsOpen = ref(false);
	const userMenuRef = ref<HTMLElement | null>(null);
	const userMenuMobileRef = ref<HTMLElement | null>(null);	

 	const mobileMenuOpen = ref(false);
 	const userMenuOpen = ref(false);
 	const notificationsOpen = ref(false);
 	const userMenuMobileOpenRef = ref<any[]>([]);

	// Mock de Notificaciones (Se tenga el store terminado  cambiarlo)
    	const notifications = ref(false);

    // =======================
	//	  COMPUTED PROPERTIES
	// =======================

   /**
      * Clases CSS Dinámicas del navbar segun el rol
   * */

    const navBarClasses = computed(()=>{
    	'navbar-student': props.role === 'student'
    	'navbar-teacher': props.role === 'teacher'

    	 if(!authStore.user) return 'Usuario';

    	  const firstName = authStore.user.firstName || '';
    	  const lastName = authStore.user.lastName  || '';

    	  return firstName && lastName
    	         ? `${firstName} ${lastName}`
    	         :  authStore.user.displayName || 'Usuario';
    });

    /**
     * Email del Usuario
     * */
     const userEmail = computed(()=>{
     	 authStore.user?.email || '';
     })

    const userInitials = computed(()=>{
     	  if(!authStore.user) return 'U';

     	  const firstName = authStore.user.firstName  || '';
		  const lastName = authStore.user.lastName  || '';

		  if(firstName && lastName){
		  	 return (firstName[0] + lastName[0].toUpperCase());  // con o sin Comp
		  }

		  if(authStore.user.displayName){
		  	 const names = authStore.user.displayName.split(' ');

		  	 return names.length > 1
		  	    ? (names[0][0] + names[1][0].toUpperCase())
			  	:  names[0].substring(0,2) // ['',''],['',''],['val1''val2']
		  }
		 return 'U'
    });


     /**
     * Etiqueta Rol en Espaniol
     * */
    const profileRoute = computed(()=>{
     	 return props.role === 'student'; 
     	    ?  '/view-register-base'
     	    :  '/view-register-teacher1';
    });

    /**
     * Cantidad de Notificaciónes
     * sin Leer
     * */
    const unReadCount = computed((){
    	notifications.value.filter(n=>!n.read).lenght;
    	 // modificarlo al store real:  notificationStore.unreadCount;
    });


	// ====================================
	// MÉTODOS
	// ====================================

	/**
	 * Cierra el menú móvil
	 */
	function closeMobileMenu(): void {
	  mobileMenuOpen.value = false;
	}

	/**
	 * Cierra el menú de usuario
	 */
	function closeUserMenu(): void {
	  userMenuOpen.value = false;
	}

	/**
	 * Alterna el panel de notificaciones
	 */
	function toggleNotifications(): void {
	  notificationsOpen.value = !notificationsOpen.value;
	  
	  if (notificationsOpen.value) {
	    userMenuOpen.value = false;
	  }
	}

	/**
	 * Controla el Cierre de Sesión
	 */	
	async function controlLogout(): Pormise <void>{
		 try{
		 	  authStore.logout();
		 	   router.push('/view-login-init');
		 }catch(error){
		 	 console.error('[Bar. de Navegacion]: Error al cerrar Sesión');
		 }
	}

	/**
	 * Cierra los Menús al hacer clic fuera de ellos
	 * */
	function controlClickOutside(event: MouseEvent): void{
	 	 	const target  =event.target as Node;
	 	 	
	 	 	//contraer el menu de Usuario(Desktop)
	 	if(userMenuRef.value && userMenuRef.value.contains(target)){
	 		 userMenuOpen.value = false;  
	 	}	
	 	   // Cerrar el Menu de Usuario(mobile)
	 	if(userMenuMobileRef.value && userMenuMobileRef.value.contains(target)){
	 		 userMenuOpen.value = false;  
	 	}
	}

	  // =================
	  //   CICLO DE VIDA
	  // =================
	onMounted(()=>{
	 	 document.removeEventListener('click', controlClickOutside());
	});

 		// const notifications = ref<(any[])>([]);
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
 		margin: 0 auto;
 		padding: 1rem 2rem;
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		gap: 2rem;
 	}

 	/*====================== 
	  	 TEMA POR ROL
 	 =======================*/

 	.navbar-student{	 /* Azul student en Tailwind */
 		 bordet-bottom: 3px solid #3b8f26;
 	}

 	.navbar-teacher{ /* Purpura teacher en Tailwind */
    border-bottom: 3px solid #7c3aed;
 	}

 	/* =================
	    LOGO
	  =================*/
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

	.logo: hover{
		color: #667eea;	
	}
	
	.logo-icon{
		 font-size: 1.75rem;
		 font-weight: 800;
		 background: linear-gradient(135deg, #667eea 0%,#764ba2 100%);
		 -webkit-background-clip: text;
		 -webkit-text-fill-color: transparent;
		 background-clip: text;
	}

	.logo-text{
		display: none;
	}

	@media (min-width: 768px){
		.logo-text {
			 display: inline;
		}
	}

	/* =============================== 
	      MENÚ HAMBURGUESA (MOBILE)    
	   =============================== */
	.mobile-menu-toggle {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: 40px;
	  height: 40px;
	  border: none;
	  background: none;
	  font-size: 1.5rem;
	  cursor: pointer;
	  color: #2d3748;
	  transition: color 0.2s;
	}

	.mobile-menu-toggle:hover {
	  color: #667eea;
	}

	@media (min-width: 768px) {
	  .mobile-menu-toggle {
	    display: none;
	  }
	}

	/*========================
     LINKS DE NAVEGACION
    ========================*/
    .navbar-links{
    	display: none;
       flex-direction: column;
       position: absolute;
       top: 100%;
       left: 0;
       right: 0;
       background: white;
       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
       padding: 1rem;
       gap: 0.5rem;
    }

    .navbar-links.mobile-open{
    	display: flex;
    }

    @media (min-width: 768px) {
    	 .navbar-links{
    	 	display: flex;
				flex-direction: row;
				position: static;
				box-shadow: none;
				padding: 0;
				gap: 0.25rem;
    	 }
    	
    }

    .nav-link{
    	background: #667eea;
    	color: white;
    }

    .nav-link: hover{
    	
    }

    .nav-link: hover {
    	background: #f7fafc;
    	color: white;
    }

    .nav-link.router-link-active{
    	background: #667eea;
    	color: white;
    }

		.navbar-student .nav-link.router-link-active{
			background: #3b82f6;
		}  
    
    .navbar-teacher .nav-link.router-link-active{
    	background: #7c3aed;

    }

		.nav-icon{
			font-size: 1.25rem;
		}


	/* =======================
      	ACCIONES DE USARIO
    ========================*/

    .navbar-actions{
    	display: flex;
    	align-items: center;
    	gap: 1rem;
    }

    .desktop-only{
    	display: none;
    }

    @media (min-width: 768px){
    	.desktop-only{
    		 display: flex;
      }
      
      .mobile-only{
      	 display: none;
      }
    }

    .action-btn{
    	 position: relative;
    	 width: 40px;
    	 height: 40px;
    	 background: #f7fafc;
    	 border: none;
    	 border-radius: 50%;
    	 display: flex;
    	 align-items: center;
    	 cursor: pointer;
    	 transition: all 0.2s;
    }

    .action-btn: hover{
    	 background: 1.25rem;
    }

    .action-icon {
    	font-size: 1.25rem;
    }

    .notification-badge{
    	position: absolute;
    	top: -4px;
    	right: -4px;
    	background: #ef444;
    	color: white;
    	border-radius: 12px;
    	font-size: 0.7rem;
    	font-weight: 700;
    	min-width: 18px;
    	text-align: center;
    }

    /**
     * =======================
     *    MENU USUARIO     
     * =======================
     * */
     .user-menu{
     	 position: relative;
     }
     
     .user-avatar{
     	 width: 40px;
     	 height: 40px;
     	 border-radius: 50%;
     	 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     	 border: none;
     	 display: flex;
     	 align-items: center;
     	 justify-content: center;
     	 cursor: pointer;
     	 font-weight: 600;
     	 color: white;
     	 transition: transform 0.2s;
     }

     .user-avatar: hover{
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
     	 font-weight: 600;
     	 flex-direction: column;
     	 margin: 0;
     }

     .user-email{
     	 font-size: 0.85rem;
     	 opacity: 0.9;
     	 margin: 0;
     }

     .user-role-badge{
     	 display: inline-block;
     	 margin-top: 0.5rem;
     	 border-radius: 12px;
     	 font-size: 0.75rem;
     	 font-weight: 600;
     	 width: fit-content;
     }

     .badge-student{
     	 background: rgba(59, 130, 246, 0.2);
     }

     .badge-teacher{
     	 background: rgba(124, 58, 237, 0.2);
     }

     .dropdown-divider{
     	 height: 1px;
     	 background: #e2e8f0;
     }
     
     .dropdown-menu{
     	 padding: 0.5rem;
     }

     .dropdown-item{	
     	  width: 100%;
     	  display: flex;
     	  align-items: center;
     	  gap: 0.75rem 1rem;
     	  padding: 0.75rem 1rem;
     	  border: none;
     	  border-radius: 6px;
     	  text-decoration: none;
     	  color: #2d3748;
     	  cursor: pointer;
     	  transition: background 0.2s;
     	  font-size: 0.95rem;
     	  text-align: left;
     }

     .dropdown-item: hover{
     	 background: #f7fafc;
     }

     .item-icon{
     	 font-size: 1.25rem;
     }

    .logout-item{
    	 color: #ef4444;
    }

    .logout-item: hover {
    		background: #fef2f2;
    }
     /**
     * ===========================
     *    PANEL DE NOTIFICACIONES     
     * ===========================
     * */

    .notifications-panel{
    	position: fixed;
    	top: 70px;
    	right: 1rem;
    	width: 400px;
    	max-width: calc(100vw - 2rem);
    	background: white;
    	border-radius: 12px;
    	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    	max-height: 600px;
    	overflow: hidden;
    	display: flex;
    	flex-direction: column;
    }

    .panel-header{
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    	 padding: 1rem 1.5rem;
    	 border-bottom: 1px solid #e2e8f0;
    }	

    /** **/
    .panel-header h3{
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
    	 border-radius: 4px;
    	 transition: all 0.2s;
    	 font-size: 1.25rem;
    }

    .close-btn: hover{
    	 background: #f7fafc;
    	 color: #2d3748;
    }
     
    .panel-placeholder{
    	display: flex;
    	flex-direction: column;
    	align-items: center;
    	justify-content: center;
    	text-align: center;
    	color: #a0aec0;
    	gap: 1rem;
    }

    .placeholder-icon{
     	 font-size: 3rem;
     	 opacity: 0.5;
    }

    .notifications-list{
    	display: flex;
    	flex-direction: column;
    	gap: 0.5rem;
    }

    .notification-item{
    	 padding: 1rem;
    	 border-radius: 8px;
    	 background: #f7fafc;
    	 transition: background 0.2s;
    }

    .notification-item: hover{
     	background: #edf2f7;
    }

    .notification-item.unread{
     	background: #edf2f7;
     	border-left: 3px solid #3b82f6;
    }	

    .notification-content{
    	display: flex;
    	flex-direction: column;
    	gap: 0.25rem;
    }

    .notification-title{
    	font-weight: 600;
    	color: #2d3748;
    	margin: 0;
    	font-size: 0.95rem;

    }

    .notification-message{
    	 color: #4a5568;
    	 margin: 0;
    	 font-size: 0.85rem;
    }

    .notification-time{
    	color:  #718096;
    }
   
    /** 
     * ==================
     *  	ANIMACIONES 
     * ================== **/

    .dropdown-enter-active,
    .dropdown-leave-active{
     	 transition:  all 0.2s ease;
    }

    .dropdown-enter-from{
    	opacity: 0;
    	transform: translateY(-10px);
    }

    .dropdown-leave-to {
    	 opacity: 0;
    	 transform: translateY(-10px);
    }

    .slide-enter-active,
    .slide-leave-active{
    	  transition: all 0.3s ease;
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