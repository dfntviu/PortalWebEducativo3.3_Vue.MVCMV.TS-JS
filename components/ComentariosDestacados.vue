<template>
	<section class="comentarios-destacados">
		<header class="section-header">
			<h4 class="section-title">
			  <span class="icon">🌟</span>
		  		Comentarios Destacados
			</h4>	
			 	<span v-if="comentarios.length>0"  class="icon">
				  {{comentarios.length}}
				</span>
		</header>

			<div v-if="comentarios.length === 0" class="empty-state">
				<p class="empty-message">No hay comentarios destacados</p>
			</div>

			<!-- Lista de Comentarios destacados -->
		<TransitionGroup v-else name="destacado" tag="ul" class="comentarios-list">
			<li class="comentario-item"
			  v-for="comentario in comentarios"
			  :key="comentario.id"
			  :class="{ getColorClass(comentario)}">
				
						<!-- Contenido del comentario -->
				<div class="comentario-content">
					<div class="comentario-header">
						 <span class="autor">
					     	{{ comentario.autorNombre || 'Profesor'}}
					  	</span>
					  	<time class="fecha" :datetime="comentario.fecha">
					  		{{formatDate(comentario.fecha)}}
					  	</time>

					  	<p class="mensaje">{{comentario.message}}</p>
					  		 <!-- Indicador del Estado -->
					  	<span class="destacado-badge">Destacado</span>
					</div>
				</div>

					  	<!-- Acciones (al perm. en modo loading) -->
					<div v-if="!loading" class="comentario-actions">
						<button 
						    class="action-btn edit" 
						     title="Editar Comentario"
						     @click="emitUpdate(comentario)">
				  		  	 <span class="icon">✏️</span>
						 </button>
						 <button 
						    class="action-btn delete" 
						     title="Eliminar Comentario"
						     @click="emitDelete(comentario.id)">
						       <span class="icon">🗑️</span>
						  </button>
				  	</div>
			</li>
		</TransitionGroup>
	</section>
</template>

<script  setup lang="ts">
	import {computed} from 'vue';
	import type {Comentario} from '@/types/interfaces4';


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


	// ==========================
	//   EMITS
	// ==========================
	interface Emits {
		(e: 'update', payload: {commentId: string; message: string;
		 highigthted:boolean }): void;
		(e: 'delete', commentId: string): void;
	}

	const emit = defineProps<Emits>();


	// ====================================
	//    LOGICA DE COLOR POR REFERENCIA
	// ====================================

	/**
	 *  Asigna clase de color segun la antigüedad de comentario
	 *  - Verde	 brillante: menos de 24 horas
	 *  - Verde medio: 1-3 día hábiles
	 *  - Verde claro: más de 3 días */
	function getColorClass(comentario: Comentario): string {
		 const now = new Date();
		 const commentDate = new Date(comentario.fecha);

		 const hoursAgo = (now.getTime() - commentDate.getTime() / (1000*60*60));

		 if(hoursAgo<24){  //verde brillante
		 	return 'color-fresh';
		 } else if(hoursAgo<72){
		 	 return 'color-recent';  //verde medio
		 } else {
		 	 return 'color-old';  // verde claro
		 }
	}

	// ================================
	//    FORMATO DE FECHA
	// ================================

	function formatDate(fecha: string | Date): string {
		const date = new Date(fecha);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs /(1000*60*60) );
		const diffDays = Math.floor(diffHours /24);


		if(diffHours < 1){
			 const diffMinutes = Math.floor(diffMs/ (1000*60));
			 const `Hace ${dif} minutos`;
		}

		if(diffHours <24){
			const `Hace  ${diffHours} horas`;
		}

		if(diffDays < 7) {
			return `Hace ${diffDays} días`;
		}

		return date.tolocaleDateString('es-MX', {
			day: 'numeric',
			month: 'short',
			year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
		});
	}

	// ===============================
	//     HANDLERS DE EVENTOS
	// ===============================
	function emitUpdate(comentario: Comentario): void {
		emit('update', {
    		commentId: comentario.id,
    		message: comentario.message,
    		highlighted: comentario.destacado,
  		});
	}

	function emitDelete(comentario: Comentario): void {
		if(confirm('Estás seguro de eliminar el comentario destacado?')){
    		emit('delete', commentId);
    	}
	}


</script>

<style scoped>
	.comentarios-destacados {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 0.75rem;
  border: 2px solid #86efac;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #15803d;
  margin: 0;
}

.section-title .icon {
  font-size: 1.25rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  background: #22c55e;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
}

/* ====================================
   ESTADO VACÍO
   ==================================== */
.empty-state {
  padding: 2rem;
  text-align: center;
}

.empty-message {
  color: #16a34a;
  font-size: 0.875rem;
  font-style: italic;
}

/* ====================================
   LISTA DE COMENTARIOS
   ==================================== */
.comentarios-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.comentario-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border-left: 4px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.comentario-item:hover{
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
	transform: translateY(-2px);
}


/* ====================================
   LÓGICA DE COLOR POR RECENCIA
   ==================================== */
	/* Verde brillante: comentarios muy recientes (< 24h) */
	/*.comentario-item.color-fresh {
	  border-left-color: #22c55e;
	  background: linear-gradient(to right, #f0fdf4, white);
	}*/

	/* Verde medio: comentarios recientes (1-3 días) */
	.comentario-item.color-recent {
	  border-left-color: #4ade80;
	  background: linear-gradient(to right, #f0fdf4, #fefefe);
	}
	
	/* Verde claro: comentarios antiguos (> 3 días) */
	.comentario-item.color-old {
	  border-left-color: #86efac;
	  background: white;
	}

/* ====================================
   CONTENIDO DEL COMENTARIO
   ==================================== */
.comentario-content {
	 flex: 1;
}

.comentario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.autor {
  font-size: 0.875rem;
  font-weight: 600;
  color: #15803d;
}

.fecha {
  font-size: 0.75rem;
  color: #6b7280;
}
	/** Copie gran parte, personalice poco. Pero que mas da, entiendo muy bien el origen y c/prop.* */
/*.mensaje {
  margin: 0.5rem 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
}*/

.destacado-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #22c55e;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}


/* ====================================
     ACCIONES
   ==================================== */

.comentario-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.action-btn.edit:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}
	
/*.action-btn.delete:hover {
	background: #fee2e2;
	border-color: #ef4444;
}
*/
.action-btn{
	font-size: 1rem;
}

/* ====================================
   TRANSICIONES
   ==================================== */
.destacado-enter-active,
.destacado-leave-active {
  transition: all 0.5s ease;
}

/*.destacado-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}*/

.destacado-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
 
 /*.destacado-move {
 	transition:  transform 0.5s ease;
 }*/
 
</style>