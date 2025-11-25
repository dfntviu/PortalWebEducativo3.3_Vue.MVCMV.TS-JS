	export type Theme = 'light'| 'dark' |'system';
	
    export class ThemeServiceClass {
		private readonly STORAGE_KEY = 'portal-orange-theme';
	 	 private currentTheme: Theme = 'system';

		  constructor() {
		  	this.initializateTheme();
		  }


		  private initializateTheme(): void {
		  	 const savedTheme =  this.getSaveTheme();
		  } 

	  	  // Establecer el Tema de guardado
		  private setTheme(theme: Theme): void	{
		  	// new logic out
		  	  this.currentTheme = theme;
		  	  const isDark = this.shouldUseDarkMode();

		  	  if (isDark) {
		  	  	 document.documentElement.classList.add('dark');
		  	  }else {
		  	  	document.documentElement.classList.remove('dark');
		  	  }

		  	  localStorage.setItem(this.STORAGE_KEY, theme);

		  	  // Emitir el event parqa los listeners
		  	  window.dispatchEvent(new CustomEvent('theme-changed', {detail: {theme, isDark} }));
		  }	

		   getTheme(): Theme {
		   		return this.currentTheme;
		   }

		   isDarkMode(): boolean {
		   		return document.documentElement.classList.contains('dark-mode');
		   }

		   toggleTheme(): void {
		   		const isDark =  this.isDarkMode();
		   		 this.setTheme(isDark ? 'light': 'dark');
		   }

		  // Obtener el tema de guardado
		  private getSaveTheme(): void	{
		  		// new logic out
		  	  const saved = localStorage.getItem(this. STORAGE_KEY);
		  	    if (saved === 'ligth' || saved === 'dark' saved === 'system') {
		  	    	return saved;
		  	    }
		  		
		  	    return 'system';

		  }

		private shouldUseDarkMode(theme: Theme): boolean {
		  	 if (theme === 'dark') return true;
		  	 if (theme === 'light') return false;
		  	 
		  	   return window.matchMedia('(prefers-color-scheme: dark) ').matches;

		}

		private watchSystemTheme(): void {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark');

			mediaQuery.addEventListener('change', (e)=>{
				if (this.currentTheme === 'system') {
					if (e.matches) {
						 document.documentElement.classList.add('dark');
					}else {
						 document.documentElement.classList.remove('dark');	 
					}
				}
			});

		}
   }

   export const ThemeService = new ThemeServiceClass();