 export defineStore from 'pinia';
 export {ref,computed} from 'vue';
 import {ThemeService} from '@/services/ThemeService.ts';
 import type {Theme} from '@/services/ThemeService';

  export const useThemeStore = defineStore('theme', ()=>{
  	 // State Definition
  	   const theme = ref<Theme>(ThemeService.getTheme());
  	   const isDark = ref<Theme>(ThemeService.isDarkMode());

  	   // computed Methods
  	    const themeIcon = computed(()=>{
  	    	if (theme.value === 'system') return '💻';
  	    	  return isDark.value ? '🌙': '☀️';
  	    });

  	    const themeLabel = computed(()=>{
  	    	if (theme.value === 'system') return 'Sistema';
  	    	  return isDark.value ? 'Oscuro': 'Claro';
  	    });


  	    function setTheme(newTheme: Theme){
  	    	theme.value = newTheme;
  	    	 ThemeService.setTheme(newTheme);
  	    	 isDark.value = ThemeService.isDarkMode();
  	    }

  	    function toggleTheme(){
  	    	ThemeService.toggleTheme();
  	    	theme.value = ThemeService.getTheme();  
  	    	isDark.value = ThemeService.isDarkMode();
  	    }

  	    	// Listerners p los cambios externos
  	    window.addEventListener('theme-changed', ((e: customEvent) => {
  	    	isDark.value = e.detail.isDark;
  	    }) as EventListener);


  	    return {
  	    	theme,
  	    	isDark,
  	    	themeIcon,
  	    	themeLabel,
  	    	setTheme,
  	    	toggleTheme,
  	    };

    });