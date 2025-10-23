   export const validacionesPerfiles = {
     /**
     * @param {string} nombre
     * @returns {booleans}
     * @param
     * */
         isValidPassword(pass){
            if( typeof pass !== "string") return false;
            if( pass.trim().length <6) return false;
               const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
                 return regex.test(pass);
         }

         isMatchingPassword(oldPass, newPass){
            if(!isValidPassword(newPass)) return false;
              return oldPass !== newPass;
         }

         isvalidEmail(email){
            if (typeof email !== "string") return false;
               const regex = /^[^s\@]+@[^\s@]+\.[^\s@]+$/;
                 return regex.test(email.trim());
         }

         // Validar que el perfil no sea duplicado


         // Validar cuota de estudiantes, solo guardar(limite alcanzado hasta 1300 alumnos).


         // Unicamente permitir la actualizacion del perfil como limite 5 veces, posterior bloquear accion


         // Notificar al usuario que no fue relacionada su correo con la cuenta de Facebook(problemas tecnicos con FB)


         // Cambio de contraseña: Validar que el usuario no repita su nueva contraseña por la anterior.


         // Sugerir al usuario modificar su contraseña en un periodo de 6-8 meses


         /*Si el usuario hizo caso omiso, de no cambiar la contraseña en el mes 9. Entonces cerrarle la sesion
           y obligarlo a cambiar la contrasenia en el mes 10*/

         
   }