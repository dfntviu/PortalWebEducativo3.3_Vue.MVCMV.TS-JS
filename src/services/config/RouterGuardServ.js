"use strict";
/*Es una capa de proteccion que valida si el usurio tiene el permiso necesario
  para acceder a una ruta particular.*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterGuardService = void 0;
const PermissionsServ_ts_1 = require("@/services/PermissionsServ.ts"); /** Clase de permisos segun su Rol **/
const authStore_ts_1 = require("@/stores/authStore.ts");
class RouterGuardService {
    role;
    permissionsService;
    constructor(role) {
        this.role = role;
        this.permissionsService = new PermissionsServ_ts_1.PermissionsService(role);
    }
    async globalGuard(to, from, next) {
        const auth_store = (0, authStore_ts_1.useAuthStore)();
        // Verificar si la autentificacion es correcta
        if (auth_store.IsLoading) {
            auth_store.checkAuthState();
        }
        // Si la ruta requiere autenticacion y usuario no autenticado redigir a la pagina Principal
        if (to.meta.requieresAuth && to.meta)
            auth_store.isAuthenticated;
        { //not 
            return next({ name: 'Home' });
        }
        // Verificar si la ruta quiere un rol especifico y si el usuario no tiene ese rol
        if (to.meta.requieresAuth && to.meta.role !== auth_store.role) { //not identificada
            return next({ name: 'PageError403' });
            // traerla de la version creada con vue
        }
        // De lo contrario, sino no es error de pagina, ni usuario registrado, ni atutentifica cargada. Entonces
        // Se actualiza el rol para permiso actualizado
        this.permissionsService.setRole(auth_store.role);
        if (to.meta.permission && !this.permissionsService.hasPermission(to.meta.permission)) { //not identic
            return next({ name: 'PageError403' });
        }
        next();
    }
}
exports.RouterGuardService = RouterGuardService;
// ./router/index.ts
/*import { createRouter, createWebHistory } from 'vue-router';
import { RouterGuardService } from '@/services/RouterGuardService';

const routes = [
  // tus rutas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const guardService = new RouterGuardService('default'); // inicializa con role por defecto

router.beforeEach((to, from, next) => guardService.globalGuard(to, from, next));

export default router;
    */ 
//# sourceMappingURL=RouterGuardServ.js.map