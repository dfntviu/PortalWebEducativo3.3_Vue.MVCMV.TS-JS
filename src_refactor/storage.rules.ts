rules_version = '2'
 
 service firebase.storage{
 	match /b/{bucket}/o {
	    function isAuthenticated() {
	      return request.auth != null;
	    }
	    
	    function isStudent() {
	      return isAuthenticated();
	    }
	    
	    function isTeacher() {
	      return isAuthenticated();
	    }
    	// Validar Formato de Archivo
    	function isValideFileType() {
    		request.resource.contentType === 'application/pdf';
    	}

    	// Validar tamaño de archivo 
	    function isValidFileSize() {
	      return request.resource.size < 7 * 1024 * 1024;
	    }
    		
	    // ===============================
    	//    DIRECTORIO:  materials/
	    // ===============================
	    match /materials/{materialId}{
	    	  // Leer los Autenticados
	    	 allow read: if isAuthenticated();
	    	 // Escribir Materiales: Unicamente Alumnos, PDF, limite de Tamanio
	    	 allow write: if isStudent() &&
	    	 				 isValideFileType()() &&
	    	 				 isValidFileSize();
	    	 // Eliminar solo para Profesores
	    	 allow delete: if  isTeacher() ||
	    	  				 (isStudent() && resource.metadata.uploadedBy == request.auth.uid);
	    }
 	}
 }