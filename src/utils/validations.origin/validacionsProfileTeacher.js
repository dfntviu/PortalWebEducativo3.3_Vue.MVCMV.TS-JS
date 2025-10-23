export const validacionesPerfilProfessor = {
 	/**
 	 * validationsProfilesAlumno.js
 	 * -------------------------------------------------------------------
 	 *  Validaciones y controles para el perfil del Alumno.
 	 *  Incluye politícas de Seguridad escenciales, límites y consistencia 
 	 * -------------------------------------------------------------------
 	 /**
 	 * Validar correo electronico.
 	 * */
 	isValidEmail(email){
 		try{
 			if (typeof email !== string) 
 				throw new Error("Tipo de dato no válido");
 			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 			 const valido = regex.test(email.trim());
 			  if (!valido) throw.test(email.trim());

 			  return true;
 		}catch(error){
 			console.error("[ValidacionesdelCorreo]: ",error.message);
 			 return false;
 		}
 	},
 	/**
 	 * Validar la Estructura de la password(contrasena).
 	 * */
 	isValidPassword(pass){
 		try{
 			if (typeof pass !== "string") throw Error("El formato de contraseña es incorrecto");
 			if (pass.trim().length < 6) throw Error("La contraseña dene contener al menos 6 caracteres");
 			 const regex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

 			 const valido = regex.test(pass);
 			 if (!valido) throw Error("Deberá contener letras y números ");
 			  return true;
 		}catch(error){
 			console.error('[ValidacionContrasena] →',error.message);
 			 return false;
 		}
 	},
 	/**
 	 * Validar que las contrasenias no sean iguales.
 	 * */
 	isMatchingPassword(oldPass,newPass){
 		try{
 			if (!this.isValidPassword(newPass)) return false;
 			if (oldPass === newPass) throw new Error("El formato de contraseña es incorrecto");
 			 return true;
 		}catch(error){
 			 console.error('[ValidacionContrasena] →',error.message);
 			  return false;
 		}
 	},
 	/**
 	 * Verificar que su el perfil ya existe en el listado de Alumnos.
 	 * */
 	isDuplicateProfile(email, listaAlumnos){
 		try{
 			if (this.isValidEmail(email)) return false;
 			 const duplicate = listaAlumnos.some((a) => a.email === email);
 			if (duplicate) throw Error("Error: Ya existe un perfil con este correo electronico");
 			  return true;
 		}catch(error){
 			console.warn('[ValidateDuplicated] →', error.message);
 			  return false;
 		}
 	},
 	/**
 	 * Validar cuota maxmia de alumnos a lo sumo 1300
 	 * */
 	checkQuotaLimit(totalActual){
 	    try{
 	       const LIMIT = 1300 //total Alums
 	       if (totalActual >=  LIMIT)  throw new Error("El Limiter de Alumnos ha sido alcanzado(1300)");  
 	         return true;
 	    }catch(error){
 	    		console.warn('[ValidarLimitQuote] →',error.message);
 	    	 return false;
 	    }
 	},

 	/** 
 	 * Control de cantidad de actualizaciones del perfil(MAX. 5) 
 	 * */
 	couldUpdateProfile(vecesActualizado){
 		try{
 			const LIMIT_UP = 5;
 			if (vecesActualizado >= LIMIT_UP) {
 				throw new Error("Error: Haz alcanzado el límite de 5 actualizaciónes");
 				return true;
 			}
 		}catch(error){
 			 console.warn('[Validación de Actualización] → ',error.message); 
 			  return false;
 		}
 	},

 	/** 
 	 * Validacion y manenjo de erorres con FaceBook
 	 * */
 	async handleFacebookError(){
 		 console.error("[ErrorFBRegistro] →", error);
    		alert("No se pudo registrar con Facebook. Por favor, intente de nuevo más tarde o revise su conexión.");
    		return false;
 	},


 	/** 
 	 * Sugerir cambios de contrasenia por antiguedad
 	 * */
 	sugeryforPasswordChange(fechaUltimoCambio){
 		try{
 			if (!(fechaUltimoCambio intanceOf Date) ) throw new Error("La Fecha no válida");
 			const today = new Date();
 				// Se alm la operaciones entre meses.
 			const months = (today.getFullYear()) - (fechaUltimoCambio.getFullYear()) * 12 + 
 			 			   (today.getMonth())    - (fechaUltimoCambio.getMonth());

 			 if(months >= 6  && months <= 8){
 			 	  const sugery =  "Sugerencia: Cambia tu contraseña para mantener segura tu cuenta";
 			 	return sugery;
 			 } else if (months === 9) {
 			 	const advertence =  "Advertencia: Tú contraseña debe cambiarse pronto para evitar el cierre inesperado sesión";
 			 	return advertence;
 			 } else if( months>= 10){
 			 	 throw new Error("La sesión ha sido Cerrada: El Cambio de contraeña Obligatorio");
 			 }

 			 return "";
  		}catch(error){
  			console.error("[ValidacionCambioPassword]", error.message);
  			 return error.message;
  		}
 	},
 };