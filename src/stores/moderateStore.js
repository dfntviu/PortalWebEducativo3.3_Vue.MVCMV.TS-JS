// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const pinia_1 = __importDefault(require("pinia"));
// const moderationServ_ts_1 = require("@/Services/moderationServ.ts");
// const types_1 = require("@/types");
// const interf_index_ts_1 = require("@/types/interf.index.ts");
// // Instalar Pinia
// const useModerationStore = ('moderation_materials', {
//     state() { }
// });
// ({
//     // Dec. de las variables reactivas de ambos roles    --> tot <- 3.5
//     tipo_moderation: uuid_mat, // 1 acierto
//     collection_type: [], // 2 acierto
//     loading: false, // 3 acierto
//     estado: 'pendiente', // 1/2 acier.
//     error: "",
//     comentarios: []
// }),
//     actions;
// {
//     async;
//     estadoDeModeracion(materialId, string, alumnoId, string);
//     {
//         // falto la 2° linea
//         this.loading = true;
//         this.error = "";
//         try {
//             // Se comprueba y/o valida el estado actual
//             if (estado === )
//                  = 'aprobado';
//             {
//                 await moderationServ_ts_1.ModerationService.arpobarMaterialsEduc(userId);
//                 console.log(`[ModerationStre]: El Material de ${userId} aprobado correctamente`);
//             }
//             if (estado === 'rechazado') {
//                 await moderationServ_ts_1.ModerationService.rechazarMaterialsEduc(userId);
//                 console.log(`[ModerationStre]: El Material de ${userId} fue rechazado`);
//             }
//             else {
//                 console.warn(`[ModerationStre] del Estado ${this.estado} no es válido para moderar`);
//             }
//         }
//         catch (err) {
//             this.error = err.message || "Error en la moderación de materiales";
//             console.error(`[ModerationStre] Error: `, this.error);
//         }
//         finally {
//             this.loading = false;
//         }
//     }
//     async;
//     estadosDeModeracionPendientes();
//     {
//         this.loading = true;
//         this.error = "";
//         try {
//             const pendientes = await moderationServ_ts_1.ModerationService.getPenditentes();
//             if (Array.isArray(pendientes)) {
//                 this.collection_type = pendientes;
//                 this.tipo_moderation = pendientes.length
//                     ? pendientes[0]
//                     : null;
//                 console.log(`[ModerationStore]: ${pendientes.length} materiales pendientes Obtenidos`);
//             }
//             else {
//                 console.error('[ModerationStore] Error:La respuesta de Materiales Pendiente no es un arreglo');
//             }
//         }
//         catch (err) {
//             this.error = err.message || "Error obtenido en materiales pendientes";
//             console.error("[ModerationStore] Error: ", this.error);
//         }
//         finally {
//             this.loading = false;
//         }
//     }
//     // Nuevo agregada(25/Sep/25)
//     async;
//     agregarComentario(mensaje, string, destacado, boolean);
//     {
//         this.loading = true;
//         this.error = "";
//         try {
//             const nuevo = moderationServ_ts_1.ModerationService.agregarComentarioProffe(mensaje, destacado);
//             this.comentarios.push(nuevo); // es alcanzable
//         }
//         catch (err) {
//             console.error("Error al escribir el Comentario: ", err);
//         }
//         finally {
//             this.loading = false;
//         }
//     }
// }
// getters: {
//     destacados: state => state.comentarios.filter(c => c.destacado);
// }
// //# sourceMappingURL=moderateStore.js.map