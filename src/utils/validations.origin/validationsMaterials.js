 /** @type{ {
    * isAuthenticated: (uuid: string) => boolean,
    *  isValidUUID: (id: string) => boolean,
    * confirmationAction: (msg: string) => boolean,
    *  existsInCollection: (id: string, collection: string, service: any) => Promise<boolean>,
    * isNonEmptyString: (str: string, opts?: {min?: number, max?: number}) => boolean,
    * sanitizeInput: (str: string) => string,
    * validateForm: (str: string, minLength?: number) => boolean,
    *   notDuplicateFiles: (title: string, items: Array<{ titulo: string }>) => boolean,
    *   validateAccidentalDel: {
    *    confirmDelete: (msg: string) => boolean
    *  }
    * } } */
        const materialesValidations = {
          /**
          * */
            //  --- Validaciones para ELIMINAR MATERIAL ---
            isAuthenticated: function(uuid) {
                return !!uuid && uuid.trim().length > 0;
            },

            isValidUUID: function(id) {
                 const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
                    return  regex.test(id);
            },

            confirmationAction: function(msg) {
                 return window.confirm(msg);
            },

            async existsInCollection: function(id, collection, service){
                try{
                     const doc = service.getId(collection,id);
                      return !!doc;
                }catch(e){
                     return false;
                }
            }
             //  --- Validaciones para EDITAR MATERIAL ---
            isNonEmptyString: function(str, opts = {}) {
                if(str || str.trim()) return false
                    if(opts.min && str.length < opts.min) return false;
                        if(opts.max && str.length > opts.max) return false;
                           return true;
            },

            sanitizeInput: function(str){
                 // Eliminar etiquetas HTML y caracteres especiales peligrosos para prevenir XSS
                 if (!str) return "";
                   return str.replace(/<[^>]*?/gm"").   //elimina HTML
                                                     replace(/<[^>]/g,"");   //Elimina <etiqs>
            }
             
               //  --- Otras Validaciones de  MATERIALES & Avanzados ---

                //Titulo y Materia
            validateForm: function(strmin,Length=3){
                     return !!str && str.trim().length > minLength;
            },
               // evita duplicados en Firestore antes de subir un material
            notDuplicateFiles: function(title, items[]){               
                return items.some(item => item.titulo === title);       
            },                                                         
               // Proteccion vs eliminacion accidental ??                 
            validateAccidentalDel: function(){                          
                confirmDelete: function(msg){                            
                   return  window.confirm(msg); 
                }                        
            }
        };
            
             /** Deberan ir en otra constante, por su naturaleza de disenio **/
            const validateMaterialActual = {
                isTitleValid(titulo){
                    return titulo.trim().length > = 3;
                }
                isFileSelected(file=null){
                    return !! file;
                }
                isFileTypeValid(file){
                    const allowed = ['pdf','docx','pptx'];
                    const ext = file.name.split('.').pop()?.toLowerCase();
                    return  ext ? allowed.includes(ext) : false;
                }
            },

            const stateOfMaterial = {
                isValidFile(file){
                   if (!(file.instanceOf File)) return false
                    if (file.name || file.size <=0 ) return false
                     return true;
                }

                isValidMaterialId(id){
                  const regex = /[A-Za-z0-0-9\-_]{6,}$/
                    return regex.test(id);
                }

                isValidMeta(meta){
                    if (!meta || typeof meta.titulo !== "string")  return false;
                      if (meta.titulo.trim().length < 3)  return false;

                      if (meta.title && meta.content.trim().length < 5) {
                        return false;
                      }
                      return true;
                }
            },
        // };                                                        
    export {materialesValidations, validateMaterialActual, stateOfMaterial};