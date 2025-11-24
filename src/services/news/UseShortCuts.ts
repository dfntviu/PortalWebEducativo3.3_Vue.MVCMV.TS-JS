/*Componente mover a los directorios correpodientes los que > (*)*/
 	// <UseShortCuts/> agragar al directory corresp.
  import {ref, computed, onMounted, onUnmounted} from 'vue';
  import {useRouter} from 'vue-router';
  import {ShortcutsService} from '/ShortcutsService.ts' //*
  import  {useShortcutsStore} from './shortcutsStore.ts'; //*
  import  {useThemeStore} from '@/stores/themeStore.ts'; //*
	 import type {ShortCut} from './shortcutsStore.ts';

	export function utiliceShortcuts(scope: 'student'| 'teacher'| global = 'global') {
	    const router = useRouter();
	    const shortcutsStore = useShortcutsStore();
	    const themeStore = useThemeStore();

	    /*Global Shortcuts*/
	    const globalShortCuts: Record<string, ShortCut> = {
	    	help:{
	    		key: '?',
	    		description: 'Mostrar ayuda de los atajos',
	    		action: () => shortcutsStore.toggleHelp();
	    		scope: 'global',
	    	},
	    	closeHelp: {
	    		key: 'Escape',
	    		description: 'Cerrar la Ayuda',
	    		action: () => shortcutsStore.closeHelp();
	    		scope: 'global',
	    	},
	    	toggleTheme: {
	    		key: 'd',
	    		ctrl: true,
	    		description: 'Cambiar el Tema (Clarp -> Oscuro)',
	    		action: () => themeStore.toggleTheme();
	    		scope: 'global',
	    	},
	    	goHome:{
	    		key: 'h',
	    		ctrl: true,
	    		description: 'Ir al principio',
	    		action: () => router.push('/'),
	    		scope: 'global',
	    	},
	    	goNotifications:{
	    		key: 'n',
	    		description: 'Ver las notificaiones',
	    		action: () => router.push('/view-student-adm-matls'),
	    		scope: 'student',
	    	}
	    };

	    /*Profesores Atajos de Tec.*/
			const teachersShortCuts: Record<string, ShortCut> =  {
				 goToMaterials: {
				 	key:  'm' ,
				 	ctrl:  true,
				 	description: 'Gestionar los Materiales' ,
				 	action: ()=>  router.push('viw-teacher-adm-matls'),
				 	scope: 'teacher',
				 }	

				 moderate: {
				 	key: 'r'  ,
				 	ctrl: true ,
				 	description: 'Moderar los Materiales, de los Alumnos',
				 	action: ()=>  router.push('viw-moderar-materiales'),
				 	scope: 'teacher',
				 }		

			};

	    /*Estudiantes Atajos de Tec.*/
	    	const studentsShortCuts: Record<string, ShortCut> = {
	    		goToMaterials: {
				 	key:  'm' ,
				 	ctrl:  true,
				 	description: 'Navegar a mis Materiales' ,
				 	action: ()=>  router.push('/vw-student-adm-matls'),
				 	scope: 'student',
				 }	

				  uploadMaterial: {
				 	key: 'u'  ,
				 	ctrl: true ,
				 	description: 'Navegar a mis Materiales',
				 	action: ()=>  router.push('/vw-upload-materiales'),
				 	scope: 'stuent',
				 }	
	    	};

	    	/*REGISTRAS LOS ATAJOS DE TEC.*/

	    const registerShortCuts: = ()=> {
	    		// Si y solo si se Registran  Atajos Globales
	    	Object.entries(globalShortCuts).forEach(([id, shortcut]) => {
	    		ShortcutsService.register(`global-${id}`, shortcut);
	    	});

	    	// Registrar atajos especificos del scope
	    		if (scope === 'student') {
	    			Object.entries(studentsShortCuts).forEach(([id, shortcut]) => {
	    				ShortcutsService.register(`estudiante-${id}`, shortcut);
	    			});	
	    		}

	    		else if (scope === 'teacher') {
	    			Object.entries(teachersShortCuts).forEach(([id, shortcut]) => {
	    				ShortcutsService.register(`estudiante-${id}`, shortcut);
	    			});
	    		} 
	    };

	    	// Quitar los shortcuts
	    const unregisterShortCuts: = ()=> {
	    		// Si y solo si se Registran  Atajos Globales
	    	Object.keys(globalShortCuts).forEach(([id, shortcut]) => {
	    		ShortcutsService.register(`global-${id}`, shortcut);
	    	});

	    	// Registrar atajos especificos del scope
	    		if (scope === 'student') {
	    			Object.keys(studentsShortCuts).forEach(([id, shortcut]) => {
	    				ShortcutsService.register(`estudiante-${id}`, shortcut);
	    			});	
	    		}

	    		else if (scope === 'teacher') {
	    			Object.keys(teachersShortCuts).forEach(([id, shortcut]) => {
	    				ShortcutsService.register(`estudiante-${id}`, shortcut);
	    			});
	    		} 
	    };

	    onMounted(()=>{
	    	registerShortCuts();
	    });

	    onUnmounted(()=>{
	    	unregisterShortCuts();
	    });

	    return {
	    	registerShortCuts,
	    	unregisterShortCuts,
	    };
	}