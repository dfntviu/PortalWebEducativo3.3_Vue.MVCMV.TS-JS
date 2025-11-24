  interface MaterialRv2 {
      uid: string;    
      titulo: string;  
      // news
      description?: string;   
      archivoURL?: string | null;
      fechaOrigen?: Date| null
      // end_news
      autor: Profile;  
    }
    // Base: Usuario General
  interface User {
  	 uid?: 'alumno'| 'profesor';
     username: string; 
  	 name: string;
     lname: string;
  	 email: string;
  	 role?: "alumno" | "profesor" | "admin";
  }
    // Interfaz heredada general
  interface Profile extends User {
    acct_number: string;
    password_pr: string;
  }
  
   // #Int. para perfil de Alumno
   interface ProfileStudent extends Profile {
      uid: 'alumno';
      role: 'alumno';
   }
     // # Int. para perfil de Profesor
   interface ProfileTeacher extends Profile {
      uid: 'profesor';
      role: 'profesor';
      area: string;
   }

  // Int. para perfil de Profesor
  interface Notification {
  	 id: string;
  	 title: string;
  	 message: string;
  	 timestamp: number;  //unix timestamp
  	 read: boolean;
  }
    // Relación entre el Alumno y un material (aprobación, moderación, etc.)
  interface Moderation {
    id_material: string; 
    id_autor: string;   
    snapshot:  'adm_materials' | 'alumno';  // estado/origen de la relación
    fecha: Date| number  
    criterio: boolean;   
       // snapshot:  'adm_materials' | User.value='alumno';
  }
    // # New date 25/Sep/25
  interface Comentario {
    id: string;
    mensaje: string;
    destacado: boolean;
    fecha: Date;
  }
  
  interface Permissions {
    pudeModerarComentarios: boolean;
    puedeVerMaterialIndividual: boolean;
    puedeRegistrarCuentaAlumno: boolean;
    puedeRegistrarCuentaProfesor: boolean;
    puedeGestionarMateriales: boolean;
    puedeGestionarMateriales_Alumno: boolean;
    puedeModerarComentarios:boolean;
    puedeSubirMateriales:boolean;
    // puedeVisualizarBienvenidaRole2: boolean;
    // puedeVisualizarBienvenidaRole1: boolean;
   }
     /*puedeSubirMaterialEducAlumno: boolean;
     puedeVisualizarMaterialesAlumno: boolean;
     puedeSubirMaterialesProffesor: boolean;
     puedeAccederVistasAlumno: boolean;
     puedeAccederVistasProffesor: boolean;
     ViewSubirMaterialPDFAlumno: boolean;
     ViewAdmMaterialesPDFsPorSession: boolean;
     VistaBienvenidaProffesor: boolean;
     VistaBienvenidaAlumno: boolean;*/
   
   //  Example
  /*const profesorProfile: ProfileProfesor = {
     uid: 'profesor',
     username: 'mgarcia',
     name: 'María',
     lname: 'García',
     email: 'maria.garcia@example.com',
     role: 'profesor',
     acct_number: 'P98765',
     password_pr: 'claveprof2025',
     area: 'Prog. Paralela'
  }*/
  /* Trasladar la interfaz de permisos de la version 1 */
  /*26/10/25*/
  // interface Material {
  	// uid: string;  id del material
  	// titulo: string;  nombre/titulo del material
  	// description?: string;  descripcion opcional
  	 //autor: Profile;  autor que subió el material
  // }
