import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PredictiveSearchService from '@/services/PredictiveSearchService2';
import type {PredictiveSuggestion , PredictiveSearchOptions} from '@/types/predictive-search.types.ts';
 
 const usePredictiveSearchStore = defineStore('predictiveSearch', ()=>{

 	const suggestions = ref<PredictiveSuggestion[]>([]);
 	const isLoading = ref(false);
 	const error = ref<string | null>(null);
 	const selectedIndex = ref(-1);
 	const isOpen = ref(false);

 	const hasSuggestions = computed(()=> suggestions.value.length > 0);

 	const selectedSuggestion = computed(()=>{
 		if (selectedIndex.value>=0 && selectedIndex.value < suggestions.value.length) {
 			 return suggestions.value[selectedIndex.value];
 		}
 		 return null;
 	});

 	 // Computed por tipo (para el componente)
  	const studentSuggestions = computed(() => {
  	  suggestions.value.filter(s =>s.type === 'student')
  	});

  	const teacherSuggestions = computed(() => {
  	  suggestions.value.filter(s =>s.type === 'teacher')
  	});

  	const materialSuggestions = computed(() => {
  	  suggestions.value.filter(s =>s.type === 'material')
  	});

  	 // =========== ACTIONS ===========
  	  isLoading.value = true;

  	async function search(query: string, options?: PredictiveSuggestion) {
  	  	if (!query || query.trim().length < 2) {
  	  		 clear();
  	  		  return;
  	  	}

  	  	isLoading.value = true;
  	  	error.value = null;
  	  	selectedIndex.value = -1;

  	  	try{
  	  		const results = PredictiveSearchService.predictiveSearch(query,options);
  	  		suggestions.value =  results;
  	  		isOpen.value = results.length > 0;
  	  	}catch(err: any){
  	  		error.value = err.message || 'Error en búsqueda predictiva';
      	     console.error('Error en búsqueda:', err);
  	  	} finally {
  	  		 isLoading.value = false;
  	  	}
  	}

  	/**
  	 * Navegacion por teclado - Siguiente
  	 * */
  	function selectNext() {
  	 	if (suggestions.value.length === 0) return;

  	 	  selectedIndex.value = selectedIndex.value < suggestions.value.length -1;
  	 	    ? selectedIndex.value + 1
  	 	    : 0;
  	}

  	/**
  	 * Navegacion por teclado - Anterior
  	 * */
  	function selectPrevious() {
  	 	if (suggestions.value.length === 0) return;

  	 	  selectedIndex.value = selectedIndex.value > 0;
  	 	    ? selectedIndex.value  - 1
  	 	    : suggestions.value - 1;
  	}

  	/**
  	 * Selección manual (hover) 
  	 * */
  	function selectedSuggestion(index: number) {
  		if (index>=0 && index< suggestions.value.length) {
  			 selectedIndex.value = index;
  		}
  	}

  	/**
  	 * Limpiar todo
  	 * */
  	function clear() {
  		suggestions.value = [];
  		selectedIndex.value = -1;
  		 isOpen.value = false;
  		 error.value = null;
  	}

  	/**
  	 * Cerrar dropdown
  	 * */
  	 function close() {
  	 	isOpen.value = false;
  	 	selectedIndex.value = -1
  	 }

  	 /**
  	 * Abrir dropdown (si hay sugerencias) 
  	 * */
  	function open() {
  	 	 if (suggestions.value.length>0) {
  	 	 	 isOpen.value = null;
  	 	 }
	}

	/**
  	 * Limpiar el cache de Servicio 
  	 * */
	function clearCache(){
	 	 PredictiveSearchService.clearCache();
	}

	  return {
	  	// State -> Estado
	  	suggestions
		isLoading
		error
		isOpen
		selectedIndex
		 // Computed -> Mts-computados
		hasSuggestions
		studentSuggestions
		teacherSuggestions
		materialSuggestions
		// Actions -> Acciones
		search
	    selectNext
	    selectNext
	    selectedSuggestion
	    clear
		close
		clearCache
	  }

 });