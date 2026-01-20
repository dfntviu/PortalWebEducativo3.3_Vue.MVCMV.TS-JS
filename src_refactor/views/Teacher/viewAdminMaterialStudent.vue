<template>   
	 <!--════════════════════════════════════════ -->
	 <!--       MAIN CONTAINER 					  -->
	 <!--════════════════════════════════════════ -->
	 <main class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
	 	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	 		<header>
	 			<!-- <div class="mb-8 animate-fade-in"> -->
	 				<h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Gestion de Mat. Educativos</h1>
	 			<!-- </div> -->
	 			<p class="text-slate-600 dark:text-slate-400">
	 			  Administra y filtra los Materiales acádemicos de tús Estudiantes
	 			</p>
	 		</header>
	 		 
	 			 <!--════════════════════════════════════════ -->
				 <!--       FILTER SECTION 									  -->
				 <!--════════════════════════════════════════ -->
				<section class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-slide-in" aria-labellebdy="filter-heading">
				 	<h2 id="filter-heading" class="sr-only">Opciónes de Filtrado</h2>
				 	
				 	<div class="flex flex-col space-y-4">
				 		  <label for="filter-select" class="text-sm font-semibold text-slate-700 dark-text-slate-300">
				 		    Sel. Filtro p-visualizar
				 		 </label>

				 		 <select name="" id="" class="w-full px-4-py-3 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-slate-100 cursor-pointer hover:border-slate-300 dark:hover:border-slate-500">
				 		 	<!-- Sel una opción de Filtrado -->
				 		 	<option  v-for="opcion in OPCIONES_FILTRO" :key="opcion.id"  
				 		 	  :value="opcion.id">
				 		 	    {opcion.label}
				 		 	</option>
				 		 </select>

				 		 <!-- Filtra decription Badge -->
				 		 <Transition>
				 		 	<div class="p-4 bg-blue-50 dark-blue-900/200 border-blue-500 rounded animate-fade-in">
				 		 		<p class="text-sm text-blue-800 dark:text-blue-300">
				 		 			{{descricpionFiltroActivo}}
				 		 	    </p>
				 		 		 <span class="text-sm text-blue-800 dark:text-blue-300">Filtro Activo:</span>

				 		 	</div>
				 		 </Transition>
				    </div>
				</section>
				 <!--════════════════════════════════════════ -->
				 <!--  CONTENT SECTION -  Transitioned States	-->
				 <!--════════════════════════════════════════ -->

				 <Transition name="fade" mode="out-in">
				 <!--════════════════════════════════════════ -->
				 <!--       LOADING STATE					 						-->
				 <!--════════════════════════════════════════ -->

				 <section>
				 	<div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12">
				 		<div role="status" class="flex flex-col items-center justify-center space-y-4" aria-label="Cargando  materiales">
				 			 <div class="animate-spin rounded-full h-1 w-16 border-b-4 border-blue-600"> </div>
				 			 	<p class="text-slate-600 dark:text-slate-400 font-medium">
				 			 		 Cargando Materiales.
				 			   </p>		
				 		</div>
				 	</div>
				 </section>

				 <!--════════════════════════════════════════ -->
				 <!--       ERROR STATE					      -->
				 <!--════════════════════════════════════════ -->
				<section  class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-shake">
				 	<div   class="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
				 			<svg  class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20">
				 				<path  fill-rule="evenodd"
                			d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                		</svg>	
			 			<div class="flex-1">
			 				<h3  class="text-red-800 dark:text-red-300 font-semibold mb-1">Error al cargar los Materiales</h3>
			 				<p class="text-red-700 dark:text-red-400 text-sm"> {{materialStore.error}} </p>
			 				<button 
			 				  @click="reintentar"
			 				  @keydown.enter="reintentar"
			 				  class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
			 				  aria-label="reintentar la carga de Materiales" >
			 					 Reintentar
			 				</button>
			 			</div>				 	
			 		</div>
				</section>

				 <!-- ──────────────────────────────────── -->
				  <!-- 			RESULT STATE			   -->
				 <!-- ──────────────────────────────────── -->
				<section class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
				 	 <!-- Resultados Encabezado -->
				 	<header class="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
				 		<div>
					 		<h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
					 			Resultados del Filtro
					 		</h2>
					 		<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
					 			{{totaMaterial}} material(es) encontrado(s)
					 		</p>
				 		</div>
				 		  <!-- State Badge -->
				 		<div class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg animate-scale-in">
				 			<span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
				 				{{totalMateriales}}
				 			</span>
				 	   </div>
				 	</header>

				 		<!-- Materiales Grid -->
				 	<TransitionGroup  name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				 			<article class="flex items-start text-slate-900 dark:text-slate-100 line-clamp-2 flex-1">
				 				<div class="flex items-start justify-between mb-3">
				 					<h3 class="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 flex-1">
									   {{material.title}}
				 				   </h3>
				 				   <span class="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs  font-medium rounded-full flex-shrink-0">{{material.title || 'PDF'}}
				 				   </span>	
				 				</div>

				 				<div class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
				 					<div class="flex items-center space-x-2">
				 						<svg class="w-4 h-4 flex-shrink-4">
				 							<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
				 							<span>material.uploadeBy  || 'sin Autor'</span>
				 						</svg>
				 					</div>
				 				
					 				<div class="flex items-center space-x-2">
					 					<svg class="w-4 h-4 flex-shrink"></svg>
					 					 <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
					 					<span>{{formatearFechaLocal(material.uploadAt)}}</span>
					 				</div>
				 				</div>
				 			</article>
				 		</TransitionGroup>	
				 </section>

						<!-- ────────────────────────────────────────────────── -->
        				<!-- EMPTY STATE -->
        				<!-- ────────────────────────────────────────────────── -->
        		<section class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12">
        		 	<div class="flex flex-col items-center space-y-4 text-center">
	    		 		<svg class="w-20 h-20 text-slate-300 dark:text-slate-600 animate-bounce-slow">
	    		 			<path  stroke-linecap="round" stroke-linewidth="round" stroke-whith="2" stroke-width="2" 
	            			   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.29315.414 1 0 
	            			      01.293.707V19a2 01-2 2z"/>
	    		 		</svg>
	        		 	<div>
	        		 		<h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No hay materiales disponibles</h3>
	        		 		<p class="text-slate-600 dark:text-slate-400">No fueron encontrados materiales, con el Filtro seleccionado</p>
	        		 	</div>
        		 	</div>
        		</section>

        		<!-- ────────────────────────── -->
				<!--    INITIAL STATE -->
				<!-- ────────────────────────── -->
				<section  v-else key="initial"  class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12" role="statu" aria-live="polite"> 
				 	<div class="flex flex-col items-center justify-center space-y-2 text-center">
				 		<svg fill="none" stroke="currentColor" class="w-20 h-20 text-blue-500 dark:text-blue-400 animate-pulse-slow" virewbox="0 0 24 24" aria-hidden="true">
				 			<path stroke-linecap="round" stroke-linewidth="round" stroke-whith="2" 
				 			d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.41a1 1 0 01-.293.707Vl-4 4v-6.586a1 1 0 01-.293707VL3.293 7.293A1 1 0 013 6.258V4z" />
				 		</svg>
				 		<div class="c1 c2 c3 c4">
				 			<h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Selecciona el Título</h3>
				 			<p class="text-slate-600 dark:text-slate-400"></p>
				 		</div>
				 	</div>
				</section>
			</Transition>

			 <!--═════════════════════════════════-->
			 <!--   TELEPORT: Notification System -->
			 <!--═════════════════════════════════-->
			<Teleport to="body">
			 	<Transtion name="mostrarModificacion">
			 		<div class="fixed top-4 rigth-4 z-50 max-w-md animate-slide-in">
			 			<div class="dark:bg-slate-800 rounded-lg shadow-2xl border-l-4 p-4">
			 				<div class="flex items-center space-x-3">
			 					<svg class="w-6 h-6 flex-shrink">
			 						<path file-rule="evenodd" v-else-if="notificationTipo === 'success' "d="M10 18a8 0 100-16 8 8 0 000 16zm#.707-#.293.a1 1 0 00-1.414-1.414L9.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 10 001.414 0l4-4z" clip-rule="evenodd" />
			 						<path file-rule="evenodd" v-else-if="notificationTipo === 'error' " d="M10 18a8 0 100-16 8 8 0 000 16zm#.707-#.293.a1 1 0 00-1.414 1.414L8.586 101-1 1.293a11 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 1l01.29-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"  />
			 						<path  v-else  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1ha1 1 0 100-2v-3a1 1 0 00-1-1H9z" file-rule="evenodd"/>
			 						<div class="flex-1">
			 							<p class="font-medium text-slate-900 dark:text-slate-100"></p>
			 						</div>
			 					</svg>
			 				</div>
			 				<button 
			 				   @click="closeNotification"
			 					class="text-slate-400 hover:text-slate-600 darkhover:text-slate-300"
			 					aria-label="Cerrar la Notificación">
			 						<svg class="" >
			 							<path
			 								 file-rule="evenodd"
			 								 d="M4.293 4.293a1 1 0 011.414 8.586l4.293-4 293a1 1 0 111.4 1.414L11.414 10L4.293 4.293a1 1 0 01-1.414 1.414L10 11.414-4.293 4.293a1 1 0 01-1.414-1.41L8.586 10 4.293 5.707a1 1 0 010-1.414z"
			 								 clip-rule="evenodd"
			 							 />
			 						</svg>
			 					</button>
			 				</div>
			 			<!-- </div> -->
			 		</div>
			 	</Transtion>
			</Teleport>
	 	</div>
	 </main>
</template>

<script setup lang="ts">
	// ══════════════════════════════
	//		 ---- LIBRERIAS ----
	// ══════════════════════════════
	 	// Vue Core
	 import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
	 	// Stores
	 import {useMaterialTeachStore} from '@/stores/materialTeachStore';
	   // Composables
	 import {useDataFormatter} from '@/composables/useDataFormatter';
	 import {useNotifications} from '@/composables/useNotifications';
	  // Types
	 import type {Material} from '@/types';

	 /** ════════════════════════  **/
	 /**   COMPOSABLES             **/
	 /** ════════════════════════  **/
     const { formatearFecha } = useDataFormatter();
     const {
     	 mostrarNotificacion,
     	 notificacionMensaje,
     	 notificacionTipo,
     	 notificacionClass,
     	 notificacionIconClass,
     	 mostrar: mostrarNotificacionFn,
     	  cerrar: cerrarNotificacion
     } = useNotifications();
	
	/** ════════════════════════
	 *     ---- ESTADOS ----
	    ════════════════════════ **/
     const materialStore = useMaterialTeachStore();

	 /** ════════════════════════════════
	 *     ---- VARIABLES REACTIVAS ----
	     ════════════════════════════════ **/
     const filtroSeleccionado = ref<number| null>(null);

	 /** ════════════════════════
	 *     ---- CONSTANTES ----
	    ════════════════════════ **/
      const OPCIONES_FILTRO = [
      	{ id: 1,
      	  label: 'Todos los materiales',
      	  description: 'Muestra todos los materiales subidos por estudiantes',
      	},
      	{ id: 2,
      	  label: 'Mas recientes primero',
      	  description: 'Materiales ordenados por fecha de subida(mas nuevos 1°) ',
      	},
      	{ id: 3,
      	  label: 'Por nombre de usuario',
      	  description: 'Materiales agrupados por el nombre del estudiante que lo subió',
      	},
      	{ id: 4,
      	  label: 'Subidos hoy',
      	  description: 'Solo materiales subidos el día de Hoy',
      	},
      	{ id: 5,
      	  label: 'Últimos 2 días',
      	  description: 'Materiales subidos las últimas 48 horas',
      	},

      	{ id: 6,
      	  label: 'Última semana',
      	  description: 'Materiales subidos en los últimos 7 días',
      	},
      ] as const;

      const RANGO_FILTRO_VALIDO = {MIN: 1, MAX: 6} as const;

  /**  ════════════════════════════════════
	 *   ---- PROPIEDADES COMPUTADAS ----
	    ════════════════════════════════════ **/
      
      /**
       * Materiales Filtrados obtenidos del store
       * Derivados en escencia(pura) del estado global.*/
      const materialesFiltrados = computed<Material[]>(()=>{
     	   materialStore.materials || [];
      })

     /**
      * Indica si hay materiales para mostrar*/
      const tieneMateriales = computed<boolean>(() => {
  		 return materialesFiltrados.value.length > 0;
      });

      /**
      * TOTAL de  materiales encontrados
      * */	
      const totalMateriales = computed<number>(()=>{
      	 return materialesFiltrados.value.length;
      })

      /**
      * Descripcion del Filtro actualmente seleccionado
      * */
      const descripcionFiltroActivo = computed<string| null>(()=>{
      	 if(filtroSeleccionado.value == null) return null;

      	  const opcion = OPCIONES_FILTRO.find( opt=>opt.id === filtroSeleccionado.value);
      	   return opcion?.description || null;
      });


	 /** ════════════════════════
	 *     ---- WATCHERS ----
	    ════════════════════════ **/
      /**
      * Observa cambios en el error del store para mostrar notificaciones
      * */
      watch(
     	  () => materialStore.error, {
     	   (nuevoError)=>{
		  	 	if(nuevoError){
		  	 		 mostrarNotificacionFn(nuevoError, 'error');
		  	 	}
      	}
      });

    /**
    * Observa como se cargan los materiales exitosamente
    * */
    watch( ()=> materialStore.materials, {
	 		(nuevosMateriales, materialesPrevios) => {
	 			// 
	 			if( (materialesPrevios || materialesPrevios.length === 0) && 
	 				 filtroSeleccionado.value !== null){
	 				  mostrarNotificacionFn(`Se encontraron: ${nuevosMateriales.length} material(es)`, 'success');
	 			}
	 		}
 		});

	 /** ════════════════════════
	 *     ---- MÉTODOS ----
	    ════════════════════════ **/

    /**
     * Maneja el cambio de selector de filtros. Ade+ valida la Ent. y delega en abs. el store
     * */
    const handleFiltroChange = (): void =>{
    	if(!esValidoFiltroSeleccionado()){
    	 	 mostrarNotificacionFn('Debes seleccionar un Filtro válido', 'error');
    	 	  return;
    	}
    	  // DELEG. PURA AL STORE 
    	  materialStore.fetchMaterialsByFilter(filtroSeleccionado.value!);
    };

   /**
    * Hace un intento mas(reintentar) la última operación fallido
    * */
   const reintentar = (): void =>{
   	if(!esValidoFiltroSeleccionado()){
   		mostrarNotificacionFn('No hay filtro seleccionado para reintetar', 'info');
   		 return;
   	}
   	aterialStore.fetchMaterialsByFilter(filtroSeleccionado.value!);
   }

   /**
    * Formatea fecha usando el composable
    * Wrapper local que maneja formato Time(local) */
   const formatearFechaLocal = (timestamp: any): string => {
   	if(!timestamp) return 'El formato de la Fecha es desconocida';

   	 try{
   	 	 return formatearFecha(timestamp);
   	 }catch(error){
   	 	console.error('Error al formatear Fecha', error);
   	 	 return 'Fecha no válida';
   	 }
   };


/** ─────────────────────────────
 *    VALIDACIONES
 * ─────────────────────────────*/

   /**
    * Valida si el Filtro seleccionado esta en el rango correcto
    * @returns true si el filtro es valido
    * */
   const esValidoFiltroSeleccionado = (): boolean =>{
   	if(filtroSeleccionado.value === null) return false;

   	 return(
   	 		Number.isInteger.value >=  RANGO_FILTRO_VALIDO.MIN &&
   	 		Number.isInteger.value <= RANGO_FILTRO_VALIDO.MAX
   	 	);
   };
	
	// ════════════════════════════
	//    LIFECYCLE 
	// ════════════════════════════
	
	/**
	 * Inicializacion del componente
	 * Limpia el estado del store al montar
	 * */
   onMounted(()=>{
   	// Reinicia el store a estado limpio
   	materialStore.$reset();
		// Limpia las notificaciones previas
   	cerrarNotificacion();
   });

   /**
    * Limpieza al desmontar*/
   onUnmounted(()=>{
   	cerrarNotificacion();
   });

</script>

<style>
	
	/** ════════════════════════════════
	 *    -- ANIMACIONES: KEY-FRAMES --
	    ════════════════════════════════ **/
</style>