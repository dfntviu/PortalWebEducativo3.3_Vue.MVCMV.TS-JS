<template>
	<button class="quick-action-card group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-2
	border-gray-200 dark:border-700 hover:shadow-xl hover:scale-105 transition-all"
	  :class="`hover:border-${color}-500`"
	>
		<div class="flex flex-col items-center gap-3">
		  	<div :class="`text-4xl p-4 bg-${color} dark:bg-${color}-900/20 rounded-2xl group-hover:scale-110 transition-transform`">
		  	 	  {{icon}}
		  	 </div>
		     <span :class="`text-sm font-medium text-gray-700 dark:text-gray-300 dark:group-hover:text-${color}-400`">
				{{label}}	
		     </span>
		</div>
	</button>
</template>

<script setup lang="ts">
	defineProps<{
		icon:string;
		label: string;
		color: string;
	}>();
</script>