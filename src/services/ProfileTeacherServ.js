// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.ProfileTeachersService = void 0;
// // ProfileTeachersService.ts
// const firestore_1 = require("firebase/firestore");
// const initializateFirebase_js_1 = require("@/config/initializateFirebase.js");
// const auth_1 = require("firebase/auth"); //libreria para Gmail
// const { db } = (0, initializateFirebase_js_1.initializateFireabaseStg)();
// class ProfileTeachersService {
//     static collectionNameR2 = 'teachers';
//     static async getTeacherById(id) {
//         try {
//             const docRef = (0, firestore_1.doc)(db, this.collectionName, id);
//             const docSnap = await (0, firestore_1.getDoc)(docRef);
//             if (!docSnap.exists())
//                 return null;
//             return { id: docSnap.id, ...docSnap.data() };
//         }
//         catch (error) {
//             console.error('[ProfileTeachersService]: Error al obtener docente', error);
//             throw error;
//         }
//     }
//     /*Guardar data de Profesor en la Firestore*/
//     static async saveTeacherProfile(teacher) {
//         try {
//             const docRef = teacher.id ? (0, firestore_1.doc)(db, this.collectionName, teacher.id) : (0, firestore_1.doc)((0, firestore_1.collection)(db, this.collectionName));
//             const data = {
//                 nombre: teacher.nombre,
//                 email: teacher.email,
//                 asignaturas: teacher.asignaturas || [],
//                 fechaActualizacion: new Date(),
//             };
//             await (0, firestore_1.setDoc)(docRef, data, { merge: true });
//             return { id: docRef.id, ...data };
//         }
//         catch (error) {
//             console.error('[ProfileTeachersService]: Error al guardar perfil Profesor', error);
//             throw error;
//         }
//     }
//     /*------------------------------------------------
//        Editar el Perfil del Alumno
//      ------------------------------------------------
//    */
//     static async updateTeacherProfile(id, data) {
//         try {
//             const ref = (0, firestore_1.doc)(db, this.collectionName, id);
//             await (0, firestore_1.updateDoc)(ref, data);
//         }
//         catch (error) {
//             console.error('[ProfileTeacherService]: Error al guardar la actualización del Profesor', error);
//             throw error;
//         }
//     }
//     /** Metodos de Actualizacion & Obtencion del Perfil **/
//     /* -------------------------------------------------------------------------------------
//          Guardar la data del profesor en Firebase, pero este e loggeado mediante Gmail
//      ---------------------------------------------------------------------------------------
//       [06/Oct/2025]
//     */
//     static async signInAndSaveGmailTeacher() {
//         const auth = (0, auth_1.getAuth)();
//         const provider = new auth_1.GoogleAuthProvider();
//         try {
//             const result = await (0, auth_1.signWithPopUp)(auth, provider);
//             const user = result.user;
//             /*Datos basicos que aloja Google-Gmail: Seleccionar la inf deseada*/
//             const teacher_data = {
//                 uid: user.uuid,
//                 nombre: user.displayName?.split(" ")[0] || 'Sin nombre',
//                 apellido: user.displayName?.split(" ")[1] || '',
//                 email: user.email,
//                 role: 'profesor',
//                 fechaRegistro: new Date(),
//             };
//             /*Guarda o actualiza información de Google en la Firestore*/
//             const docRef = (0, firestore_1.doc)(db, this.collectionNameR2, user.uid);
//             await (0, firestore_1.setDoc)(docRef, teacher_data, { merge: true }); //comprobacion si se mezco inf
//             /*Advertimos al Sistema, que la info fue guardada*/
//             console.log('[Servicio-Profesor]El perfil del Profesor fue guardado exitosamente');
//             return teacher_data;
//         }
//         catch (error) {
//             console.error('[ProfileTeachersService]: Error en el Registro de Profesor', error);
//             throw error;
//         }
//     }
//     /*Actualiza la data del perfil del Profesor*/
//     static async updateTeacherProfile(id, dataProfile) {
//         try {
//             const ref = (0, firestore_1.doc)(db, this.collectionNameR2, id);
//             await (0, firestore_1.updateDoc)(ref, dataProfile);
//         }
//         catch (error) {
//             console.error('[ProfileTeachersService]: Error al actualizar los datos del Profesor', error);
//             throw error;
//         }
//     }
//     /*Obtener info del profesor loggeado desde la firestore*/
//     static async getTeacherProfile(id) {
//         try {
//             const ref = (0, firestore_1.doc)(db, this.collectionNameR2, id);
//             const snap = await (0, firestore_1.getDoc)(ref, data);
//             if (docSnap.exists()) {
//                 return snap.data();
//             }
//             else {
//                 return null;
//             }
//         }
//         catch (error) {
//             console.error('[ProfileTeachersService]: Error al obtener el  Perfil del Profesor', error);
//             throw error;
//         }
//     }
// }
// exports.ProfileTeachersService = ProfileTeachersService;
// //# sourceMappingURL=ProfileTeacherServ.js.map