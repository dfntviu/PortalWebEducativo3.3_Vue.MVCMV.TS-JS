/**
*  @file validationsNotifications.ts (Notificationes de validationes)
*  @descripcion Se encuentran las validaciones necesarias para notificaiones y roles
**/
/** Tipos de roles aceptables en este script de validacion
Alumno o Profesor **/
export type Role = 'alumno' | 'profesor';
declare const notificationsValidations: {
    /**Valida que el UID vacio y contenga la longintud minima

      * @param   {string} uid
      * @returns {boolean} Verdadero si es valido

    **/
    validarUID(uid: string): boolean;
    /**
     * Valida que el rol sea valido
     * @param{Role} uid
     *   @returns True si es alumno o profesor
     * */
    validarRole(role: any): boolean;
    /**
     * Valida que el rol sea valido
     * @param {string} msg
     * @param {number} minLenght
     * @returns {boolean}
     * */
    validarMensaje(msg: string, minLenght?: number): boolean;
    /**
     * Validar que el timestamp exista y sea un objeto Date valido
     * @param {any} timestamp
     * @returns {boolean}
     *
     */
    validarTimeStamp(timestamp: any): boolean;
    /**
     * Valida el motivo o rechazo de la aportacion(material)
     * @param {string} motivo
     * @returns boolean
     * */
    validarMotivo(motivo: string): boolean;
    /**
* Valida asincronia: que la fecha no sea futura
* @param{Date} uid
* @returns True si es alumno o profesor
* */
    validarAsincronia(fecha: Date): boolean;
    /**
        * Valida el Id del Material Educativo
        * @param{Role} materialId
        * @returns {boolean}
        * */
    validarMaterialId(materialId: string): boolean;
};
/**
  * Helpers para prevenir errores antes de llamar a funciones criticas
*/
declare const notiticationHelpers: {
    /**
    * Valida que el rol y el uid sean correctos antes de iniciar el listener o escucha
    * de notificaciones
    * @param {Role,uid} (escucha notificaciones, identificadro requerido por el rol)
    * @returns No devuelde nada
    * */
    validarAntesDeEscucha(role: Role, uid: string | null): void;
    /**
     * @prop Valida que los datos sean correctos antes de marcar un notificacion como leida
     * @params {notifyId^uid } = (Identificador unico de la notificacion^ UID del alumno[obligatorio])
     * @returns  No regresa nada si se cumplen las condiciones **/
    validarAntesMarcarLeido(role: Role, notifyId: string, uid?: string): void;
    /**
      * @prop Valida todos los parametros necesarios antes de enviar la notificacion, incluyendo rol del emisor,
      * lista de destinarios(alumnos) y el contenido del mensaje.
      * @params {uidList msge} = (lista UIDs de los destinatarios contenido del msga enviar)
      * @returns  No regresa nada si se cumplen las condiciones **/
    validarAntesDeEnviar(role: Role, uidList: string[], msge: string): void;
};
export { notificationsValidations, notiticationHelpers };
//# sourceMappingURL=validationsNotifications.d.ts.map