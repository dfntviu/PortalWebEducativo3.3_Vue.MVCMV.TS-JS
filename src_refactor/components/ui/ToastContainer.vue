<template>
	
    <!-- <optgroup></optgroup> -->
     <Teleport>
     	<div>
     		<TransitionGroup>
     			<article>
     				<div class="flex items-start gap-3">
     					<div class="flex-1 min-w-0">
     						<h4 class="font-semibold text-sm">
     							<p class="text-sm opacity-90 mt-1"></p>
     						</h4>
     					</div>
     					<button 
     					  v-if="toast.dimissible"
     					  @click="handleClose(toast.id)"
     					  class="ml-2-p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 
     					    transitions-colors"
     					   arial-label="Cerrar notificación"
     					 >
     					  <svg> 
     					  	 <path stroke-linecap="round" stroke-linejoin="round"  stroke-width="2"
     					  	   d="M6 18L18 6M6 6l12 12"/>	
     					  </svg>	
     					 </button>
     				</div>

     				<div
     				   class="absolute bottom-0 left-0 h-1 bg-current-0 opacity-30 transition-all"
     				    :style="{width = 'getProgressWidth(toast)'}"
     				   >
     					
     				</div>
     			</article>
     		</TransitionGroup>
     	</div>
     </Teleport>	
</template>

<script setup lang="ts">
	import {ref, onMounted, onUnmounted } from 'vue'
	import {ToastServiceClass, ToastPosition } from '@/services/ToastService';
	import type { ToastType } from '@/services/ToastService';

	/* ══════════════════════════════════════════════ */
	/*			STATE												  */
   /* ══════════════════════════════════════════════ */

   const toasts = ref<ToastType[]>([]);
   const positions = Object.values(ToastPosition);

   let unsuscribe: ( () => void ) | null = null;

   // ═════════════════════════════════════════════════
   // 						METODOS
   // ═════════════════════════════════════════════════

   function getToastByPosition(position: ToastPosition): Toast[] {
   	return toasts.value.filter(t => t.position === position);
   }

   function getContainerClasses(position: ToastPosition){
   	const base = 'fixed z-[9999] pointer-events-none p-4';

   	const postionClasses: Record<ToastPosition, string> = {
   		[ToastPosition.TOP_RIGTH]: 'top-0 rigth-0',
   		[ToastPosition.TOP_LEFT]: 'top-0 left-0'
   		[ToastPosition.TOP_CENTER]: 'top-0 left-1/2 -translate-x-1/2'
   		[ToastPosition.BOTTOM_RIGTH]: 'bottom-0 right-0'
   		[ToastPosition.BOTTOM_LEFT]: 'bottom-0 left-0'
   		[ToastPosition.BOTTOM_CENTER]: 'bottom-0 left-1/2 -translate-x-1/2'
   	};
   	return `${base} ${postionClasses[position]}`;
   }

   function getIconClasses(type: string): string {

   	const elapsed = Date.now() - toast.timestamp.getTime();
   	const progress = Math.max(0,100 - (elapsed / toast.duration! * 100 ));

   	return `${progress}%`;
   }

   function handleClose(id: string): void {
   	ToastServiceClass.remove(id);
   }

   // ═════════════════════════════════════════
	// 	  CICLO de VIDA
   // ═════════════════════════════════════════
   onMounted( () => {
   	unsuscribe = ToastServiceClass.suscribe((newToast) => {
   	 	  toasts.value = newToast;
   	});
   });

   onUnmounted(() => {
   	if(unsuscribe){
   		unsuscribe();
   	}
   });

</script>

 <style scoped>
 	 .toast-enter-active,
 	 .toast-leave-active {
 	 	 transition: all 0.3s cubic-bezier(0.4,0.2,1);
 	 }

 	 .toast-enter-from {
 	 	opacity: 0;
 	 	transform: translateX(100%);
 	 }

 	 .toast-leave-to {
 	 	 opacity: 0;
 	 	 transform:  translateX(100%) scale(0.8);
 	 }

 	 .toast-move {
 	 	 transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
 	 }

 </style>