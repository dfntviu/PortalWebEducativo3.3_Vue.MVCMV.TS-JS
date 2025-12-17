
   export interface Permissions {
	   esposibleModerarComentarios: boolean;
      esposibleVerMaterialIndividual: boolean;
      esposibleRegistrarCuentaAlumno: boolean;
      esposibleRegistrarCuentaProfesor: boolean;
      esposibleGestionarMateriales: boolean;
      esposibleGestionarMateriales_Alumno: boolean;
      esposibleModerarComentarios: boolean;
      esposibleSubirMateriales: boolean;
   }
    
    export type UserType = 'active' | 'innactive';  
    export type SessionStatus = 'active' | 'innactive';


   export interface Role{
      uid: string;
       nombre: string;
      apellido: string;
      tipoUsuario: UserType;
      permisos: Permissions;
   }

   export interface CurrentUser{
      fecha: Timestamp;
       user: Role;
      dispMateriales: boolean;
      numberMaterials: number | null;
      tipoSesion: SessionStatus;
   }
