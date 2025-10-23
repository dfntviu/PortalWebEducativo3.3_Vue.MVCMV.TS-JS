  <template>
  	<section class="comentarios destacados">
  		<h3>Comentarios Destacados</h3>
  		 <ul>
  		 	<section-group name="resaltar" tag="div">
  		 		<li  v-for="c in destacados" :key="c.uid" :class="verde">	
  		 			{{c.mensaje}}
  		 		</li>
  		 	</section-group>
  		 </ul>
  	</section>
  </template>
<script setup language="ts">
	import {storeToRefs} from 'pinia';
	import {useModerationStore} from '@/stores/moderateStore.ts';

	const store_moderat = useModerationStore();
	const {destacados} = storeToRefs(store_moderat);
	
	/*Proces*/
</script>

 <style scoped>
 	.verde{
 		background-color: #d1f7d1;
 		padding: 6px;
 		margin-bottom: 4px;
 		border-radius: 4px;
 	}

 	 .resaltar-enter-active,
    .resaltar-leave-active {
	  transition: all 0.5s ease;
    }

    .resaltar-enter-from,
	.resaltar-leave-to {
	  opacity: 0;
	  transform:  translateY(-5px);
    }
 </style>