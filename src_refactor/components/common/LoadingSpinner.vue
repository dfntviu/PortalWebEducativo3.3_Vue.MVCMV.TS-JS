<template>
	 <!-- Modo FullScreen con overlay -->
	<div v-if="fullscreen" class="loading-overlay">
		<div class="spinner-container">
			 <div class="spinner">
				<p class="spinner-message">{{message}}</p>
			 </div>
		</div>
	</div>

	 <!-- Modo inline -->
	<div class="spinner-inline" :class="alignClass">
		<div class="spinner"
		    :class="size"
			:style="spinnerStyle"
			  role="status"
			  aria-label="message || 'Cargando contenido..'"
		    >
			   <span class="src-only"> {{message || 'Cargando...'}} </span>
	   </div>
	   <span v-if="message" class="inline-message"> {{message}} </span>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	interface Props {
		size?: 'small' | 'medium' | 'large';
		message?: string;
		fullscreen?: boolean;
		color?: string;
		align?: 'left'| 'center'| 'rigth';
	}

	interface props = widthDefaults(defineProps<Props>(), {
	   size: 'medium',
	   message: '',
	   fullscreen: false,
	   color: '#3b82f6'
	   align: 'center'
	});

	/* ══════════════════════════════════
		   METODOS COMPUTADOS
	   ══════════════════════════════════
	*/

	const spinnerStyle = computed(() => ({
		'--spinner-color': props.color,
	}));

	const alignClass = computed( () => { `align- ${props.align}`});
</script> 

<style scoped>
	/* ════════════════════════
		   VARIABLES
	   ════════════════════════
	*/

	:root {
		--spinner-color: #3b82f6;
	}

	/* ========================= 
	 	  VZRIABLES
	   =========================*/
	 .src-only {
	 	 position: absolute;
	 	 width: 1px;
	 	 height: 1px;
	 	 padding: 0;
	 	 margin: -1px;
	 	 overflow: hidden;
	 	 clip: rect(0, 0, 0, 0);
	 	 white-space: nowrap;
	 	 border-width: 0;
	 }

	.loading-overlay{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		animation: fadeIn 0.2s ease-out;
	}

	.spinner-container {
		background: white;
		padding: 2rem;
		border-radius: 0.75rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
				    0 10px 10px -5px rgba(0, 0, 0, 0.4); 
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 200px;
	}

	.spinner-message {
		margin: 0;
		font-size: 0.9375rem;
		color: #374151;
		text-align: center;
		font-weight: 500;
	}

	.spinner-inline{
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
	}

	.spinner-inline.align-left {
		justify-content: flex-start;
	}

	.spinner-inline.align-center {
		justify-content: center;
	}

	.spinner-inline.align-right {
		justify-content: flex-end;
	}


	.inline-message {
		font-size: 0.875rem;
		color: #6b7280;
	}



	.spinner {
	  border-radius: 50%;
	  border-style: solid;
	  border-color:  rgba(59, 130, 246, 10.1);
	  border-top-color: var(--spinner-color);
	  animation:  spin 0.8s linear infinite;
	}

	.spinner.small {
		width: 1rem;
		height: 1rem;
		border-width: 2px;
	}

	.spinner.medium {
	  width: 2em;
	  height: 2rem;
	  border-width: 3px;
	}

	.spinner.large {
		width: 3rem;
		height: 3rem;
		border-width: 4px;
	}

	/* ========================= 
	 	  ANIMACIONES
	   =========================*/
	    @keyframes spin {
	   	  to {
	   	  	 transform: rotate(360deg);
	   	  }
	    }

	    @keyframes fadeIn {
	   		from {
	   		  opacity: 0;
	   		}

	   		to {	
	   		  opacity: 1;
	   		}
	    }

	  /* ========================= 
	 	 	 RESPONSIVO    
	     =========================*/

	    @media (max-width: 640px) {
	    	.spinner-container {
	    		padding: 1.5rem;
	    		min-width: 160px;
	    	}

	    	.spinner-message {
	    		font-size: 0.875rem;
	    	}	
	    }
</style>