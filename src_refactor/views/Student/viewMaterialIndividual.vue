<template>
	<main class="material-catalog-view">
		<header class="catalog-header">
			<div class="header-content">
				<h1 class="main-title">Mís Materiles...</h1>
				<p v-if="studentInfo" class="student-welcome">
					Bienvenido, <strong> {{studentInfo.fullName}}</strong>
					<span class="student-id"></span>
				</p>
			</div>
			<!-- Tarjetas Estads -->
			<div class="stats-grid">
				<article class="stats-card">
				  <span class="stat-icon">📚</span>
					<div class="stat-content">
					<p class="stat-value"> {{totalMaterials}} </p>
					<p class="stat-label"> Todos los Materiales</p>
					</div>
				</article>
				<article class="stat-card">
					<span class="stat-icon">📅</span>
					<div class="stat-content">
						<p class="stat-value"> {{recentMaterialsCount}}</p>
						<p class="stat-label"> Materiales Recientes - Últimos 7 días</p>
					</div>
				</article>
				<article class="stat-card">
					<span class="stat-icon">💾</span>
					<div class="stat-content">
						<p class="stat-value"> {{totalFileSizeFormatted}}</p>
						<p class="stat-label"> El espacio esta usado</p>
					</div>
				</article>
			</div>
		</header>	
			<!-- ══════════════════════════════════════ -->
		    <!-- 		FILTROS Y SECCION DE BUSQUEDA   -->
			<!-- ══════════════════════════════════════ -->
		
		<section class="filters-section">
			<div class="search-container">
				  <label for="" class="src-only">Buscar Materiales</label>
			     <input type="text" v-model="searchQuery" 
			       class="search-input" placeholder="Buscar por nombre de material..."
			       @input="handleSearch">   
			</div>
			<!-- los tags inputs compuestos deberan dejar indicado el cierre -->
			<div class="filters-container">
				<div class="filter-group">
					<label for="" class="filter-label">Ordenar por:</label>
					<select id="sort-select" v-model="sortBy" 
					   class="filter-select" @change="handleSortChange">
						<option value="recent">Más Recientes</option>
						<option value="oldest">Más AntigÜos</option>
						<option value="name-asc">Nombres(A-Z) </option>
						<option value="name-desc">Nombres(Z-A)</option>
					</select>
				</div>
			</div>
			<button  v-if="hasFilters"  @click="handleClearFilters"
			        class="clear-filter-btn" type="button">Limpiar Filtros
			</button>
		</section>
			<!-- ══════════════════════════════════════ -->
			 <!--	 GRID DE: TABLA DE MATERIALES 		-->
			<!-- ══════════════════════════════════════ -->
		<section class="materials-section" aria-label="Lista de Materiales">
				<!-- Carga de Estado -->
			<Transition name="fade" mode="out-in">
				<div  v-if="isLoading" key="loading" class="state-container">
					<div class="spinner" aria-label="Cargando Materiales"></div>
					<p class="state-message">Cargando tus Materiales..</p>
				</div>
				 <!-- Estado de Error -->
				<div  v-else-if="hasError" class="state-container error">
					<span class="state-icon">⚠️</span>
					<p class="stat-message"> {{errorMessage}}</p>
					<button @click="handleRetry" class="retry-btn">Reintentar</button>
				</div>
				<!--  Estado vacío -->
				<div v-if-else="isEmpty" key="empty" class="state-container empty">
					<p class="state-icon">📭</p>
					<p class="state-message">
							{{searchQuery ? 'Error: No se encontraron materiales' : 'Aún, no tienes Materiales en tú Sesión'}}
					</p>
					<p v-if="!searchQuery" class="state-hint">
						Materiales que se suban, aquí se mostrarán aquí
					</p>
				</div>
				  <!-- Tabla de Materiales -->
				<div v-else key="content" class="table-container">
					<table class="materials-table" role="table"> 
						<thead>
							<tr>
								<th scope="col">Material</th>
								<th scope="col">Fecha de Subida</th>
								<th scope="col">Tamaño</th>
								<th scope="col">Estado</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<TransitionGroup name="table-row" tag="tbody">
							<tr v-for="material in paginacionMateriales" :key="material.id_material" class="material-row">
								<td class="material-name-cell">
									<div class="material-info">
										<span class="material-icon">📄</span>
										<!-- <div class="material-icon"> -->
										<div class="material-details">
											<p class="material-name"> {{material.nombre_material}} </p>
											<p class="material-id"> {{material.id_material}} </p>
										</div>
									</div>
								</td>
									<td class="date-cell">
									  <time :datetime="material.fechaSubida" >
									  	 {{formatDate(material.fechaSubida)}}
									  </time>
									</td>
									   
									 <td class="size-cell">
									 	 {{formatFileSize(material.size)}}	
									 </td>

									<td class="status-cell">
										<span :class="['status-badge',`status-${material.status || 'pending'}`]">
											 {{getStatusLabel(material.status)}}
										</span>
									</td>
									
									<td class="actions-cell">
										<div class="actions-button">
										    <button 
										    	 @click="hanldeViewMaterial(material) "
										      	class="action-btn view"
										      	 type="button"
										      	 :aria-label="`Ver: ${material.nombre_material}`"
										    	 title="Ver Material"
										      	 >
										      	 👁️
										    </button>
										    <button 
										      	@click="handleDownloadMaterial(selectedMaterial)"
										      	class="action-btn downlonad" 
										      	:aria-label="`Descargando.. ${material.nombre_material}`"
										      	title="Descargar Material"
										      	>
										      	 {{isDownloanding === material.id_material ? '⏳' : '⬇️'}} 
										    </button>
									    </div>
									</td><!-- /td_composed_more -->
							</tr>
						</TransitionGroup>
					</table>
					 <!-- Paginación de Materiales Individuales -->
					<nav class="pagination">
						<button @click="handlePreviousPage"  :disabled="currrentPage===1"
							class="pagination-btn" type="button" aria-label="Pag. Anterior" > ⬅️Anterior</button>
						
						<div class="pagination-info">
							Página {{currrentPage}} de {{totalPages}}
							{{filteredMaterials.length}} materiales
						</div>

						<button @click="handleNextPage" :disabled="currrentPage===totalPages"
						   class="pagination-btn" type="button" aria-label="Pag. Siguiente">Siguiente➡️</button>
					</nav>
				</div>		
			</Transition>
		</section>

			 <!-- ════════════════════════════════════ -->
			 <!--     MATERIAL VIEWER MODAL 		   -->
			 <!-- ════════════════════════════════════ -->
		<Teleport to="body">
			<Transition>
				<div v-if="showViewer"  class="modal-overlay" @click.self="handleCloseViewer"
				 role="dialog" arial-modal="true" aria-labelledy="viewer-title">
					<article class="modal-viewer">
						<header class="viewer-header">
							<h2 class="viewer-title">
								{{selectedMaterial?.nombre_material}}
							</h2>
							<button 
							  @click="handleCloseViewer"  class="modal-close"	type="button" aria-label="Cerrar Visor">
							 ✕ </button>
						</header>
						<div class="viewer-content">
							<iframe  v-if="selectedMaterial?.url"
							:src="selectedMaterial.url" class="pdf-viewer" title="Visor PDF"></iframe>
							<div  v-else class="viewer-placeholder">
								<p>No fue posible, cargar el material.</p>
							</div>
						</div>

						<footer class="viewer-actions">
							<button @click="handleDownloadMaterial(selectedMaterial)" class="viewer-btn downlonad" 
							 type="button"> ⬇️ Descargar</button>
							 <button @click="handleCloseViewer" class="viewer-btn cancel" type="button">
							 	Cerrar
							 </button>
					   </footer>
					</article>
				</div>
			</Transition>
		</Teleport>

		<!-- ════════════════════════════════════ -->
		<!--     NOTIFICATIONS	     -->
		<!-- ════════════════════════════════════ -->
		<Teleport to="body" >
			<TransitionGroup class="notificacions-container">
				<article
				  v-for="notification in activeNotifications"
				  :key="notification.id"
				  :class="['notification', `notification- ${notification.type}`] "
				  :role="alert"
				  :aria-live="notification.type === 'error' ? 'assertive' : 'polite' "
				 >
					<span class="notificacion-icon">{{notification.icon}} </span>
					<p class="notificacion-message">{{notification.message}}</p>
					<button class="notificacion-close"
						@click="handleViewMaterial"
						type="button"
						 aria-label="Cerrar Notificación"
					 >
					 	✕
					 </button>
				</article>
			</TransitionGroup>
		</Teleport>
	</main>
</template>
		<!-- Teleport>Transition.modal-fade>div.modal-overlay>article.modal-viewer>(header.viewer-header>h2.viewer-title+button.modal-close)+div.viewer-content>iframe.pdf-viewer+div.viewer-placeholder -->
<script setup lang="ts">
     import { ref, computed, watch, onMounted } from 'vue'
	 import {useMaterialStore} from '@/stores/authStoreF.ts'
	import { useAuthStore } from '@/stores/authStore2.ts'	
	import {useNotifications} from '@/composables/useNotifications.ts'
	import {useDateFormatter} from '@/composables/useDateFormatter.ts'
	import {useFileFormatter} from '@/composables/useFileFormatter.ts'

	// ══════════════════════
	//    TYPES & INTERFAC
	// ══════════════════════
	interface Material {
      id_material: string
      nombre_material: string
      fechaSubida: string
	   size?: number,
	   	approved: ''
		pending: ''
		rejectedstastus: ''
	   '';
	   url?: string
	} 

	interface StudentInfo {
		fullName: string,
		numCuenta?: string,
	}

	type shorOption = 'recent'| 'oldest '| 'name-asc' | 'name-desc';

	// ══════════════════════
	//    COMPOSABLES
	// ══════════════════════
	 const materialStore = useMaterialStore()
	 const     authStore = useAuthStore()

	 const { formatDate } = useDateFormatter()
	 const { formatFileSize } = useDateFormatter()


	// ══════════════════════
	//    REACTIVE STATE
	// ══════════════════════
	 const searchQuery = ref('')
	 const sortBy = ref<shorOption>('recent')
	 const currrentPage = ref(1)
	   const showViewer = ref(false)
	 const selectedMaterial = ref<Material| null>(null);
	   const isDownloanding = ref<string | null>(null);

	// ══════════════════════
	//    CONSTANTES
	// ══════════════════════
	const ITEMS_PER_PAGE = 10
	const STATUS_LABELS : Record<string, string> = {
		approved: 'Aprovado'
		pending: 'Pendiente'
		rejected: 'Rechazado'
	}

	// ══════════════════════════
	//    PROPIEDADES COMPUTADAS
	// ══════════════════════════
	const isLoading = computed(() => materialStore.loadign);
	const  hasError = computed(() => materialStore.error !== '' );
	const errorMessage = computed(() => materialStore.error);

	const studentInfo = computed((): StudentInfo| null => {
	 	const profile = materialStore.studentProfile
	 	  if(!profile) return null

 	  	return {
 	  		fullName: `${profile.name} || '' ${profile.lname}`.trim(), 
 	  		numCuenta: profile.numCuenta
 	  	}
	});

	const allMaterials = computed(()=> materialStore.studentMaterials || [])

	const filteredMaterials = computed(() => {
		let materials = [ ...allMaterials.value]

		// Aplicar el filtro de busqueda
		 if(searchQuery.value.trim()){
		 	const query = searchQuery.value.toLowerCase();
		 	 materials  = materials.filter(m=>m.nombre_material?.toLowerCase().includes(query))
		 }

		 // Aplicar criterios de Clasificacion
		switch(sortBy.value) {
		 	case 'recent':
                materials.sort( (a,b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime());  
		 	 	break;
		 	case  'oldest':
				    materials.sort( (a,b) => new Date(a.fechaSubida).getTime() - new Date(b.fechaSubida).getTime()); 				
		 	 	break; 
		 	case 'name-asc':
				    materials.sort( (a,b) => a.nombre_material.localCompare(b.nombre_material))  
		 	 	break;
		 	case 'name-desc':
                materials.sort( (a,b) =>b.nombre_material.localCompare(a.nombre_material))
		 	 	break;
		}

		 return materials;
	});

	const paginacionMateriales = computed(() => {
		const start = (currrentPage-1) * ITEMS_PER_PAGE; 
		const end =  start +ITEMS_PER_PAGE;
		 return filteredMaterials.value.slice(start, end);
	});

	const totalPages = computed(() => {
		 Math.ceil(filteredMaterials.value.length / ITEMS_PER_PAGE);
	}); 

	const isEmpty = computed(() => {
		const totalBytes = isLoading.value && hasError.value.reduce( (sum,m) => sum + (m.size || 0), 0);
		return formatFileSize(totalBytes);
	};

	const totalMaterials = computed(()=> allMaterials.value.length );

	 const recentMaterialsCount = computed(() => {
	 	const sevenDaysAgo = new Date();
	 		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

	 		allMaterials.value.filter( m => {
	 			const uploadDate = new Date(m.fechaSubida)
	 			 return uploadDate >= sevenDaysAgo
	 		}).length
	 }); 
	
	const totalFileSizeFormatted = computed(() => {
		const totalBytes = allMaterials.value.reduce((sum,m)=> sum + (m.size || 0), 0 )
		 return formatFileSize(totalBytes);
	})

	const hasFilters = computed(() => {
		return seaarchQuery.value.trim() !== '' || sort.value !== 'recent';
	} 

	// ══════════════════════
	//    METHS WATCHERS
	// ══════════════════════
	watch(() materialStore.error, (error) => {
		if(error){
			showNotification({ type: 'error', message: 'error'});
			 return;
		}

	});

	watch(() filteredMaterials.value.length, () => {
		if(currrentPage.value > totalPages.value){
			currrentPage.value = 1;
		}
	});

	// ══════════════════════
	//    METS DE APOYO
	// ══════════════════════
	const handleSearch=(): void => {
		currrentPage.value = 1;
	}

	const handleSortChange=(): void => {
		currrentPage.value = 1;
	}

	const handleClearFilters=(): void => {
		searchQuery.value = '';
		sortBy.value = 'recent'
		currrentPage.value = 1;
	}

	/*Control de desplazamiento de Paginado*/
	const	handlePreviousPage =(): void => {
		if(currrentPage.value>1){
			currrentPage--;
		}
	}

	const	handleNextPage =(): void => {
		if(currrentPage.value<totalPages.value){
			currrentPage.value++;
		}
	}

	const handleViewMaterial = (material: Material): void => {
		selectedMaterial.value = material;
		showViewer.value = true;
	}	

	const handleCloseViewer = (): void => {
		showViewer.value = false;
		selectedMaterial.value = null
	}

	const handleDownloadMaterial = async (): Promise<void> => {
		if(!material) return

		 isDownloanding.value = material.id_material

		try{
			 await materialStore.downnloadMaterial(material.id_material);
			 showNotification({
			 	type: 'succes',
			 	message: `Material ${material.nombre_material} descargado correctamente`
			 });
		} finally{
			isDownloanding.value = null
		}
	}

	const handleRetry = async(): Promise<void> => {
		const uid = authStore.user?.uid
		   if(uid){
		 	  await materialStore.fetchStudentMaterials(uid)
		   }
	}
	// ══════════════════════
	//    HELPER FUNCTION
	// ══════════════════════
	const getStatusLabel = (status?: string): string => {
		return  STATUS_LABELS[status || 'pending'] || 'desconocido';
	}

	// ══════════════════════
	//    LYFECICLE OF HOOK
	// ══════════════════════
	onMounted(async() => {
		 const uid  = useAuthStore.user?.uid

		if(!uid){
			showNotification({ type: 'error', message: 'No fue posible identificar el uid del usuario'});
			 return;
		}

		await materialStore.fetch(uid); //*
	});
</script>

 <style scoped>

  	 /*═══════════════════════════════════*/
  	 /*			LAYOUT						  */
  	 /*═══════════════════════════════════*/
  	.material-catalog-view{
  		@apply min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50
  		 				dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
  		 				py-8 px-4 sm:px-6 lg:px-8;
  		 animation: fadeIn 0.5s ease-out;
  	}

  	/*═══════════════════════════════════*/
  	 /*			ENCABEZADO					*/
  	 /*══════════════════════════════════ */
  	 	.catalog-header{
  	 		@apply max-w-7xl mx-auto mb-8;
  	 		animation: slideInDown 0.6s ease-out;
  	 	}

  	 	.header-content{
  	 		@apply text-center mb-6;
  	 	}
  	 	
  	 	.main-title{
  	 		@apply text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2;
  	 	}

  	 	.student-welcome{
  	 		@apply text-lg text-gray-600 dark:text-gray-400;
  	 	}
  	 	
  	 	.student-id{
  	 		@apply text-sm text-gray-500 dark:txt-gray-500 ml-2;
  	 	}


	.stats-grid{
		@apply grid grid-cols-1 sm:grid-cols-3	gap-4;
	}

	.stats-card{
	   @apply bg-white dark:bg-gray-800 rounded-xl shadow-md
	          flex items-center gap-4 transition-transform duration-300 hover:scale-105;
	}

	.stats-icon{
		 @apply text-3xl
	}

	.stat-content{
		@apply flex flex-col;
	}

	.stat-value{
     @apply text-sm text-gray-600 dark:text-gray-400;
	}

	.stat-label{
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	/*═══════════════════════════════════*/
  	/*			FILTROS						    */
  	/*══════════════════════════════════ */
  	 .filters-section {
  	 	@apply max-w-7xl mx-auto mb-6 space-y-4;
  	 	animation: slideInUp 0.6s ease-out 
  	 }

  	 .search-container {
  	 	@apply w-full
  	 }
  	 
  	 .search-input{
  	 	@apply w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
  	 		bg-white dark:bg-gray-800 text-gray-900 dark:text-white
  	 		focus: ring-2 focus:ring-blue-500 focus:border-transparet
  	 		transition-all duration-200;
  	 }

  	 .filters-container {
  	 	 @apply flex flex-grap gap-4 items-center justify-between;
  	 }

  	 .filters-group {
  	 	@apply flex items-center gap-2:;
  	 }

  	 .filters-label {
  	 	@apply text-sm font-medium text-gray-700 dark: text-gray-300;
  	 }

  	.filter-select {
  	 	@apply px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
  	 			bg-white dark:bg-gray-800 text-gray-900 dark:text-white
	 	 	   focus:ring-2 font:ring-blue-500 focus:border-transparet;
  	}

	.clear-filter-btn {
	 	 @apply px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700
	 	   text-gray-700 dark:text-gray-300 font-medium
	 	   hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors;
	} 
	 /*═══════════════════════════════════*/
  	 /*	SECCION DE MATERIALES 			  */
  	 /*═══════════════════════════════════*/
	.materials-section {
		@apply  max-w-7xl mx-auto;	
	}	  	 

	.state-container {
		@apply bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg;
		animation: scaleIn 0.4s ease-out;
	}

	.state-container .error {
		@apply border-2 border-red-200 dark:border-red-800;
	}

	.state-container .empty {
		@apply border-2 border-gray-200 dark:border-gray-700;
	}

   .spinner {
     	@apply w-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full;
     	animation: spin 1s linear infinite;
   }

   .state-icon {
   	@apply text-6xl mb-4 block;
	}

	.state-message {
		@apply text-xl font-medium text-gray-700 dark: text-gray-300 mb-2; 
	}

	.state-hint {
		@apply mt-4 px-6 bg-blue-600 text-white rounded-lg font-medium
		 hover:bg-blue-700 transition-colors;
	}

	.retry-btn {
		@apply bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden;
		animation: slideInUp 0.6s ease-out;
	}
	
		/* Table  */
	.table-container {
		@apply bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden;
		animation: slideInUp 0.6s ease-out;
	}

	.materials-table {
		@apply w-full;
	}

	.materials-table th {
		@apply px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider;
	}

	.materials-row {
		@apply border-b border-gray-200 dark: border-gray-700
		 hover: bg-gray-50 dark:hover:bg-gray-700 transition-colors;
	}

	.materials-table td {
		@apply px-6 py-4 text-sm text-gray-900 dark: text-gray-100;
	}

	.material-icon {
		@apply text-2xl;
	}

	.material-details {
		@apply font-medium text-gray-600 dark:text-white;
	}

	.material-name {
		@apply font-medium text-gray-600 dark:text-white;
	}

	.material-id {
		@apply text-xs text-gray-500 dark:text-gray-500;
	}

	.status-badge {
		@apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200;
	}

	.status-approved {
		@apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200;
	}

	.status-pending {
		@apply bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200;
	}

	.status-rejected {
		@apply bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200;
	}

	.actions-button {
		@apply flex gap-2;
	}

	.action-btn {
		@apply p-2 rounded-lg transition-all duration-200
		disabled:opacity-50 disabled:cursor-not-allowed;
	}

	.action-btn .view {
		@apply bg-blue-100 dark: bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800;
	}

	.action-btn .downlonad {
		@apply btn-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800;
	}

	/* Paginacion de Materiales */
	.pagination {
		@apply flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700;
	}

	.pagination-btn {
		@apply px-4 py-4 bg-blue-600 text-white rounded-lg font-medium
		hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed;
		 transition-colors;
	}

	.pagination-info {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	/*════════════════════════════════════*/
  	/*	MODAL VIEWER 			            */
  	/*════════════════════════════════════*/
   
   .modal-overlay {
   	 @apply fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4;
   }

   .modal-viewer{
   	 @apply bg-white dark:bg-gray-800 rounded-xl shadow-xl
   	  w-full max-w-6xl h-[90vh] flex flex-col
   	  animation: scaleIn 0.3s ease-out;
   }
  	
  	.viewer-header{
  		@apply text-xl font-bold text-gray-900 dark:text-white;
  	}

  	.viewer-title{
  	  @apply text-xl font-bold text-gray-900 dark:text-white;
  	}

  	.modal-close {
  		@apply text-gray-400 hover:text-gray-600 dark: hover: text-gray-600 text-2xl
  		transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded;
  	}

  	.viewer-content {
  		@apply flex-1 p-4 overflow-hidden;
  	}

  	.pdf-viewer {
  		@apply w-full h-full border-0;
  	}

  	.viewer-placeholder {
  		@apply flex items-center justify-center h-full text-gray-500;
  	}

  	.viewer-actions {
  		@apply flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700;
  	}

  	.viewer-btn {
  		@apply px-6 py-2 rounded-lg font-medium transition-colors;
  	}
   
   	.viewer-btn.downlonad{
	  @apply bg-blue-600 text-white hover:bg-blue-700;
	}

  	.viewer-btn.cancel {
  		@apply bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
  		hover:bg-gray-300 dark:hover:bg-gray-600;
  	}

  	/* ═════════════════════════════ */
	/*    NOTIFICACIONES             */
	/* ═════════════════════════════ */
   	.notificacions-container{
	  @apply fixed top-4 right-4 z-50 space-y-3 max-w-sm;
   	}
     	
   	.notification {
   		@apply flex items-center gap-3 p-4 rounded-lg shadow-lg
   		bg-white dark:bg-gray-800 border-l-4;
   		animation: slideRight 0.3s ease-out;
   	}

      /* (*)  */
     .notificacion-success {
	   @apply border-green-500		
     }

   	.notificacion-error {
	   @apply border-red-500
   	}	

   	.notificacion-icon{
	   @apply text-xl
   	}

   	.notificacion-message {
       @apply flex-1 tex-sm text-gray-700 dark:text-gray-300;
   	}

   	.notificacion-close {
   	  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
   	   transition-colors;
   	}
   	/*═══════════════════════════════════════*/
   	/*			 TRANSITIONS			 */
   	/*═══════════════════════════════════════*/

  </style>  