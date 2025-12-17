 import {ref, watch } from 'vue';
 import { usePredictiveSearchStore } from '@/stores/usePredictiveSearchStore';
 import  { storeToRefs } from 'pinia';
  import type {PredictiveSearchOptions} from '@/types/predictive-search.types';

  /**
   * Composable de busqueda predictiva con debouncing
   * */
   function usePredictiveSearch(options:PredictiveSearchOptions= {}) {
   	  const store_predictions = usePredictiveSearchStore();

   	  // Extraer lo mas indispensable
   	  const {  
   	  	suggestions,	//eror >> unnescesary
		isLoading,
		selectedIndex,
		isOpen,
		hasSuggestions,
		selectedSuggestion,
		studentSuggestions,
		teacherSuggestions,
		materialSuggestions
   	  } = storeToRefs(store_predictions);

   	  	 const  searchQuery = ref('');
   	  	 let debounceTimer: ReturnType<typeOf setTimeOut> | null = null;
   	  	 const DEBUNCE_DELAY = 300;

   	  	 /**
   		  * Búsqueda con debounce
   		 
   	  	  const debouncedSearch = (query: string) => {
		    if (debounceTimer) {
		      clearTimeout(debounceTimer);
		    }

		    debounceTimer = setTimeout(() => {
		      store.search(query, options);
		    }, DEBOUNCE_DELAY);
  		 };*/

  	 	/**
  	 	 * Watcher debounce
  	 	 * *
  	 	 */
   	  	watch(searchQuery,  (newQuery)=>{
   	  		if (debounceTimer) {
   	  			clearTimeout(debounceTimer);
   	  		}

   	  		if (newQuery && newQuery.length <=2) {
   	  			debounceTimer = setTimeOut(() => {
   	  				store_predictions.search(newQuery,options)
   	  			}, DEBUNCE_DELAY);
   	  		} else {
   	  			store_predictions.clear();
   	  		}
   	  	});

   	  	/**
   	  	 * Manejo del Teclado
   	  	 * */
   	  	const handleKeyDown= (event: keboardEvent)=>{
   	  	  	 if (!isOpen.value) {

   	  	  	 	switch(event.key){
   	  	  	 	 	case 'ArrowDown':
   	  	  	 	 		event.preventDefault();
   	  	  	 	 		store_predictions.selectNext()
   	  	  	 	 	break;

   	  	  	 	 	case 'ArrowUp':
   	  	  	 	 		event.preventDefault();
   	  	  	 	 		store_predictions.selectPrevious();
   	  	  	 	 	break;
					
   	  	  	 	 	case 'Enter':
   	  	  	 	 		event.preventDefault();
   	  	  	 	 		selectedSuggestion.value;
   	  	  	 	 	break;	

					case 'Escape':
						event.preventDefault();
						store_predictions.close();
					  break;	 	  	  	 	 		
   	  	  	 	}
   	  	  	}
   	  	  	 return null;
   	  	}

   	  	/**
   	  	 * Selección por Index
   	  	 * */
   	  	const selectSuggestion = (index: number)=>{
   	  		 store_predictions.selectedSuggestion(index);
   	  		   return suggestions.value[index];
   	  	}

   	  	/**
   	  	 * Limpiar la Busqueda
   	  	 * */
   	  	const clear = ()=>{
   	  		searchQuery.value = '';
   	  		store_predictions.clear();
   	  	}


   	  	 return {
   	  	 	searchQuery,
			suggestions,
			isLoading,
			selectedIndex,
			isOpen,
			hasSuggestions,
			selectedSuggestion,
			studentSuggestions,
			teacherSuggestions,
			materialSuggestions,
			// Metodos
			handleKeyDown,
			selectSuggestion,
			clear,
			close: store.close,
			open: store.open,
   	  	};
   }