/**
 * @store MaterialStudentService
 * @description Gestión de materiales del Alumno
 * @pattern derivada de(centralizacion MaterialBaseStr) 
 * @extends MaterialBaseService*/

/**
 * FUNCIONALIDADES
 *  Crear materiales propios
 *  - Ver materiales visibles (propios + aprobados de otros)
 *  - Actualizar/eliminar materiales propios
 *  - Consultar estado de envíos
 * */
 // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
 import { defineStore } from 'pinia';
 import { ref, computed } from 'vue';
 import { useMatBaseStore } from './materialBaseStore.ts';
 import {MaterialBseService} from '@/services/materials/MaterialBseService.ts';  //**
 import {MaterialStudentService} from '@/services/materials/MaterialStudentService.ts' // |-<>-|
 import { useAuthStore } from '@/stores/authStore2' //# -> <-
 import type {Material} from '@/types/indexInterface.ts';
 // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
export const useMaterialStudentStore = defineStore('materialStudent', ()=>{
   // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
	  // ================================
    //   HERENCIA DEL STORE BASE
    // ================================
    const baseStore = useMatBaseStore();
    const {
    	materials,
	    loading,
	    error,
	    searchTerm,
	    totalMaterials,
	    filteredMaterials,
	    hasMaterials,
	    hasError,
    } = storeToRefs(baseStore);

    // =================================
    //		 EDO ESPECIFICO DEL ALUMNO
    // =================================

    // Estado para modo edicion
     const isEditMode = ref<boolean>(false);
     const editingMaterialId    = ref<string | null>(null);
     const originalMaterialData = ref<Partial<Material>| null>(null);
     const editFormData = ref<{
     	titulo:string;
     	description: string;
     	tags: string[];
      }>({
     	   titulo: '',
     	   description: '',
     	   tags: [],
        });

    // ===================================
    //	  COMPUTED ESPECIFICS FOR STUDENT
    // ===================================

     /**
      * Materiales Propios del Alumno
      * */
    const myMaterials = computed(() =>{
     	const authStore = useAuthStore();
     	  const material_filter = materials.value.filter( m => m.autorId === authStore.user?.uid);
     	  return material_filter;
    });

    /**
      * Materiales Aprobados por los Alumnos
      * */
    const approvedMaterials = computed(()=>{
    	const authStore = useAuthStore();
    	    	const approves =	materials.value.filter( m => m.status === 'approved' &&
    								   m.autorId !== authStore.user?.uid );
    	    return approves;
    });

    /**
      * Materiales Pendientes del Alumno
      * */
    const pendingMaterials = computed(()=>{
      const authStore = useAuthStore();
         return materials.value.filter(
                   m => m.autorId === authStore.user?.uid
                   &&   m.status  === 'pending'
                );
    });
        // * NEWS *
    /**
      * Materiales Aprobados del Alumno
      * */  
    const myApprovedMaterials = computed(()=>{
      const authStore = useAuthStore();
      return materials.value.filter(
          m=>m.autorId === authStore.user?.uid
        &&   m.status  === 'approved'
      );
    });

    /**
      * Materiales Rechazados del Alumno
      * */  
    const myRejectedMaterials = computed(()=>{
       const authStore = useAuthStore();
        return materials.value.filter(
            m => m.autorId === authStore.user?.uid
          &&     m.status  === 'rejected'
        );
    });


    /**
      * Estadistícas del Alumno
      * */  
    const myStats = computed(()=>{
        total: myMaterials.value.length,
        pending: pendingMaterials.value.length,
        approved: myApproveMaterials.value.length,
        rejected: myRejectedMaterials.value.length
    });

    /**
      * Indica si hay cambios en el formulario de edición respecto al original
      * */  
    const hasEditChanges = computed(()=>{
      if (!originalMaterialData) return false;
        return (
            editingFormData.value.titulo !== originalMaterialData.value.titulo ||
            editingFormData.value.description !== originalMaterialData.description ||
              JSON.stringnify(editingFormData.value.tags) !== JSON.stringnify(originalMaterialData.value.tags)
          );
    });

    /**
      * Material que se está editando actualmente
      * */  
    const editingMaterial = computed(()=> {
      if (!editingMaterial.value) return null;
        materials.value.find(m =>m.uid === editingMaterial.value) || null;
    });

    /**
     * Material que está siendo editado actualmente
     * */
    const editingMaterial = computed(()=>{
      if (!editingMaterialId.value) return null;
          materials.value.find( m =>m.uid === editingMaterialId.value) || null;
    });

    // ================================
    //   METS ESPECIFICOS DEL ALUMNO
    // ================================

    /**
     * Carga todos los materiales especificos para 
     * el Alumno (sus materiales + materiales aprobados por otros)
     *  */
     async function fetchMaterials(): Promise<void> {
         const authStore = useAuthStore();

         if (!authStore.user?.uid) {
            baseStore.setError('Debes iniciar Sesión para ver los Materiales');
            return;
         }

          baseStore.manejoEjecucionError(
             async ()=> {
                 const visibleMaterials =  MaterialStudentService.getAllVisibleMaterials(authStore.user!.uid);
               
              baseStore.setMaterials()
            },
             'Error al cargar 0Materiales del Alumno'
          );  
     }

     /**
      * Crear un nuevo Material
      * */
    function createMaterial(data: Partial<Material>): Promise<string> {
       const authStore = useAuthStore();

       if (authStore.user?.uid) {
          baseStore.setError('Debes iniciar Sesión para crear los Materiales');
           return null;
       }

        const result = baseStore.emanejoEjecucionError(
          async ()=> {
            const materialId = MaterialStudentService.createMaterial(authStore.user.!uid, data);

            // Recargar materiales despues de crear
               await fetchMaterials();

               return materialId;
          },
          'Error al crear el Material del Alumno'
        );
    }
   // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
    /**
     * Actualizar el Material Propio
     * */
    async function updateMyMaterial(materialId: string,
      updates: Partial<Material> ) {

      const authStore = useAuthStore();

      if (authStore.user?.uid) {
         baseStore.setError('Debes iniciar sesión para actualizar los Materiales');
          return false;
      }

              await baseStore.manejoEjecucionError(
                 async () => {
                     await MaterialStudentService.updateMaterial(authStore.user!.uid,materialId,updates);

                     baseStore.updateMaterial(materialId, updates);

                     return true;
                 },
                  'Error al actualizar material'
              );

              return result !== null;
    }
// ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
    /**
     * Elimina un material propio(soft delete) 
     * */
    async function deleteMyMaterial(materialId: string): Promise<boolean>{
      const authStore = useAuthStore();

        if(authStore.user?.uid) {
            baseStore.setError('Debes inciar sesión para eliminar Materiales');
              return false;
        }

          const result = baseStore.manejoEjecucionError(
            async () => {
                     
                  await MaterialStudentService.deleteMyMaterial(authStore.user!.uid,materialId);

                  // Remover del store local
                 baseStore.removeMaterial(materialId);

                 return true;
             },
                  'Error al eliminar material'
          ); 

          return result !== null;
    }
    // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
    /**
     * Consulta el estado del material propio
     * */
   async function getMyMaterialStatus(materialId: string):Promise<{status:string, moderateAt?: Date,
    reason?: string| null}>{
       const authStore = useAuthStore();

       if (!authStore.user?.uid) {
           baseStore.setError('Debes inciar sesión, para filtrar los distintos status'); 
            return null;
       }

          const result = baseStore.manejoEjecucionError(
             async () => {
                     return await MaterialStudentService.getMyMaterialMyStatus(
                                  authStore.user!.uid,materialId);

                     return true;
                 },
                  'Error al consultar estado del material'
            );

          return result;
    }
// ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
    // ======================
    //   METODOS DE EDICIÓN 
    // ======================
    // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
    /**
     * Inicia el modo de edición para un material
     * @param material - Material a Editar
     * @param true - si no fue posible Iniciar edición, falso si
     * */
    function startEditMaterial(material: Material): boolean {

         // Validación 1: El Material debera perm. en estado 'pending->pendiente'
        if (material.status !== 'pending') {
           baseStore.setError('Solo puedes editar materiales pendientes de revisión');
             return false;
        }
          // Validación 2: Usuario deber ser el propietario
        if (material.autorId !== authStore.user?.uid) {
           baseStore.setError('NO tienes PERMISO para editar el Material.');
             return false;
        }

        // Activar el modo edición
          editMode.value = true;
          editingMaterial.value = material.uid;

          // Guardar los datos originales (para detectar cambios y cancelar)

          originalMaterialData.value = {
              titulo  = material.titulo,
              description = material.description,
              tags = material.tags || [],
          };
           // Cargar Datos de formulario de edición
          editingFormData.value = {
              titulo:  material.titulo  || '',
              description:  material.description || '',
              tags:  material.tags || [],
          };

            console.log('[MaterialStudentStore]✏️ Edicion iniciada para: ', material.titulo);
             return true;
    }
    // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
    /**
     * Cancela el modo de edición para un material
     *
     *  @param force - Si no es true, no pide confirmación a pesar(aunque) haya cambios
     * @returns true  si canceló, false si el usuario rechazó cancelar
     * */
    function cancelEditMaterial(force: boolean= false): boolean {
       if (!force && hasEditChanges.value) {
         return false;
       }

        isEditMode.value = false;
        editingMaterialId.value = null;
        originalMaterialData.value = null;

         editingFormData.value = {
          titulo:  '',
          description: '',
          tags:[],
         };

         baseStore.clearError();
         console.log('[MaterialStudentStore] ❌ Edición cancelada');
        // Body of function()
      return true;
    }

    function updateEditFormData(field: 'titulo'| 'description'| 'tags', value: any):void {
        editingFormData.value[field] = value;
    }

    /**
     * Guarda los cambios del Material en Edición
     * */
     function saveEditMaterial(): Promise<boolean> {
        const authStore = useAuthStore();

        if (!authStore.user?.uid) {
           baseStore.setError('No hay material de Edición');
             return false;
        }

        if (!editingMaterialId.value) {
            baseStore.setError('No hay materiales en Edición');
             return false;
        }

        if (!editingFormData.value.titulo.trim()) {
            baseStore.setError('El título es requerido');
              return false;
        }

           const result = baseStore.manejoEjecucionError(
               async () => {
                   const updates: Partial<Material> = {
                       titulo: editingFormData.value.titulo.trim(),
                       description: editingFormData.value.description.trim(),
                       tags: editingFormData.value.tags,
                   };

                   MaterialStudentService.updateMyMaterial(
                       authStore.user!.uid,
                       editingMaterialId.value!,
                       updates
                    );

                    const materialName = editingFormData.value.titulo;
                    cancelEditMaterial(true);

                    console.log(`[MaterialStudentStore] ✅ Material ${materialName} actualizado `);  
                     return true;
               },
                'Error al actualizar el Material'
            );

            const result !== null;
     }

     /**
      * Sube un archivo PDF y crea el material
      * */
      async function uploadMaterialFile(file: File, materialData: Partial <Material> ): Promise<string| null> {
         const authStore = useAuthStore();

         if (file.type !== 'application/pdf') {
            baseStore.setError('Debes iniciar Sesión para subir Materiales');
              return null;
         }

         if (file.type !== 'application/pdf') {
            baseStore.setError('Solo se aceptan archivos PDF');
             return null;
         }

         return await createMaterial({
            ...materialData,
         });

      }
         return {
          // Estado heredado(referenciados)
           materials,
           loading,
           error,
           searchTerm,

           // Estado de Edicion
            isEditMode,
            editingMaterialId,
            editForm
            editFormData,
            editingMaterial

           // Computed heredados
            totalMaterials,
            filteredMaterials,
            hasMaterials,
            hasError,

            // Metdo Especifícos
            myMaterials,
            approvedMaterials,
            pendingMaterials,
            myApprovedMaterials,
            myRejectedMaterials,
            myStats,
            hasEditChanges,

             // Metodos Heredados
            clearError: baseStore.clearError,
            searchMaterials: baseStore.searchMaterials,
            clearSearch: baseStore.clearSearch,
            resetState: baseStore.resetState,
            getMaterialById: baseStore.getMaterialById,

            // Metodos Especifícos
            fetchMaterials
            createMaterial
            updateMyMaterial
            deleteMyMaterial
            getMyMaterialStatus
            uploadMaterialFile
             // Metodos de Edicion
            startEditMaterial
            cancelEditMaterial
            updateEditFormData
            saveEditMaterial
         };

    // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR

    // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR
});
 // ########## ================== ///////////////////// ------------------------------- *********************   PPPPPPPPPPPPPPPPPP RRRRRRRRRRRRRRR