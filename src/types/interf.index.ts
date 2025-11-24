  interface Material {
  	 uid: string;  //id del material
  	 titulo: string;  //nombre/titulo del material
  	 description?: string;  //descripcion opcional
  	 autor: Profile;  //autor que subió el material
  }
    /*26/10/25*/
    interface MaterialRenovado {
      uid: string;    
      titulo: string;  
      // news
      description?: string;   
      archivoURL?: string | null;
      fechaOrigen?: Date| null
      // end_news
      autor: Profile;  
    }
  
  interface AlumnoUser {
      name: string;
     lname: string;
     email: string;
     password: string;
     numCuenta: string;
     username: string; 
      role: "alumno";
   }

  export interface ProfesorUser {
      name: string;
     lname: string;
     email: string;
     password: string;
     numCuenta: string;
     username: string; 
      area: string;
      role: "profesor";
   }
  
  interface Notification {
  	 id: string;
  	 title: string;
  	 message: string;
  	 timestamp: number;  //unix timestamp
  	 read: boolean;
  }
    // Relación entre el Alumno y un material (aprobación, moderación, etc.)
  interface Moderation {
    id_material: string; //id del material relacionado
    id_autor: string;   //id del autor(perfil del Alumno)
    snapshot:  'adm_materials' | 'alumno';  // estado/origen de la relación
    fecha: Date| number  // fecha de moderación o tiemstamp
    criterio: boolean;   // true = aprobado, false = rechazado
        //correction-2 en Fecha
       // snapshot:  'adm_materials' | User.value='alumno';
  }
    // # Nueva agregada(25/Sep/25)
  interface Comentario {
    id: string;
    mensaje: string;
    destacado: boolean;
    fecha: Date;
  }

   interface Permissions {
     puedeSubirMaterialEducAlumno: boolean;
     puedeVisualizarMaterialesAlumno: boolean;
     puedeSubirMaterialesProffesor: boolean;
     puedeAccederVistasAlumno: boolean;
     puedeAccederVistasProffesor: boolean;
     ViewSubirMaterialPDFAlumno: boolean;
     ViewAdmMaterialesPDFsPorSession: boolean;
     VistaBienvenidaProffesor: boolean;
     VistaBienvenidaAlumno: boolean;
   }

   // export type ProfileRole = AlumnoUser | ProfesorUser

   /*interface BaseUser {
     name: string;
     lname: string;
     email: string;
     password: string;
     numCuenta: string;
     username: string; //new a condition
     role: "alumno" | "profesor"; /*| "admin";
  }*/

    // Profile del Estudiante/Profesor se extiende dese User
   /* interface ProfileUser extends BaseUser {
      role: "profesor";
      area: string; // area existe y es Obligatorio de Profesor
    }*/
  


       // # Agregada recientemente, para trabajar entre el conre de aprobacion y relacion engtre amnas entidades(alumno-materiales, sust. por herencia de la Ln.28)
    /*interface Profile {
  	   uid_prof: string;
  	   name: string;
  	   email: string;
  	   role?: string;
  	   autor: User.value = 'alumno' | 'professor';  [correction-1]
    }*/