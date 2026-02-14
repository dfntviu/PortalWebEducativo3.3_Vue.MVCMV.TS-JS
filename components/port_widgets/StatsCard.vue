<template>
	<div class="stats-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700
		hover:shadow-xl transition-all cursor-pointer">
		<div class="flex items-center justify-between mb-4">
			<div :class="`text-4xl p-3  rounde-xl ${bgColor}`">
				{{icon}}
			</div>
			<div v-if="trend" :class="`text-sm font-medium px-3 py-1 rounded-full ${trendColor}`">
				{{trend}}
			</div>
		</div>
		
		<div>
			<p :class="`text-3xl font-bold mb-1 text-${textColor}`">
			 {{formattedValue}}
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

	const bgColor = computed(() => {
  	const map: Record<typeof props.bgColor,string> = {
  		blue: 'bg-blue-100 dark:bg-blue-900/20',
  		green: 'bg-green-100 dark:bg-green-900/20',
  		purple: 'bg-purple-100 dark:bg-purple-900/20',
  		orange: 'bg-orange-100 dark:bg-orange-900/20',
  		red: 'bg-red-100 dark:bg-red-900/20',
  	};

  	return map[props.color];
  });

	const textColor = computed(() => {
  	const map: Record<typeof props.bgColor,string> = {
  		blue: 'text-blue-100 dark:text-blue-400',
  		green: 'text-green-100 dark:text-green-400',
  		purple: 'text-purple-100 dark:text-purple-400',
  		orange: 'text-orange-100 dark:text-orange-400',
  		red: 'bg-red-100 dark:bg-red-400',
  	};

  	return map[props.color];
  });

  /*const trendColor = computed(()=> {
  	 if (!props.trend) return '';
  	  const isPositive = props.trend.startWith('+');
  	    return isPositive;
  	    	? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  	    	: 'bg-green-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  });*/

</script>

<style scoped>
	/*.color{
		background: #356d;
		height: 8px;
		margin: 6px 3px;
		padding: 8px;
	}*/
</style>