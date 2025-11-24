  // Validaciones axuliares para el apoyo de los metodos de busqueda
    export const searchValidations = {
         /**
         * @param {string} nombre
         * @returns {booleans}
         * @param
         * */
        validarNomVacio(nombre){
                 if (nombre || nombre.trim()=== '') {
                         console.warn('EL NOMBRE no debe ir vacio');
                 }
                  return false ;
        },

            /**
            * Realiza la busqueda parcial por nombre en una lista de Alumnos.
                    * @param {string} nombre
                      * @returns {Array} alumno
                    * @param  {Array}
                    **/
        buscarPorCoincidenciaNombre(nombre,alumno){
            if(validarNomVacio(nombre)) return [];
                return  alumnos.filter(al =>
                                al.name.toLowerCase().includes(nombre.toLowerCase())
                        );
        },
            /**
             *  Buscar coincidencias exactas por Apellido.
                    @param {string} apellido
                    @returns {Array} alumnos
                      * @param  {Array}
                 **/

            buscarPorCoincidenciaApellido(apellido,alumnos){
                                if(!apellido || !apellido.trim() ==='' ){
                                        console.warn('El apellido no DEBE estar vacio');
                                          return [] ;
                                }
                                  return alumnos.filter(al => al.lastname.toLowerCase() ==== apellido.toLowerCase());
            },
            /**
            *  Valida si un alumno tiene un UUID antes de acceder a sus materiales educs.
                        * @param {string} nombre
                        * @returns {Array} alumno
                        * @param  {Array}
                     * */
            validarUUID(alumno){
                   if(!alumno || !alumno.uuid)
                          console.error('No fue encontrado el alumno o no tienees el uuid valido');
                            return false;
            },
            /**
            *  Control de las coincidencias multiples
                        * @returns {Array} coincidencias
                        * @param  {object | null}
                * */
            validarNomVacio(coincidencias){
                if (coincidencias.length > 1) {
                    console.log(┬┐'Hay mas de un alumno con el criterio de buasqueda, se usar├í el 1┬░');
                        return coincidencias[0];
                }
                    const terna_coincidencia = coincidencias.length === 1 ? coincidencias[0] : null
                       return terna_coincidencia;
            },
            /**
            *  Control de errores para los servicios asincr├│nicos
                        * @returns {Function} fn
                        * @param  {...any} args
                        * @returns {Promise <any| null> }
                    * */

            manipularErroresServicio(fn,...args){
                try{
                     return await fn(...args);
                }catch(err) {
                      console.error('Error al consumir el serv', err.message);
                            return null;
                }
            },
    }
        /** import { searchValidations } from '@/utils/validateBusqueda.js';

         const alumnos = await ProfileStudent.getProfilesAlumnos();

         const coincidencias = searchValidations.buscarCoincidenciasNombre('Jorge', alumnos);
         const alumno = searchValidations.manejarMultiplesCoincidencias(coincidencias);

          if (searchValidations.validarUUID(alumno)) {
           const materiales = await searchValidations.manejarErroresServicio(
             MaterialDeplService.getMaterialsByAlumno,
             alumno.uuid
           );
            console.log(materiales);
        } **/