<template>
	<div class="stats-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700
		hover:shadow-xl transition-all cursor-pointer">
		<div class="flex items-center justify-between mb-4">
			<div :class="`text-4xl p-3 bg-${color}-100 bg-${color}-900/20 rounded-xl`">
				{{icon}}
			</div>
			<div v-if="trend" :class="`text-sm font-medium px-3 py-1 rounded-full ${trendColor}`">
				{{trend}}
			</div>
		</div>
		
		<div>
			<p :class="`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mb-1`">
			 {{formattedValued}}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				{{label}}
			</p>
		</div>
	</div>
</template>
 
<script setup lang="ts">
  import {computed} from 'vue';

  const props = defineProps<{
  	 icon: string;
  	 value: number;
  	 label: string;
  	 trend?: string;
  	 color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }>();

  const formattedValue = computed(()=>{
  	 if (props.value >= 1000) {
  	 	return (props.value / 1000).toFixed(1) + 'k';
  	 }
  	  return props.value.toString();
  });

  const trendColor = computed(()=> {
  	 if (!props.trend) return '';
  	  const isPositive = props.trend.startWith('+');
  	    return isPositive;
  	    	? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  	    	: 'bg-green-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  });

</script>