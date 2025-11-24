import {defineStore} from 'pinia';
  import {ModerationService} from '@/services/ModerationServ.ts';
  import {Moderation} from '@/types/interf.index';
  import {Comentario} from '@/types/interf.index';
  import type  {Material} from '@/types/interf.index';
  // Instalar Pinia
    export const useModerationStore =  defineStore('moderation_materials', {
     	 state: () => ({
    	 	   // Dec. de las variables reactivas de ambos roles    --> tot <- 3.5
          // tipo_moderation: 'uuid_mat' as Moderation | null;  // 1 acierto
          collection_type: [] as Material[], // 2 acierto
     	 	   loading: false,   // 3 acierto
                estado: 'pendiente' as 'aprobado' | 'rechazado' | 'pendiente',  // 1/2 acier.
     	 	     error: "",
            comentarios: [] as Comentario,  // nueva agregada(25/Sep/25
            // comentarios: [] as any []; //nuevo para la opinion de profesore
     	 }),

     	actions: {
     	    async estadoDeModeracion(materialId: string,alumnoId: string){
               // falto la 2° linea
     	 		this.loading = true;
                this.error = "";    
                this.estado = "pendiente" ;
     	 		
     	 	    try{
                    // Se comprueba y/o valida el estado actual
                    if (estado === 'aprobado') {
     	 		       await ModerationService.arpobarMaterialsEduc(userId);
                        console.log(`[ModerationStre]: El Material de ${userId} aprobado correctamente`);          
                  }else if (estado === 'rechazado') {
                       await  ModerationService.rechazarMaterialsEduc(userId);
                        console.log(`[ModerationStre]: El Material de ${userId} fue rechazado`);
                  }else{
                      console.warn(`[ModerationStre] del Estado ${this.estado} no es válido para moderar`)
                  }
       	 	    }catch(err: any){
       	 	    	  this.error = err.message || "Error en la moderación de materiales" ;
                       console.error(`[ModerationStre] Error: ${this.error}.` );
       	 	    }finally{
       	 	   	      this.loading = false;
       	 	    }
     	    },

 	 	    async estadosDeModeracionPendientes(){
 	 		  this.loading = true;
              this.error = "";
 	 		
     	 		try{
                       const pendientes = await ModerationService.getPenditentes();
                    if(Array.isArray(pendientes)) {
     	 		        this.collection_type = pendientes;
                        this.tipo_moderation =  pendientes.length
                            ? (pendientes[0] as Moderation)
                            : null;

                    console.log(`[ModerationStore]: ${pendientes.length} materiales pendientes Obtenidos`);

                }else{  
                    console.error('[ModerationStore] Error:La respuesta de Materiales Pendiente no es un arreglo');
                }
   	 	        }catch(err: any){
   	 	   	       this.error = err.message || "Error obtenido en materiales pendientes" ;
                     console.error("[ModerationStore] Error: ", this.error);
       	 	    }finally{
       	 	   	    this.loading = false;
       	 	    }
    	    },

             // Nuevo agregada(25/Sep/25)
            async agregarComentario(mensaje:string,destacado:boolean){
              this.loading = true;
              this.error = ""
            
                try{
                    const nuevo = ModerationService.agregarComentarioProffe(mensaje,destacado);
                     this.comentarios.push(nuevo); // es alcanzable
                }catch(err: any) {
                    console.error("Error al escribir el Comentario: ", err);
                }finally{
                   this.loading = false;
                }
            }
        },

        getters: {
            destacados: state => state.comentarios.filter(c => c.destacado),
        },
    });