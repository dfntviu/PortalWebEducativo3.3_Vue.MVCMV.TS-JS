<template>
	<div class="moderation-view">
		<header class="moderation-header">
			 <h1 class="title">Panel de Moderación de Materiales</h1>
			 <!-- <ModerationStats
			    :stats="statistics"
			    :loading="isLoadingStats"
			 /> por el momento no disponible -->
		</header>
			 	<!-- Estado de carga Inicial -->
			  <LoadingSpinner v-if="isInitLoading" message="Cargando materiales pendientes..."/>
			  	
			  	<!-- Estado Vacio -->
			    <EmptyState 
			   	  v-else-if="!hasPendingMaterials && !isInitialLoading"
			   	  message="No hay materiales pendientes para moderacion"
			   	  icon="check-circle"
			    />

			     <!-- Contenido Principal -->
			    <main class="moderation-content">
			    	<!-- Panel de materiales Pendientes -->
			    	 <section class="materials-panel">
			    	 	<h2 class="section-title">Sus Materiales Pendientes</h2>
			    	 	 <MaterialList  
			    	 	 	:materials="pendingMaterials"
			    	 	 	:current-material-id="currentMateriald"
			    	 	 	@select="handleSelectMaterial"
			    	 	 />
			    	 </section>

			    	 <!-- Panel de revisión de mtaerial seleccionado -->
			    	<section v-if="" class="review-panel">
			    	 	 <MaterialReview
			    	 	 	:material="selectedMaterial"
			    	 	 	:loading="isActioning"
			    	 	 	 @approve="handleApprove"
			    	 	 	 @reject="handleReject"
			    	 	 />

			    	 	 <!-- Modulo de Comentarios -->
			    	 	 <div class="comments-module">
			    	 	 	<h3 class="subsection-title">Gestión de Comentarios</h3>

			    	 	 	<!-- Componente- Formulario para aniadir comentario -->
			    	 	 	 <CommentForm 
			    	 	 	     :loading="isActioning"
			    	 	 	     @submit="handleAddComment"
			    	 	 	 />
			    	 	 	 <!-- Componente p/los Comentarios Destacados -->
			    	 	 	 <ComentariosDestacados
			    	 	 	    :comentarios="highLigthedComments"
			    	 	 	    :loading="isLoadingComments"
			    	 	 	    @update="handleUpdateComment"
			    	 	 	    @delete="handleDeleteComment"
			    	 	 	 />

			    	 	 </div>
			    	</section>	

			    	  <!-- Mensaje cuando no hay material seleccionado -->
			    	   <section class="no-selection">
			    	   	 <p class="hint">Selecciona un material para comenzar la revisión.</p>
			    	   </section>
			    </main>
			       <!-- Notificaciones y errores -->
			      <ErrorNotification 
			        v-if="errorMessage"
			        :message="errorMessage"
			        @dimiss="clearError"
			      />
	</div>
</template>

<script setup lang="ts">
	import { ref, computed,onMounted, watch } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useModerationStore } from '@/stores/moderationStore';
	 import type { Material, Comentario } from '@/types/intefaces';

	 // ═════════════════════════════════════
	 //   IMPORTACIÓN DE COMPONENTES
	 // ═════════════════════════════════════
	// ## import ModerationStats from '@/components/moderation/ModerationStats.vue'; 
	import MaterialList from '@/components/moderation/MaterialList.vue';
	import MaterialReview from '@/components/moderation/MaterialReview.vue';
	import CommentsForm from '@/components/moderation/CommentsForm.vue';
	import ComentariosDestacados from '@/components/moderation/ComentariosDestacados.vue';
	import ComentariosCronologicos from '@/components/moderation/ComentariosCronologicos.vue';
	import LoadingSpinner from '@/components/moderation/LoadingSpinner.vue';
	import EmptyState from '@/components/moderation/EmptyState.vue';
	import NotificationManager from '@/components/moderation/NotificationManager.vue';
	// ## import ErrorNotification from '/components/moderation/ErrorNotification.vue';"
	// No fueron importados los componentes de ErrorNotification y ModerationStas. Puesto que en un principio
	// se habia contemplado, pero se omitio por que seria exceso de design y tendriamos doble dashboard
	// en forma de PowerBI, lo que esta vista superaria la Lógica restringida

	// ══════════════════════════════════
	//	   STORE Y ESTADO REACTIVO
	// ══════════════════════════════════

	const moderationStore = useModerationStore();

	 // Refs del store (reactivos automaticamente)

	const {
		pendingsMaterial: pendingsMaterials,
		currentMaterial: selectedMaterial,
		loading:  isStoreLoading,
		error: storeError,
		stats: stactics,
		hasPending: hasPendingMaterials,
	} = storeToRefs(moderationStore);

	  // Estado local de la vista
	  const isInitialLoading = ref(false);
	  const isActioning = ref(false);
	  const isLoadingComments = ref(false);
	  const errorMessage = ref('');

	  // ════════════════════════════════════════
	  // 	PROPIEDADES COMPUTADAS (PROP COMPUTED)
	  // ════════════════════════════════════════
	  const currentMaterialId = computed(( ) => selectedMaterial.value?.id  || null);

	  const isLoadingStats = computed(() => isStoreLoading.value);


	  // ✅✅ Los comentarios son filtrados por el material seleccionado ✅✅

	    const currentMaterialComments = computed(() => {
	  	  if(selectedMaterial.value) return [];
	  	   return moderationStore.comentarioDeMaterial(selectedMaterial.value.id);
	    });
	  
	  	// Comentarios actuales del material actual
	const highlightedComments = computed(()=> {
	  	  return currentMaterialComments.value.filter( c=>c.destacado);
	});
		// Comentarios cronologicos del material actual
	const chronologicalComments = computed(() =>  {
	  	  return [...currentMaterialComments.value].sort((a,b) => {
	  	  	 new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
	  	  });
	});	

	onMounted(async () => {
		await initializeView()
	});

	async function initializeView(): Promise <void> {
		try{
			isInitialLoading.value = true;

			await moderationStore.loadPendingMaterials();

			await moderationStore.updateStactics();

			console.error('[VwModerarMateriales]: Vista inicializada correctamente');
		}catch(error: any){
			errorMessage.value = error.message || 'Error al iniciar de la vista de moederación';

			console.error('[VwModerarMateriales]: ',error);
		} finally {
			isInitialLoading.value = false;
		}

	}

	async function handleSelectMaterial(materialId: string): Promise<void> {
		try{
			 await moderationStore.materialSelected(materialId);
			 console.log(`[VwModerarMateriales]: Material ${materialId} seleccionado`);
		}catch(error: any){
			errorMessage.value =  'Error al seleccionar el material';
			console.error('Hay un error al momento de intentar mostrar el material',error);
		}
	}


	  // ══════════════════════════════════
	  // 	  HANDLERS COMENTARIOS
	  // ══════════════════════════════════
	
	async function handleAddComentarios(payload: {
	 	message: string,
	 	highlighted: boolean;
	}):Promise <void> {
	 	 if (!selectedMaterial.value) {
	 	 	 errorMessage.value = 'Error: No hay material seleccionado';
	 	 	  return;
	 	 }

	 	 try{
	 	 	isActioning.value = true;

	 	 	await moderationStore.addComment(
	 	 		selectedMaterial.value.id,
	 	 		payload.message,
	 	 		payload.highlighted
	 	 	);

	 	 	console.log('[VwModerarMateriales] El comentario se ha agredado exitosamente');
	 	 }catch(error:any){
	 	 	errorMessage.value = 'Error al generar el comentario';
	 	 	console.error('[VwModerarMateriales]: ',error);
	 	 }finally{
	 	 	isInitialLoading.value = false;
	 	 }
	}	

	async function handleReject(materialId: string,alumnoId: string, reason: string): Promise<void> {
  		try {
  		  isActioning.value = true;
  		  await moderationStore.rejectedMaterial(materialId, alumnoId, reason);
  		  
  		  console.log(`[ViewModerarMateriales]: Material ${materialId} rechazado`);
    
		    if (!hasPendingMaterials.value) {
		      await moderationStore.updateStatistics();
		    }
  		} catch (error: any) {
    		errorMessage.value = 'Error al rechazar el material';
	    		console.error('[ViewModerarMateriales]:', error);
  		} finally {
    	   isActioning.value = false;
  		}
	}
	

 	async function handleDeleteComment(commentId: string): Promise<void> {
 	   if (!selectedMaterial.value) return;

	   try {
	    isLoadingComments.value = true;
	    
	    await moderationStore.deleteComment(commentId, selectedMaterial.value.id);
	    
	    console.log('[ViewModerarMateriales]: Comentario eliminado');
	  } catch (error: any) {
    	errorMessage.value = 'Error al eliminar el comentario';
    	console.error('[ViewModerarMateriales]:', error);
	  } finally {
	    isLoadingComments.value = false;
	  }
	}


	async function handleUpdateComment(payload: {commentId: string, message:string, highlighted?: boolean}):
	  Promise<void>{

	  	try{
	  		isLoadingComments.value = true;

	  		await moderationStore.updateComment(payload.commentId,
	  			payload.message,	
				payload.highlighted
	  			);

	  		console.error('[VwModerarMateriales]: El comentario ha sido actualizado');
	  	} catch (error: any) {
    		errorMessage.value = 'Error al actualizar el comentario';
		    console.error('[ViewModerarMateriales]:', error);
  		} finally {
    		isLoadingComments.value = false;
  		}
	  	
	}


  // ====================================
  //   UTILIDADES
  // ====================================
	function clearError(): void {
	  errorMessage.value = '';
	  moderationStore.error = ''; // Limpiar también el error del store
	}


</script>

 <style scoped>
 	.moderation-view{
 	  display: flex;
 	  flex-direction: column;
 	  min-height: 100vh;
 	  padding: 2rem;
 	  background-color: var(--bg-primary, #f9fafb);
 	}

	.moderation-header{
		margin-bottom: 2rem;
	}
 	
 	.title {
 		font-size: 2rem;
 		font-weight: 700;
 		color:  var(--text-primary, #11827);
 		margin-bottom: 1rem;
 	}

 	/*══════════════════════════════════
 			CONTENIDO PRINCIPAL
 	══════════════════════════════════*/

 	.moderation-content{
 	  display: grid;
 	  grid-template-columns: 350px 1fr;
 	  gap:  2rem;
 	  flex: 1;
 	}

 	@media (max-width: 1024px){
 		.moderation-content{
 			grid-template-columns: 1fr;
 		}

 	}

   /*══════════════════════════════════
 	 		PROPS EST. DE PANELES
 	══════════════════════════════════*/
 	.materials-panel,
 	.review-panel{
 		background: white;
 		border-radius: 0.75rem;
 		padding: 1.5rem;
 		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
 	}

 	.section-title{
 		font-size: 1.25rem;
 		font-weight: 600;
 		color: var(--text-primary, #11827);
 		margin-bottom: 0.75rem;
 		border-bottom: 2xp solid var(--border-color, #e5e7eb);
 	}

 	.subsection-title{
 		font-size: 1.125rem;
 		font-weight: 600;
 		color: var(--text-secondary, #374151);
 		margin-bottom: 1rem;
 	}
 	/*══════════════════════════════════
 	 		ESTILOs COMENTARIO y Seleccion
 	══════════════════════════════════*/
 	.comments-module{
 		margin-top: 2rem;
 		padding-top: 2rem;
 		border-top: 2px solid var(--border-color, #e5e7eb);
 	}
 	/*══════════════════════
 	 		ESTADO VACIO
 	════════════════════════*/
 	.no-selection{
 		display: flex;
 		align-items: center;
 		justify-content: center;
 		min-height: 400px;
 		background: white;
 		border-radius: 0.75rem;
 		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
 	}

 	.hint {
 	   font-size: 1.125rem;
 	   color: var(--text-tertitary,#6F8279);
 	   text-align: center;
 	}
 </style>