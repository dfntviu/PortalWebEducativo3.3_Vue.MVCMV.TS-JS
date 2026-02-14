<template>
	<section class="comentarios-cronologicos">
		<header class="section-header">
			<h4 class="section-title">
			  <span class="icon">🧸</span>
		  		Historial de Cambios
			</h4>	

			<div class="header-controls">
				<span class="badge">
				  {{comentarios.length}}
				</span>
				<select v-model="sortOrder" class="sort-select" id="">
					<option value="desc" class="desc">Más Recientes</option>
					<option value="asc" class="desc">Más Antigüos</option>
				</select>
			</div>
		</header>

		<div class="empty-state">
			<div class="empty-icon">💬</div>
			<p class="empty-message">No hay comentarios para este material</p>
			<p class="empty-hint">Los comentarios aparecerán aquí, una vez que los profesores los agreguen.</p>
		</div>

		<TransitionGroup class="comentarios-list">
			<li class="comentario-item"
			  v-for="comentario in sortedComentarios"
			  :key="comentario.id"
			  :class="{ 'is-highligthed': comentario.destacado}">
				<div class="timeline-marker">
					<div class="marker-dot" :class="getMarkerClass(comentario)"></div>
					<div class="marker-line"></div>
				</div>
				<div class="comentario-card">
					<div class="comentario-header">
						<div class="autor-info">
							 <span class="autor-avatar">
						     	{{getInitials(comentario.autorNombre)}}
						  	</span>
						  	<div class="autor-details">
						  		<span class="autor-nombre">
						  			{{comentario.autorNombre  || 'Profesor'}}
						  	    </span>
						  	<time class="fecha" :datetime="comentario.fecha">
						  		{{formatFullDate(comentario.fecha)}}
						  	</time>
						</div>
					</div>

					<div class="status-badges">
						  <span class="badge destacado">
						  	Destacado🌟
						  </span>
						  <span class="badge tiempo">
						  	  {getRelative(comenatio.fecha)}
						  </span>
				  	</div>
				  	<!-- Mensaje -->
				  	<div class="comentario-body">
				  		<p class="mensaje">{{comentario.message}}</p>
				  	</div>

				  	<div class="comentario-footer">
				  		  <button class="action-btn secondary" @click="emitUpdate(comentario)">
				  		  	 <span class="icon">✏️</span>
				  		  	 <span class="text">Editar</span>
				  		  </button>
				  		  <button class="icon">
				  		  	<span class="icon">🌟</span>
				  		     <span>Destacar</span>
				  		</button>
				  		<button class="action-btn danger">
				  			<span>🗑️</span>
				  			<span class="text">Eliminar</span>
				  		</button>
				    </div>
				</div>
			</li>
		</TransitionGroup>
	</section>
</template>

<script lang="ts">
	import {ref, computed} from 'vue';
	import type {Comentario} from '@/types/interfaces4'


	/*────────────────────────────────
		 PROPS 
	  ────────────────────────────────*/
	interface Props {
		comentarios: Comentario[];
		loading?: boolean;
	}

	const props = widthDefaults(defineProps<Props>(), {
		loading: false;
	};

  const emit = defineEmits<Emits>();
  // =========================
  //   ESTADO LOCAL
  // =========================
  const sortOrder = ref<'asc'| 'desc'>('desc');

  // ========================
  // 	PROPS COMPUTADAS
  // ========================
   const sortedComentarios = computed(() =>{
   	   const sorted = [...props.comentarios].sort((a,b) => {
   	   		const dateA = new Date(a.fecha).getTime();
   	   		const dateB = new Date(b.fecha).getTime();

   	   		 return sorted.value === 'desc' ? dateB - dateA : dateA - dateB;
   	    });
   	   return sorted;
   });


    function formatFullDate(fecha:string | Date): string {
    	const date = new Date(fecha);
 	  return date.toLocaleDateString('es-MX', {
    	weekday: 'long',
    	year: 'numeric',
    	month: 'long',
    	day: 'numeric',
    	hour: '2-digit',
    	minute: '2-digit',
  	  });
    }

    function getRelative(fecha:string | Date): string {
    	const date = new Date(fecha);
    	const now = new Date();
    	const diffMs = now.getTime() - date.getTime();
    	const diffsMinutes = Math.floor(diffMs/ (1000 *60));
    	const diffHours = Math.floor(diffMinutes/24);
    	const diffDays = Math.floor(diffHours/24)

    	 if (diffMinutes < 1) return 'Ahora mismo';
  		if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
  		if (diffHours < 24) return `Hace ${diffHours}horas`;
		if (diffDays < 7) return `Hace ${diffDays}dias`;  
		if (diffDays < 30) return `Hace ${Math.floor(diffDays/7) }semanas`;		

		return `Hace:  ${Math.floor(diffDays/30) meses}`;
    }

    function getInitials(nombre?: string): string {
    	if(!nombre) return 'P';

    	const words = nombre.trim().split('');
    	if(words.length>=2){
    		return `${words[0][0]}${words[1][0]}`.toUpperCase();
    	}

    	return nombre.substring(0,2).toUpperCase();
    }

    function getMarkerClass(comentario: Comentario): string {
    	 const now = new Date();
    	 const commentDate = new Date(comentario.fecha);
    	 const hoursAgo = (now.getTime() - commentDate.getTime() / (1000*60*60));

    	 if(comentario.destacado) return 'marker-destacado';
    	 if(hoursAgo<24) return 'marker-fresh';
    	 if(hoursAgo<72) return 'marker-recent';

    	 return 'marker-old';
    }


    function handlerSortChange():void {
    	console.log(`[Componente: Comentarios Cronologicos]: Orden modificado a: ${sortOrder.value} `);
    }


    function emitUpdate(comentario: Comentario): string {
    	emit('update', {
    		commentId: comentario.id,
    		message: comentario.message,
    		highlighted: comentario.destacado,
    	});
    }

    function emitToggleEmitligth(comentario: Comentario): void {
    	emit('update', {
    		commentId: comentario.id,
    		message: comentario.message,
    		highlighted: true,
    	});
    }

    function emitDelete(commentId: string): void {
    	if(confirm('Estás seguro de eliminar este comentario?')){
    		emit('delete', commentId);
    	}
    }

</script>


<style scoped>
	.comentarios-cronologicos {
	   padding: 1.25rem;
       background: white;
       border-radius: 0.75rem;
       border: 1px solid #e5e7eb;
	}

	.section-header {
		 display: flex;
         align-items: center;
         justify-content: space-between;
         margin-bottom: 1.5rem;
         padding-bottom: 1rem;
         border-bottom: 2px solid #f3f4f6;
	}

	.section-title {
		display: flex;
       align-items: center;
       gap: 0.5rem;
       font-size: 1rem;
       font-weight: 600;
       color: #111827;
       margin: 0;
	}

	.section-title .icon {
  	   font-size: 1.25rem;
	}
	
	.header-controls {
	  display: flex;
	  align-items: center;
	  gap: 1rem;
	}	

	.badge {
		display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.5rem;
        background: #3b82f6;
        color: white;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 9999px;
	}

	.sort-select {
		padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
	}	

	.sort-select:hover {
		border-color: #3b82f6;
	}	

	.sort-select:focus {
		outline: none;
		border-color: #3b82f6;
  		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.empty-state {
		display: flex;
  		flex-direction: column;
  		align-items: center;
  		justify-content: center;
  		text-align:center;
  		padding:3rem 1rem ;  /**sw  <**/
	}

	.empty-icon {
		font-size: 3rem;
  		margin-bottom: 1rem;
  		opacity: 0.5;
	}

	.empty-message {
		font-size: 1rem;
		font-weight: 600;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.empty-hint {
	   font-size: 0.875rem;
	   color: #9ca3af;
	   max-width: 300px;
	}
	/* ====================================
   		LISTA CON TIMELINE
   	  ==================================== */
	.comentarios-list {
		display: flex;
		flex-direction: column;
		gap:0;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.comentario-item {
		display: flex;
	   gap: 1rem;
	   position: relative;

	}

	.comentario-item:not(:last-child) {
		margin-bottom: 1.5rem;
	}

	.timeline-marker {
     	display: flex;
       flex-direction: column;
       align-items: center;
       padding-top: 0.5rem;
	}

	.marker-dot {
	   width: 0.875rem;
  	   height: 0.875rem;
  	   border-radius: 50%;
  	   border: 2px solid white;
  	   box-shadow: 0 0 2px currentColor;
  	   z-index: 1;
	}

	/*.marker-dot{  }*/

	/** TIPOS DE MARCADORES**/

	.marker-dot.marker-destacado {
	       color: #22c55e;
	  background: #22c55e;
	}

	.marker-dot.marker-fresh {
		   color: #3b82f6;
      background: #3b82f6;
	}

	.marker-dot.marker-recent {
		  color: #8b5cf6;
     background: #8b5cf6;
	}


	.marker-dot.marker-old {
		   color: #9ca3af;
      background: white;
	}


	.marker-line {
		flex: 1;
		background: linear-gradient(to bottom, currentColor 0%, transparent 100%);
  		color: #e5e7eb;
  		margin-top: 0.25rem;
	}


	.comentario-item.is-highligthed.marker-line {
		display: none;
	}	
	

	/* ════════════════════════════════════
   	  CARD DEL COMENTARIO
   	 ════════════════════════════════════ */

	.comentario-card {
		flex: 1;
		padding: 1rem;
		background: white;
		border: 1px solid #e5e7eb;
  	   border-radius: 0.5rem;
  	   transition: all 0.2s ease
	}

	.comentario-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.comentario-item:is-highligthed.comentario-card {
		border-color: #86efac;
		background: linear-gradient(135deg, #f0fdf4 0%, white 100%);
	}

   .comentario-header {
     display: flex;
     align-items: center;
     justify-content: space-between;
     margin-bottom: 0.75rem;
     gap: 1rem;
   }

   .autor-info {
   	  display: flex;
   	  align-items: center;
   	  gap: 0.75rem;
   }

   .autor-avatar {
   	 display: flex;
   	 align-items: center;
   	 justify-content: center;
   	 width: 2.5rem;
   	 height: 2.5rem;
   	 background: linear-gradient(135deg, #3b82f6, #8b5cf6);
   	 color: white;
   	 font-size: 0.875rem;
   	 font-weight: 700;
   	 border-radius: 50%;
   }

   .autor-details {
   	 display: flex;
   	 flex-direction: column;
   }

   .autor-nombre {
   	font-size: 0.9375rem;
   	font-weight: 600;
   	color: #111827;
   }


   .fecha {
   	font-size: 0.75rem;
   	color: #6b7280;
   }

   .status-badges {
   	  display: flex;
   	  flex-direction: column;
   	  align-items: flex-end;
      gap: 0.25rem;
   }

   .badge.destacado {
   	 background: #22c55e;
   }
   
   .badge .tiempo {
   	background: #9ca3af;
   	font-size: 0.6875rem;
   }

   /*════════════════════════════════════
      CUERPO DE COMENTARIO
   ════════════════════════════════════*/

   .comentariobody {
   	 margin-bottom: 1rem;
   }

   .mensaje {
   	 margin: 0;
   	 font-size: 0.9375rem;
   	 line-height: #374151;
   	 white-space: pre-wrap;
   	 word-break: break-word;
   }
   /*════════════════════════════════════*/
   /*    PIE CON ACCIONES*/
   /*════════════════════════════════════*/
   .comentario-footer {
   	 display: flex;
   	 gap: 0.5rem;
   	 padding-top: .75rem;
   }

   .action-btn {
   	  display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
   }

   .action-btn.secondary {
   	 color: #6b7280;
   	 background: white;
   	 border-color: #d1d5db;
   }

   .action-btn.secondary:hover {
   	 background: #f9fafb;
     border-color: #9ca3af;
     color: #374151;
   }


   .action-btn .danger {
     color: #dc2626;
     background: white;
     border-color: #fecaca;
    }

   .action-btn.danger:hover{
   	 background: #fef2f2;
    border-color: #ef4444;
   }

   .action-btn.icon {
   	 font-size: #1rem;
   }

   .action-btn.text {
   	 font-size: 0.8125rem;
   }
  /*════════════════════════════*/
  /* 	TRANSICIONES   			*/
  /* ═══════════════════════════*/
</style>