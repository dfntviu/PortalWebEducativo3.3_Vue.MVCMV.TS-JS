// Nuevo en Service >  24/11/2025
    export interface ShortCut {
 	     key: string;
 	     ctrl?: boolean;
 	    shift?: boolean;
 	    alt?: boolean;
 	    meta?: boolean;
 	    description?: string;
 	    action: ()=> void;
 	    scope?: string;  // 'global' |  'student'| 'teacher'
    }

  export class ShortcutsService{
 	 private shortcuts: Map<string, ShortCut> = new Map();
 	 private isEnabled = true;

 	 constructor(){
 	 	this.intializeGlobalListener();
 	 }

 	 /**
 	  * Registrar shortcut
 	  * */
 	register(id:string, shortcut: ShortCut): void {
 	 	this.shortcuts.set(id, shortcut);
 	}

 	 /**
 	  * Quitar shortcut
 	  * */
 	unregister(id:string): void {
 	 	this.shortcuts.delete(id);
 	}

 	 /**
 	  * Eliminar todos los shortcuts
 	  * */

 	getAll(): ShortCut[]{
 	 	return Array.from(this.shortcuts.values());
 	}

 	 /**
 	  * Obtener shortcuts por scope
 	  * */
    getByScope(scope: string): ShortCut[] {
     	 return this.getAll().filter(s => !s.scope || s.scope === scope || s.scope=== 'global');
    }	

     /**
      * Habilitar/deshabilitar shortcuts
      * */
    setEnabled(enabled: boolean): void {
     	 this.isEnabled = enabled;
    }

 	private intializeGlobalListener(): void {
 	 	document.addEventListener('keydown', (e: KeyBoardEvent) => {
 	 	    if (this.isEnabled) return;

 	 	    /*Ignorar si se esta escribiendo en input/textarea */
 	 	      const target = e.target as HTMLElement;
 	 	        if (target.tagName === 'INPUT'  ||
 	 	       	   target.tagName === 'TEXTAREA'||
 	 	       	   target.isContentEditable ) {
 	 	        		/*Solo permitir los atajos especiales */
 	 	        	    if (e.key === 'Escape') {
 	 	        	   	   target.blur();
 	 	        	    }
 	 	        	     return;
 	 	        }
 	 	        	
 	 	        /*Buscar shortcuts coincidentes*/
 	 	        for (const shortcut; of this.shortcuts.values()) {
 	 	        	if (this.matchesShortCut(e, shortcut)) {
 	 	        		e.preventDefault();
 	 	        		shortcut.action();
 	 	        		 break;
 	 	        	}
 	 	        }
 	 	});	

 	}

 	/*Verificar si el evento coincide con el atajo(shortcut) */
 	private matchesShortCut(e: KeyBoardEvent, shortcut: ShortCut): boolean{
 		 const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
 		 const cntrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);  // F -> T, T->F sin nec. de metodo
 		 const shiftMatch = !!shortcut.shift === e.shiftKey;
 		 const allMatch = !!shortcut.alt === e.altKey;

 		 return keyMatch && cntrlMatch && shiftMatch && allMatch;
 	}

 	  /** =====================================================
 	  *    Formater el shrotcut(atajo de  teclado) para mostrar
      *   =====================================================
 	  * */
 	    static matchesShortCut(shortcut: ShortCut): boolean {
 	  	   const parts = string[] = [];
 	  	   const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

 	  	    if (shortcut.ctrl|| shortcut.meta) {
 	  	  	  parts.push('Shift' ? '⌘': 'ctrl');
 	  	    }
 	  	    if (shortcut.shift){
 	  	  	  parts.push('Shift');
 	  	    }
 	  	    if (shortcut.alt) {
 	  	  	 parts.push(isMac ? '⌥':  'Alt');
 	  	    }

 	  	     parts.push(shortcut.key.toUpperCase());

 	  	    return parts.join(' + ');
 	    }
    }
  export const ServicioAtajosTeclado = new ShortcutsService