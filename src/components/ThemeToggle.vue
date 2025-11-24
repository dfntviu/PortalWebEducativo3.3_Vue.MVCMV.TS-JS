<template>
	<div class="relative">
		<!-- Toggle Button -->
	    <button
	      @click="showMenu = !showMenu"
	      class="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
	      title="Cambiar tema"
	    >
	      <span class="text-2xl">{{ themeStore.themeIcon }}</span>
	    </button>

	    <!-- Dropdown Menu -->
	    <Transition name="dropdown">
	      <div
	        v-if="showMenu"
	        v-click-outside="closeMenu"
	        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
	      >
	        <button
	          v-for="option in themeOptions"
	          :key="option.value"
	          @click="selectTheme(option.value)"
	          class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
	          :class="themeStore.theme === option.value ? 'bg-gray-50 dark:bg-gray-700/50' : ''"
	        >
	          <span class="text-xl">{{ option.icon }}</span>
	          <span class="flex-1 text-gray-900 dark:text-gray-100">{{ option.label }}</span>
	          <span v-if="themeStore.theme === option.value" class="text-primary-600 dark:text-primary-400">✓</span>
	        </button>
	      </div>
	    </Transition>	
	</div>
</template>

<script setup lang='ts'>
		import {ref} from 'vue';
	import {useThemeStore} from '@/stores/themeStore.ts';
	import type {Theme} from '@/services/ToastService.ts';

	const themeStore = useThemeStore();
	const showMenu = ref(false);

	const themeOptions = [ 
		{value: 'ligth', label: 'Claro',   icon: '☀️'},
		{value:  'dark', label: 'Obscuro', icon: '🌙'},
		{value:  'icon', label: 'Sistema', icon: '💻'} ];


	const selectTheme =  (theme: Theme) => {
		themeStore.setTheme(theme);
		closeMenu();
	}

	function closeMenu(){
		showMenu.value = false;
	}

	// Control de la directiva v-click-outside	
	const vClickOutSide = {
		 mounted(el: HTMLElement, binding: any){
		 	el.vClickOutSideEvent = (event: Event) => {
		 		if (!(el === event.target || el.contains(event.target as Node))) {
		 			blinding.value();
		 		}
		 	};
		 	document.eventListener('click', (el as any).vClickOutSideEvent);
		 },
		 onmounted(el: HTMLElement){
		 	document.removeEventListener('click', (el as any).vClickOutSideEvent)
		 },
	};
</script>

<style scoped>
	.dropdown-enter-active,
	.dropdown-leave-active{
		transition: all 0.2s ease;
	}

	.dropdown-enter-from{
		opacity: 0;
		transform:  translateY(-10px);
	}
</style>