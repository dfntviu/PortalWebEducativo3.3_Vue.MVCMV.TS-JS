<template>
  <!-- <div> -->
    <section class="p-6 max-w-3xl mx-auto">
      <h1>Gestión de Materiales</h1>

      <!-- Formulario Crear y Editar -->
        <form @submit.prevent="handleSave" class="space-y-4 border p-4 roundend-lg shadow"> 
           <input 
            v-model="form.titulo"
            type="text"
            placeholder="Esc el Titul0"
            class="w-full border rounded p-2" 
             required 
           />

          <textarea  v-model="form.description" 
            placeholder="Descripción del Material PDF" 
            class="w-full border rounded p-2" 
            required 
          ></textarea>

            <input
                v-model="form.archivoURL"
                type="url"
                placeholder="URL del archivo"
                class="w-full border rounded p-2"
            />
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
              {{form.id ? 'Actualizar' : 'Guardar'}}
          </button>
        </form>

      <!-- Mensajes de Error -->
        <p class="text-red-600 mt-2">
           {{materialStore.error}}
        </p>
      <!-- Listado de Materiales -->
        <div>
          <h2>Lista de Materiales</h2>
            <ul>  <!-- nombre de la coleccion del DeployService -->
              <li  v-for="m in materialStore.materials" :key="m.id" class="border-b py-2 flex justify-between items-center">
                <span> {{m.titulo}} </span>
                <div class="space-x-2" >
                   <button
                    @click="viewDetails(m)"
                     class="bg-blue-500 text-white px-2 py-1 rounded" 
                   >
                    ver Detalles
                   </button>
                   <button
                    @click="editarMaterial(m)"
                     class="bg-yellow-500 text-white px-2 py-1 rounded" 
                   ></button>

                   <button
                    @click="eliminarElMaterial(m)"
                     class="bg-red-500 text-black px-2 py-1 rounded" 
                   ></button>
                </div>
              </li>
            </ul>
        </div>
          
          <!-- Modal de Detales-->
        <div v-if="materialStore.selectedMaterial" class="fixed s inset-0 bg-black bg-opacity-40 items-center justify-center">
            <div class="bg-white p-6 rounded shadow max-w-md w-full">
               <h3 class="text-lg font-bold mb-2">
                   {{materialStore.selectedMaterial.titulo}}
               </h3>
                <p> {{materialStore.selectedMaterial.descripcion}} </p>
                <p class="text-sm text-gray-500 mt-2"> 
                 {{materialStore.selectedMaterial.autor || "N/D"}} 
                </p>

                 <button @click="materialStore.selectedMaterial=null" class="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                 > Cerrar
                 </button>
            </div>
        </div>
    </section>
   <!--  <div v-if="materialStore.validationErrors.length">
      <p v-for="err in materialStore.validationErrors" :key="err" class="error">
        {{ err }}
      </p>
    </div> -->

</template>

<script setup lang="ts">
 import { reactive, onMounted } from "vue";
 import { useMaterialStore } from "@/stores/materialStore.ts";
 import {materialAdmValidations} from '@/utils/validations.origin/validationsAdminMaterials.js';
 // import {materialesValidations, validateMaterialActual, stateOfMaterial} from '@/utils/validationsMaterial/validationsMaterials.js';
 import type {Material} from '@/types/interf.index';

   const materialStore = useMaterialStore();

  const form = reactive({
     id: "",
     titulo: "",
     desciption: "",
     archivoURL: "",
  });

    onMounted(async ()=>{
       await materialStore.fetchMaterials();  //cargar la lista inicial
    });

    async function handleSave(){
      await materialStore.guardarMateriales({...form});
    }

    async function editarMaterial(material) {
       form.id = material.uuid;
       form.titulo = material.title;
       form.desciption = material.description;
       form.archivoURL = material.file || "";
    }

    async function viewDetails(id: string) {
      await materialStore.obtenerMaterialPorId(id);
    }

    async function eliminarElMaterial(Material) {
      const material = Material;
      await materialStore.eliminarLosMateriales(material);
    }

      function resetForm() {
        form.id =  "";
        form.titulo = "";
        form.desciption = "";
        form.archivoURL =  "";
      }
    
</script>

<style>
.error {
  color: red;
}
</style>
