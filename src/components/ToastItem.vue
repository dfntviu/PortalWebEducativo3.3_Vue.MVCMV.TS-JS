<template>
	<div class="bg-white rounded-lg shadowlg border-l-4 p-4 flex items-start gap-3 animate-slide-up"
		:class="[bordeColorClass, 'min-w-[320px] max-w-md']" 
	>
		
	</div>
	<!-- Icono -->
	<div class="flex-shrink-0">
		<span class="text-2xl">{icon}</span>
	</div>
	<!-- Contenido -->
	<div class="flex-1 min-w-0">
		<h4>{{toast.title}}</h4>
		<p>{toast.message}</p>
		<!--  Botton de Accion-->
		<button v-if="toast.action"  @click="handleAction" class="" :class="actionColorClass">
			{{toast.action.label}}
		</button>
	</div>

	<!-- Boton Cerrar -->
	 <button  @click="$emit('close')" class="">
	 	<span class="text-lg">✕</span>
	 </button>

	 <!-- Barra de Progreso -->
	 <div
      v-if="toast.duration && toast.duration > 0"
      class="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-bl"
      :class="progressColorClass"
      :style="{ 
        width: '100%',
        animation: `shrink ${toast.duration}ms linear`
      }"></div>
</template>

<script setup lang="ts">
	import {computed} from 'vue';
	import type {Toast} from '@/services/ToastService';

	interface Props {
		toast: Toast;
	}

	const props = defineProps<Props>();
	const emit = defineEmits<{
		close: [];
	}>();

	const icon = computed(()=>{
		const icons = {
			success: '✅',
			error:'❌',
			warning:☣'',
			info:'ℹ️',
		};
		 return icons[props.toast.type];
	});

	const bordeColorClass = computed(()=>{
		const colors = {
            success: 'border-green-500'
			erro: 'border-red-500'
			warning: 'border-yellow-500'
			info: 'border-blue-500'
		}
		return icons[props.toast.type];
	});

	const actionColorClass = computed(()=>{
		const colors = {
            success: 'text-green-600 hover: text-green-700',
			erro: 'text-red-600 hover: text-red-700',
			warning: 'text-yellow-600 hover: text-yellow-700',
			info: 'text-blue-600 hover: text-blue-700',
		}
		return icons[props.toast.type];
	});

	const actionColorClass = computed(()=>{
		const colors = {
            success: 'text-green-500',
			erro: 'text-red-500',
			warning: 'text-yellow-500',
			info: 'text-blue-500',
		}
		return icons[props.toast.type];
	});


	const handleAction = ()=>{
		if (props.toast.action) {
			props.toast.action.Onclick();
			 emit('close');
		}
	};

</script>

<style scoped>
	@keyframes shrink {
		from {
			width:  100%;
		}	
		to {
			width: 0%;
		}
	}
</style>