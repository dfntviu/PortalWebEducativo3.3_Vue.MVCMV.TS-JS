<template>
 <div class="card-space-y-6">
	   <div class="flex items-center justify-between">
			<div>
			 <h2 class="text-2xl fontbold text-gray-900 dark:text-white">⚙️ Configuración Personal</h2>
			  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
			  	Personaliza tu experiencia en el Portal
			  </p>
			</div>

		  <!-- Provider Badge -->
		    <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-700 roundend-lg">
		  	  <span class="text-lg">{{personalityStore.providerLabel}}</span>
		  	  <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">
		  	 	 Personaliza tú experiencia en el Portal
		  	   </span>
		      </div>
	    </div>
		  <!-- Sección de Apariencia -->
	<div class="space-y-4">
		<div class="flex-1">
		  	<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
		  		<span>🎨</span>
		  		<span>Apariencia</span>
		  	</h3>

		  <!--TEMA -->
		    <div class="flex items-center justify-between p-4 bg-gray50 dark:bg-dark-700/50 rounded-lg">
		  	    <div class="flex-1">
		  	 	    <h4 class="font-medium text-gray-100 dark:text-white">Tema de Interfaz</h4>
		  	 	    <p class="text-sm text-gray-600 dark:text-gray-400">
		  	 	 	  Selecciona Tú preferencia
		  	 	    </p>
		  	 <!-- </div> -->
		        </div>

		    <div class="flex gap-2">
		  	   <button v-for="themeOption in themes" :key="themeOption.value" @click="handleThemeChange(themeOption.value)" class="px-4 py-2 rounded-lg font-medium transition-all" 
		  	        :class="personalityStore.theme ===  themeOption.value
					   ? 'bg-primary-600 dark:bg-primary-500 text-white'
					   : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
					      'dark:hoover:bg-dark-700 border border-gray-300 dark:border-dark-600'">
					 <span class="mr-2">{{themeOption.icon}}</span> 	   
				</button>
		    </div>
 	       </div>
	    </div> 

	    <!-- Seccion de Productividad -->
	    <div class="space-y-4">
	    	<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
	    		<span>⚡</span>
	    		<span>Productividad</span>
	    	</h3>
	    	<!-- Atajos del Teclado -->
	    	<div class="flex items-center justify-between p-4 bg-gray-500 dark:bg-gray-700/500 rounded-lg">
	    		<div class="flex-1">
	    			 <h4 class="font-medium text-gray-900 dark:text-white">Atajos de Teclado</h4>
	    			   <p class="text-sm text-gray-600 dark:text-gray-400"> 
	    			   	 Utiliza los Atajos de Teclado para Navegar al instante
	    			   </p>
	    		</div>
	    		  <button class="relative inline-flex h-6 w-11 items-center rounder-full transition-colors"
	    		    :class="personalityStore.shorcutsEnabled ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'">
	    		  	 <span class="inline-block h-4 w-4 transform rounded-full-bg-white transition-transform"
	    		  	   :class="personalityStore.shorcutsEnabled ? 'translate-x-6' : 'translate-x-1' " 
	    		  	 ></span>
	    		  </button>
	    	</div>
	    </div>

	    <!-- Sección de Notificaciónes -->
	    <div class="space-y-4">
	    	<h3>
	    		<span>🔔</span>
	    	     <span>Notificaciónes</span>
	    	</h3>
	    	<!-- Noticiaciones Push -->
	    	<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
	    		<div class="flex-1">
	    			<h4 class="font-medium text-gray-900 dark:text-white">Notificaciónes Push</h4>
	    			  <p class="text-sm text-gray-600 dark:text-gray-400">
	    			  	Recibe Notificaciónes en Tiempo Real
	    			  </p>
	    		</div>
	    	</div>

	    	<button @click="personalityStore.toggleNotifications()"
	    	  class="relative h-4 w-4 transform rounded-full bg-white transition-transform"
	    	  :class="personalityStore.notifationsEnabled ? 'bg-primary-600 dark:bg-primary-500' 
	    	     :'bg-gray-300 dark:bg-dark-600'">
	    			<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
	    			     :class="personalityStore.notifationsEnabled ? 'translate-x-6' : 'translate-x-1">
	    			</span>
	    	</button>
	    </div>
	    	<!-- Sonido de Notifaciónes -->
	    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700/50 rounded-lg">
	    	<div class="flex-1">
	    		<h4 class="font-medium text-gray-900 dark:text-white">Sonido</h4>
	    		<p class="text-sm text-gray-600 dark:text-gray-400">Reproducir Sonido en las Notificaciónes</p>
	    	
	    

		      <button class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
		       :class="personalityStore.sounEnabled 
		         ? 'bg-primary-600 dark:bg-primary-500'
		         : 'bg-gray-300 dark:bg-dark-600'"
		       > 
		       	<span class="inline-block h-4 w-4 transform rounded-full bg-white transtion-transform"
		       	  :class="personalityStore.sounEnabled ? 'translate-x' : 'translate-x-6' : 'translate-x-1'" >
		       	  </span>
	     	
	      	 </button>
	        </div>
	    </div>

	    <div class="pt-6 border-t border-gray-200 dark:border-dark-700">
	    	<div>
	    		<span class="text-gray-600 dark:text-gray-400">Último Acceso:<span>
	    		</span class="ml-2 text-gray-900  dark:text-white font-medium">
	    			{{formDate(personalityStore.personality?.lastLogin)}} 
	    		</span>
	    	</div>
	    </div>

 	</div>
</template>
 
 <script setup lang="ts">
 	  import {usePersonalityStore} from '@/stores/personalityStore.ts';
 	  import type {Theme} from '@/services/PersonalityService';

 	  const personalityStore = usePersonalityStore();

 	  const themes = [
 	  	 {value: 'ligth' as Theme, label: 'Claro': icon: '☀️'},
 	  	 {value: 'dark' as Theme, label: 'Oscuro', icon:  '🌙'},
 	  	 {value: 'system' as Theme, label: 'Sistema', icon '💻'},
 	  ];

 	   const handleThemeChange = async (theme: Theme) =>{
 	   		await personalityStore.updateTheme(theme);
 	   };

 	    const formDate = (date: Date | undefined): string =>{
 	   	 if (!date) return 'N/A';
 	   	   return new Date(date).toLocaleDateString('es-MX',{
 	   	   	   year: 'numeric',
 	   	   	   month:  'long',
 	   	   	   day: 'numeric',
 	   	   });
 	    };
 </script>