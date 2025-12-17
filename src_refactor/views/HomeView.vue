e<template>
	<div class="home-view min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
		<!-- Hero Section con Búsqueda rápida -->
		<section class="hero-section max-w-7xl mx-auto mb-12"> 
			<div class="text-center mb-8">
					<!-- Logo y Título -->
			   <div class="flex items-center justify-center gap-4 mb-4">
				   <div class="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 roundend-xl flex items-center justify-center shadow-lg">
							<span class="text-3xl">🎓</span>
				   </div>
					<div class="text-left">
						<h1 class="text-4xl font-bold text-gray-900 dark:text-white">Portal Educativo</h1>
						<p class="text-lg text-gray-600 dark:text-gray-400">
						    Facultad de Ingeniería
						</p>
					</div>
				</div>
			<!-- Busqueda Rapida -->
				<div class="max-w-2xl mx-auto mt-8">
					<div class="relative">
						 <input type="text"   placeholder=" Buscar: materiales, autores, categorías." 
						  class="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500 bg-white darl:bg-gray-900 dark:text-white transition-all"
						  @keyup.enter="handleQuickSearch"/>
						    <button class="absolute rigth-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-500 text-white roundend-xl hover:bg-blue-600
						    transition-colors font-medium">
						    		Buscar
						    </button>
					</div>
					<div class="flex items-center justify-center gap-4 mt-3">
					 <button  @click="openAdvancedSearch" class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
							  <!-- Sist. Coordenadas Declarativo -->
	 						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
	 							<!-- comporta y renderizan las coordenadas -->
	 							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"  d="M12 6V4mo 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 110-4m" />  <!-- instrucciones vectoriales -->
	 						<svg>
						   Busqueda Avanzada
	 					</button>
	 					<span class="text-gray-40">|</span>
	 						<button 
	 						 	  @click="viewSavedSearches"
	 						 	 class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
	 						 	  Mis Busquedas Favoritas
	 						</button>
					</div>
				</div>
			</div>
		</section>

		<section>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Static_Card-One -->
				<StatsCard 
				   icon="📚"
				   :value="stats.totalMaterials"
				   label="Materiales Totales"
				   :trend="stats.materialsGrowth"
				   color="blue"
				/>
				<!-- Static_Card-Two -->
				<StatsCard 
				   icon="✅"
				   :value="stats.approvedToday"
				   label="Aprobados el día de Hoy"
				   :trend="stats.approvedRate"
				   color="green"
				/>
				<!-- Static_Card-Three -->
				<StatsCard 
				   icon="📚"
				   :value="stats.activeUsers"
				   label="Usuarios Activos"
				   :trend="stats.userGrowth"
				   color="purple"
				/>

				<!-- Static_Card-Four -->
				<StatsCard 
				   icon="🚬"
				   :value="stats.downloandsWeeek"
				   label="Descargas"
				   :trend="stats.downloandTrend"
				   color="orange"
				/>
			</div>	
		</section>

		<section class="max-w-7xl mx-auto mb-12">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
			   Acciónes Rápidas
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				 <QuickActionCard
               v-for="action quickActions"
               :key="action.id"
               :icon="action.icon"
               :label="action.label"
               :color="action.color"
               @click="controllQuickAction(action.route)"
				 />
			</div>
		</section>

		<!-- Materiales Recientes Destacados -->
		<section class="max-w-7xl mx-auto mb-12">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
				  Materiales Destacados 🌟
				</h2>
				<div class="flex gap-2">
					<button class="px-4 py-2 rounded-lg transition-colors"
					:class="featureTab== 'recent' 
						? 'bg-blue-500 text-white'
						:  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
					 ">Recientes
					</button>
					<button class="px-4 py-2 rounded-lg transition-colors" 
						 :class="featureTab === 'popular' 
						 ? 'bg-blue-500 text-white'
						 : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					  >Populares
					</button>
			  </div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				 <MaterialCard 
				   v-for="material in featuredMaterials"
				    :key="material.id"
				    :material="material"
				    @click="viewMaterials(material.id)"
				 />
			</div>

			<div v-if="featuredMaterials.length === 0" class="text-center py-12">
				<svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stoke="currentColor" viewBox="0 0 24 24">
				 <path  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"  d="M9 12h6m-6 2 0 01-2-2v5a2 2 012-2h5.586a1 1 0 
				 01.707.29315.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
				</svg>
				 <p class="text-gray-600 dark:text-gray-400">No hay Materiales disponibles</p>
			</div> 		
		</section>

		<!-- Informacion Institucional Moderna -->
		<section class="max-w-7xl mx-auto mb-12">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Mision -->
				<InfoCard
				  icon="🎯"
				  title="Nuestra Misión"
				  :content="misionContent"
				  color="green"
				/>
					<!-- Objetivo del Portal -->
				<InfoCard
				  icon="🚀"
				  title="Objetivos del Portal"
				  :content="objetivosContent"
				  color="blue"
				/>
			</div>
		</section>

		<!-- Actividad Reciente [Timeline] -->
		 <section class="max-w 7xl mx-auto mb-12">
		 	<h2 class="text-2xl font-bold text-gray-900 dark:text-whitw mb-6">
		 	 🗒️Tú Material Reciente
		 	</h2>
		 	 <ActivityTimeline :activities="recentActivities"/>
		 </section>

		 <!-- Footer Stats -->
		  <section class="max-w-7xl max-auto">
		  	<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
		  		<div>
		  			<p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{stats.totalCategories}} </p>
		  			<p class="text-sm text-gray-600 dark:tex-gray-400 mt-1">Almacenamiento</p>
		  		</div>
		  	</div>
		  </section>

		 <!-- Report Modal -->
		 <ReportSumaryModal 
		   v-if="authStore.isAuthenticated"
		   :is-open="showReportModal"
		   :role="authStore.role"
		   @minimize="controllMinimizeReport"
 		 />  
	</div>
</template>

<script setup lang="ts">
import {ref,computed} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore15 } from '@/stores/authStore15.ts';
 import {MaterialAdminService} from '@/services/MaterialAdmService';  // adaptar a herencia de materials
// import { ToastService } from '@/services/ToastService';  // adecuarlo con src_normal
 	// Componentes que aún no han sido creados
 import StatsCard from '@/components/port_widgets/StatsCard.vue';
 import QuickActionCard from '@/components/port_widgts/QuickActionCard.vue';
 import MaterialCard from '@/components/port_widgets/MaterialCard.vue';
 import InfoCard from '@/components/port_widgets/InfoCard.vue';
 import ActivityTimeline from '@/components/port_widgets/ActivityTimeline.vue';
 import ReportSummaryModal from '@/components/port_widgets/ReportSummaryModal.vue';
  import { Material } from '@/types/interf.index.ts';  //No ha sido declarado/

  // Router y Stores
  const    router = useRouter();
  const authStore = useAuthStore();
	 // ==================
	 //     ESTADO LOCAL
	 // ==================
   const quickSearchQuery = ref('');
   const featuredTab = ref<'recent'| 'popular'>('recent');
   const showReportModal  = ref(false);
   const     loading = ref(false);

    // ==================
	 //    STATS
	 // ==================
    const stats = ref({
    	totalMaterials:0
    	approvedToday:0,
    	activeUsers: 0,  // ajustar con respecto a usuarios reales
    	downloandsWeeek: 0, // ajustar con respecto a usuarios reales
    	materialsGrowth: '+12%',
    	approvedRate: '+8%',
    	userGrowth: '+15%',
    	downloandTrend: '+23%',
    	totalCategories: 7,
    	totalAuthors:  0,
    	avgRating: 4.5,
    	storageUsedGB: 0
    });

     // Materials
   	const recentMaterials  = ref<Material[] >([]);
	const popularMaterials = ref<Material[] >([]);
	const recentActivities = ref<Material[] >([]);

	 // METODOS COMPUTADOS
	const userName = computed(()=> {
	 	 const user = authStore.user;
	 	  return user?.displayName || user?.email?.split('@')[0] || 'Usuario';
	});

	// Mensaje de Bienvenida en el Widget
	const welcomeMessageUser = computed(()=> {
	 	const hour = new Date().getHours();
	 	 const role = authStore.role === 'teacher' ? 'teacher': 'student';

	 	  if(hour < 12) return `Buenos Días. Listo para comenzar el día: ${role}`;
	 	  if(hour < 18) return `Buenos Tardes. Espero que tengas un buen día: ${role}`;
	 	   return `Buenas Noches. Tiempo de Regresar tú progreso administrativo del día: ${role}`;
	});


	const quickActions = computed(()=>{
	 	const baseActions = [
	 		 { id: 'search', icon: '🔍', label: 'Buscar', route: '/search', color: 'blue' },
	 		 { id: 'recent', icon: '🕜', label: 'Recientes', route: '/materials/recent', color: 'purple' },
	 		 { id: 'favorites', icon: '🌟', label: 'Favoritos', route: '/favorites', color: 'yellow' }
	 	];

	 	if(authStore.role === 'student'){
	 		return [
	 			...baseActions
	 			{ id: 'upload', icon: '📤', label: 'Subir', route: '/upload-material', color: 'green' },
	 			{ id: 'my-materials', icon: '📚', label: 'Mis Materiales', route: '/my-materials', color: 'indigo' },
	 			{ id: 'download', icon: '⬇️', label: 'Descargas', route: '/downloads', color: 'teal' }
	 		];
	 	}else if(authStore.role === 'teacher'){
	 		return [
	 			...baseActions
	 			{ id: 'moderate', icon: '✅', label: 'Subir', route: '/upload-material', color: 'green' },
	 			{ id: 'upload', icon: '📤', label: 'Mis Materiales', route: '/my-materials', color: 'indigo' },
	 			{ id: 'analytics', icon: '📊', label: 'Descargas', route: '/downloads', color: 'teal' }
	 		];
	 	}

	 	 return baseActions;
	});

	const featuredMaterials = computed(()=> {
	 	return featuredTab.value === 'recent' ? recentMaterials.value: popularMaterials.value;
	});

	const misionContent = computed( ()=>
	 	'Preservar, transmitir y extender el conocimiento cientifícoy tecnologíco en el área de Ingeniería con'
	 	 'conciencia Huamnistica, a través de planes  y programas de estuido pertinentes a la calidad'
	);

	const objetivosContent = computed(() => 
  	 'Implementar un Portal Web Educativo para la automatización y gestión del material de estudio, facilitando el acceso a recursos académicos de calidad mediante tecnologías modernas y una experiencia de usuario excepcional.'
	);

	// Methods
	/*Carga de Todas las Estadistícas más imp, en el Card*/
	async function loadStats(){

	 	try{	 
	 		const materials = MaterialAdminService.getAllMaterials();
	 
	 		stats.value.totalMaterials = materials.length;

 			stats.value.approvedToday = materials.filter(m =>{
 				const today = new Date.toDateString();
 				const approvalDate = m.fechaAprobacion?.toDate.()?.toDateString();
 				 return m.estado === 'aprobado' && approvalDate === today;
 			}).length;
	 			
	 			// Calcular authors > Users
 			/*const uniqueAuthors = new Set(materials.map(m => m.autorEmail));
    		stats.value.totalAuthors = uniqueAuthors.size;*/

	 		// Calcular almacenamiento
 			const totalsizeMB = materials.reduce((acc,m)=> acc + (m.tamanioMB || 0), 0);
 			 stats.value.storageUsedGB = totalsizeMB /1024;
	 			
	 			/*Agregar datos reales, segun los usuarios activos*/
 			 // stats.value.activeUsers = 
 			 // stats.value.downloandsWeeek = 
	 	}catch(error){
	 		 console.error('Error en la carga de Estadisítcas.');
	 	}
	}

	async function loadFeaturesMaterials(){
		try{
			const materials = MaterialAdminService.getAllMaterials();

			recentMaterials.value = materials;
			 .filter(m=>m.estado === 'aprobado')
			 .sort((a,b)=>{
			 	 const dateA = a.fechaCreacion instanceof Date ? a.fechaCreacion : new Date(a.fechaCreacion);
			 	 const dateB = b.fechaCreacion instanceof Date ? b.fechaCreacion : new Date(b.fechaCreacion);
			 	    return dateA.getTime() - dateB.getTime();
			})
			 .slice(0,6);

			 // Materiales populares (simulado por ahora, post usar downloands/views)
			  popularMaterials.value = [...materials];
			   .filter(m=>m.estado === 'aprobado')
			   .sort(()=> Math.random() - 0.5)
			   .slice(0,6);
		}catch(error){
			console.error('Erro loading featured materials', error);
		}
	}

	async function loadRecentActivities(){
		// TODO: Implementar con Firestore Activity log
		recentActivities.value = [ // Modificar por Datos reales de Firebase
				{
			      id: 1,
			      type: 'upload',
			      description: 'Subiste "Cálculo Diferencial - Capítulo 3"',
			      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			      icon: '📤',
			      color: 'green'
			    },
			    {
			      id: 2,
			      type: 'download',
			      description: 'Descargaste "Estructuras de Datos en C++"',
			      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
			      icon: '📥',
			      color: 'blue'
			    },
			    {
			      id: 3,
			      type: 'search',
			      description: 'Buscaste materiales de "Álgebra Lineal"',
			      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
			      icon: '🔍',
			      color: 'purple'
			    }
		]
	}

	function handleQuickSearch(){
		if(quickSearchQuery.value.trim()){
			ToastService.warning('Busqueda vacía', 'Por favor ingresa un término de busqueda');
			 return;
		}

		router.push({
			path: '/search',
			query: {q: quickSearchQuery.value}
		});
	}


	function openAdvancedSearch() {
	  router.push('/search/advanced');
	}

	function viewSavedSearches() {
	  router.push('/search/favorites');
	}

	function controllQuickAction(route: string){
		router.push(route);
	}

	function viewMaterials(id: string){
		router.push(`/material/${id}`);
	}


	function openReportModal(){
		showReportModal.value = true;
	}

	function controllMinimizeReport(isMinimized: boolean){
		console.log('Reporte Minimizado', isMinimized);
	}

	onMounted(async ()=>{
		loading.value = true;

		try{
			await Promise.all([
				loadStats(),
				loadFeaturesMaterials(),
				 authStore.isAuthenticated ? loadRecentActivities() : Promise.resolve()
			]);
		}catch(error){
			console.error('Error loading home data.');
			ToastService('Error', 'No fue posible cargar información del portal');
		} finally{
			 loading.value = false;
		}
	});

	// Eventos Nativos: Son los que definio del creado de Vue
	  // Eventos Personalizados: Son los que define el desarrollador
	    // Eventos Personalizados / Evs Personalizables
</script>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		} 
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

   .home-view > section {
   	 animation: fadeInUp 0.6s ease-out;
   }

	.home-view > section:nth-child(2) {
		animation-delay: 0.1s;
	}

	.home-view > section:nth-child(3){
		animation-delay: 0.2s;
	}

	.home-view > section:nth-child(4){
		animation-delay: 0.3s;
	}
</style>	

<!-- $$$$ STAND-BY $$$$$$$$$$$

$$$$ STAND-BY $$$$$$$$$$$

$$$$ STAND-BY $$$$$$$$$$$

$$$$ STAND-BY $$$$$$$$$$$ -->