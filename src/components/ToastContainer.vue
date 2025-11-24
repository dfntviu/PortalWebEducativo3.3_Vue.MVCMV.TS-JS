<template>
	<div class="fixed top-4 right-4 z-[9999] flex-flex-col gap-3 max-w-md w-full point">
		<TransitionGroup name="toast">
			<ToastItem/ 
				 v-for="toast in toastStore.toasts"
				 :key="toast.id"
				 :toast="toast"
				 @close="toastStore.remove(toast.id)"
				 :class="pointer-events-auto"
			>
		</TransitionGroup>
</template>

<script setup lang="ts">
	import {onMounted, onUnmounted} from 'vue';
	import {useToastStore} from '@/stores/toastStore.ts';
	import {ToastService} from '@/services/ToastService.ts';
	 import  ToasItem from './ToasItem.vue';

  const toastStore = useToastStore();
  let unscribe: (()=> void) | null = null;

 	onMounted(()=>{
  	 	unsuscribe = ToastService.suscribe((toast)=>{
  	 	  toastStore.add(toast);
  	    });
 	});

 	onUnmounted(()=>{
  	 	if (unscribe) {
  	 		unsuscribe();
  	 	}
 	});

	/**/

</script>

<style scoped>
	.toast-enter-active {
  	  transition: all 0.3s ease-out;
	}

	.toast-leave-active {
	  transition: all 0.2s ease-in;
	}

	.toast-enter-from {
	  opacity: 0;
	  transform: translateX(100px);
	}

	.toast-leave-to {
	  opacity: 0;
	  transform: translateX(50px) scale(0.95);
	}
</style>