// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const pinia_1 = __importDefault(require("pinia"));
// const MaterialAdmServProfessor_ts_1 = require("@/services/MaterialAdmServProfessor.ts");
// // Darle una pasada al DeployService y la vista  viewMaterials_MatStore -> viewMethodsMaterials, abrir vista en siguiente de unitled
// const useMaterialStoreR2 = (0, pinia_1.default)('teacher_materials', {
//     state: () => ({
//         materials: [],
//         loading: false,
//         error: "",
//         errorHistory: [], // 📌historial de errores
//         id: "",
//         msgError: "",
//         // Test de Stores para filtros del profesor(ServAdmR2)
//     }),
//     actions: {
//         async fetchMaterials(option) {
//             this.loading = true;
//             this.error = "";
//             const service_teachersR2 = (0, MaterialAdmServProfessor_ts_1.MaterialDeployServiceR2)();
//             const actionsMap = {
//                 // //UH01, UH02 UH03, UH04, Uh05,UH06, UH07, UHO8
//                 1: () => service_teachersR2.getAllStudentsMaterials(),
//                 2: () => service_teachersR2.getMaterialsSortedByLatest(), //procesa
//                 3: () => service_teachersR2.getMaterialsByUsername(),
//                 4: () => service_teachersR2.getMaterialsToday(), // procese
//                 5: () => service_teachersR2.getMaterialLast2Days(), // procesa
//                 6: () => service_teachersR2.getMaterialsLastWeek(),
//             };
//             try {
//                 // En lugar del intercambio, la f(n) se incia directamente
//                 const action = actionsMap[opc];
//                 if (!action) {
//                     this.error = 'Opcion inaccesible o no definida en nuestros parametros';
//                     this.errorHistory.push(this.error);
//                     return;
//                 }
//                 /* Si existe la clave del mapeo. Entonces, ejecutamos la f(n) de mapeo */
//                 this.materials = await action();
//                 /* Ventajas del Mapeo
//                    - El código es limpio
//                    - Más fácil de mantener
//                    - Más escalable
//                 */
//             }
//             catch (err) {
//                 this.error = err.message || "Error inesperado al obtener los materiales";
//             }
//             finally {
//                 this.loading = false;
//             }
//         },
//     }
//     /* Advices for best practices of developing
//         - No saturar el store, utilizar la definicion muy puntual
//         - Utilizar la mejor estructura, para consumir la información de forma eficiente
//         - verificar 2 veces la sintaxis
//         - Tomarse el tiempo para analizar el esqueleto del diseño del store
//     */
//     /* name: '', es incesario, con lo que ya se definio se diseña toda la logica
//      hoy: '',  // <?>
//       twoday_previous: [] as Material[],
//       semana_pasada: [] as Material[],
//     */
// });
// /*switch(opc){
//                   case  1:
//                       this.materials = await store_proff_adm.getAllStudentsMaterials();
//                     break;

//                     case  2:
//                       this.materials = await store_proff_adm.getMaterialsSortedByLatest();
//                     break;

//                       case  3:
//                       this.materials  = await  store_proff_adm.getMaterialsByUsername();
//                     break;

//                     case 4:
//                       this.materials = await store_proff_adm.getMaterialsToday();   // cross(1)
//                     break,

//                     case 5:
//                       this.materials = await store_proff_adm.getMaterialLast2Days(); // cross(2)
//                     break;

//                     case 6:
//                        this.materials = await store_proff_adm.getMaterialsLastWeek(); // cross(3)
//                     break;
//                       default:
//                         this.msgError = 'Opcion inaccesible o no definida en nuestros parametros'; // cross(4)
//                 }*/ 
// //# sourceMappingURL=materialTeacherStore.js.map