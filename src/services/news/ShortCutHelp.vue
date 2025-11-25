 <template>
 	<Teleport to="body">
 		<Transition name="modal">
 		    <div v-if="shortcutsStore.showHelp" class="fixed inset-0 z-50 flex items-center justify-center p-4  bg-black/50 backdrop-blur-sm"
 		     @click="shortcutsStore.closeHelp()">
 		   		<div class="bg-white dark-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
 		          @click.stop>
 		  		  <!-- Header -->
	 		  	    <div class="p-6 border-b border-gray-200 dark:border-dark-700">
	 		  	 	    <div class="flex items-center-justify-between">
	 		  	 		    <div>
	 		  	 			  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">⌨️ Atajos de Teclado</h2>
	 		  	 			    <p class="text-sm text-gray-600 dark:text-gray mt-1">
	 		  	 			 	  Navega más rápido con estos atajos
	 		  	 			    </p>
	 		  	 		    </div>
	 		  	 		      <button @click="shortcutsStore.closeHelp()"  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
	 		  	 		             transition-colors">
	 		  	 		      	     <span class="text-2xl">✕</span>
	 		  	 		      </button>
	 		  	 	    	</div>
	 		  	    </div>
					 <!--Content  -->
					<div class="p-6 overflow-y-auto custom-scrollbar" style="max-height:calc(80vh - 140px)">
						<!-- Shortcut for categorie -->
						 <div class="mb-6"   
						       v-for="category in categories">
						 	
						 </div>

						<h3 class="text-lg font-semi-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
							<span>{category.icon}</span>
					     	<span>{{caegory.name}}</span>
						</h3>

						<div class="space-y-2">
							<div  v-for="(shortcut,index) in category.shortcuts" :key="index"  class="flex items-center justify-between p-3 rounded-lg        hover:bg-gray-50  dark:hover:bg-dark-700 transition-colors">
						        <span class="text-gray-700 dark:text-gray-300">
						       	   {{formatShorCut(shortcut)}}
						        </span>
						       	<kbd class="px-3 py1.5 text-sm font-mono font-semibold bg-gray-100 dark:bg-dark-900
						       			  text-gray-900 dark:text-white roudend border border-gray-300 dark:border-dark-600
						       			  shadow-sm">
						       			  	{{formatShorCut(shortcut)}}
						       	</kbd>
						 	</div>
						</div>
					</div>

					 <!-- Footer -->
				 	<div class="p-6 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-gray-900/50">
				 		<p class="text-sm text-gray-600 dark:text-gray-400 text-center">
				 			Presiona<kbd class="px-2 py-1 text-xs font-mono bg-gray-200 dark:bg-dark-800 rounded">?</kbd>
				 			en cualquier momento.
				 		</p>
				 	</div>
			    </div>
 		    </div>
 		</Transition>
 	</Teleportort>
 </template>

 <script setup lang="ts">
 	 import {computed} from 'vue';  
 	 import {useShortcutsStore} from '@/servicess/news/shortcutsStore.ts'
 	 import {useAuthStore} from '@/stores/AuthStore2.ts';
 	 import {ShortcutsService} from '@/services/news/ShortcutsService.ts'
 	 import type {ShortCut} from '@/services/news/ShortcutsService.ts';

 	 const shortcutsStore = useShortcutsStore();
 	 const      authStore = useAuthStore();
 
 	 const isStudent   = computed(()=> authStore.role === 'student');
 	 const isTeacher   = computed(()=> authStore.role === 'teacher');

 	 const categories = computed(()=> {
 	 	const allShortcuts = shortcutsStore.getShortcuts();

 	 	const cats = [
 	 		{
 	 			name: 'General'
 	 			icon: '🧩',
 	 			shortcuts: allShortcuts.filter(s => s.scope === 'global' && 
 	 				                                s.scope.description.includes('tema') &&
 	 												s.scope.description.includes('ayuda')
 	 									 ),
 	 		},
 	 		{
 	 			name: 'Interfaz',
 	 			icon: '🖌️',
 	 			shortcuts: allShortcuts.filter(s=>s.description.includes('tema') || 
 	 						s.description.includes('ayuda')
 	 		    ),
 	 		},	 		
 	 	];

 	 	if (isStudent.value) {
 	 		cats.push({
 	 			name: 'Estudiante',
 	 			icon: '🧑🏽‍🎓',
 	 			shortcuts.allShortcuts.filter(s => s.scope === 'student')
 	 		});
 	 	}

 	 	if (isTeacher.value) {
 	 		cats.push({
 	 			name: 'Profesor'
				icon: '👨🏽‍🏫'
				hortcuts.allShortcuts.filter(s => s.scope === 'teacher'): 
 	 		});
 	 	}

 	 	 return cats.filter(cat => cat.shortcuts.length > 0);
 	});

 	 const formatShortcut = (shortcuts: ShortCut): string =>{
 	 	 return ShortcutsService.formatShortcut(shortcuts);
 	 };
 </script>

  <style scoped>
  	.modal-enter-active,
  	.modal-leave-active{
  		opacity: 0;
  	}

  	.modal-enter-from > div,
  	.modal-leave-to > div {
  		transform: scale(0.95) translate(-20px);
  	}
  </style>