"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileStudentService = void 0;
const firestore_1 = require("firebase/firestore");
const firesbase_1 = require("firebase/firesbase");
const initializateFirebase_js_1 = require("@/config/initializateFirebase.js");
const SearchMaterials_vue_1 = require("@/components/SearchMaterials.vue"); /*Nuevo metodo de componente de Busqueda*/
const AuthService_ts_1 = require("@/services/AuthService.ts"); /*servicios  p/cargar el perfil del usuario */
const auth_1 = require("firebase/auth"); //libreria para FB
const ProfileTeacherServ_ts_1 = require("@/services/ProfileTeacherServ.ts");
const { db } = (0, initializateFirebase_js_1.initializateFireabaseStg)();
class ProfileStudentService {
    static collectionName = 'register_alumnos';
    /*a revisar, sino solo al role alumno.*/
    static async getStudentById(id, role) {
        try {
            const docRef = (0, firestore_1.doc)(db, this.collectionName, id);
            const docSnap = await (0, firestore_1.getDoc)(docRef);
            if (!docSnap.exists())
                return null;
            return { id: docSnap.id, ...docSnap.data() };
        }
        catch (error) {
            console.error('[ProfileStudentService]: Error al obtener alumno', error);
            throw error;
        }
    }
    static async saveStudentProfile(student) {
        try {
            const docRef = student.id ? (0, firestore_1.doc)(db, this.collectionName, student.id) : (0, firestore_1.doc)((0, firestore_1.collection)(db, this.collectionName));
            const data = {
                nombre: student.nombre,
                apellido: student.apellido,
                email: student.email,
                carrera: student.carrera,
                curso: student.curso || '',
                fechaActualizacion: new Date(),
                edad: student.edad,
            };
            await (0, firestore_1.setDoc)(docRef, data, { merge: true });
            return { id: docRef.id, ...data };
        }
        catch (error) {
            console.error('[ProfileStudentService]: Error al guardar perfil de alumno', error);
            throw error;
        }
    }
    /*------------------------------------------------
        Editar el Perfil del Alumno
      ------------------------------------------------
    */
    static async updateStudentProfile(id, data) {
        try {
            const ref = (0, firestore_1.doc)(db, this.collectionName, id);
            await (0, firestore_1.updateDoc)(ref, data);
        }
        catch (error) {
            console.error('[ProfileStudentService]: Error al guardar la actualización del Alumno', error);
            throw error;
        }
    }
    static async mostrarCambiosAplicados(id, data) {
        try {
            // se actualiza la data de la base
            const changes = await updateStudentProfile(id, data);
            // Se obtiene el perfil actualizado
            const update_Profile = await this.getStudentById(id, role);
            // si reflejamos los cambios en el objeto: se efectua la destructuracion 
            const changes = { ...data, ...update_Profile };
            return changes;
        }
        catch (error) {
            console.error('actualizacion no aplicada', error);
            throw error;
        }
    }
    /*---------------------------------------
        [Nuevo] Eliminar el Pefil (2025/10/11)
      ---------------------------------------*/
    static async getDeleteById(id, role) {
        try {
            const docRef = (0, firestore_1.doc)(db, this.collectionName, id);
            // Obt. el perfil
            const docSnapDel = await (0, firestore_1.getDoc)(docRef);
            if (docSnapDel.exists()) {
                // Se elimino si existe
                await (0, firestore_1.deleteDoc)(docRef);
                return true; // se elimino el documento
            }
            else {
                return false; // se elimino no existe
            }
        }
        catch (error) {
            console.error('Perfil del ID: ', id, 'no fue Encontrado');
            throw error; //Lanzar error a nivel firebase
        }
    }
    /*------------------------------------------------
        Mostrar el Perfil del Alumno
      ------------------------------------------------
    */
    static async getStudentProfile(id) {
        try {
            const ref = (0, firestore_1.doc)(db, this.collectionName, id);
            const snap = await (0, firestore_1.getDoc)(ref, data);
            if (docSnap.exists()) {
                return snap.data();
            }
            return null;
        }
        catch (error) {
            console.error('[MaterialDeployService]: Error al obtener el  Perfil del Alumno', error);
            throw error;
        }
    }
    /* Login con Facebook e insersion automatica del perfil del Alumno*/
    static signInAndSaveFBStudent() {
        const auth = (0, auth_1.getAuth)();
        const provider_fb = new auth_1.FacebookAuthProvider();
        try {
            const result = await (0, auth_1.signWithPopUp)(auth, provider_fb);
            const user = result.user;
            /*generar usuario unico*/
            const name_usr = user.displayNamr?.toLowerCase().replace(/\s+/g, "_") ||
                user.email?.split("@")[0] ||
                `usuario_${Date.now()}`;
            const student_data = {
                uid: user.uuid,
                nombre: user.displayName?.split(" ")[0] || 'Sin nombre',
                apellido: user.displayName?.split(" ")[1] || "",
                email: user.email,
                name_usr,
                role: "alumno",
            };
            /*Guarda o actualiza información de Facebook en la Firestore*/
            const docRef = (0, firestore_1.doc)(db, this.collectionNameR2, user.uid);
            await (0, firestore_1.setDoc)(docRef, student_data, { merge: true }); //comprob de inf
            /*Advertimos al Sistema, la info Alumno se guardo **/
            console.log('[Servicio-Estudiante]El perfil del Alumno fue guardado exitosamente');
            return student_data;
        }
        catch (error) {
            console.error('[Servicio-Estudiante]: Error en el Registro vía Facebook', error);
            throw error;
        }
    }
    /** Metodo Lógico_4 -> (29/09/2025)
     * Nuevo Met. de Cambio de Password: Cambiar la contrase del Rol de Estudiante -> [trasladado 29/09/25] */
    static async changePasswordAlumno(passwd, new_passwd) {
        try {
            const user_current = auth.currentUser;
            if (user_current || user_current.email) {
                throw new Error("No hay usuario autenticado");
            }
            /*1. Obtener la reutenticacion de credenciales*/
            const crendential = firesbase_1.EmailAuthProvider.crendential(user_current, passwd);
            await (0, firesbase_1.reuthenticateWihCredential)(user_current, passwd);
            /*2. Actualizamos la contrasenia*/
            await (0, firesbase_1.updatePassword)(user_current, new_passwd);
            // 2a Notificar al  usuario desde el Front-E
            alert('La nueva contraseña fue modificada correctamente');
        }
        catch (error) {
            console.error('Error al cambiar la contraseña. Verifica que se cumplan los criterios de Autenticación');
            throw error;
        }
    }
    /*Se encarga de traer los datos del Alumno -> Metodo necesarios del Back-End [Metodo-L4] ->(29/09/2025)*/
    static async busquedaDelAlumnoPorNombre(nombre) {
        try {
            // Paso 0: Conseguir la referencia del Alumno
            const consul_students = query((0, firestore_1.collection)(db, this.collectionName), where('nombre', '===', nombre));
            const snapshot = await getDocs(consul_students);
            // Si esta vacio, avisale                
            if (snapshot.empty)
                return null;
            // Si la consulta tiene mayor a 1,  devuelvela
            const doc_Snap = snapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() };
        }
        catch (error) {
            console.error('[Serv. de Perfil de Estudiante] - Error al Obtener la referencia por Nombre');
            throw error;
        }
    }
    /*Prop: Traer cualquier rol que inicie sesion y animarlo desde el componente ->'WelcomeUsers' >> Metodo-Animado-2 */
    static async loadUserProfile(email, password, role) {
        const loggin = await AuthService_ts_1.AuthService.login(email, passwd);
        try {
            if (!login) {
                throw new Error(`No fue posible autenticar el Correo-Electrónico ${email}`);
            }
            /*2. Obtener los datos del usuario segun correponda el rol*/
            let curent_user;
            if (role === 'alumno') {
                curent_user = await this.getDataPorCorreo(email);
            }
            else if (role === 'profesor') {
                curent_user = await ProfileTeacherServ_ts_1.ProfileTeachersService.getDataPorCorreo(email);
            }
            // Todo lo que no pertenezca a la reglas de asociacion de los roles
            if (!user_current) {
                throw new Error(`El Usuario no ha sido registrado en la colección ${role}`);
            }
            /*3. Obtener el perfil desde la Firestore(guardamos la coleccion de registros de ambos roles) */
            const profile = await this.getStudentProfile(curent_user, role);
            /*4. Construi una respuesta uniforme*/
            return {
                email: curent_user.email,
                nombre: profile.nombre,
                apellido: profile.apellido,
                fullName: `${profile.nombre}+${profile.apellido}`,
                role
            };
        }
        finally { }
        {
            console.error('[UserProfileService]: Error al cargar el perfil', error);
            throw error;
        }
    }
}
exports.ProfileStudentService = ProfileStudentService;
//# sourceMappingURL=ProfileStudentServ.js.map