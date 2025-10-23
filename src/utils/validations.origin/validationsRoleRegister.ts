 import {getAuth, fetchSignInMethodsForEmail} from 'firebase/auth';  //Back
 import {socialUser, socialProfile, error, message, loading, profileStore} from '@/Teacher/views/viewRegisterTeacher.vue';  //Vista

  /** Fecha: 09/Oct/2025
   * Autor: Daniel Gómez 
   * Validaciónes de registro por Rol
   *  Estructura: validationsRoleRegister = {common, teacher, student, dispatchValidation()}
   * */
  export const validationsRoleRegister = {
  	// VALIDACIONES COMUNES(AMBOS ROLES)
  	common:{
  		// Validar que el email contenga formato valido
  		isValidEmail(email:string):boolean{
  			if (!email) {
  			  console.error('No hay correo, el campo está vacío');
  			    return false;
  			}

  			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  			if(regex.test(email.trim)){
  				console.warn('El correo no es válido');
  				 return false;
  			}
  		},
  		 
  		 // Validar que el email ya este registrado en Firebase
  		async isEmailRegistered(email:string): Promise<boolean>{
  		 	try{
  		 		const autor = getAuth();
  		 		const methods = await fetchSignInMethodsForEmail(autor,email);
  		 		  if (methods.length > 0) {
  		 		  	 console.warn("El Correo: ",email,"ha sido registrado previamente ");
  		 		  	   return true;
  		 		  }
  		 		   return false;
  		 	}catch(err){
  		 	   console.error('Error al verificar el correo en Firebase',err);
  		 	    return false;
  		 	}
  		},

  		 // Confirmar la coincidencia de contrasenias
  		isPasswordConfirmed(contrasena: string, confirm:string){
  			if (contrasena !== confirm) {
  				console.error('Error: Las contraseñas no coinciden');
  				 return false;
  			}
  			return true;
  		},

  		// Validar que la contrasena sea segura(minuscula o mayuscula, al menos 8 caracteres)
  		isSecurePassword(passwd: string): boolean{
  			if (!passwd) return false;
  			  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{7,}$/;
  			   if (!regex.test(passwd)) {
  			   	  console.error('La Contraseña es débil: Requiere una mayuscula, una minuscula, un número y por lo menos un total'
  			   	  	 			'de 7 caracteres.');
  			   	     return false;

  			   }
  			    return true;
  		},
  		// Nombre valido (minimo 4 caracteres mayuscula y minuscula)
  		hasValidateName(name: string): boolean{  //Juan|Rosa|Jael|Anel|etc
  			if (!name || name.length < 4) {
  				console.warn("Error: El nombre debe contener al menos 4 caracteres");
  				 return false;
  			}
  			 let mayus_regex = /^[A-ZÁÉÍÓÚÑ]/;
  			if(!mayus_regex.test(name.trim)){
  				console.warn('El nombre debe Comenzar con la Primera Mayuscula')
  				return false;
  			}
  			return true;
  		},
  		// Verificar la longitud del apellido
  		hasValidateSurname(surname: string): boolean {
  			if (!surname || surname.length < 5) {
  				console.warn("El apellido debe tener al menos 5 caracteres.");
  				 return false;
  			}
  			let mayus_regex = /^[A-ZÁÉÍÓÚÑ]/;
  			if(!mayus_regex.test(surname.trim)){
  				console.log('El Apellido debe Comenzar con Mayuscula');
  				 return false;
  			}
  		   return true;
  		},
  		// Terminos y condiciones para comenzar a usar el Portal
  		aceptarTerminosYCondiciones(accepted: boolean): boolean{
  			if (!accepted) {
  				alert('Deberás aceptar los términos y condiciones. Recuerda que tú almacenamiento en el Cloud es un estimado de 1.5Gb'
  					  'anualmente el unico formato aceptado es PDF');
  				 return false;
  			}
  		   return true;
  		},
  	      // Verificar que los campos no esten vacíos
	  	hasEmptyFields(obj: Record<string,any>):boolean{
	  	 	const empty = Object.entries(obj).filter(
	  	 		([key,value]) => value === "" || value === null || value === undefined
	  	 	);
	  	 	if (empty.length > 0) {
	  	 		console.log('Los campos estan vacíos', empty.map(([k])=>k));
	  	 		 return true;
	  	 	}
	  	 	return false;
	  	},
	  	
	  	/* NUEVO: Validar la seleccion de tipo de Registro (paneles dinamicos) */
	  	isValidRegisterType(tipoRegistro: string): boolean {
	  		alert(!tipoRegistro){
	  			alert('Por favor, Debe de seleccionar un tipo de Registro: (Profesor o Alumno).');
	  			 return false;
	  		}
	  		return true;
	  	}

  	}, // #End_Common	

  	/*  VALIDACIÓNES PARA EL PROFESOR */
  	teacher:{
  		// Validar numero de cuenta, el numero de digitos es 7. Se compone [11xxxxxx - 29xxxxxx]  
  		hasValidNumCuenta(numCuenta: string): boolean{
  			const regex = /^[0-9]{7}$/;
  			
  			if (!regex) {
  				console.error('Error el numero de Cuenta contiene 7 digitos');
  				 return false;
  			}
  			return true;

  			const n = parseInt(numCuenta);
  			if (n<1100000 && n >2900000) {
  				console.error('Error el numero de cuenta esta fuera del rango permitido');
  				 return false;
  			}
  			return true;
  		},
  		// El area academica sera opcional, pero si debera de verificarse
  		hasValidAcademicArea(area: string): boolean{
  			if (!area) return true;
  			 const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s] {5,}$/;  //se permite la acentuacion en mayusculas
  			    if (!regex.test(area)) {
  			  	  console.log('Area academica no existente, La cantidad miníma es de 5 caractéres');
  			  	    return false;
  			    }
  			  return true;
  		}

  		 /** Menu de validaciones totales: Formulario Profesor **/
  		validateTeacherForm(data: any): boolean{
  			const c = validationsRoleRegister.common;

  			if(!c.hasValidateName(data.nombre)) return false;
  			if(!c.hasValidateSurname(data.apellido)) return false;
  			if(!c.isValidEmail(data.email)) return false;
  			if(c.hasEmptyFields(data)) return false;

  			if (data.tipoRegistro === 'manual') {
  				if (!c.isSecurePassword(data.passwd)) return false;
  				if(!c.isPasswordConfirmed(data.passwd,data.confirm)) return false;
  			}

  			if(!this.hasValidNumCuenta(data.numCuenta))   return false;
  			if(!this.hasValidAcademicArea(data.area)) return false;
  			if(!c.aceptarTerminosYCondiciones(data.accepted))  return false;

  			// if (c.isValidRegisterType(data.tipoRegistro)) return false; (-verify-)

  			 return true;
  		}
  	}, // #End_Role-Teacher

  	/* VALIDACIONES PARA EL ALUMNO(ESTUDIANTE) */
  	student:{
  		 // Correo institucional UAEMEX
  		isCollegeEmail(email: string):boolean {
  			const regex = /^[a-zA-Z0-9._%+-]@alumno\.uamex\.mx$/;
  			if (regex.test(email.trim())) {  //inicialmente estan invertidas las booleanos, cambiar a msg de error
  				console.log("Bien: Esta usando el correo institucional: @alumno.uaemex.mx");
  				  return true;
  			}
  			return false;
  		},

  		 // Validar dominio permitido (evita dominios externos)
  		isInvalidDomain(email: string): boolean {
  			const invalid = /(outlook.com|live\.com|hotmail\.com|yahoo\.com(com|mx))$/;
  			if (invalid.test(email)) {
  				console.log("El dominio de correo no permitido para alumnos");
  				 return false;
  			}
  			return false;
  		},

  		 // Verficar un rango de Edad razonable
  		hasValidateAge(age?: number): boolean {

  			if (!age) return true;  
  			if (age < 17 || age > 66) {
  				console.warn("La Edad está fuera del rango razonable (18-65 años).");
  				 return false;
  			}
  		  return true;
  		},	
  		
  		 /* NUEVO: Evitar la duplicidad de numero de Cuenta */
  		isUniqueAccount(numCuenta: string, existsAccounts: string[]){
  			if (existsAccounts.includes(numCuenta.trim())) {
  				alert('El número de Cuenta ya fue registrado por otro usuario');
  				  return false;
  			}
  			return true;
  		}

		 /* NUEVO: c. Verificacion - Validar aceptación de términos & condiciónes Storage*/
  		accepterTermsStorage(checked: boolean): boolean{
  			if (!checked) {
  				alert('Debe de aceptar las condiciónes de Almacenamiento');
  				 return false;
  			}
  			return true;
  		}

		 /* NUEVO: El campo Apellido paterno es obligatorio */
  		hasLastName(apellido: string): boolean {
  			if (!apellido || apellido.trim() === '') {
  				alert('Es Obligatorio: Ingresar el su Apellido Paterno');
  			}
  			return false;
  		}

  		 // Validar el anio de ingreso en la Facultad de Ingenieria UAEMex
		hasValidEnrollmentYear(email: string): boolean {
			 const match = email.match(/(\d{4})[a-zA-Z]?\d*@alumno\.uaemex\.mx$/);
			  
			if(!match) return true;
			
			 const year = parseInt(match[1]); 
			 const currentYear = new Date().getFullYear();

				if (year < 2019 || year > currentYear) {
					console.warn("El año de ingreso no es válido");
					 return false;
				}  // del 2025 en adelante
			return true;
		},

		 // Validacion Principal del formulario del Alumno
		validateStudentForm(data: any): boolean {
			const c = validationsRoleRegister.common;

			if (!c.hasValidateName(data.nombre)) return false;
			if (!c.hasValidateSurname(data.apellido)) return false;
			if (!this.isCollegeEmail(data.email)) return false;
			if(!this.isInvalidDomain(data.email))return false;
			if (!c.isSecurePassword(data.password)) return false;
			if (!c.isPasswordConfirmed(data.password,data.confirmPassword)) return false;
			if (!this.hasValidEnrollmentYear(data.email)) return false;
			if (!this.hasValidateAge(data.acceptedTerms)) return false;
			// invoque methods news (for to review)
			if(this.isUniqueAccount(data.numCuenta, data.isRegister)) return false;
			if(this.hasLastName(data.apellido)) return false;
			if(this.accepterTermsStorage(data.verfyTerms)) return false;

			// if (c.isValidRegisterType(data.tipoRegistro)) return false; (-verify-) (si no cambio el disenio descomentar)

			return true;
		}	
  	}, // #End_Role-Student,
  	  /** * COORDINADOR de validaciones según corresponda su ROL* **/
  	async dispatchValidation(role: "profesor" | "alumno", formData: any): Promise<boolean> {
  		
  		if (role === 'profesor') {
  			return this.teacher.validateTeacherForm(formData); 
  		} else if (role === 'alumno') {
  			return this.student.validateStudentForm(formData);
  		} else {
  			console.error("El Rol es desconocido: ",role);
  			 return false;
  		}
  	}
  } // # end_validations_Rr;