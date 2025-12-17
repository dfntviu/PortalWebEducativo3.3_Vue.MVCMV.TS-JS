/**
 * @Description Store de notificaciónes unificado para roles
 * 
 * Usa: NotificationService.ts(unificado)
 * */
 
 import { defineStore } from 'pinia';
 import { MaterialService } from '@/services/MaterialServiceUnify.ts';
 import type {Material} from '@/types/interfaces.ts';
   
   // ===========================
   //        TIPOS
   // ===========================
   
    interface MaterialFilterOption = {
   	 | 'all'		// Todos los materiales
   	 | 'lastest'	// Ord. recientemente
   	 | 'by-user'    // Por usuario espefico
   	 | 'today'		// Solo Hoy
   	 | 'last-2-days' // Ultimos dos días
   	 | 'last-weeek' // La semana pasada
   	 | 'approved'   // Solo Aprobados
   	 |  'pendding'  // Unicamente Pendientes
   	 | 'reajected' // Unicamente Rechazados
    }

    interface MaterialStoreState {
    	materials: Material[];
    	currentMaterial: Material | null;
    	loading: boolean;
    	error: string;
    	errorHistory;
    }

     // ===========================
     //		  STORE
     // ===========================
	 const useMaterialStore = defineStore('materials'{
	 	// ===========================
	 	//		  STATE
	 	// ===========================
	 	state: (): MaterialStoreState =>({
	 	 	 materials: [],
	 	 	 currentMaterial: null,
	 	 	 loading: false,
	 	 	 error: '',
	 	}),
	   // ===========================
       //		  GETTERS
       // ===========================
	 	getters: {	
	 		/**
	 		 * Materiales Aprobados
	 		 * */
	 		approvedMaterials: (state): Material[] => {
	 			return state.materials.filter(m => m.status === 'aproved');
	 		},
	 		/**
	 		 * Materiales Pendientes de revision
	 		 * */
	 		pendingMaterials: (state): Material[]=>{
	 	        return state.materials.filter(m=> m.status === 'pendig');
	 		},

	 		/**
	 		 * Materiales Rechazados
	 		 * */
	 		rejectedMaterials: (state): Material[]=>{
	 			return state.materials.filter(m=>m.materials === 'rejected');
	 		},
	 		/**
	 		 * Total de Materiales
	 		 * */
	 		totalMaterials: (state): Material[]=>{
	 			return state.materials.length;
	 		},
	 		/**
	 		 * Verifica si hay materiales cargados
	 		 * */
	 		hasMaterials: (state): Material[]=>{
	 			return return state.materials.length > 0;
	 		},
	 		/**
	 		 * Verifica si esta cargado*/
	 		isLoading: (state): boolean =>{
	 			return return state.loading;
	 		},
	 		/**
	 		 * Verifica si hay error
	 		 * */
	 		hasError:  (state): boolean =>{
	 			return state.error.length > 0;
	 		},

	 		/**
	 		 * Obtiene material por ID
	 		 * */
	 		getMaterialById: (state) => (id: Material): Material[] | undefined =>{
	 			 return state.materials.find(m =>m.uid === id );	
	 		}
	 		/**
	 		 * Materiales de usuario especifico
	 		 * */
	 		getMaterialByUser: (state) => (userId: string): Material | undefined {
	 			  return state.materials.filter(m =>m.autorId === userId);
	 		}
	 	},
	 	// ===========================
        //		  ACTIONS
        // ===========================
	 	actions: {
	 		  // ===========================
     		//		  UTILIDADES
     		// ===========================

     		/** Establece materiales en el estado
     		 * */
	 		setMaterials(materials: Material[]){
	 			this.materials = materials;
	 		}
	 		/**
	 		 * Establece material actual*/
	 		setCurrentMaterial(material: Material | null){
	 			this.currentMaterial = material;
	 		}
	 		/**
	 		 * Establece error
	 		 * */
	 		setError(message: string){
	 			this.error = message;
	 			 this.errorHistory.push(`[${new Date().toISOString()}] ${message}`);
	 			 console.error('[MaterialStore] Error: ', message);
	 		},

	 		/**
	 		 * Limpiar error
	 		 * */
	 		cleanError(){
	 			this.error = '';
	 		}

	 		/**
	 		 * Limpia historial de errores
	 		 * */
	 		clearHistory(){
	 			this.errorHistory = [];
	 		}
	 	
	 	  // ========================
     	  //      OPERACIONES CRUD
     	  // ========================

	 	  /**
	 	   * Obtiene todos los materiales
	 	   * @param filter - Opción de filtrado(opcional) 
	 	   * */
	 		async fetchMaterials(filter: MaterialFilterOption='all'){
	 			this.loading = true;
	 			this.cleanError();

	 			try{
	 				let materials: Material[];
	 				switch(filter){
	 					case 'all' :
	 						materials = await MaterialService.getAllMaterials()
	 					break;
	 					case 'lastest'
	 						 materials = await MaterialService.getMaterialsSortedByLatest();
	 					break;
	 					case 'by-user':
	 					  materials = await MaterialService.getMaterialsByUsername();
	 					break;
	 					case 'today':
	 					  materials = await MaterialService.getMaterialsToday();
	 					break;
	 					case 'last-2-days':
	 					  materials = await MaterialService.getMaterialsLast2Days();
	 					break;
	 					case 'last-weeek':
	 					  materials = await MaterialService.getMaterialsLastWeek();
	 					break;
	 					case 'approved':
	 					  materials = await (MaterialService.getMaterialsByStatus())
	 					  			  .filter(m =>m.status === 'approved');
	 					break;

	 					case 'pendding':
	 					  materials = await (MaterialService.getMaterialsByStatus())
	 					  			  .filter(m =>m.status === 'pendding');
	 					  	break;
	 					  case 'reajected':
	 					  materials = await (MaterialService.getMaterialsByStatus()).
	 					  		filter(m =>m.status === 'reajected');
	 				}
	 			}catch(err: any){
	 				this.setError(err.message || 'Error al obtener los materiales');
	 				 throw err;
	 			} finally{
	 				this.loading = false;
	 			}
	 		}

	 		/**
	 		 * Obtiene Material por ID
	 		 * */
	 		async fetchMaterialsById(id: string): Promise <Material[] | null>{
	 			 this.loading = true;
	 			 this.cleanError();
	 			  try{
	 			  	   const material = await MaterialService.getMaterialsById(id);
	 			  	    if (material) {
	 			  	    	this.setCurrentMaterial(material);
	 			  	    	 console.log(`[MaterialStore] Material cargado: ${id}`);
	 			  	    	  return material;
	 			  	    } 
	 			  	    console.warn(`[MaterialStore] Material no Encontrado: ${id}`);
	 			  	     return null;
	 			  }catch(err: any){
	 			  	 this.setError(err.message || `Error al obtener material ${id}`);
                throw err;
	 			  }finally{
	 			  	this.loading = false;
	 			  }
	 		}  //??  > duda, xq no defini el servicio
	 		
	 		async saveMaterialAndRefresh(material: Material): Promise <void>{
	 			this.loading = true;
	 			 this.cleanError();

	 			try{
	 			 		 await MaterialService.saveMaterial(material);

	 			 		 await this.setMaterials( MaterialService.getAllMaterials());

	 			 		 console.log('[MaterialStore] Material guardado y lista actualizada');

	 			}catch(err: any){
	 			 	  this.setError(err.message || 'Error al guardar y actualizar material');
                throw err;
	 			}finally{
	 				 this.loading = false;
	 			}
	 		} //? > existe un servicio con otro nombre pero con f(n) parecid

	 		async updateMaterial(id: string, updates: Partial<Material> ): Promise <void>{
	 			this.loading = true;
	 			 this.cleanError();

	 			try{
	 			 		 await MaterialService.updatedMaterial(id, updates);

	 			 		 	// Actualizar la lista local 
	 			 		 const index = this.materials.findIndex(m =m.uid === id);
	 			 		  if (index!==-1) {
	 			 		  	 this.materials[index] = {
	 			 		  	 	    ...this.materials[index],
	 			 		  	 	    ...updates,
	 			 		  	 }
	 			 		  }
	 			 		  	// Si es el actual, actualizarlo
	 			 		   if (this.currentMaterial?.uid === id) {
	 			 		   	   this.currentMaterial = {
	 			 		   	   	  ...this.currentMaterial,
	 			 		   	   	  ...updates,
	 			 		   	   }
	 			 		   }	

	 			 		 console.log('[MaterialStore] Material guardado y lista actualizada');

	 			}catch(err: any){
	 			 	  this.setError(err.message || `Error al guardar y actualizar material ${id}`);
                throw err;
	 			}finally{
	 				 this.loading = false;
	 			}
	 		},

	 		async deleteMaterial(id: string): Promise <void>{
	 				this.loading = true;
	 			 this.cleanError();
	 			try{	
	 						await MaterialService.deleteMaterial(id);

	 						  // Actualizar la lista, despues de eliminar
	 						this.setMaterials(
	 								await MaterialService.getAllMaterials()  //checar metodo
	 						);

	 						if (this.currentMaterial?.uid === id) {
	 								this.materials = null;
	 						}

	 						console.log(`[MaterialStore] El Material Fue Eliminado: ${id} `);
	 			}catch(err:any) {
	 				   this.setError(err.message || `Error al Eliminar el material ${id}`);
	 				    throw err;
	 			}finally{
	 				this.loading = false;
	 			}
	 		},

	 		searchMaterials(term: string): Material[]{
	 		  		if (!term || term.trim().length === 0) {
	 		  			 return this.materials;
	 		  		}

	 		  		 	const searchTerm = term.toLowerCase();


	 		  		 	this.materials.filter(material => {
	 		  		 		  return (
	 		  		 		 	 		  material.titulo?.toLowerCase().incluedes(searchTerm) ||
	 		  		 		 	 		  material.description?.toLowerCase().incluedes(searchTerm) ||
	 		  		 		 	 		  material.autorNombre?.toLowerCase().incluedes(searchTerm)
	 		  		 		 	);
	 		  			});
	 		},

	 			// ==========================
     		//		 FILTROS DE MATERIALES
     		// ==========================

	 		filterByStatus(status: Material['status'] ): Material[] {
	 				this.materials.filter(m => m.status === status);
	 		},

	 		filterbyAutor(authorId:string): Material[]{
	 			   this.materials.filter(m =>m.autorId === authorId);
	 		},

	 		filterByDateRange(startDate: Date, endDate: Date):Material[] {
	 			  	this.materials.filter( material=> {
	 			  		  if (!material.fechaOrigen) return false;

	 			  		  			const materialDate = material.fechaOrigen.toDate
	 			  		  			   ?  material.fechaOrigen.toDate()
	 			  		  			   : new Date(material.fechaOrigen);

	 			  		  			 return materialDate <= startDate && materialDate <= endDate;
	 			  	});
	 		},
	 			// =================
     		//		  RESET
     		// =================
	 		  $reset(){
	 		  	  this.materials = [];
	 		  	   this.currentMaterial = null;
	 		  	   this.loading = false;
	 		  	   this.error =  '';
	 		  	   this.errorHistory = [];
	 		  }
	 	}
	});