<!-- Maquetado de la vista del Componente Paginado [30/Sep/2025]
 Proposito:  Servir el metodo de Paginacion de Materiales en el compontente PaginadoMateriales
  con el objetivo de no saturar visualmente la vista de administración (evitar scrolear)-->
<template>
    <div>   <!-- x=x l=large -->        
        <h2 class="text-xl font-bold mb-4">Paginas Materiales Educativos</h2>

        <p  v-if="errorMsg" class="text-red-600">{{errorMsg}}  </p>

        <ul v-else>
            <li v-for="mat in materiales" :key="mat.uid">
                <strong> {{mat.titulo}} </strong> - {{mat.description}}
            </li>
        </ul>

        <div v-if="totalMateriales >=20" class="flex gap-2 mt-4">
            <button @click="previousPage"  class="px-4 py-2 bg-blue-500 text-white roundend-lg" :disabled="currentPageData.length === 0">Anterior</button>
            <button @click="nextPage"  class="px-4 py-2 bg-green-500 text-white roundend-lg"  :disabled="currentPageData.length === 0">Siguiente</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import  { ref, onMounted} from 'vue';
    import  { MaterialDeployService } from '@/services/MaterialAdmServAlumno.ts';
     import { MaterialRenovado} from '@/types/interf.index.ts';

          const materiales = ref<MaterialRenovado[]>([]);
     const totalMateriales = ref(0);
             const erroMsg = ref<string | null>(null);
     const currentPageData = ref<MaterialRenovado[]>([]);

    onMounted(async ()=>{
        try{
            const {materiales: inciales, total, hasNext} = await MaterialDeployService.cargarMaterialesPaginados();
                 materiales.value = inciales;
            totalMateriales.value = total;
        
             if (total === 0) {
                errorMsg.value = 'Lo sentimos, no existen materiales en la Base de Firebase NoSQL';
             }  
        } catch(error){
             errorMsg.value = 'Error al cargar Materiales intentelo de nuevo o más tarde';
              console.log(error);
        }
    });

     /* Dirigirse a la Pagina Anterior */
    async function previousPage() {
        try{
            currentPageData.value = await MaterialDeployService.siguientePagina(true);
        }catch(error){
            console.error('Error al ir a la pagina anterior',error);
        }          
    } 

        /*Dirigirse a la Pagina Siguiente*/
    async function nextPage() {
        try{
            currentPageData.value = await MaterialDeployService.siguientePagina(false);
        }catch(error){
            console.error('Error al ir a la pagina anterior',error);
        }          
    }

	/* ¿Que validaciones, necesito para mostrar la paginacion de los materiales*/
     
</script>