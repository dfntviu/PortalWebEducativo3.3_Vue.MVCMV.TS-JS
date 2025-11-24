"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialValidationsNotify = void 0;
const validationsNotifications_ts_1 = require("validationsNotifications.ts");
exports.materialValidationsNotify = {
    /**
     *  Valida antes de aceptar o rechazar el material educativo
     * @param {string} materialId
     * @param {string} alumnoId
     * @param {string} profesorId
     * @param {string} [motivo]
    **/
    validarMaterialParaModeracion(materalId, alumnoId, profesorId, motivo) {
        if (!validationsNotifications_ts_1.notificationsValidations.validarMaterialId(materalId)) {
            throw new Error('LO SENTIMOS: El ID del material es inv├ílido');
        }
        if (!validationsNotifications_ts_1.notificationsValidations.validarUID(alumnoId)) {
            throw new Error('LO SENTIMOS: El ID el ALUMNO es inv├ílido');
        }
        if (!validationsNotifications_ts_1.notificationsValidations.validarUID(profesorId)) {
            throw new Error('LO SENTIMOS: El UuID del PROFESOR es inv├ílido');
        } // es opcional
        if (validationsNotifications_ts_1.notificationsValidations.validarMotivo(motivo)) {
            throw new Error('ERROR: El motivo de rechazo de aprobaci├│n del Material-Educ es invalido');
        }
    }
};
//# sourceMappingURL=validationsModerationNotifications.js.map