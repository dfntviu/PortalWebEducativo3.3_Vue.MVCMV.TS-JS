import { collection, doc,docs, getDocs, setDoc,getFirestore, deleteDoc } from 'firebase/firestore';
import { getStorage, ref,uploadBytes, getDownloadURL} from 'firebase/storage'; /*alm archivo en firestorage **/ 
import { initializeFirebaseStorage } from '@/public/initializeFirebaseConf'; 
  import {Material} from '@/types/interf.index.js';  //script de interfaces
 
const { db } = initializeFirebaseStorage();
 /* Nuevas*/
          /* const currentPage = ref(0); const allItems = ref([0]); const pageSize = 20; const nextPageToken = ref(false); */

    /* El Viernes pasado*/
  export class MaterialDeployService {
    static collectionName = 'materials_loaded';

    /* ------------------------------------------------
      Obtener los Servicios de los materiales
      ------------------------------------------------
     */
    static async getAllMaterialsEduc(){

      try{
          const snapshot = await getDocs(collection(db, this.collectionName)); // #1. Obtiene el snap con los materiales#
          return snapshot.docs.map(doc => {   // #2. Itera sobre c/material del snap #
             return  {id: doc.id, ...doc.data}  // # 3. Crea un objeto con el id y los datos del documento #
           });
        }catch(error){
           console.error('Error al obtener materiales');
            throw error;
        }

    }
    /* ------------------------------------------------
      Obtener los Materiales por ID 
      ------------------------------------------------
     */
    static async getMaterialsEducById(id: string){
        try{
          docRef = doc(db,this.collectionName, id);
          docSnap = await getDoc(docRef);   // no sera 1 condicional y obtener el snap
            if (!docSnap.exists()) return null;
        }catch(error){
             console.error('[MaterialDeployService]: Error al obtener material', error);
              throw error;
        }
    }

    /*------------------------------------------------
      Guardar y Actualizar los materiales Educativos
      ------------------------------------------------
     */
    static async saveMaterialsEduc(material: { id?: string; titulo: string; descripcion: string; archivoURL?: string; fechaCreacion?: Date; autor?: string }){
      try{
        // Obligar a llenar los campos escenciales
          if(material.titulo || material.descripcion){
             throw new ('El titulo y la descripcion del material son obligatorios');
          }

         const docRef = material.id ? doc(db,this.collectionName,material.id) : doc(collection(db,this.collectionName))
        const dataToSave = {
           titulo: material.titulo,
           descripcion_extract: material.descripcion,
           archivoURL: material.archivoURL || null,
           fechaCreacion: material.fechaCreacion || new Date(),
           autor: material.autor || null,
        }
          await setDoc(docRef,dataToSave,{ merge: true});
      }catch(error){
          console.error('[MaterialDeployService]: Error al guardar material', error);
          throw error;
      }
  
    }
     /* Guarda y unicamente eso, cualquier documento en la Firestore:Fecha de creación  [07/Oct/2025] */
    static async saveMatererials(file_material: string){
        try{
             // P1 Obt. la instancia de Firebase Storage
            const storage = getStorage();   
            // P2: Crear la referencia del archivo
            const filreRef = ref(storage,`file_dir/${file_material.name}`);
                // P3: Subir el archivo
            const snapshot = await uploadBytes(filreRef,file_material);
            // P4: Obtener la URL de descarga
            const fileURL =   getDownloadURL(snapshot.ref)  //ref es prop. del snaphot
              // 4.1 devolver la URL
              return fileURL;
        }catch(error){
          console.error("Error al subir el archivo:", error);
            throw error;
        }
    }
    /**  === [22/Nov/2025] ===
     *   Eliminar parcialmente el material 
     *   Elimina del Portal W. Educativo
     * */
    static async deleteMaterialsEduc(materialId: string ){
      try{
           await deleteDoc(doc(this.db,this.collectionName,id));
           console.log(`Material ${materialId} eliminado del Portal`)
        }catch(error){
             console.error('[MaterialDeployService]:❌ Error al borrar del Portal', error);
              throw error;
        }
    }

    /**  === [22/Nov/2025] ===
     * Eliminar permanentemente el material 
     *  ⚠️ Elimina del Backed [USAR con Precauccion]
     * */
    static async hardDeleteMaterial(materialId: String): Promise<void>{
       try{
            const firebaseDb = getFirestore();
             await deleteDoc(doc(firebaseDb, this.collectionName, materialId));
              
              console.warn('[MaterialService] ✅ Material eliminado permanetemente');

       }catch(error){
            console.error('MaterialFirebaseDB ❌ Error al borrar en Firestore', error);
            throw error;
       }
    }
      /** === [22/Nov/2025] ===
       *  F(n) Intermedia que efecuta la alternancia entre los tipos de eliminacion*/
      static async deleteMaterialEveryWhere(materialId: string): Promise<void>{
          try{
             const role = 'teacher' | 'admin';
                  
              if (role==='teacher') {
                  // Borra solo del Sistema
                  await this.deleteMaterialsEduc(materialId);
              }else if (role==='student') {}{
                 // Borra tanto del Sistema como de Firestore
                 await this.hardDeleteMaterial(materialId);
              }
              console.log(`✔ Material ${materialId} eliminado respectivamente de: ${role}`);
          }catch(error){
               console.error('[MaterialService] ❌ Error en eliminación por Rol: ', error);
                  throw error;
          }
      }
    // -> [trasladado 29/09/25]
    /*  Cambiarlo traer logica de Firbease, revisar muy bien el componente origen
       que esta como action(de pinia) en la version de prototipado */
       
      static async siguientePagina(next = true){
        if (next) {
          if ((currentPage+1)* pageSize < allItems.value.length){
             currentPage.value++;
          }else{
              if (currentPage.value>0) {  //13 -12 //12 11 //9 -8
                currentPage.value--;
              }
          }
        }  
          // Nueva logica: Devuelve el rango entre materiales del primero al siguiente
          const start = currentPage.value * pageSize;
          const   end = start + pageSize;

            return allItems.value.slice(start,next);
         // return {next,currentPage,pageSize}
      }
      
      static async cargarMaterialesPaginados(){
        try{
           const materiales = this.getAllMaterialsEduc();
            allItems.value = materiales; 
            nextPageToken.value = materiales.length > pageSize;

             return {
                materiales: allItems.value.slice(0, pageSize),
                total: allItems.value.length,
                hasNext: nextPageToken.value,
             };
        }catch(error){
            console.error('[Desp. Servicio de Materiales Edu]: Error al cargar la Paginación de Materiales');
             throw error;
        }
        // return {materiales,allItems,nextPageToken}
      }  
  }