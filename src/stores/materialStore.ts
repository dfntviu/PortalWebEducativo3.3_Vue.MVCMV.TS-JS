 import {defineStore} from 'pinia';
 import { MaterialDeployService } from '@/services/MaterialServ.js' ;
  import type {Material} from '@/types';
        // Darle una pasada al DeployService y la vista  viewMaterials_MatStore -> viewMethodsMaterials, abrir vista en siguiente de unitled
    const useMaterialStore = defineStore('material', {
   	    state: () => ({
   	   	 materials: [] as Material[],
   	   	 loading: false,
         error: "",
   	   	 errorHistory: [] as string, // 📌historial de errores
   	   	 id: "" as string | null,
          alumno: null as any; // nuevo for fetch
   	   	});

   	    actions: {
          /** ----------------
           * SETTERS
           * ----------------*/
            setError(msg: string){
              this.error = msg;

              // 📌Traza de errores en Consola
               console.error("[MaterialStore] Error: ", msg);

               this.errorHistory.push(
                  `${new Date().toISOString() - ${msg}}`
               );
            },

            cleanError(){
              this.error = "";
            },

            clearMaterials(){
              this.materials = [];
            },

            setMaterials(list: Material[]){
               this.materials = [];
            },

            setId(id: string | null){
               this.id = id;
            },
             /* ----------------
             *   ACTIONS
            * ---------------- */
       	   	async fetchMaterials{
       	   	 	this.loading = true;
              this.cleanError();
       	   	 	   try{
                    this.setMaterials(
                         await MaterialDeployService.getAllMaterialsEduc()
                    );
       	   	 	   }catch(err: any){
       	   	 	   	  this.error = err.message;
       	   	 	   }finally{
       	   	 	   	 this.loading = false;
       	   	 	   }
       	   	},
       	   	/*Metodo creado el [07/Oct/2025]*/
            async guardarMaterialesYActualizar(material: Material) {
       	   	 	this.loading = true;
              this.cleanError();
       	   	 	  try{
       	   	 	  	 await MaterialDeployService.saveMaterialsEduc(material);
                    // 🔄 Actualizar lista después de guardar
                   this.setMaterials(
                       await MaterialDeployService.getAllMaterialsEduc()
                   );

       	   	 	  }catch(err: any){
       	   	 	  	  this.setError(err.message)
       	   	 	  }finally{
       	   	 	   	 this.loading = false;
       	   	 	  }
       	   	},

            async guardarMateriales(material: Material) {
              this.loading = true;
              this.cleanError();
                try{
                   const resultado = await MaterialDeployService.saveMatererials(material);
                    if(resultado){
                      console.log('Se guardado del material fue exitoso');
                    }else {
                      console.log('No se guardó el material. Verifica la seleccion.');
                      }
                }catch(err: any){
                    this.setError(err.message)
                }finally{
                   this.loading = false;
                }
            },

       	   	async obtenerMaterialPorId(id: string) {
                this.loading = true;
                this.cleanError();
       	   	 	  try{
       	   	 	  	 const material = await MaterialDeployService.getMaterialsEducById(id);
                   console.log(`[Estado-Material] cargado por UUID: ${id}`, material);
                     return material;
       	   	 	  }catch(err: any){
                  this.setError(err.message);
       	   	 	  }finally{
                   this.loading = false;
                }
       	   	},
            /**
             * Habilitar unicamente, si se desea refactorizar la vista, 
             * activa el compentario compuesto de la ln. 84  Fecha: [08/Oct/2025]
             * Traer materiales de Forma individual(por alumno) **/
            /*async fetchMaterialesPorAlumno(uid: string){
               this.loading = true;
               this.error = null;
               const auth_store = useAuthStore();
               const profile_store = useAuthStore();

                try{
                  if (!auth_store.uid || auth_store!== uid) {
                   throw new Error('El usuario autenticado no coincide con el material solicitado');
                  }

                 const materiales = await MaterialDeployService.obtenerMaterialPorId(uid);
                  if (!materiales || materiales.length === 0) {
                     throw new Error('No existen materiales subidos en la sesión');
                  }

                        const perfil = await profile_store.fetchProfileUno(uid);

                      this.materials = materiales;
                         this.alumno = perfil;
                }catch(error: any){
                  this.error = error.message || 'El Perfil es desconocido al cargar materiales.';
                  console.error('Traza de Error: [',this.error,']');
                }finally{
                   this.loading = false;
                }
              }, */

    	   	async eliminarLosMateriales(id: string) {
              this.loading = true;
              this.cleanError();
    	   	 	  try{
    	   	 	  	 await MaterialDeployService.deleteMaterialsEduc(id);
                    console.log(`El Material con UUID: ${id} fue eliminado correctamente`);

                    // actualizar la lista después de eliminar 
                     this.setMaterials(
                        await MaterialDeployService.getAllMaterialsEduc()
                     );
    	   	 	  }catch(err: any){
                this.cleanError();
    	   	 	  }finally{
                 this.loading = false;
              }
    	   	}
   	    },

        getters:{
          hasError: (state) => state.error !== "",
          materialCount: (state) => state.materials.length,
          materialById: (state) => {
             return (id: string) => 
                state.materials.find((m)=> m.id === id ) || null;
          },
        }
    });