<template>
	<div class="comment-form">
		<h5 class="form-title">Agregando Comentarios</h5>
	
		<form @submit.prevent="handleSubmit" >
			<div class="form-group">
				 <label for="" class="form-label">Mensaje del Comentario</label>
				 <textarea  id="" class="form-textarea">
				 	
				 </textarea>
			</div>
			<div class="text-area-footer">
				<span class="error-message"></span>
				 <span class="char-counter"  :class="{'limit-warnig'}" ></span>
			</div>

			<div class="form-group">
				<label for="" class="checkbox-label"></label>
				<input  v-model="FormData.highlighted" type="checkbox" class="checkbox-input" :disabled="loading">
					<span class="checkbox-text">
						<span class="icon">🌟</span>
						 Marcar como comentario destacado
					</span>
					<p class="help-text">
					 Los comentarios destacados tendran mayor visibilidad</p>
			</div>
			
			<div class="forms-action">
				<button  type="button" class="btn btn-secondary"
				 :disabled="loading"
				 @click="handleReset" >
					Limpiar
				</button>
				<button 
				  type="submit" class="btn btn-primary"		 
				  :disabled="loading || !isFormatValid">
					<span  v-if="loading" class="loading-spinner"></span>
					<span  v-else  class="icon"> 💬 </span>
					  {{ loading ? 'Enviando...': 'Agregar Comentario'}}
				</button>
			</div>			
		</form>
	</div>
</template>

<script setup lang="ts">
	import {reactive,computed, watch} from 'vue';

	/*==============================
	    PROPS
	  ==============================*/
	interface Props {
	   comentarios: Comentario[];
	   loading?: boolean;
	}

	const props = withDefaults(defineProps<Props>(), {
		loading: false,
	});

	interface Emits {
		(e: 'emit', payload: {message: string; highlighted: boolean }): void;
	}

	const emit = defineProps<Emits>();

	/*==============================
	    ESTADO DEL FORMULARIO
	  ==============================*/

	interface FormData {
		message: '' ;
		highlighted: boolean;
	}

	interface FormErrors {
		message?: string;
	}

	const errors = reactive<FormErrors>({});


	/*==============================
	    VALIDACION
	  ==============================*/

	const isFormatValid = computed(() => {
		 FormData.message.trim().length >= 10
		 FormData.message.trim().length <= 500;

	});


	function validateForm(): boolean {
		errors.message = undefined;

		const trimmedMessage = FormData.message.trim();

		if(!trimmedMessage){
			errors.message = 'El comentario no puede estar vacio';
			 return false;
		}

		if(trimmedMessage.length < 10){
			errors.message = 'El comentario debe tener al menos 10 caracteres';
			 return false;
		}

		if(trimmedMessage.length > 500){
			errors.message = 'El comentario no puede exceder de 500 caracteres';
			 return false;
		}

		return true;
	}

	// Limpiar los errores al escribir
	watch(() => FormData.message, ()  => {
		 if(errors.message){
		 	errors.message = undefined;
		 }
		
	});
	/*==============================
	    METODOS CONTROLADORES (AYUDA)
	  ==============================*/

	function handleSubmit(): void {
		if(!validateForm()){
			return;
		}

		emit('submit', {
			message: FormData.message.trim();
			highlighted: FormData.highlighted
		});
		 // Resetear form despues de enviar
		handleReset();
	}
	
	function handleReset():void {
		FormData.message = '';
		FormData.highlighted = false;
		errors.message = undefined;
	}
</script>

<style scoped>
  	
  	.comment-form {
  		padding: 1.25rem;
  		background: #f9fafb;
  		border: 1px solid #e5e7eb;
  		border-radius: 0.75rem;
  		margin-bottom: 2rem;
  	}

  	.form-title {
  	  font-size: 1rem;
  	  font-weight: 600;
  	  color: #111827;
  	  margin:  0 0 1rem 0;
  	}

 	.form-group{
 		margin-bottom: 1.25rem;
 	}

 	.form-group: last-of-type {
 		margin-bottom: 1.5rem;
 	}

 	.form-label {
 	   display: block;
 	   font-size: 0.875rem;
 	   font-weight: 500;
 	   color: #374151;
 	   margin-bottom: 0.5rem;
 	}

 	.form-textarea {
 		width: 100%;
 		padding: 0.75rem;
 		font-size: 0.9375rem;
 		line-height: 1.5;
 		color: #111827;
 		background: white;
 		border: 2px solid #d1d5db;
 		border-radius: 0.5rem;
 		resize: vertical;
 		transition: all 0.2s ease;
 		font-family: inherit;
 	}

 	.form-textarea:focus {
 		outline: none;
 		border-color: #3b62f6;
 		box-shadow: 0 0 3px  rgba(59, 130, 246, 0.1);
 	}

 	.form-textarea.has-error {
 		border-color: #ef4444;
 	}

 	.form-textarea.has-error:focus {
 		box-shadow: 0 0 3px rgba(239, 68, 68, 0.1);
 	}

 	.form-textarea.diabled {
 		background: #f3f4f6;
 		cursor: not-allowed;
 		opacity: 0.6;
 	}

 	.form-textarea::placeholder {
 		color: #9ca3ef;
 	}
    /*===============================
       TEXTAREA FOOTER
      ===============================*/
 	.text-area-footer {
 	 	display: flex;
 	 	justify-content: space-between;
 	 	align-items: center;
 	 	margin-top: 0.5rem;
 	 	gap: 1rem;
 	}

 	.error-message {
 		font-size: 0.8125rem;
 		color: #ef4444;
 		font-weight: 500;
 	}

 	.char-counter {
 		font-size: 0.8125rem;
 		color: #6b7280;
 		font-weight: 500;
 		margin-left: auto;
 	}

 	.char-counter.limit-warnig {
 		color: #f59e0b;
 	}
 	/*=====================================
      STYLES LA CASILLA VERFIFIC (checkbox)
      ======================================*/
 	.checkbox-label {
     display: flex;
     align-items: center;
     gap: 0.7;
     cursor: pointer;
     user-select: none;
 	}

 	.checkbox-input {
 		width: 1.25rem;
 		height: 1.125rem;
 		cursor: pointer;
 		accent-color: #22c55e;
 	}

 	.checkbox-input: disabled {
 		cursor: not-allowed;
 		opacity: 0.5;
 	}

 	.checkbox-text {
 		display: flex;
 		align-items: center;
 		gap: 0.375rem;
 		font-size: 0.9375rem;
 		font-weight: 500;
 		color: #374151;
 	}	

 	.checkbox-text .icon {
 		 font-size: 1rem;
 	}	

 	.help-text {
 		 margin: 0.5rem 0 0 2rem;
 		 font-size: 0.8125rem;
 		 color: #6b7280;
 		 font-style: italic;
 	}

 	  /*===========================
	   	 	 BOTONES DE ACCION
	    ===========================*/
	   .forms-action {
	   	 display: flex;
	   	 gap: 0.75rem;
	   	 justify-content: flex-end;
	   }

	   .btn{
	   	 display: inline-flex;
	   	 align-items: center;
	   	 gap: 0.5rem;
	   	 padding: 0.625rem 1.25rem;
	   	 font-size: 0.9375rem;
	   	 font-weight: 600;
	   	 border:  none;
	   	 border-radius: 0.5rem;
	   	 cursor: pointer;
	   	 transition: all 0.2s ease;
	   }

	   .btn:disabled{
	   		cursor: pointer;
	   		opacity: 0.5;
	   }

	   .btn-secondary{
	   	 color: #374151;
	   	 background: white;
	   	 border: 1px solid #d1d5db;
	   }

	   .btn-secondary:hover:not(:disabled) {
	   	  background: #f9fafb;
	   	  border-color: #9ca3af;
	   }


	   .btn-primary{
	   	 color: white;
	   	 background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	   	  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
	   }

	   .btn-primary:hover:not(:disabled) {
	   	  background: linear-gradient(135deg,#2563eb 0%, #1d43d8 100%);
	   	  box-shadow: 0 4px 6px rgba(59, 130, 246,0.3);
	   	  transform: translateY(-1px);
	   }


	   .btn .icon{
	   	 font-size: 1.125rem;
	   }

	   /*============================
			 LOADING SPINNER
	     ============================*/
	   .loading-spinner {
	   	 display: inline-block;
	   	 width: 1rem;
	   	 height: 1rem;
	   	 border: 2px solid rgba(255, 255, 255, 0.3);
	   	 border-top-color: white;
	   	 border-radius: 50%;
	   	 animation: spin 0.6 linear infinite;
	   }

	   @keyframes spin{
	   	  to {
	   	  	transform: rotate(360deg);
	   	  }
	   }

</style>