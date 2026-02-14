<template>
	<div class="material-card">
		<div class="h-40 bg-gradient from-blue-500 to-purple-600 flex items-center justify-center">
			<span class="text-6xl">{{getCategoryIcon(material.categoria)}}</span>
		</div>
		<!-- Content -->
		<div class="p-4">
			<span class="inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-700 dark:text-blue-300 rounded-full mb-2">
				{{material.categoria}}
			</span>
		
		     <!-- Título -->
			<h3 class="text-lg font-bold text-gray-900">
			  {{material.titulo}}
			</h3>

		     <!-- Author and Date -->
			<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-line-join="round" stroke-width="2"
					 d="M16 7a4 4 0 11-8 0 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
				  <span class="truncate">{{material.autorNombre}}</span>
			</div>

		    <!-- Tags -->
			<div v-if="material.tags && material.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
				<span  v-for="tag in material.tags.slice(0,3)" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-700 rounded">
					 {{tag}}
				</span>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
				<span class="text-sm text-gray-600 dark:text-gray-600">
					{{material.tamanioMB?.toFixed(1)|| '0.0'}} MB
				</span>
				<span class="text-sm font-medium text-blue-600 dark:text-blue-600 dark:text-blue-400">
				  Ver Detalles
				</span>
			</div>
	    </div>
	</div>
</template>

<script setup lang="ts">
 import { Material } from '/types/interf.index.ts';

    defineProps<{
    	material: Material;
    }>();

	function getCategoryIcon(category: string): string {
		const icons: Record<string, string> ={
			'Apuntes': '🗒',
			'Presentaciones': '📽️',
			'Artículos': '✍🏼',
			'Libros': '📚',
			'Otros': '',
			'Examenes': '🤔📝'
		};
		return icons[category] || '📄';
	}
</script>