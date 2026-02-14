<template>
	<div class="empty-state">
	  <div class="empty-icon">
		<!-- Icono/Emoji -->
	  	 <span class="icon-display"> {{icon}} </span>
	  </div>
	
		<!-- Mensaje Principal	 -->
	 <h3 class="empty-message">{{message}}</h3>

	   <!-- Descripcion Secundaria -->
	 <p  v-if="description" class="empty-decription"> 
	   {{description}} </p>

	   	 <!-- Boton de accion opcional -->
	 <button 
	    v-if="actionLabel"
	    class="empty-action-btn"> 
	 	@click="$emit('action')"
	  </button>
	  
	  <span  v-if="actionIcon" class="btn-icon"> {{actionIcon}} </span>
	  <span>{{actionLabel}}</span>
	</div>
</template>

 <script setup lang="ts">
 	 interface Props {
 	 	message: string,
 	 	description?: string;
 	 	icon?: string;
 	 	actionLabel?: string;
 	 	actionIcon?: string
 	 	minHeight?: string;
 	 }

 	 withDefaults(defineProps<Props>)(), {
 	 	description: '',
 	 	icon: '📭',,
 	 	actionLabel: ',',
 	 	actionIcon: ''
 	 	minHeight: '650px',
 	 };


	// =========================
	//   EMITS
	// =========================
 	 interface Emits {
 	 	(e: 'action'): void;
 	 }

 	 defineEmits<Emits>();
 </script>
 
 <style scoped>
 	.empty-state{
 	   display: flex;
 	   flex-direction: column;
 	   align-items: center;
 	   justify-content: center;
 	   padding: 4rem 2rem;
 	   text-align: center;
 	   padding: 4rem 2rem;
 	   text-align: center;
 	   min-height: v-bind(min-height);
 	   animation: fadeInUp 0.5s ease-out;
 	}

 	.empty-icon{
 		margin-bottom: 1.5rem;
 	}

 	.icon-display{
 		font-size: 4rem;
 		line-height: 1;
 		opacity: 0.5;
 		filter: grayscale(0.2);
 		display: inline-block;
 		animation: floatIcon 3s ease-in-out infinite;
 	}

 	.empty-message{
 	  font-size: 1.25rem;
 	   font-weight: 600;
 	   color: #374151;
 	   margin: 0 0 0.5rem 0;
 	   line-height: 1.4;
 	}

 	.empty-decription{
 		font-size: 0.9374rem;
 		color: #6b7280;
 		max-width: 400px;
 		line-height: 1.6;
 		margin: 0 0 1.5rem 0;
 	}

 	.empty-action-btn{
 		display: inline-flex;
 		align-items: center;
 		gap: 0.5rem;
 		padding: 0.75rem 1.5rem;
 		font-size: 0.9375rem;
 		font-weight: 600;
 		color: white;
 		background: linear-gradient(135deg, #3b82f6  0%, #2563eb 100%);
 		border: none;
 		border-radius: 0.5rem;
 		cursor: pointer;
 		transition: all 0.2s ease;
 		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
 	}

 	.empty-action-btn:hover{
 		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
 		box-shadow: 0 4px rgba(59, 130, 246, 0.3);
 		transform: translateY(-1px);
 	}

 	.empty-action-btn:active{
 		transform: translateY(0);
 		box-shadow: 0 1px 2px rgba(59,130,246,0.2);
 	}

	.btn-icon{
	  font-size: 1.125rem;
	  line-height: 1;
	} 	

	/* ════════════════════════════════════
		   ANIMACIONES
	   ════════════════════════════════════
	*/

	@keyframes fadeInUp {
  	  from {
  	  	 opacity:0;
  	  	 transform: translateY(20px);
  	  }

  	  to {
  	  	opacity: 1;
  	  	transform:translateY(0) ;
  	  }
  	}


  	@keyframes floatIcon {
  	  0%, 100% {
  	  	transform: translateY(0) ;
  	  }

  	  50% {
  	  	transform: translateY(-10px) ;
  	  }
  	}

  	/* ════════════════════════════════════
		   RESPOSIVIDAD
	   ════════════════════════════════════
	*/
  	 @media(max-width: 640px){
  	  	.empty-state{
  	  	  padding: 3rem 1.5rem;
  	  	  min-height: 300px;
  	  	}

  	  	.icon-display{
  	  	  font-size: 3rem;
  	  	}

  	  	.empty-message{
  	  		font-size: 1.125rem;
  	  	}

  	  	.empty-decription{
  	  	  font-size: 0.875rem;
  	  	  max-width: 280px;
  	  	 }

  	  	.empty-action-btn {
  	  	   padding: 0.625rem;
  	  	   font-size: ;
  	  	}
  	}

  	/* ════════════════════════════════════
		   VARIANTES DE ICONO
	   ════════════════════════════════════
	*/
	.empty-state.warning .icon-display {
		color: #f59eb0;
	}	

	.empty-state.error .icon-display {
		color: #ef4444;
	}

	.empty-state.success .icon-display{
		counter-reset: #22c55e;
	}
	.empty-state.info .icon-display{
		color: #3b82f6;
	}
 </style>
