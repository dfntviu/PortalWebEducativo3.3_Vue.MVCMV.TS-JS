export type UserRole = 'student' | 'teacher';

 export interface Profile {
 	uid: string;
 	uid_profe: string;
 	nombre: string;
 	apellidos: string;
 	email: string;
 	role: UserRole;

 	telefono?: string;
 	activo?: boolean;
 	createdAt?: Date | Timestamp;
 	updateAt?: Date | Timestamp;

 	materias?: string[];
 	departamento?: string;
 	especialidad?: string;
 }
    //new (any thougth)
   export interface Notification {
     id: string;
     title: string;
     message: string;
     timestamp: number;  //unix timestamp
     read: boolean;
   }


 export interface ProfilePhotoOptions {
  /** Si se debe subir una foto **/
  uploadPhoto: boolean;
  /**  Archivo de foto a subir (solo si uploadPhoto es true)**/
  photoFile?: File;/**
   * URL de foto existente (para preview) **/
  photoURL?: string;
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

export interface Material {
      id: string;
      titulo: string;
      descripcion: string;
      autorNombre: string;
      autorEmail: string;
      autorId: string;
      estado: MaterialStatus;
      fechaCreacion?: Date;
}
   export interface Comentario {
    id: string;
    mensaje: string;
    destacado: boolean;
    fecha: Date;
  }

  export interface TipoDocumento {

  }