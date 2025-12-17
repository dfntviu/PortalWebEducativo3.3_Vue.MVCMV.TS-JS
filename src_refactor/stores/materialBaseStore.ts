/**
 * @store MaterialBaseStore
 * @description Store base con lógica compartida para materiales
 * @pattern Herencia originada por MaterialBase
 * */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {MaterialBseService} from '@/services/materials/MaterialBseService';
import type {Material} from '@/types/indexInterface.ts';

/**
 * PROPOSITO
 *  Estados comunes (loading,error, materials)
 *  Metodos helpers centralizados
 *  Gestion de errores centralizada
 * */

 /**
  * Estado Base compartido
  * */
 interface BaseMaterialsState {
 	materials: Material[];
 	loading: boolean;
 	error: string | null
 	searchTerm: string;
 }

 /**
  * No se usa directamente, solo en Herencia*/
  const useMatBaseStore = defineStore('materialBase', () => {

  	// =======================
  	// ESTADO BASE COMPARTIDO
  	// =======================

  	const materials = ref<Material[]>([]);
  	const loading = ref<boolean>(false);
  	const error = ref<string>('');

  	// =============================
  	//  COMPUTADOS BASE(Compartidos)
  	// =============================

  	/**
  	 * Total de Materiales cargados
  	 * */

  	const totalMaterials = computed(()=> materials.value.length);

  	/**
  	 * Materiales filtrados en la busqueda
  	 * */
  	const filteredMaterials = computed(()=> {
  		if (!searchTerm.value.trim()) {
  			 return mateials.value;
  		}

  		return MaterialBseService.searchMaterials(
  				searchTerm.value,
  				materials.value
  			);
  	});

  	/**
  	 * Indica  si hay materiales cargados 
  	 * */
  	const hasMaterials = computed(()=> materials.value.length > 0);

  	/**
  	 * Indica  si está en estado de error 
  	 * */
  	const hasError = computed(()=> error.value !== null);

  	// =========================
  	//  METODOS BASE(Compartidos)
  	// =========================

  	function clearError(): void {
  		error.value = null;
  	}
  	/**
  	 * Estab un error
  	 * */
  	function setError(message: string): void {
  		error.value = message;
  		console.error('MaterialBseStore Error', message);
  	}
  	/**
  	 * Inicia el estado de carga
  	 * */
  	function startLoading(): void {
  		loading.value = true;
  		error.value;
  	}
  	/**
  	 * Finaliza el estado de carga
  	 * */
  	function stopLoading(): void {
  		loading.value = false;
  	}
  	/**
  	 * Actualiza la Lista de los materiales
  	 * */
  	 function setMaterials(newMaterials: Material[]):void {
  	 	materials.value = newMaterials;
  	 	 console.log(`[MaterialBseStore] ${newMaterials.length} materiales cargados `);
  	 }

  	 /**
  	  * Agrega un material a la lista
  	  * */
  	 function addMaterial(material: Material): void {
  	 	 materials.value.unshift(material) //al inicio de la lista
  	 }

  	 /**
  	  * Actualiza un material existente
  	  * */
  	 function updateMaterial(materialId: string, updates: Partial<Material>): void {
  	 	const index = materials.value.findIndex( m=>m.uid === materialId);
  	 	 if (index !== -1) {
  	 	 	materials.value[index] = {...materials.value[index], ...updates};
  	 	 }
  	 }

  	 /**
  	 * Elimina un Material de la Lista
  	 * */
  	 function removeMaterial(materialId: string) void{
  	 	materials.value.filter(m =>m.uid === materialId);
  	 }

  	 /**
  	 * Obt el Material por ID
  	 * */
  	function getMaterialById(materialId: string) {
  	 	try{
  	 		stopLoading()
  	 		const material = await MaterialBseService.getMaterialById(materialId);
  	 		stopLoading();
  	 		 return mateial;
  	 	}catch(error: any){
  	 		setError(`Error al obtener el Material: ${err.message}`);
  	 		stopLoading();
  	 		 return null;
  	 	}
  	}

  	 /**
  	  * Busca el Material en la lista actual
  	  * */
  	function searchMaterials(term: string) {
  	 	searchTerm.value = term;
  	}

  	 /**
     * Limpia el término de búsqueda
     */
    function clearSearch(): void{
     	searchTerm.value = '';
    }

     /**
      * Resete todo el estado
      * */
     function resetState(): void {
     	materials.value = [];
     	loading.value = false;
     	error.value = null;
     	 searchTerm.value = '';
       /*setError('');
         clearSearch(''); El identico de 169,170*/
     }


     // =========================
     //		HELPERS COMPARTIDOS
     // =========================

     /**
      * Maneja los Errores de forma 
      * centralizada.*/
    function contoladoraError(error:any, context: string): void{
     	const message = error?.message || 'Error desconocido';// '>>unknown'
     	 setError(`${context}: ${message}`);
     	  console.error(`[MaterialBseStore]: ${context}`, error);
    }	

    /**
     * Ejecuta 1 op. de Manejo de Errores automático
     * */
    function manejoEjecucionError<T>( operation: () => Promise<T>,
    	 								  context: string): Promise<T| null>{
    	try{
    		stopLoading();
    		const result = await operation();
    		stopLoading();
    		clearError();
    		 return result;
    	}catch(err: any){
    		contoladoraError(error, context);
    		stopLoading();
    		 return null;
    	}
    }

    // ============================
    //		RETORNO DEL STORE BASE
    // ============================
    	return {
    	 	//  STATES
    	 	materials,
    	 	loading,
    	 	error,
    	 	searchTerm,

    	 	 //  COMPUTED
    	 	totalMaterials
    	 	filteredMaterials
    	 	hasMaterials
    	 	hasError
    	 	 // MÉTODOS
    	 	clearError,
    	 	setError,
    	 	startLoading,
    	 	stopLoading,
    	 	setMaterials,
			addMaterial,
			updateMaterial,
			removeMaterial,
			getMaterialById,
			searchMaterials
			clearSearch,             	
            resetState, 
            contoladoraError,
            manejoEjecucionError
    	};	
});
	// No representa un store con API Composition sino tipo API Options
  export type materialBaseStoreType = ReturnType<typeof useMatBaseStore>;
    // ## Forma no convencional para exportar ##