 import defineStore from 'pinia';
 import {ref} from 'vue';
 import { ShortcutsService} from './ShortcutsService.ts';
  import type {ShortCut} from './ShortcutsService.ts';

   export const useShortcutsStore = defineStore('shortcuts', ()=>{
   			// State
   		const showHelp = ref(false);
   		const enabled = ref(false);

   		// Acciones
   		 function toggleHelp() {
   		 	showHelp.value = !showHelp.value;
   		 }

   		 function closeHelp() {
   		 	showHelp.value = false;
   		 }

   		 function openHelp() {
   		 	showHelp.value = true;
   		 }

   		 function setEnabled(value:boolean) {
   		 	 enabled.value = value;
   		 	 ShortcutsService.setEnabled(value);
   		 }

   		 function getShortcuts(scope?:string): ShortCut[] {
   		 	if (scope) {
   		 		return ShortcutsService.getByScope(cope);
   		 	}
   		 	 return ShortcutsService.getAll();
   		 }

   		 return {
   		 	showHelp,
   		 	enabled;
   		 	toggleHelp,
			closeHelp,
			openHelp,
			setEnabled,
			getShortCuts,
   		 };
   });
