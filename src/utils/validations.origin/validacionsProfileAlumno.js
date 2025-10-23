  export const validacionesPerfilAlumno = {
 	/**
 	 * validationsProfilesAlumno.js
 	 * -----------------------------------------------------------------------
 	 *  Validaciones y controles para el perfil del Profesor.
 	 *  Incluye politícas de Seguridad escenciales, límites y control errores. 
 	 * -----------------------------------------------------------------------
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
 			console.error("[ValidacionesProfesor]: ",error.message);
 			 return false;
 		}
 	},

	/**
	 * Validar el nombre del Profesor
	 * */
 	isValidEmail(nombre){
 		try{
 			if (typeof pass !== "string") throw Error("El formato de Nombre no valido");
 			if (nombre.trim().length < 4)  throw Error("El nombre es demasido corto");
 			
 			 	const regex_nme = /^[a-zA-ZÀ-ÿ\s]+$/;
 			if(!regex_nme.test(nombre)){
 			 	throw new Error("El nombre solo debe contener Letras");
 			 		return true;
 			}
 		}catch(error){
 			console.error('[ValidacionContrasena] →',error.message);
 			 return false;
 		}
 	},

 	/*Verificar si el perfil del Profesor existe*/

 	isDuplicatedTeacher(email, listaProfesores){
 		try{
 			if (!this.isValidEmail(email)) return false;
      		   const duplicado = listaProfesores.some((p) => p.email === email);
     	     if (duplicado) {
     	     	 throw new Error("Ya existe un profesor con este correo electrónico");
     	          return true;
     	     }
 		}catch(error){
 			console.error('[ValidacionPerfilDuplicado] →',error.message);
 			 return false;
 		}
 	},

 	/** 
 	 * Control de cantidad de actualizaciones (7) */
 	canUpdateProfile(vecesAcutalizado){
 	 	 try{
 	 	 	 const LIMITE = 7;
 	 	 	  if (vecesAcutalizado>= LIMITE) {
 	 	 	  	 throw new Error("Haza alcanzado el límite de 8 actualizaciónes del perfil");
 	 	 	  	 return true;
 	 	 	  }
 	 	 }catch(error){
 	 	 	 console.warn("[ValidacionActualizaciónProfesor] → ", error.message);
 	 	 	  return false;
 	 	 }
 	},
 	/**
 	 * Validar la quota maxima de registro del Rol Profesor
 	 *  **/
 	checkQuotaLimit(totalActual){
 		try{
 			const LIMIT_TEACHER = 140;
			if (totalActual  >= LIMIT_TEACHER){
			  	 throw new Error("El límite de profesores ha sido alcanzado(80)");
			  		return true;
			}
		}catch(error){
			console.warn('[validacionCuotaProfesor] → ', error.message);
			 return false;
		}
 	},

 	/** 
 	 * Validacion y manejo de error con Gmail*/
 	async handleGmailErrors(error){
 		console.error("[ErrorGmailRegistroProfesor]→ ",error );
 		let mensaje = "No fue posible registra tu cuenta de Estudiante mediante Gmail.";

 		if (error.code === "auth/popup-closed-by-user") {
 			 mensaje += "El usuario cerró la ventana antes de completare el inicio de sesión.";
 		}else if (error.code === 'auth/account-exists-with-different-credential') {
 			 mensaje+= "Este correo ya está registrado con otro método de autentificación.";
 		}else {
 			mensaje+= "Por favor, intente de nuevo mas tarde.";
 		}

 		 alert(mensaje);
 		return false;
 	},

 	/**
 	 * Validar cambio de contrasenia por antiguedad
 	 * */
 	sugerirCambioPassword(fechaUltimoCambio){
 	  	 	try{	
 	  	 	 if (!(fechaUltimoCambio instanceof Date)) throw new Error('La fecha no es valida');
 	  	 	   const today = new Date();
 	  	 	    const meses = (today.getFullYear() - fechaUltimoCambio.getFullYear()) *12 +
 	  	 	    			  (today.getMonth() - fechaUltimoCambio.getMonth());
 	  	 	    if (meses >=6 meses<= 8) {
 	  	 	    	return "Sugerencia: Cambia tu contraseña para mantener tu cuenta segura";
 	  	 	    } else if(meses=== 9){
 	  	 	    	return "Advertencia: La contraseña debe cambiarse pronto para evitar el cierre de sesion";
 	  	 	    }  else if (meses>= 10) {
 	  	 	    	throw new Error("La sesión ha sido cerrada. El Cambio de contraseña es OBLIGATORIO.");
 	  	 	    }
 	 		    return "";
 	  	 	}catch(error){
 	  	 		console.error("[ValidaciónCambioContrasenia] →", erro.message);
 	  	 		 return error.message;
 	 	 	}
 	},
 };