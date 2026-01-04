<template>
	   <main class="register-view">
	 	   <header class="register-header">
	 	   	 <h1 class="text-3xl font-bold text-gray-800">Registro de Usuario</h1>
	 	   	 <p class="text-3xl font-bold text-gray-800">Selecciona el mét. de registro preferido</p>
	 	   </header>

	 	   <nav class="registration-selector">
	 	   	  <button v-for="type in REGISTRATION_TYPES"
	 	   	    :key="type.id"
	 	   	     :class="[
	 	   	     	'selector-button':
	 	   	     	  { 'active' registrationType === type.id}
	 	   	     	 ]"
	 	   	     	 :aria-selected="registrationType === type.id"
	 	   	     	  role="tab"
	 	   	     	  @click="handlerTypeChange(type.id)"
	 	   	     	 >
	 	   	   	 <span class="button-icon" v-html="type.icon"></span>
	 	       		 <span class="button-text"> {{type.label}} </span>
	 	     </button>
	 	   </nav>

	 	   		   <!-- ══════════════════════════════ -->
 						<!--  FORMS CONTAINER - REGISTRO 	-->
						<!-- ══════════════════════════════ -->
	 	   <section class="forms-container">
	 	   	<Transition	:key="registrationType" class="registration-panel" mode="out-in">
	 	   		<article 
	 	   			class="registration-panel"
	 	   			role="tabpanel" 
	 	   		 >		
	 	   		   <!-- ══════════════════════════════════ -->
 						<!--   TRADITIONAL REGISTRATION - FORM  -->
						<!-- ══════════════════════════════════ -->
	 	   			<form v-if="registrationType==='traditional'"
	 	   			    class="registration-form" novalidate>
	 	   				<h2  class="form-title" >Registro Tradicional</h2>
	 	   				<div class="form-grid">
	 	   					<!-- Entrada de Nombre -->
		 	   				<div class="form-group">
		 	   					<label for="name" class="form-label"> 
										 Nombre <span class="required">*</span>
		 	   					</label>
		 	   					<input  id="name" v-model.trim="formData.name" type="text"
		 	   					     class="form-input" placeholder="Ingresa tú Nombre"
		 	   					      required maxlength="50" :disabled="isSubmmitting" :aria-invalid="hasFieldError('name')"
		 	   					      aria-describedby="name-error" >
		 	   					<span v-if="hasFieldError('name')" id="name-error"
		 	   					       id="name-error"  class="field-error">
		 	   						  {{getFieldError('name')}}
		 	   					</span>
		 	   				</div>
		 	   				 <!-- Entrada Apellido -->
	 	   					<div class="form-group">
	 	   					  <label for="" class="form-label">Apellido
	 	   					   	Apellido<span class="required">*</span>
	 	   					  </label>
	 	   					 <input id="lname"  v-model.trim="formData.lname" type="text" 
	 	   					   class="form-input" placeholder="Ingresa tú Apellido" required maxlength="50"
	 	   					   :aria-invalid="hasFieldError('lname')" aria-describedby='lname-error'/>
	 	   					   <span  v-if="hasFieldError('lname') " 
	 	   					       id="lname-error" class="field-error">
	 	   					   	  {{getFieldError('lname')}}
	 	   					   </span>	
	 	   				   </div>
								  <!-- Entrada de contrasenia -->
	 	   				   <div class="form-group full-width">
		 	   					<label for="contrasenia" class="form-label">
		 	   						    Correo Institucional
		 	   				   </label>
	 	   					   <input id="password"  v-model="formData.password" type="text"
	 	   					     class="form-input" placeholder="Lo Minímo son 6 caracteres" required
	 	   					     minlength="6" maxlength="50" :disabled="isSubmmitting" :aria-invalid="hasFieldError('password')"
	 	   					     aria-describedby="password-error">
	 	   					   <span v-if="hasFieldError('password')" id="password-error"
	 	   					        class="field-error">
	 	   					   	   {{getFieldError('email')}}
	 	   					   </span>
	 	   					</div>

	 	   					<div class="form-group">
	 	   						 <label for="numCuenta" class="form-label">
	 	   						   Número de Cuenta</label>
	 	   					      <input id="numCta" v-model="formData.numCuenta" type="text" 
	 	   					        class="form-input" placeholder="Por Ejem: 1141392" maxlength="isSubmmitting" />
	 	   				   </div>
	 	   				   <!-- Campo de Area de Esp(Academica) -->
	 	   					<div class="form-group">
	 	   					  <label for="area" class="form-label">Área Ácademica</label>
	 	   				      <input  id="area" v-model.trim="formData.area" type="text" class="form-input" 
	 	   				      placeholder="Ej: Desarrollo de Software"	maxlength="50" :disabled="isSubmmitting"/>
	 	   					</div>
	 	   						<!-- Seleccion de Rol -->
		 	   				<div class="form-group full-width">
		 	   					  <label for="role" class="form-label">
		 	   					  	 Tipo de Usuario <span class="required">*</span>
		 	   				     </label>
		 	   					<select id="role" v-model="formData.role" class="form-select"
	 	   					      required :disabled="isSubmmitting" :aria-invalid="hasFieldError('role')" aria-describedby="role-error">
		 	   						<option value="">Selecciona un Valor</option>
		 	   						 <option value="alumno">Alumno</option>
		 	   						<option value="profesor">Profesor</option>
		 	   						<span  v-if="hasFieldError('role')"  id="role-error" class="field-error">
		 	   							{{getFieldError('role')}}
		 	   						 </span>
		 	   					</select>
		 	   				</div>
	 	   				</div> 
	 	   				
	 	   				<button type="submit" class="submit-button" 
	 	   				   		:disabled="isSubmmitting" :aria-busy="isSubmmitting">
	 	   					   <span v-if="!isSubmmitting" class="loading-content">Registrar</span>
	 	   				      <span  v-else class="spinner">Procensando..</span>
	 	   			   </button> 
	 	   			</form>

	 	   			<!--  ═══════════════════════════ -->
 						<!--      FACEBOOK	- REGISTER 	 -->
						<!--  ═══════════════════════════ -->
						<div class="social-registration">
							<h2 class="social-title">Reg. de Facebook</h2>
							<p class="form-title">
								Inicia sesión, con tú cuenta Facebook para crear tú Perfil automático
							</p>
							<button @click="handleFacebookLogin" class="social-button facebook"
								:disabled="isSubmmitting" :aria-busy="isSubmmitting"> </button>
							<span class="social-icon">replace Official icon</span>
							<span>Conectando..</span>
							
							<button @click="handleCancelSocial" class="cancel-button"
								:disabled="isSubmmitting"
							 	>
								   Cancelar
						   </button>
						</div>
						<!--  ═══════════════════════════ -->
 						<!--      GMAIL  -  REGISTER 	 -->
						<!--  ═══════════════════════════ -->
						<div class="social-registration">
							<h2 class="form-title">Registro en Google</h2>
							<p class="social-description">Inicia sesión mediante tú Cuenta Google para crear tu Perfil automáticamente</p>
							<button class="social-button"
								@click="handleGoogleLogin"
								class="social-button google"
								:disabled="isSubmmitting"
								:aria-busy="isSubmmitting"
							 >
							
							  <span class="social-icon">🔎</span>
							  <span v-if="!isSubmmitting" >Continuar con Google</span>
							  <span v-else >Conectando...</span>
						   </button>
							<button class="cancel-button"
								@click="handleCancelSocial"
								class="cancel-button"
								:disabled="isSubmmitting"
							 >
								Cancelar
							</button>
						</div>
	 	   		</article>
	 	   	</Transition>
	 	   </section>
	 	   <!-- ══════════════════════════════════════════════ -->
	 	   <!--   PROFILE EDITOR - MODAL_UX [EDIT ISN'T CLOSE] -->
	 	   <!-- ══════════════════════════════════════════════ -->
	 	   <Teleport name="modal-fade">
	 	   	<Transition name="modal-fade">
	 	   		<div  v-if="showProfileEditor" class="modal-overlay" @click.self="handleCloseModal"
	 	   		   role="dialog" aria-modal="true" aria-labelledby="modal-title" >
	 	   			<article class="modal-content">
	 	   				<header class="modal-header">
	 	   					<h3 class="modal-title">Completar el Perfil</h3>
	 	   					<button @click="handleCloseModal" class="modal-close" 
	 	   					   aria-label="Cerrar Modal" :disabled="isSubmmitting">✕</button>
	 	   				</header>

	 	   				<form action="" class="modal-form">
	 	   					<div class="form-grid">
		 	   					<div class="form-group">
		 	   						<label for="modal-name" class="form-label">Nombre</label>
		 	   						<input type="text" class="form-input"/>
		 	   					</div>
		 	   					<div class="form-group">
		 	   						<label for="modal-lname" class="form-label">Apellido</label>
		 	   						<input type="text" class="form-input"/>
		 	   					</div>
		 	   					<div class="form-group full-with">
		 	   						<label for="modal-email" class="form-label">Correo Electrónico </label>
		 	   					   	<input type="text" class="form-input"/>
		 	   					</div>
		 	   					<div class="form-group">
		 	   						<label for="modal-cuenta" class="form-label">Num. Cuenta</label>
		 	   						<input type="text" class="form-input">
		 	   					</div>
		 	   					<div class="form-group">
		 	   						<label for="modal-area" class="form-label">Área</label>
		 	   						 <input type="text" class="form-input"/>
		 	   					</div>

		 	   					<div class="form-group">
		 	   						<label for="modal-role" class="form-label">Rol</label>
		 	   							<select 
		 	   							    id="modal-role" v-model="ProfileFormData.role"
		 	   							    class="form-select" :disabled="isSubmmitting">
		 	   								<option value="alumno">Alumno</option>
		 	   								<option value="profesor">Profesor</option>
		 	   							</select>
		 	   					</div>
	 	   					</div>

	 	   					<footer class="modal-actions">
	 	   						 <button 
										type="button"
										@click="handleDeleteProfile"
										class="action-button delete" 	
										:disabled="isSubmmitting"
	 	   						  >
	 	   						   Eliminar</button>
	 	   						 <button 
										type="button"
										@click="handleEditProfile"
										class="action-button edit" 
										:disabled="isSubmmitting"
	 	   						  >
	 	   						   Actualizar</button>
	 	   					   <button 
										type="button"
										@click="handleCloseModal"
										class="action-button cancel" 
										:disabled="isSubmmitting"
	 	   					    >
	 	   					    Cerrar</button>
	 	   				   </footer>
	 	   				</form>
	 	   			</article>
	 	   		</div>
	 	   	</Transition>
	 	   </Teleport>

	 	   <!--  ═══════════════════════════ -->
 			<!--     	NOTIFICATIONS MODULE	 -->
			<!--  ═══════════════════════════ -->
			<Teleport to="body">
				<TransitionGroup name="notification-list">
					<article  v-for="notification in activeNotifications"
					   :key="notification.id"
					   :class="['notification' ,`notifcation-${notification.type}`]"
					   role="alert"
					  	:aria-label="notification.type === 'error' ? 'assertive' : 'polite' ">
						 <span class="notification-icon" aria-hidden="true" > {{notification.icon}} </span>
						 <p class="notification-message">  {{notification.message}} </p>
						 <button @click="dimissNotification(notification.id)" class="notification-close"
						 		class="notification-close" :aria-label="Cerrar notificación"
						 	>
						 	Cerrar ✕
						 </button>
				   </article>
				</TransitionGroup>
			</Teleport>

	 </main>
</template>
<script setup lang="ts">
 	/*══════════════════════════════════════*/
 	/*			DECLARE LIBRARIES			*/
 	/*══════════════════════════════════════*/
 import { ref, reactive, computed, watch, onMounted, nextTick} from 'vue';
 import { useRouter } from 'vue-router';
 import {useProfileStore} from '@/stores/profileStore';
 import {useAuthStore} from '@/stores/profileStore';
 import {useNotifications} from '@/composables/useNotifications';
 import {useFormValidation} from '@/composables/useFormValidation';
 import type {ProfesorUser} from '@/types/interfacesProfiles.index';
    
   /*══════════════════════════════════════*/
 	/*			TYPES & INTERFACES			*/
 	/*══════════════════════════════════════*/
     type RegistrationTypes = 'tradicional' | 'facebook'| 'google';
    type RegistrateType = 'student'	| 'teacher';
   
    interface RegistrationFormData{
    	name: string
  	    lname: string
  	    email: string
  	    password: string
  	    numCuenta: string
  	    area: string
  	    role: UserRole | ''
    }

    interface ProfileFormData {
    	  name: string
          lname: string
          email: string
          numCuenta: string
   			area: string
   			role:UserRole
    }

      interface RegistrateTypeOption {
      	 id: RegistrateType
      	 label: string;
      	 icon: string;
      }


 	/*══════════════════════════════════════*/
 	/*			COMPOSABLES					*/
 	/*══════════════════════════════════════*/
      const router = useRouter();
      const profileStore = useProfileStore();
      const authStore = useAuthStore();
      const {showNotification, activeNotifications, dimissNotification} = useNotifications();
      const {validateField, hasFieldError, getFieldError, clearErrors} = useFormValidation();

 	/*══════════════════════════════════════*/
 	/*			REACTIVE STATES				*/
 	/*══════════════════════════════════════*/
      const registrationType = ref<RegistrateType>('tradicional');
      const isSubmmitting = ref(false);
      const showProfileEditor = ref(false);

    const formData = reactive<RegistrationFormData>({
      	name:'',
      	lname:'',
      	email:'',
      	password:'',
      	numCuenta:'',
      	area:'',
      	role:''
    });

    const profileFormData = reactive<ProfileFormData>({
    	name:'',
		lname:'',
		email:'',
		area:'',
		role:'teacher',
    })

 	 /*══════════════════════════════════════*/
 	 /*				 CONSTANTS       		*/
 	 /*══════════════════════════════════════*/
    const REGISTRATION_TYPES: readonly RegistrateTypeOption[] = {
    	{  id:'', label:'', icon:''},
    	{  id:'', label:'', icon:''},
    	{  id:'', label:'', icon:''}
    } as const;	

    const ROLE_ROUTES: Record<UserRole, string> = {
    	profesor: '/vw-bienvenida-teacher',
    	 alumno: '/vw-bienvenida-student'
    } as const;

     /*══════════════════════════════════════*/
 	 /*			PROPERTIES COMPUTED			*/
 	 /*══════════════════════════════════════*/	
    const transitionName = computed(()=>{
    	return registrationType.value === 'traditional' ? 'slide-left' : 'slide-right'
    });

    const currentUserProfile = computed(()=> profileStore.profile)

    const isAuthenticated = computed(()=> authStore.isAuthenticated)

 	 /*══════════════════════════════════════*/
 	 /*				 WATCHERS		     	*/
 	 /*══════════════════════════════════════*/
    watch(() => profileStore.profile, (newProfile) => {
		if(newProfile){
			showProfileToForm(newProfile)
			showProfileEditor.value = true;
		}
	}, {deep: true});


	watch(() =>  profileStore.error, (error) => {
		if(error){
			showNotification({
				type: 'error',
				message: 'Hay error al acceder al Perfil'
			});
		}
	});

	watch(()
	    => profileStore.message, (message) => {
		  	if(message){
			 	showNotification({
					type: 'success',
					message: `Ingresando a tú Perfil cómo: ${ProfileFormData.role}`
				});
		 	}
	    }
	);

      /*══════════════════════════════════════*/
 	  /*			EVENT HANDLERS				*/
 	  /*══════════════════════════════════════*/

	const handlerTypeChange = (type: RegistrateType): void =>{
	  registrationType.value = type;
	   clearErrors()
	}

	const handlerTraditionalSubmit = (type: RegistrateType): void => {
		clearErrors();

		if(!validateTraditionalForm()){
			return;
		}

		isSubmmitting.value = true;

		 try{
		 	 await profileStore.registerTraditional({
		 	 	 nomb: formData.name,
				 apellido: formData.lname,
				 correo: formData.email,
				 passwd: formData.password,
				 cuenta: formData.numCuenta,
				 areaTr: formData.area,
				 role: formData.role
		 	 });

		 	 showNotification({
		 	 	type: 'success',
		 	 	message:`Registro Existoso como ${formData.role}`
		 	 });

		 	  await nextTick();

		 	  const targetRoute = ROLE_ROUTES[formData.role as UserRole];
		 	      await router.push(targetRoute);
		  }catch(error){
		  	console.error('Ocurrio un errro al Actualizar Perfil');
		  } finally {
		  	  isSubmmitting.value = false;
		  }
	}

	const handleFacebookLogin = async(): Promise <void> => {
		 isSubmmitting.value = true;
		
		try{
			await profileStore.signInWithFacebook();

			showNotification({
			  type: 'success',
			  message: 'Conexión Exitosa, mediante la R. Social Facebook'
			});

		}catch(error){
			console.log('Lo sentimos, no fue posible acceder med. FB');
		}finally{  //flag to returt base st 
			isSubmmitting.value = false; 
		}
	}

		const handleGoogleLogin = async(): Promise <void> => {
			conffirm('F(n) en construccion');
		}

	   const handleCancelSocial = async(): Promise <void> => {
	    	profileStore.clearSocial();

	    	registrationType.value = 'tradicional';
	   }

   const handleProfileSubmit = async(): Promise <void> => {
   	  const uid = profileStore.typeUser?.uid;
   	   if(!uid) return;

   	   isSubmmitting.value = true;

   	    try{
   	   	   await profileStore.editProfile(uid,{
   	   	   	    nomb: profileFormData.name
				apellido: profileFormData.lname
				correo: profileFormData.email
				area: profileFormData.area
   	   	   });

   	   	   showNotification({
			 type: 'success',
			 message: 'El Perfil fue actualizado correctamente';
		   });
   	    }catch(error){
   	   	 console.log('Lo sentimos, no fue posible editar su info. de Perfil');
   	    }finally{
   	   	  isSubmmitting.value = false;
   	    }
   }

		const handleEditProfile = async (): Promise <void> => {
			await handleProfileSubmit();
		}	

	const handleDeleteProfile = async(): Promise <void> => {
		 const uid = profileStore.typeUser?.uid;
		 if(!uid) return;

		 const confirmed = confirm('¿Está seguro d Eliminar este Perfil?');
		  if(!confirmed) return

		  	isSubmmitting.value = true;

		  try{
		  	   await profileStore.deleteProfiles(uid);

		  	   showNotification({
				 type: 'info',
				 message: 'El Perfil fue eliminado Exitosamente'
				});

		  	   showProfileEditor.value = true;

		  }catch(error){
		  	console.log('Lo sentimos, no fue posible Eliminar su Perfil');
		  }finally{   // showProfileEditor.value = false;
		  	isSubmmitting.value = false;
		  }
	}

	function handleCloseModal(): void {
		if(!isSubmmitting.value){
			showProfileEditor.value = false;
			profileStore.clearSocial();
		}
	}

    /*══════════════════════════════════════*/	
 	/*			HELPER FUNCTIONS		    */
 	/*══════════════════════════════════════*/

	const validateTraditionalForm = async(): boolean => {
		let isValid = true;

		if(!formData.name){
			validateField('name', 'El nombre es Requerido');
			 isValid = false; //# se cambio
		}

		if(!formData.lname){
			validateField('lname', 'El apellido es Requerido');
			 isValid = false; 
		}

		if(!formData.email){
			validateField('email', 'El Corro es Requerido');
			 isValid = false; 
		} else if(formData.password.length<=6){
			 validateField('password', 'Deberá de contener al menos 6 caracteres');
			 isValid = false;
		}

		if(!formData.role){
			validateField('role', 'Es OBLIGATORIO, seleccionar cualq. Rol');
			 isValid = false; 
		}

		return isValid;
	}

	const isValidEmail = async(email: string): boolean => {
		 const emailRegex = /^ [^\s@]+[^\s@]+\.[^\s@]+$/
		 return emailRegex.test(email);
	}

	const syncProfileToForm = async(profile: ProfesorUser): void =>{
		profileFormData.name = profile.name || '',
		profileFormData.lname  = profile.lname || '',
		profileFormData.correo = profile.correo  || '',
		profileFormData.numCuenta = profile.numCuenta || '' ,
		profileFormData.area	 = profile.area  || '',
		profileFormData.role = profile.role || 'teacher'

	}
		// METHOD ONLY 
	const resetForm = async(): void => {
		formData.name = '',
		formData.lname = '',
		formData.correo  = '',
		formData.numCuenta = '',
		formData.area = '',
		formData.password = '',
		formData.role = '',
		 clearErrors() //(?)
	}

 	/*══════════════════════════════════════*/
 	/*		  LIFECYCLE - HOOK				 */
 	/*══════════════════════════════════════*/

	onMounted(async() => {
		 const uid  = authStore.user?.uid;

		 if(uid){
		 	try{
		 		await profileStore.fetchProfiles(uid);
		 	}catch(error) {
		 		console.error('(Vta-Reg/Perf): Error al cargar el Perfil: ',error);
		 	}
		 }

	});
</script>

<style scoped>
	 /*══════════════════════════════════════*/
 	 /*	  ANIMATIONS				         */
 	 /*══════════════════════════════════════*/

	@keyframes fadeIn {
	  from {
	    opacity: 0;
	  }
	  to {
	    opacity: 1;
	  }
	}

    @keyframes fadeOut {
     from {
       opacity: 1;
      }
      to {
       opacity: 0;
      }
    }

	@keyframes slideInDown {
	  from {
	    transform: translateY(-20px);
	    opacity: 0;
	  }
	  to {
	    transform: translateY(0);
	    opacity: 1;
	  }
	}

	@keyframes slideInUp {
	  from {
	    transform: translateY(20px);
	    opacity: 0;
	  }
	  to {
	    transform: translateY(0);
	    opacity: 1;
	  }
	}

	@keyframes slideLeft {
	  from {
	    transform: translateX(30px);
	    opacity: 0;
	  }
	  to {
	    transform: translateX(0);
	    opacity: 1;
	  }
	}

	@keyframes slideRight {
	  from {
	    transform: translateX(-30px);
	    opacity: 0;
	  }
	  to {
	    transform: translateX(0);
	    opacity: 1;
	  }
	}

	@keyframes scaleIn {
	  from {
	    transform: scale(0.95);
	    opacity: 0;
	  }
	  to {
	    transform: scale(1);
	    opacity: 1;
	  }
	}

	@keyframes bounce {
	  0%, 100% {
	    transform: translateY(0);
	  }
	  50% {
	    transform: translateY(-5px);
	  }
	}

	@keyframes spin {
	  from {
	    transform: rotate(0deg);
	  }
	  to {
	    transform: rotate(360deg);
	  }
	}

	@keyframes pulse {
	  0%, 100% {
	    opacity: 1;
	  }
	  50% {
	    opacity: 0.5;
	  }
	}

	/* ═════════════════════════════════════════════ */
	/* UTILITY CLASSES */
	/* ═════════════════════════════════════════════ */
  @layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  .animate-slide-in {
    animation: slideInDown 0.4s ease-out;
  }

  .animate-scale {
    animation: scaleIn 0.2s ease-out;
  }

  .animate-bounce {
    animation: bounce 0.6s ease-in-out;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

/* ════════════════════════════════════════════════ */
/* LAYOUT */
/* ════════════════════════════════════════════════ */
	.register-view {
	  @apply min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4;
	  animation: fadeIn 0.5s ease-out;
	}

	.register-header {
	  @apply max-w-4xl mx-auto text-center mb-8;
	  animation: slideInDown 0.6s ease-out;
	}

	/* ══════════════════════════════════════ */
	/*  	REGISTRATION TYPE SELECTOR 	      */
	/* ══════════════════════════════════════ */
   .registration-selector{
  	 @apply max-w-4xl mx-auto mb-8 flex gap-4 justify-center flex-wap
   }

   .selector-button {
	 	@apply px-6 py-3 rounded-lg font-medium transition-all duration-300
	  	  bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
	  	  hover:bg-blue-50 dark:hover:bg-gray-600 hover:scale-105
	  	  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
	  	  flex items-center gap-2 shadow-md
   }

   .selector-button-active {
  	  @apply bg-blue-600 text-white dark:bg-blue-500 shadow-lg scale-105;
  	  animation: bounce 0.5s ease-out;
   }

  .button-icon{
  	 @apply text-sm sm:text-base;
   }

   .button-text{
   	@apply text-sm sm:text-base;
   }

	/* ══════════════════════════════════════ */
	/*  		  FORMS CONTAINER 	         */
	/* ══════════════════════════════════════ */

	.forms-container{
		@apply max-w-2xl mx-auto;
	}

	.registration-panel{
		@apply bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8;
		animation: scaleIn 0.4s ease-out;
	}


	/* ══════════════════════════════════════ */
	/*  			FORMS STYLES	          */
	/* ══════════════════════════════════════ */
	.registration-form,
	.social-registration {
		 @apply space-y-6;
	}	

	.form-title{
		@apply text-2xl font-bold text-gray-800 dark:text-gray-800 dark:text-gray-100 mb-6;
	}

	.form-title{
		@apply grid grid-cols-1 md:grid-cols-1 gap-4;
	}

	.form-group {
		@apply flex flex-col gap-2;
	}

	.form-group.full-width {
		@apply md:col-span-2;
	}

	.form-label{
		@apply text-sm font-medium text-gray-700 dark:text-gray-300;
	}

	.requiered {
		@apply text-red-500
	}

	.form-input,
	.form-select{
		 @apply w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
		 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
		 focus:ring-2 focus:ring-blue-500 focus:border-transparent
		 disabled:opacity-50 disabled:cursor-not-allowed
		 transition-all duration-200;
	}

   .form-input:hover:not(:disabled),
   .form-select:hover:not(:disabled) {
   	@apply border-blue-400 dark:border-blue-500;
   }


   .form-input:[aria-invalid="true"],
	.form-select:[aria-invalid="true"] {
		 @apply border-red-500 focus:ring-red-500;
		 animation: bounce 0.5s ease-out;
	} 

	.field-error{
		@apply text-sm text-red-600 dark:text-red-400;
		animation: slideInUp 0.3s ease-out;
	}

	/* ══════════════════════════════════════ */
	/*  				BUTTONS	             */
	/* ══════════════════════════════════════ */

	.submit-button{
		@apply bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
		focus:ring-blue-500 hover:scale-105 shadow-lg;
	}

	.social-button.facebook {	
		@apply bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 hover:scale-105 shadow-lg;
	}

	.social-button.google {
		@apply bg-red-600 hover:bg-red-700 focus:ring-red-500 hover:scale-105 shadow-lg ;
	}

	.cancel-button{
		@apply w-full mt-4 px-6 py-2 rounded-lg font-medium
		  bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200
		  hover:bg-gray-200 dark:hover:bg-gray-500
		  transition-all duration-200 disabled:opacity-50;
	}

	.loading-content{
		@apply flex items-center justify-center gap-2;
	}

	.spinner{
		 @apply inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full;
		 animation: spin 1s linear infinite;
	}

	.social-icon{
		@apply text-gray-600 dark:text-gray-400 mb-4 text-center;
	}

	.social-description{
		@apply text-gray-600 dark:text-gray-400 mb-4 text-center;
	}

	/* ══════════════════════════════════════ */
	/*  				MODAL 	              */
	/* ══════════════════════════════════════ */





	/* ══════════════════════════════════════ */
	/*  			NOTIFICATIONS		 	  */
	/* ══════════════════════════════════════ */






	/* ══════════════════════════════════════ */
	/*  	  	   TRANSITIONS 	      	      */
	/* ══════════════════════════════════════ */



</style>