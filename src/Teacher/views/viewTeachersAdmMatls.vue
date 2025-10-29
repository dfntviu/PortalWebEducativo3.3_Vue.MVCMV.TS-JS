 <template>
 	<div>
 		<h2>Materiales</h2>

 		<div v-if="materialStore2.loading">Cargando..</div>
 		  <div v-else-if="materialStore2.error">Error: {{ materialStore2.error}} </div>

 		  	<label for="filter">¿Que Filtro deseas aplicar en los Materiales?</label>
 		   <!-- UX mejorada: se filtra automaticamente mediante event @chage -->
 		  <label for="filter">¿Que filtro elige para organizar los materiales?</label>
 		   <select  id="filter" v-model="filtro" @change="filtradoDeMateriales(filtro)">
 		   	  <option v-for="opciones in [1,2,3,4,5,6]" :key="opciones">
 		   	  	 Opción Elegida {{opc}}
 		   	  </option>
 		   </select>

 		  <h3>Resultados Aplicados, con respecto al Filtro:</h3>

			<ul>
			    <li v-for="mat in materialStore2.materials">
			  	  {{mat.title}}
			  	</li>
			</ul>
 	</div>
 </template>
 
 <script setup lang="ts">
  import { ref } from 'vue';  //bien
  import { useMaterialStoreR2 } from '@/stores/materialTeacherStore.ts';
  // import {materialesValidations} from '@/utils/validations.origin/validationsMaterials.js'; //*

 	 const materialStore2 = useMaterialStoreR2();

 	 /*Opcion predefinida, acceso a todos los filtros*/
 	  	 // El adicional
 	   const filtro = ref<number | null>(null); 

 	   const opciones = ref([1,2,3,4,5,6]); 

 	  const filtradoDeMateriales = async(opcion: number | null)=>{
 			// El adicional
  		if (!opcion) return;

        try{ 
        	await materialStore2.fetchMaterials(opciones);
        }catch(err){
        	materialStore2.error = "Error al Filtrar los materiales";
        }
 	  };
 </script>