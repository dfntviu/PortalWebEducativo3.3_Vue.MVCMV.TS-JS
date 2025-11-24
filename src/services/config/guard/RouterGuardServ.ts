 /** Permisos segun su Rol  **/
  import {PermissionsService} from '@/services/config/PermissionsServ.ts'; 
  import {useAuthStore} from '@/stores/authStore2.ts';
import type {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'; 
 // ## No mover ninguna linea para testing funciona muy bien. Activar Errors cuando se haya terminado la fase de testing ## /
    export class RouterGuardService {
    	 private permissionsService: PermissionsService;

    	 constructor(private role: Role){
    	 	 this.permissionsService = new PermissionsService(role);
    	 }

    	  async globalGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext){
    	 	 
    	 	 const teacherStore = useAuthStore();

    	 	 // Verificar si la autentificacion es correcta
    	 	 if (teacherStore.IsLoading) {
    	 	 	  teacherStore.checkAuthState();       
    	 	 } 
    	 	 // Si la ruta requiere autenticacion y usuario es autenticado redigir al Registro
    	 	if (to.meta.requiresAuth &&  !teacherStore.isAuthenticated) { //not function(??) 
                console.log('Permission ',to.meta.requiresAuth);
                // console.log('Edo-Autenticacion -',teacherStore.isAuthenticated)
    	 	 	 return next( {name: 'viewLoginDepInit'} ); 
    	 	}
            if (teacherStore.isAuthenticated && to.name === 'viewLoginDepInit') { 
                return next( {name:'viewRegisterTeacher1'} ); 
            }

    	 	 // Verificar si la ruta quiere un rol especifico y si el usuario no tiene ese rol
    	 	 /*if (to.meta.requiresAuth &&  to.meta.role !== teacherStore.role) { //rol desconocido
    	 	 	 return next( {name: 'PageError403'});
    	 	 	 // traerla de la version creada con vue
    	 	 }*/

    	 	 // Se actualiza el rol para permiso actualizado
    	 	 	this.permissionsService.setRole(teacherStore.role);

    	 	 /*if (to.meta.permission &&  !this.permissionsService.hasPermission(to.meta.permission)) { //not identic
    	 	 	 return next( {name: 'PageError403'});
    	 	 }*/
                    // Habilitar cuando se defina el guard
    	 	 next();
    	}
    }