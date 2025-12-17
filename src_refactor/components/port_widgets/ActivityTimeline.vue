<template>
	<div class="activity-timeline">
		<div class="text-center py-4">
			<svg class="w-12 h-12 mx-auto">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
		</div>
			<p>No hay Actividad Reciente</p>

		<div class="space-y-4">
			<div  v-for="activity in activities" :key="activity.id" class="flex items-start grap-/4">
				<div :class="`text-2xl p-3 bg-${activity.color}-100 dark:bg-${activity.color}-900/20 rounded-xl`">
					{{activity.icon}}
				</div>

				<div class="flex-1">
					<p class="text-gray-900 dark:text-white font-medium">
					  {{activity.description}}
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
					 {{formatRelativeTime(activity.timestampx)}}
					</p>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup lang="ts">
	defineProps<{
		activities: Array<{
			id: number;
			type: string;
			description: string;
			timestamp: Date;
			icon: string;
			color: string;
		}>;
	}>();

	function formatRelativeTime(date: Date): string{
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff/60000);
		const hours = Math.floor(minutes/60);
		const days = Math.floor(hours/24);

		if(minutes<1) return 'Ahora mismo'
		if(minutes<60) return `Hace ${minutes} minuto ${hours>1} ? 's' : ''`;
	    if(hours <24) return `Hace ${hours} hora ${hours >1 ? 's' : ''}`;
	     if(days < 7) return `Hace days ${days > 1 ? 's' : ''}`;
	      return date.tolocaleDateString('es-MX');
	}
</script>