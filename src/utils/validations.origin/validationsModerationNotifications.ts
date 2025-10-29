 import {notificationsValidations} from 'validationsNotifications.ts';

export const materialValidationsNotify = {
        /**
         *  Valida antes de aceptar o rechazar el material educativo
         * @param {string} materialId
         * @param {string} alumnoId
         * @param {string} profesorId
         * @param {string} [motivo]
        **/

        validarMaterialParaModeracion(materalId: string,alumnoId:string,profesorId:string, motivo?:string){
                if(!notificationsValidations.validarMaterialId(materalId)){
                        throw new Error('LO SENTIMOS: El ID del material es inv├ílido');
                }
                if(!notificationsValidations.validarUID(alumnoId)){
                        throw new Error('LO SENTIMOS: El ID el ALUMNO es inv├ílido');
                }
                if(!notificationsValidations.validarUID(profesorId)){
                 throw new Error('LO SENTIMOS: El UuID del PROFESOR es inv├ílido');
                }   // es opcional
                
                if(notificationsValidations.validarMotivo(motivo)){
                        throw new Error('ERROR: El motivo de rechazo de aprobaci├│n del Material-Educ es invalido');
                }
        }
}