<template>
	<aside class="material-list-container">
		<header class="list-header">
			<h2 class="header-title">
			 <span class="icon">📚</span>
			  Materiales Pendientes
			</h2>
			 <span class="counter-badge"> {{materials.length}} </span>
		</header>
	
	<div  v-if="loading" class="loading-container">
		<NameComponent></NameComponent>
	</div>
	<Componente2></Componente2>
	<ul class="materials-list">
		<li class="material-card">
		 	  <!-- Encabezado de Card -->
			<div class="card-header">
				<h3 class="material-title">{truncateTitle}</h3>
				<span v-if="isNew(material)" class="new-badge">Nuevo</span>
			</div>

			<div class="material-author">
				 <span class="author-icon"></span>
			     <span class="author-name"></span>
			</div>
		  	  <!-- Metada Mats adicional -->
			<div class="material-meta">
				<time class="material-date"  :date-time="material.fechaSubida">
					 {{formRelativeDate(material.fechaSubida)}}
			    </time>

			    <span class="material-subject">
			      {material.typeMaterial}
			    </span>
		    </div>
		    	 <!-- Indicador visual de seleccion -->
	    	<div v-if="material.id === currentMaterialId" class="active-indicator">
	    	     <span class="indicator-icon">📐</span>
	     	</div>
	    </li>
	</ul>
	  <!-- Indicador del Scroll [Scroll-Indicator]  -->
	  <div class="scroll-indicator">
	  	  <span class="scroll-text">Desliza para ver más</span>
	     <span class="scroll-icon">⬇️</span>
	  </div>
	  </aside>
</template>

<script setup lang="ts">

	import {ref, onMounted, onUnmounted} from 'vue';
	import { storeToRefs } from 'pinia';
	import { useModerationStore } from '@/stores/moderationStore';
	 import type {Material, Comentario} from '@/types/interfaces4';
	 import EmptyState from '@/components/common/EmptyState.vue';

	 /* ═══════════════════════
		  PROPS
	   ════════════════════════ */

	 interface Props {
	 	materials: Material[];
	 	currentMaterialId: string | null;
	 	loading?: boolean;
	 }

	 const props = withDefaults(defineProps<Props>(), {
	 	loading: false;
	 });

	 /* ═══════════════════════
		  EMTIS
	   ════════════════════════ */

	 interface Emits {
	 	(e: 'select', materialId: string): void;
	 }

	 const emit = defineEmits<Emits>();
		
	 /* ═══════════════════════
		  ESTADO LOCAL
	   ════════════════════════ */

	 const showScrollIndicator = ref(false);
	 const listElement = ref<HTMLElement | null>(null);

	  /* ═══════════════════════
		  METODOS
	     ════════════════════════ */
	   function selectMaterial(materialId: string): void {
	   	 emit('select', materialId);
	   }

	   /**
	    * Trunca el titulo si excede de 40 caracteres
	    * */
	    function truncateTitle(title: string, maxLength: number = 40): void {
	    	if (title.length <= maxLength) return title; 
    	  return title.substring(0, maxLength)+ '...';
	    }

	   /**
	    * Verfica si el material es nuevo (subido las ultimas 24 horas)
	    * */
	    function isNew(material: Material): boolean {
	    	const uploadDate = new Date(material.fechaSubida);
	    	const now = new Date();

	    	 const hoursDiff = (now.getTime() - uploadDate.getTime()) /(1000*60*60);

	    	 return hoursDiff < 24;
	    }

	 /**
	    * Formate la fecha en formato relativo
	    * */
	 function formRelativeDate(fecha: string | Date): string {
	    	const date = new Date(fecha);
    		 const now = new Date();

    	const diffMs = now.getTime() - date.getTime();
    	const diffsMinutes = Math.floor(diffMs/ (1000 *60));
    	const diffHours = Math.floor(diffMinutes/60);
    	const diffDays = Math.floor(diffHours/24)

    	 if (diffMinutes < 1) return 'Ahora mismo';
  		if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
  		if (diffHours < 24) return `Hace ${diffHours}horas`;
		if (diffDays === 1) return `Hace ${diffDays}días`;  
  		if (diffDays < 7) return `Hace ${diffDays}días`;

  			// Fecha completa para los materiales más antiguos
  		return date.toLocaleDateString('es-MX', {
  			day: 'numeric',
  			month: 'short'
  		})
	}

	/**
	    * Detecta si la lista tiene scroll para mostrar indicador
	    * */
	function checkScrollIndicator(): void {
		if(!listElement.value) return;

		const hasScroll = listElement.value.scrollHeight > listElement.value.clientHeight;
		 const isAtBottom = listElement.value.scrollHeight
		    - listElement.value.scrollTop === listElement.value.clientHeight;

		    showScrollIndicator.value =  hasScroll && !isAtBottom;
	}

	/** ═══════════════════════
		  CICLO DE VIDA
	   ════════════════════════ **/
	onMounted(() => {
		listElement.value = document.querySelector('.materials-list');

		if(listElement.value){
			listElement.value.addEventListener('scroll', checkScrollIndicator);
		}
	});

	onUnmounted(() => {
		if(listElement.value){
			listElement.value.removeEventListener('scroll', checkScrollIndicator);
		}
	})
	/*import { ref, computed, onUnmounted } from 'vue';
	import type { Material } from '@/types/interfaces4'
	import LoadingSpinner from '@/components/LoadingSpinner.vue';*/
</script>

<style scoped>
	.material-list-container {
	   display: flex;
	   flex-direction: column;
	   height: 100%;
	   background: white;
	   border-radius: 0.75rem;
	   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	   overflow: hidden;
	}

	/* ESTILOS DEL ENCABEZADO */
	.list-header {	
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, #f9fafb 0%, #fff 100%);
		position: sticky;  /*el chiste sticky-bit  [el bit pegaso fue un momento graciosos] */
		top: 0;
		z-index: 10;
	}


	.header-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-size: 1.115rem;
		font-weight: 700;
		color: #111827;
	}

	.header-title .icon {
		font-size: 1.25rem;
	}

	.counter-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		height: 2rem;
		padding: 0  0.625rem;
		background: #3b82f6;
		color: white;
		font-size: 0.875rem;
		font-weight: 700;
		border-radius: 9999px;
	}
	
	/*═══════════════════════*/
	/*	CARGADORE DE ESTADO	 */
	/*═══════════════════════*/
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		padding: 2rem;
	}

	/*═══════════════════════*/
	/*	 LISTA DE MATERIALES */
	/*═══════════════════════*/
	.materials-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
		list-style: none;
		margin: 0;
	}

	 /* Scrollbar personalizado */

	.materials-list::-webkit-scrollbar {
		width: 6px;
	}

	.materials-list::-webkit-scrollbar-track {
		background: #f3f4f6;
	}
	
	.materials-list::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 3px;
		/*width: 6px;*/
	}

	.materials-list::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}

	/*═══════════════════════*/
	/*	  CARD OF MATERIAL   */
	/*═══════════════════════*/
	 .material-card {
	 	position: relative;
	 	padding: 1rem;
	 	margin-bottom: 0.75rem;
	 	background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all;
	 }

	 .material-card: hover {
	 	border-color:#3b82f6;
	 	box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
	 	transform: translateY(2px);
	 }

	 .material-card:focus{
	 	outline: none;
	 	border-color: #3b82f6;
	 	box-shadow: 0 0 3px rgba(59, 130, 266, 0.1);
	 }

	 .material-card.is-active {
	 	border-color: #3b82f6;
	 	background: linear-gradient(135deg, #eff6ff 0%, #fff 100%);
	 	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
	 }

	 .material-title {
	 	outline: none;
	 	border-color: #54C449;
	 	transform: translateY(2px);
	 }

			
	/* .new-badge {  }*/

	 .material-author {
	 	display: flex;
	 	align-items: center;
	 	gap: 0.375rem;
	 	margin-bottom: 0.5rem;
	 }

	 .author-icon {
	 	font-size: 0.875rem;
	 	opacity: 0.7;
	 }

	 .author-name {
	 	font-size: 0.8125rem;
	 	color: #6b7280;
	 	font-weight: 500;
	 }

	 /*═══════════════════════*/
	/*		 METADATA		  */
	/*═══════════════════════*/
	.material-meta {
	   display: flex;
	   align-items: center;
	   justify-content: space-between;
	   gap: 0.5rem;
	}

	.material-date {
		font-size: 0.75rem;
		color: #9ca3af;
		font-weight: 500;
	}

	.material-subject {
	  padding: 0.125rem;
	  background: #f3f4f6;
	  color: #6b7280;
	  font-size: 0.6875rem;
	  border-radius: 0.25rem;
	  text-transform: uppercase;
	  letter-spacing: 0.025rem;
	}

	/** 
	 * EL INDICARDOR ACTIVO DE LA  LIST */
	.active-indicator {	
		position: absolute;
		left: -2px;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		height: 60%;
		background: #3b82f6;
		border-radius: 0 2px 2px 0;
	}

	.indicator-icon {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.75rem;
		color: #3b82f6;
		animation: bounceRigth 1s ease-in-out infinite;
	}
	 /* iNDICADOR DEL SCROLL */
	.scroll-indicator {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  gap: 0.5rem;
	  padding: 0.75rem;
	  background: linear-gradient(to bottom, transparent, #f9fafb);
	  border-top: 1px solid #e5e7eb;
	  font-size: 0.8125rem;
	  color: #6b7280;
	}

	.scroll-icon {
		animation: bounceDown  1.5s ease-in-out infinite;
	}

	/*═══════════════════════*/
	/*		 ANIMACIONES 	 */
	/*═══════════════════════*/
	@keyframes pulse {
          0%, 100%{
            opacity: 1;
          }

          50% {
            opacity: 0.7;
          }
    }

    @keyframes bounceRigth {
        0%,100% {
            transform: translateY(30px) translateY(0);
            /*opacity: 0;*/
        }

        50% {
            transform: translateY(-50%) translateY(4px);
            /*opacity: 1;*/
        }
    }

    @keyframes bounceDown {
        0%,100% {
            transform:  translateY(0);
            /*opacity: 0;*/
        }

        50% {
            transform: translateY(0); /*translateY(4px)*/
            /*opacity: 1;*/
        }
    }

    /**
     * ═══════════════════════
     *   RESPONSIVIDAD
     * ═══════════════════════*/

    @media (max-width: 1023px) {
     	.materials-list-container{
     		max-height: 400px;
     	}

     	.list-header {	
     	   padding: 1rem 1.125rem;
     	}

     	.header-title {
     	   font-size: 1rem;
     	}

     	.materials-list {
     	  padding: 0.5rem;
     	}

     	.material-card {
     	  padding: 0.875rem;
     	}
    }

    @media(max-width: 640px){
     	.material-title {
     	   font-size: 0.875rem;
     	}
     	
     	.author-name {
     		font-size: 0.75rem;
     	}

    }
    
</style>