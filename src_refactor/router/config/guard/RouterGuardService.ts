import { PermissionsService } from './router/PermissionService.ts';
import { useAuthStore } from '@/stores/authStore2';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import type { Role } from '@/types/interfacesv2';
		/**
		 * Archivo de Seguridad determinar inicios de sesion y vista predeterminada del Web System
		 * Port. Web Educativo 3.3.2 */

/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
export class RouterGuardService {
	private permissionServs: PermissionService;
/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
	constructor(private role:Role='default') {
		 this.permissionServs = new PermissionService(role);
	} 
	/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
	async globalGuard(
		to: RouteLocationNormalized,
		from: RouteLocationNormalized,
		next: NavigationGuardNext
	): Promise<void> {
		const authStore = useAuthStore();
		/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/	
		if (authStore.loading) {
			 await new Promise(resolve => setTimeout(resolve,100));
		}
		/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/	
		if (!to.meta.requieresAuth) {
			 return next();
		}
		/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/	
		if (to.meta.requieresAuth && !authStore.isAuthenticated) {
			console.warn('[Guardia de Ruteo]: Acceso Rechazado - Usuario NO Autenticado');
			  return next({ name: 'viewLogin'});
		}

		/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
		if (authStore.isAuthenticated && to.name === 'viewLogin' ) {
			  const redirectRoute = authStore.role === 'teacher'
			     ?  'welcomeStudents'
			     :  'welcomeTeachers';
			    return next({ name: redirectRoute });
		}
		
		// Validar el Rol requerido
		if(to.meta.role && to.meta.role!==authStore.role) {
			console.warn('[Guardia de Ruteo]: Acceso Negado - El Rol es Incorrecto');
			return next({name: 'PageError403'})
		}
		/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
		this.permissionServs.setRole(authStore.role || 'default');
		/*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
		if (to.meta.permission) {
			const hasPermission = permissionServs.hasPermission(to.meta.permission as any);

			if (!hasPermission) {
				console.warn('[Guardia de Ruteo]: Acceso Negado - Sin permisos para Ingresar..');
				  return next({name: 'PageError403'})
			}
		}
			// Permitir el acceso
		 next();	
		 /*?=??QWQEGTDRHYIUOIFGDFCEFJGOIERPHKJNHTEJF*/
	}
    
    /**
     * Guard especifíco para rutas de Profesor
     * */
	teacherGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			const authStore = useAuthStore();
	 	if (authStore.role !== 'teacher') {
	 	 	 console.warn('[RouterGuard] Acceso denegado - Es Obligatorio ingresar credenciales de Profesor.');
	 	 	  return next({name: 'PageError403'});
	 	}

	 	  next();
	}

	/**
	 * Guard especifíco para rutas de Alumno 
	 * **/	
	studentGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
			const authStore = useAuthStore();			
		if (authStore !== 'student') {
		 	console.warn('[RouterGuard]: Acceso denegado - Es Obligatorio ingresar credenciales de Alumno.');
		 	 return next({name: 'PageError403'});
		}
		 next();
	}
}