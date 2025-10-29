  // import defineStore from 'pinia';
  import {defineStore} from 'pinia';
  import { adminAllServices} from '@/Services/adminServAll.ts'
  import type  {Moderation} from '@/types';

 const useAdmAllStore = defineStore('todo_admin', {
 	state() => ({
	 	   // Dec. de las variables reactivas de ambos roles
 	 	  loading: false,
      // No es así, no trates a multiples valores como variables, sino como objeto
       totales: {
         tot_alums = 0,
         tot_materials = 0,
       },
          alumnos: alumnos as Profile[],
        materials: materials as Material[],
 	 	     error: "";
 	}),

 	actions: {
     /** 
      * Se carga y refresca el total de Alumnos y materiales
      * */
 	 	async monitoringTotal(nombreAlum: string){
 	 		this.loading = true;
 	 		
 	 		try{
           // Para los Alumnos
            const alumnos = await adminAllServices.adminAlumnos(nombreAlum);
          if (alumnos && alumnos.length > 0) {
            // Refrescar a las variables reactivas
             this.alumnos = alumnos;
             this.totales.tot_alums = alumnos.length;
             console.log('Hemos terminado de desplegar los ALUMNOS.'); 
             
           } 
             // Para los Materiales Educativos
              const materiales = await adminAllServices.adminMaterials();     
             if (materiales && materiales.length > 0) {
              this.materials = materiales;
              this.totales.tot_materials = materiales.length;
              console.log('Hemos terminado de desplegar los MATERIALES.');
           }
   	 	   }catch(err: any){
   	 	   	  this.error = err.message;
   	 	   }finally{
   	 	   	 this.loading = false;
   	 	   }
 	 	},
     /**
      * Actualiza los contadores totales de alumnos y materiales
      * */
    async cuantificateTotal(materialId: string){
      this.loading = true;
        
      try{
           // El Total de Materiales
          const  totalMats = await adminAllServices.totalDeMateriales(materialId);
          if(totalMats !== undefined){
            this.totales.tot_materials += 1; 
              alert('Proceso Conteno Total de Materiales finalizado')
          }
            // El Total de Alumnos
             const  totalAlums = await adminAllServices.totalDeMateriales(materialId)
          if (totalAlums !== undefined) {
            this.totales.tot_alums  += 1; 
             alert('Proceso Conteo Total de Alumnos finalizado');
          }
      }catch(err: any){
        this.error = err.message ?? "Error en la Cuantificación Total";
      }finally{
         this.loading = false;
      }
    }
  },
});