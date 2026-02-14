import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SearchService from '@/services/SearchService.ts';
import type { SearchFilters, SearchResults} from '@/types/search.types.ts';

 export const useSearchStore = defineStore('materialBase', () => {
 	// State
 	const searchResults = ref<SearchResults| null>(null);
 	const isSearching = ref(false);
 	const searchError = ref<string | null>(null);
 	const searchHistory = ref<string[]>([]);
 	const activeFilters = ref<SearchFilters>({
 		searchStudents,
		searchTeachers,	
		searchMaterials,
		searchInStudentName,
		searchInTeacherName,
		sortBy: 'relevance',
		sortOrder: 'desc',
 	});

 	// Getters
 	const hasResults = computed(()=> {
 		 searchResults.value  && searchResults.value.totalResults>0 || [];
 	});

 	const studentsFound = computed(()=> {
 		 searchResults.value?.students || [];
 	});

 	const teachersFound = computed(()=> {
 		 searchResults.value?.teachers || [];
 	});

 	const materialsFound = computed(()=> {
 		 searchResults.value?.materials || [];
 	});

 	const totalResults = computed(()=> {
 		 searchResults.value?.totalResults  || [];
 	});

 	// ACTIONS
 	async function performanSearch(filters:searchResults) {
 		isSearching.value = true;
 		searchError.value = '';

 		try{
 			// Guardar el Historial si hay termino de busqueda
 			if (filters.searchTerm && filters.searchTerm.trim()) {
 				 addToHistory(filters.searchTerm.trim());
 			}
 				// Realizar la busqueda
 				const results =	await SearchService.search(filters);
 				searchResults.value = results;

 				 // Actualizar filtros activos
 				activeFilters.value = {...filters};
 		}catch(error: any){
 			searchError.value = error.message || 'Error al realizar la búsqueda';
 			console.error('Error en performanSearch: ',error);
 		} finally {
 			isSearching.value = false;
 		}
 	}

 	async function quickSearch(searchTerm: string) {
 		const filters: SearchFilters = {
 			...activeFilters.value,
 			searchTerm
 		};

 		await performanSearch(filters);
 	}
 	
 	async function searchStudentEmail(email: string) {
 			const filters: SearchFilters = {
 				 searchStudents: true;
 				 searchTeachers:  false,
 				 searchMaterials: false,
 				 studentEmail:  email

 			};
		  
		  return performanSearch(filters); 		
 	}
 	 
 	async function searchByArea(area: string){
 	 	const filters: SearchFilters = {
 	 		searchStudents: false,
 	 		searchTeachers: true,
 	 		searchResults: false,
 	 		teacherArea: area
 	 	};
 	 	 await performanSearch(filters);
 	}

 	async function searchMaterialByStudent(studentUid: string) {
 		isSearching.value = true;
 		searchError.value = null;
 		
 		try{
 			 const materials = await SearchService.searchMaterialsByStudent(studentUid);

 			 searchResults.value = {
 			 	students:[],
 			 	teachers:[],
 			 	materials,
 			 	totalResults: materials.length,
 			 	searchTerm: `Materiales del Estudiante ${studentUid}`;
 			 };
 		}catch(error: any){
 			searchError.value = error.message
 		} finally {
 			isSearching.value = false;
 		}
 	}

 	function updateFilters(newFilters: Partial <SearchFilters> ) {
		  activeFilters.value = {
		  	  ...activeFilters.value,
		  	  ...newFilters
		  };
	}

	function clearResults() {
		searchResults.value = null;
		searchError.value = null;
	}

	function clearFilters() {
		activeFilters.value = {
			 searchStudents:  true,
			 searchTeachers: true,
			searchMaterials:  true,
			  searchInStudentName: true, 
			  searchInTeacherName: true, 
			  sortBy: 'relevance',
			  sortOrder: 'desc'
		}
	}

 	function addToHistory(term: string) {
 		// body...
 			
 	  const index = searchHistory.value.indexOf(term);
 	   if (index>=0) {
 	   	  searchHistory.value.splice(index,1);
 	   }  

 	   // Agrrgar al principio  0,1,2,3,...,9
 	    if (searchHistory.value.length >10) {
 	    	 searchHistory.value.pop();
 	    }

 	     // Persistir en localStorage
 	      localStorage.setItem('searchStory',JSON.stringify(searchHistory.value));
 	}

 	function loadHistory() {
 		const saved = localStorage.getItem('searchStory');

 		 if (saved===true) {
 		 	try{
 		 		searchHistory.value = JSON.parse(saved);
 		 	}catch(error){
 		 		console.error('Error cargando el historial');
 		 	}
 		 }
 	}

 	function clearHistory() {
 		 // vaciar busqueda e historial reciente
		searchHistory.value = [];
		localStorage.removeItem('searchStory');
	}
	 /*La carga del historial tiene un dispararo a partir de la senial del servicial, 
	 puesto que el disparo es inmediato. ->Cargar historial al inicializar*/
	 loadHistory();

	 return {
	 	  // La inicializacion del Estado
	 	searchResults
	 	isSearching
	 	searchHistory
	 	activeFilters

	 	// Getters
	 	hasResults,
	   studentsFound,
	   teachersFound,
	   materialsFound,
		totalResults,

		// Actions
	  searchByArea,
	  quickSearch,
	  searchStudentEmail,
	  searchByArea,
	  searchMaterialByStudent,
	  updateFilters,
	  clearResults,
	  clearFilters,
	  clearHistory,
	  addToHistory,
	};

 } 