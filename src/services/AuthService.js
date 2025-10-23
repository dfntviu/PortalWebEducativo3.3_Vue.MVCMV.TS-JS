"use strict";
/**
 * @file Servicio de Autentificacion
 * @decription Servicio de autentificación: Inicio, cierre y obtención del usuario actual
 *  **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const ProfileStudentServ_ts_1 = require("@/services/ProfileStudentServ.ts");
const ProfileTeacherServ_ts_1 = require("@/services/ProfileTeacherServ.ts");
const auth_1 = require("firebase/auth");
const interf_index_js_1 = require("@/types/interf.index.js");
class AuthService {
    static async login(email, password) {
        try {
            //1. Autentificacion de Firebase(BackEnd)
            const userCrendential = await (0, auth_1.signWithEmailAndPassword)(auth, email, password);
            const user = userCrendential.user;
            // 2. Mapear dinamicamente correspondiente a los roles del Sitema
            const roleServices = [
                { role: 'profesor', service: ProfileStudentServ_ts_1.ProfileStudentService },
                { role: 'alumno', service: ProfileStudentServ_ts_1.ProfileStudentService }
            ];
            let profile = null;
            let role = null;
            // 3. Buscar en los servicios el perfil del usuario
            for (const access of roleServices) {
                profile = await access.service.getById(user.uid);
                if (profile) {
                    role = access.role;
                    break;
                }
            }
            // 4. Validacion adicional, por seguridad
            if (!profile || !role) {
                throw new Error("El tipo de Usuario no corresponde o no ha sido registrado");
            }
            ;
            // 5. Crear el payload y preparar la sesión Fisica
            const payload = { user: profile.nombre || '',
                email: user.email || '',
                u, uid: user.uuid || '',
                apellido: profile.apellido || '',
                role,
            };
            // 6. Guardar en el AuthService (la sesión del usuario)
            // AuthService.setUser(payload);  el metodo es de authStore
        }
        catch (error) {
            // Registro de error por el Sistema o personalizado
            throw new Error(error.message || 'Se registro Error en el Inicio de sesión');
        }
    }
    static async logout() {
        try {
            // Cerrar sesión con Firebase
            await (0, auth_1.signOut)(auth);
            // Limpiar sesión del usuario almacenada en el AuthService
            //AuthService.clearUser()     el metodo es de authStore ?
        }
        catch (error) {
            //  Registro de error por el Sistema o personalizado
            throw new Error(error.message || "Error al cerrar sesión");
        }
    }
    static async getCurrentUser() {
        try {
            const auth = (0, auth_1.getAuth)(); //obtiene la instancia de Firebase
            const currentUser = auth.currentUser;
            return currentUser;
        }
        catch (error) {
            console.error(`Error la obtener: ${error}, el usuario actual`);
            return null;
        }
    }
    /* Identificar quién ha iniciado sesión en una aplicación mediante la autentificacion del Back*/
    static async signInUser(email, password) {
        try {
            const auth = (0, auth_1.getAuth)(); // Obtiene la instancia de autenticación de Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user; // Devuelve el usuario autenticado
        }
        catch (error) {
            console.error('Error al iniciar sesión:', error);
            return null; // Si ocurre algún error, devuelve null
        }
    }
}
exports.AuthService = AuthService;
/*static async getCurrentUser(): Promise<User | null>{
        try{
          const answer =  await  //fn firebase
        }catch (error: any){
            return null;
        }
 }*/ 
//# sourceMappingURL=AuthService.js.map