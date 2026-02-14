<template>
	<section class="edicion-perfil">
		<h2 class="titulo-seccion">Edición del Perfil</h2>
		<div class="alerta alerta-error">
		  {{error}}
		</div>
		<div class="alerta alerta-exito">
		  {{message}}
		</div>
		
		<div v-if="profile" class="info-usuario">
			<h3>Perfil de: {{fullName}}</h3>
			<p class="texto-secundario">Última Actualización: {{formDate(profile.fechaRegistro)}}</p>
		</div>
			<!-- Formulario de Edicion del Perfil -->
		<form class="formulario-edicion">
			<div class="seccion-inmutable">
				<h4 class="subtitulo">Información Inmutable</h4>
				<p class="texto-ayuda">Los siguientes campos no pueden ser modificados:</p>
				 <!-- email universitario (campo inmutable) -->
				<div class="s">
					<label for="">Email Universitario</label>
					<input type="text" class="campo-inmutable">
					<small class="texto-ayuda">Generado automáticamente</small>
				</div>		
					<!-- Num. de Cuenta (campo inmutable) -->
				<div class="campo-formulario">
					<label for="numCuenta">Núm. de Cuenta</label>
					 <input id="numCuenta" type="text"  :value="profile.numCuenta" 
					   disabled class="campo-inmutable"/>
					<small class="texto-ayuda">Asignado Automáticamente</small>
				</div>					

					<!-- Username (inmutable) -->
				<div class="campo-formulario">
					 <label for="">Usuario del Sistema</label>
				        <input id="numCuenta" type="text" :value="profile.numCuenta"
				          class="campo-inmutable"/>
				        <small class="texto-ayuda">Asignado Automaticamente</small>
			    </div>

			    <div class="campo-formulario">
			    	 <label for="">Rol</label>
			    	 <input  id="role" type="text"
			    	   value="Alumno" disabled   class="campo-inmutable">
				 </div>
			</div>

			<!-- ═══════════════════════════════════ -->
			<!-- 	     CAMPOS EDITABLES 			 -->
			<!-- ═══════════════════════════════════ -->
			<div class="seccion-editable">
				<h4 class="subtitulo">Informacion Editable</h4>
				
				<div class="campo-formulario">
					 <label for="">Nombre *</label>
				       <input id="nombre" type="text" v-model.trim="editForm.name"
				         placeholder="Tú Nombre" :disabled="loading"
				       >
				</div>

					<div class="campo-formulario">
						<label for="nombre">Apellido *</label>
					     <input id="apellido" type="text" v-model.trim="editForm.lname"
					         required  :disabled="loading">
					</div>

					<div class="form-group">
			    	<label for="">Correo Institucional *</label>
			    	<input id="Email" type="text" v-model="registerForm.email"
			    		placeholder="ejemplo@alumno.uaemex.mx" 
			    	 >
			    	<small class="form-hint">Este correo no debe ser modificado despues</small>
				</div>

			    	<!-- Contraseña -->
					<div class="form-group">
						<label for="">Contraseña *</label>
						<input id="password" type="text"
							v-model="registerForm.password" placeholder="Mínimo 6 carácteres"
							:disabled ="loading"
						/>
					</div>
				  <!-- Numero de Cuenta -->
				<div class="form-group">
					<label   for="numCuenta">Número de Cuenta *</label>
					<input id="numCuenta" type="text" v-model="registerForm.numCuenta" placeholder="7 dígitos"
					maxlength="7" :disabled="loading"> 
					<small class="form-hint">Será asginado automáticamente al registrar</small>
				</div>
					<!-- Carrera -->
				<div class="campo-formulario">	
					<label for="">Carrera *</label>
					<select name="" id="">
						<option value="">Selecciona una Carrera</option>
						<option value="">Ingeniería en Computación</option>
						<option value="">Ingeniería Mecánica</option>
						<option value="">Ingeniería Civil</option>
						<option value="">Ingeniería Eléctronica</option>
						<option value="">Ingeniería en Sistemas Energeticos y S.</option>
						<option value="">Ingeniería en IA</option>
					</select>
				</div>

				<div class="campo-formulario">
					   <label for="">Edad</label>
				     <input  id="edad" type="number" v-model="registerForm.tipoMaterial"
				     	  placeholder="Digíta tú Edad" :disabled="loading"
				      >
			    </div>
			    <!-- Eleccion del Material -->
			    <div class="form-group">
			    	<label for="">Tipo de Material Preferido *</label>
			    	<select  id="tipoMaterial" v-model="registerForm.tipoMaterial" 
			    	   :disabled="loading">
			    		<option value="PDF">PDF</option>
			    		<option value="DOCx">DOCx</option>
			    	</select>
			    </div>

				<!-- Botones de Accion -->
				<div class="botones-accion">
					<button type="submit" class="btn-actualizar"
						:disabled="loading">
						<span v-if="!loading" >Guardar Cambios</span>
						<span v-else >Guardando...</span>
					</button>

					<button type="button" 
					   class="btn-eliminar" @click="evDelete" :disabled="loading">
					   Eliminar Perfil
					</button>

					<button  type="button" class="btn-cambiar-password" 
					   @click="openPasswordModal" :disabled="loading">
					    Deshacer
					</button>

				</div>

			   <div class="password-section">
			   	 <p class="section-description">Personality Text</p>
			    	<button type="button" class="btn btn-outline"
			    		@click="openPasswordModal"
			    	 >Cambiar Contraseña
			    	</button>
			   </div>
			</div>
		</form>
		   <!-- Mensaje si no existe perfil cargado -->
		<div  v-if="!profile" class="sin-perfil">
			<p>No hay perfil cargado. Por favor inicia sesión o registra de nuevo</p>
		</div>
	</section>
</template>

<script setup lang="ts">

	/**
	 * Nota: Algunso de los errores son originados cuando a pesar de contener el flujo de trabajo
	 * y la direccion de ruteo correcta sin error sintacticos, estos deberan encontrarse mas arriba
	 * en otra  clase, a pesar de ello. Algunas veces a falta de imprecisión del compiler los errrores
	 * se encuentran adscritos a las pseudoclases en CSS.*/

	/**
	 * 
	 * ═════════════════════════════════════════════════════════
	 * 		COMPONENT: PfeStudentView
	 * 
	 * ═════════════════════════════════════════════════════════
	 * Responsabilidad: Renderizado del formulario de Edicion de perfil
	 * Objetivo: Logica del composable useStudentProfile
	 * */

	 import { onMounted } from 'vue';
	 import { useStudentProfile, controllerRegistro} from '@/composables/compStudentProfile';

	 // ══════════════════════════════
	 // 		EMITS
	 // ══════════════════════════════
	 const emit = defineEmits<{
	 	openPasswordModal: []
	 }>();

	  // ══════════════════════════════════════
	  // 	COMPOSABLES
	  // ══════════════════════════════════════
	  const {
	  	profile,
		fullName,
		editForm,
		isEditFormValid,
		loading,
		error,
		message,
		loadProfileEditForm,
		controllerUpdate,
		controllerDelete,
		loadCurrentProfile,
		clearMessages
	  } = useStudentProfile();

	  // ════════════════════════════════════════════
	  // 	LIFECYCLE HOOKS
	  // ════════════════════════════════════════════

	   onMounted(async () => {
	  	  await loadCurrentProfile();
	   });


	   // ══════════════════════════════════════
	   // 		MÉTODOS
	   // ══════════════════════════════════════

	    /**
	     * Manipula la actualizacion del Perfil */
	    async function onSubmitUpdate(): Promise<void> {
	    	clearMessages();

	    	const success = await controllerUpdate();

	    	if (success) {
	    		alert('El perfil ha sido actualizado exitosamente');
	    	}
	    }

		/**
	     * Manipula la eliminacion del Perfil */
	    async function onDelete(): Promise<void> {
	    	clearMessages();

	    	const success = await controllerDelete();

	    	if (success) {
	    		alert('El Perfil fue ELIMINADO exitosamente');
	    	}
	    }

		/**
	     * Abre el Modal de Contraseña */
	    function openPasswordModal(): void {
	    	emit('openPasswordModal');
	    }
		
		/**
	     * Formatea una fecha ISO a formato legible */
	   function formDate(isoDate: string): string {
	    	const date = new Date(isoDate);
	    	   return date.toLocalDateString('es-MX', {
	    	    			year: 'numeric',
	    	    			month: 'long',
	    	    			day: 'numeric'
	    	   });
	   }

</script>

<style scoped>
	/*==========================================
		ESTILOS DEL COMPONENTE DE EDICION DEL PERF.
		==========================================*/
	.edicion-perfil{
     background-color: #f8f9fa;
     border-radius: 8px;
     padding: 2rem;
     max-width: 700px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.titulo-seccion{
		text-align: center;
		color: #0d6ffd;
		margin-bottom: 1.5rem;
		font-size: 1.8rem;
		font-weight: bold;
	}
	/* Informacion del usuario */
	.info-usuario{
		background-color: #e7f3ff;
		border-left: 4px solid #0d6efd;
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-radius: 4px;
	}

	.info-usuario h3 {
		margin: 0 0 0.5rem 0;
		color: #0a58ca;
		font-size: 1.2rem;
	}
   
   .texto-secundario{
   	margin: 0;
   	color: #6c757d;
   	font-size: 0.9rem;
   }

     /* Alertas */
   .alerta {
   	padding: 0.75rem;
   	margin-bottom: 1rem;
   	border-radius: 5px;
   	font-size: 0.95rem;
   }

   .alerta-error {
   	background-color: #f8d7da;
   	color: #721c24;
   	border: 1px solid #c3e6cb;
   }

   .alerta-exito{
   	background-color: #d4edda;
   	color: #155724;
   	border: 1px solid #c3e6cb;
   }
   
   /* Formulario */
   .formulario-edicion{
   	display: flex;
   	flex-direction: column;
   	gap: 2rem;
   }	
     /* Secciónes */
   .seccion-inmutable,
   .seccion-editable {
   	background-color: white;
   	padding: 1.5rem;
   	border-radius: 6px;
   	border: 1px solid #dee2e6;
   }

   .seccion-inmutable {
   	background-color: #f1f3f5;
   }

   .subtitulo{
   	margin: 0 0 1rem 0;
   	color: #495057;
   	font-size: 1.1rem;
   	font-weight: 600;
   	border-bottom: 2px solid #dee2e6;
   	padding-bottom: 0.5rem;
   }

    /* Campos del Formulario */
   .campo-formulario {
   	display: flex;
   	flex-direction: column;
   	gap: 0.4rem;
   	margin-bottom: 1rem;
   }
 
   .campo-formulario:last-child {
   	margin-bottom: 0;
   }

   .campo-formulario label{
   	font-weight: 600;
   	color: #495057;
   	font-size: 0.95rem;
   }

   .campo-formulario input,
   .campo-formulario select {
   	padding: 0.75rem;
   	font-size: 1rem;
   	border: 1px solid #ced4da;
      border-radius:  5px;
      transition: border-color 0.3s box-shadow 0.3s;
      width: 100%;
   }

   .campo-formulario input:focus,
   .campo-formulario select:focus {
   	outline: none;
   	border-color: #0d6efd;
   	box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
   }

   .campo-inmutable{
   	background-color: #e9e6ef !important;
   	cursor: not-allowed;
   	color: #6c757d;
   	font-style: italic;
   }

   .campo-formulario input:disabled,
   .campo-formulario select:disabled {
   	background-color: #e9ecef;
   	cursor: not-allowed;
   }
   	/* Textos de Apoyo */
   .texto-ayuda {
   	font-size: 0.85rem;
   	color: #6c757d;
   }

   .botones-accion {
   	display: flex;
   	flex-direction: column;
   	gap: 1rem;
   	margin-top: 1rem;
   }

   .btn-actualizar,
   .btn-eliminar,
   .btn-cambiar-password {
   	padding: 0.75rem;
   	border: none;
   	border-radius: 5px;
   	font-size: 1rem;
   	font-weight: bold;
   	cursor: pointer;
   	transition: all 0.3s;
   }

   .btn-actualizar {
   	background-color: #0d6efd;
   	color: white;
   }	

   .btn-actualizar:hover:not(:disabled) {
   	background-color: #0b5ed7;
   	transform: translateY(-2px);
   }

   .btn-eliminar {
   	background-color: #dc3545;
   	color: white;
   }

   .btn-eliminar:hover:not(:diabled){
   	background-color: #bb2d3b;
   	transform: translateY(-2px);
   }


   .btn-cambiar-password {
   	background-color: #ffc107;
   	color: #000;
   }

   .btn-cambiar-password:hover:not(:disabled) {
   	background-color: #ffca2c;
   	transform: translateY(-2px);
   }

   .btn-actualizar:disabled,
   .btn-eliminar:disabled
   .btn-cambiar-password:disabled {
		  opacity: 0.6;
		  cursor: not-allowed;
	}

   .sin-perfil {
   	text-align: center;
   	padding: 3rem 2rem;
   	color: #6c757d;
   }

   .sin-perfil p {
   	font-size: 1.1rem;
   }

   @media (min-width: 768px){
   	.botones-accion {
   		flex-direction: row;
   		justify-content: space-between;
   	}

   	.btn-actualizar,
   	.btn-eliminar,
   	.btn-cambiar-password {
   		flex: 1;
   	}

   }

   @media (max-width: 768px) {
   	.edicion-perfil{
   		 padding: 1.5rem;
   	}

   	.titulo-seccion{
   		font-size: 1.5rem;
   	}
   }
</style>