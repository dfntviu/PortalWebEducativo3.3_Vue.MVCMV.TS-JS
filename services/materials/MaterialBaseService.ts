/**
 * @service Servicio Base de Materiales
 * @description Servicio Base con Métodos compartidos entre roles
 * @pattern*/

  import  { getFirestore, collection, doc, getDoc, getDocs, query, where, OrderBy, type DocumentsSnapshot, type CollectionReference, Timestamp
          } from 'firebase/firestore';
  import type {Material} from '@/types/indexInterface.ts';

  export class MaterialBseService {
  	 protected static readonly COLLECTION = 'materials';
  	 /**
  	  * ===========================
  	  *   MÉTODOS COMPARTIDOS (DRY)
  	  * ===========================*/
  	 
  	 /**
  	  * Obtiene la Referencia de la coleccion de Materiales
  	  * */
  	 static getMaterialsCollection(): CollectionReference {
  	 	const db = getFirestore();
  	 	  return collection(db,this.COLLECTION);
  	 }

  	 /**Obtiene un material por ID(En ambos roles)
  	  *@param materialId -  Id del material
  	  * */
  	static async getMaterialById(materialId:string): Promise<Material| null>{
 			try{   
 		  		    console.log(`[MaterialBaseService] 🔍Obteniendo el Material: ${materialId}`);
 		   	   		  const db = getFirestore();
 		             const docRef = doc(db, this.COLLECTION, materialId);
 		            const docSnap = await getDoc(docRef);
 		 
 		              if (docSnap.exists()) {
                      console.log('[MaterialBaseService] ✅ Material encontrado');
 		              	 return{
 		              	 	uid:docSnap.id,
 		              	 	...docSnap.data()
 		              	 } as Material;
 		              }
 		   	}catch(error: any){
           console.error('[MaterialBaseService]❌ Error al obtener material: ',error);
            throw new Error(`Error al obtener Material: ${error.message}`);
 		   	}
 		}

    /**
     * Buscar materiales por término(compartido por ambos roles) 
     * @param searchTerm - Término de Busqueda
     * @param materials -  Materiales donde buscar
     * */
    static async searchMaterials(searchTerm:string, materials: Material[]): Promise<Material[]>{
        
        try{
           const searchLower = searchTerm.toLowerCase().trim();
           // filtrada & Validada
           const filtered = materials.filter(material =>
               material.titulo?.toLowerCase().includes(searchLower) ||
               material.description?.toLowerCase().includes(searchLower) ||
               material.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );

            console.log(`[MaterialBaseService] ✅ ${filtered.length} resultados encontrados`);
            return filtered;
        }catch(error: any){
            console.error('[MaterialBaseService] ❌ Error en la búsqueda:',error);
             throw new Error(`Error en la búsqueda: ${error.message}`);
        }
    }

    /**
     * Valida datos del material
     * */
    protected static validateMaterialData(data: Partial<Material>): void{
       if (!data.titulo.trim()) {
          throw new Error(`El título es requerido`);
       }
       if (!data.autorId.trim()) {
        throw new Error(`El ID del Autor es requerido`);
       }
    }

    /**
     * Convierte Timestamp a Date(helper compartido)
     *  */
    protected static timestampToDate(timestamp: Timestamp | undefined): Date | undefined {
       return timestamp ? timestamp.toDate() : undefined;
    }
  
  }