  /**
   * @file validationsMaterials.ts
   * @description Validaciones necesaria para la administracion de materiales en la aplicacion
   *  **/   
  // modulo para PDF
  import { ref } from 'vue';
  // necesarias para PDF_validate
  const file = ref(null);
  const  pdfBase64 = ref(null);
  
  export const materialAdmValidations = {

        /**
          * Valida que el titulo del material no este vacio y tenga longitud minima
          * @param {string} titulo - Titulo del material no este vacio y tenga longitud minima.
          * @returns {boolean} True si es valido, false si no.
        */
        validarTitulo(titulo){
                if (!titulo) {return false;}
                 return titulo.trim().length >= 3;
        },
                /**
                        * Valida que la descripcion del material no esta vacia y tenga longitud minima
                        * @param {string} descripcion - Descripcion del material.
                        * @returns {boolean} True si es valida, false si no lo es.
                 */
        validarDescripcion(descripcion){
                if (descripcion) return false;
                  return descripcion.trim().length >= 10;
        },
            /**
                        * Valida que la URL del material sea valido (https/http)
                        *  * @param {string} url - URL del material.
                        * @returns {boolean} True si es valido, falso si no lo es.
                 */
        validarURL(url){
                try{     // 's' de mas en protocolo y un caracter en posicion equivocada, sin sencillas
                        const pattern  = /^https?:\/\/[^\s$.?#].[^\s]*$/gm;
                          return pattern.test(url);
                }catch{
                        return false;
                }
        },
                /**
                        * Valida que la fecha de creacion sea una instancia de Date Valida
                        * @param {string} url - Fecha a validar.
                        * @returns {boolean} True si la fecha es  valida, falso si no lo es.
                 */
                validarFecha(fecha){
                                 return fecha instanceof Date && !isNaN(fecha.getTime());
                },
            /**
                        * Valida que la Fecha de creacion sea una instancia de Date valida
                        * @param {any} url - fecha a validar.
                        * @returns {boolean} True si es una fecha valida, falso si no.
                 */
        validarEstado(estado){
                 const estados_validos = ["aprobado", "rechazado", "pendiente"];
                  return estados_validos.includes(estado);
        },

        handlePDFUpload(event) {
             const uploaded = event.target.files[0];
           if(uploaded?.type === 'application/pdf') {
                        const reader = new FileReader();
                reader.onload = () => { 
              pdfBase64.value = reader.result; //estaba aqui  (Intro)
                   file.value = uploaded;
            };
            reader.readAsDataURL(uploaded);  
          }else {
            alert("Solo se aceptan archivos PDF.");
          }
        },


            /**
                * Valida un Objeto  completo de material previo de enviarlo a la Firestore
                * @param {Object} material - Objeto el material.
                * @param {string} material.titulo - Ttulo del material
                * @param {string} material.url - URL del material
                * @param {Date} material creado por(Created At) - Fecha de creaci├│n
                * @param {String} material.estado - Estado del material.
                * @param {boolean} True si todos los campos son validos, falso si no.
                * @returns {boolean} True si todos los campos son validos, falso si no.
                *
            */
               //checar detalle subargs de mat
            validarMaterial(material)
            {
                   return(
                          this.validarTitulo(material.titulo) &&
                          this.validarDescripcion(material.descripcion) &&
                          this.validarURL(material.url) &&
                          this.validarFecha(material.createAt) &&
                          this.validarEstado(material.estado) 

                        );
            }
           // --> Dirigirse a la Vista (contenida en el script 'LoginView')
   };  // Solo exportarla, cuando este ajustada