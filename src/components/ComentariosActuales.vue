<template>
   <section class="comentarios-actuales">
      <h3>Comentarios Actuales</h3>


      <section class="transition">
         <p v-if="ultimoComenatario" 
            :class="{
              verde: ultimoComenatario.destacado,
              rojo: !ultimoComenatario.destacado
              }">
                 {{ultimoComenatario.mensaje}}
         </p>

            <div class="acciones">
               <input type="text" v-model="nuevoComentario" placeholder="Escribe un comentario">
               <button type="text" @click="valorar(true)">Destacado</button>
               <button type="text" @click="valorar(false)">No Destacado</button>
            </div>
      </section>

   </section>
</template>


<script setup lang="ts">
	import {ref, computed} from 'vue';
	import {storeToRefs} from 'pinia';
	import {useModerationStore} from '@/stores/moderateStore.ts';
	import {useHighLight} from '@/composable/useHighLight.ts';

    const moder_store = useModerationStore();
    const {comentarios} = storeToRefs(moder_store);

    const {estado, activar} = useHighLight();
    const nuevoComentario = ref("");

    /* Procesar la informacion de la lib iluminjaion y estado*/

   const ultimoComenatario = computed(()=>{
    	const condicional_longitud = comentarios.value.length> 0;
    	const condicional_2 = comentarios.value[comentarios.value.length-1];
    	 return condicional_longitud
    	 	  ? condicional_2
    	 	  :  null;
   });	

      function valorar(destacado: boolean) {
       		if (!nuevoComentario.value) return;
       		moder_store.agregarComentarios(nuevoComentario.value, destacado);
       		  activar(destacado ? "destacado" : "nodestacado");
              nuevoComentario.value = "";
      }
</script>
 <style>
   .verde{
      background-color: #d1f7d1;
      padding: 6px;
      margin-bottom: 4px;
   }

   .amarillo{
      background-color: #fff8c4
      padding: 6px;
      margin-bottom: 4px;
   }

   .resaltar-enter-active,
   .resaltar-leave-active {
     opacity: 0;
     transform:  all 0.5s ease;
   }

   .resaltar-enter-from,
   .resaltar-leave-to {
      opacity: 0;
    transform:  translateY(-5px);
   }
 </style>