<template>
	<div class="info-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200
	 dark:border-700 hover:shadow-xl transition-all">
	  <div :class="`text-4xl p-4 bg-${color}-100  dark:bg-${color}-900/20 rounded-xl`">
	  	{{icon}}
	  </div>
		<h3 :class="`text-xl font-bold text-${color}-600  dark:text-${color}.}-400 flex-1`">
		 {{title}}
	    </h3>
	</div>

	<p class="text-gray-700 dark:text-gray-300 leading-relased">
		{{content}}
	</p>
</template>

<script setup lang="ts">
	defineProps<{
	  icon: string;
	  title: string;
	  content: string;
	  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
	}>();
</script>