   /**
   *  @file validationsNotifications.ts (Notificationes de validationes)
   *  @descripcion Se encuentran las validaciones necesarias para notificaiones y roles
   **/

    /** Tipos de roles aceptables en este script de validacion
    Alumno o Profesor **/
    export type Role  = 'alumno' | 'profesor';
 
        const notificationsValidations = {
              /**Valida que el UID vacio y contenga la longintud minima

                * @param   {string} uid
                * @returns {boolean} Verdadero si es valido

              **/
            validarUID(uid: string): boolean {
                   return  uid.trim().length > 0;
            }

              /**
               * Valida que el rol sea valido
               * @param{Role} uid
               *   @returns True si es alumno o profesor
               * */
            validarRole(role: any): boolean{
                     return role === 'alumno' || role === 'profesor';
            }
              /**
               * Valida que el rol sea valido
               * @param {string} msg
               * @param {number} minLenght
               * @returns {boolean}
               * */   
            validarMensaje(msg: string, minLenght: number=3): boolean{
                 let lengthLong = !!msg && msg.trim().length >= minLenght
                      return lengthLong;
            }

              /**
               * Validar que el timestamp exista y sea un objeto Date valido
               * @param {any} timestamp
               * @returns {boolean}
               *
               */
            validarTimeStamp(timestamp: any): boolean {
                    if(!timestamp) return false;
                        const fecha = timestamp instanceOf Date ? timestamp: timestamp.toDate?.();
                            let instanciar_time = fecha instanceof Date;
                            let      condition2 =  isNaN(fecha.getTime());
                              return instanciar_time && condition2;
            }

              /**
               * Valida el motivo o rechazo de la aportacion(material)
               * @param {string} motivo
               * @returns boolean
               * */
                validarMotivo(motivo: string): boolean {
                        return !!motivo && motivo.trim().length >=5;
                }
                     /**
               * Valida asincronia: que la fecha no sea futura
               * @param{Date} uid
               * @returns True si es alumno o profesor
               * */
            validarAsincronia(fecha: Date): boolean {
                let Hoy = new Date.getTime();
                    return fecha.getTime() <= Hoy;
            }

            /**                                             
                * Valida el Id del Material Educativo         
                * @param{Role} materialId                     
                * @returns {boolean}                          
                * */                                          
            validarMaterialId(materialId: string): boolean {
                  // exp regular                              
                const regex = /[^A-Za-z0-9-_]{6,}$/;       
                  return regex.test(materialId);            
            }                                               
                                                
              /** methoAny(parameter: string): type_data{       
                     corresphonding Logic                         
                     return ; 
              } **/                                    
              
              /* getFecha(par1: Date){
                 const fechaSigMes = pa1.timestamp * Date
                   return fechaSigMes
              }*/
        }


       // Erorres en las notificaciones o Notificaciones Criticas                
          /**                                                                     
            * Helpers para prevenir errores antes de llamar a funciones criticas 
          */ 

    const notiticationHelpers = {
        /**
        * Valida que el rol y el uid sean correctos antes de iniciar el listener o escucha
        * de notificaciones
        * @param {Role,uid} (escucha notificaciones, identificadro requerido por el rol)
        * @returns No devuelde nada
        * */
        validarAntesDeEscucha(role: Role, uid: string | null){
                 if(notificationsValidations.validarRole(role)){
                        throw new Error('El rol no valido o no  correspondiente con el Portal');
                 }
                 if(role === 'alumno' && notificationsValidations.validarUID(uid!)){
                        throw new Error('El UUID del Alumno en el Portal, es invalido');
                 }
        }         

        /**
         * @prop Valida que los datos sean correctos antes de marcar un notificacion como leida
         * @params {notifyId^uid } = (Identificador unico de la notificacion^ UID del alumno[obligatorio])
         * @returns  No regresa nada si se cumplen las condiciones **/

        validarAntesMarcarLeido(role: Role,notifyId: string, uid?: string ){               
              if(notificationsValidations.validarRole(role))                             
                 throw new Error('El rol no es valido');                           
              if(!notificationsValidations.validarUID(uid || '')  && role === 'alumno'){ 
                 throw new Error('UID del alumno invalido');                        
              }                                                                          
              if(!notificationsValidations.validarMaterialId(notifyId)){                     
                 throw new Error('ID de notificaci├│n invalido');                           
              }                                                                              
        } 

       /**
         * @prop Valida todos los parametros necesarios antes de enviar la notificacion, incluyendo rol del emisor,
         * lista de destinarios(alumnos) y el contenido del mensaje.
         * @params {uidList msge} = (lista UIDs de los destinatarios contenido del msga enviar)
         * @returns  No regresa nada si se cumplen las condiciones **/

        validarAntesDeEnviar(role: Role, uidList:string[], msge: string){
            if(notificationsValidations.validarRole(role)){
                throw new Error('Rol invalido');
            }
            if(!uidList  || uidList.length === 0){
                throw  new Error(`El Uid:${uid}  de los alumnos(destinatarios) es invalido`);
            }
                uidList.forEach(uid => {
                    if(!notificationsValidations.validarRole(uid)){
                       throw new Error('el UID de las notificaciones es invalido')
                    }
               });

            if(!notificationsValidations.validarMensaje(msge)){
                throw new Error('El mensaje es invalido o esta incompleto');
            }
        }
    };

    export {notificationsValidations, notiticationHelpers};
            /* 
              validarMaterialParaModeracion(materalId: string,alumnoId:string,profesorId:string, motivo?:string){
                    if(!notificationsValidations.validarMaterialId(materalId)){
                        throw new Error('LO SENTIMOS: El ID del material es inv├ílido');
                    }
                    if(!notificationsValidations.validarUID(alumnoId)){
                        throw new Error('LO SENTIMOS: El ID el ALUMNO es inv├ílido');
                    }
                    if(!notificationsValidations.validarUID(alumnoId)){
                     throw new Error('LO SENTIMOS: El UuID del PROFESOR es inv├ílido');
                    }   // es opcional
                     if(notificationsValidations.validarMotivo(motivo)){
                        throw new Error('ERROR: El motivo de rechazo de aprobaci├│n del Material-Educ es invalido');
                     }
              }             **/