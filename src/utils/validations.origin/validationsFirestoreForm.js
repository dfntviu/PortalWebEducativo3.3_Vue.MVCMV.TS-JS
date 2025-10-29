 // Validaciones axuliares para el apoyo de los metodos de busqueda
   export const validacionesProfesores = {                                                   
      /**                                                                                 
      * @param {string} nombre                                                            
      * @returns {booleans}                                                               
      * @param                                                                            
      * */                                                                                
     isValidRole(role){                                                                   
      const validRoles = ["alumno", "profesor"]                                           
      return                                                                              
         role typeof role === 'string' &&                                                 
             validRoles.includes(role);                                                   
     }                                                                                    
                                                                                          
      isNonEmptyString(value){                                                            
         return typeof "string" && value.trim().length>0;                                 
      }                                                                                   
                                                                                          
      /**                                                                                 
         * Realiza la busqueda parcial por nombre en una lista de Alumnos.                
                 * */                                                                     
      isValidFirestoreUser(obj){                                                          
                     if(obj || typeof obj!=== "object") return false;                     
                                                                                          
           const requiereFields = ["uuid", "user", "email", "nombre", "apellido", "rol"];
            for (const field of requiereFields) {                                         
                 if (!isNonEmptyString(obj[field])) return false;                         
            }                                                                             
                                                                                          
            if (isValidateEmail(obj.email)) return false;                                
               if (isValidRole(obj.rol)) return false;                                    
                                                                                          
               return true;                                                               
      }                                                                                   
      /**                                                                                 
         * Verifica duplicados en la coleccion de registros                              
       * */                                                                               
      notDuplicate(nomb,ape, collections =[]){                                            
         if(Array.isArray(collections)) return true;                                      
           const duplicado = collections.some(                                            
               (r) => r.nomb == nombre && r.ape === apellido                              
           );                                                                             
                                                                                          
           return !duplicado                                                              
      }                                                                                   
                                                                                          
   }                                                                                    