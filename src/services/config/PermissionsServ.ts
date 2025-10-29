/** Prop: Se encarga de gestionar los permisos por cada rol de usuario[es decir: (quien tiene
 * permitido ver o no ver las vistas segun corresp. la naturaleza del rol)] */

   import {Permissions} from '@/types/interf.index.js';

 /*interface Permissions {
 	puedeSubirMaterialEducAlumno: boolean; puedeVisualizarMaterialesAlumno: boolean; puedeSubirMaterialesProffesor: boolean;
 	puedeAccederVistasAlumno: boolean; puedeAccederVistasProffesor: boolean; ViewSubirMaterialPDFAlumno: boolean;
 	ViewAdmMaterialesPDFsPorSession: boolean; VistaBienvenidaProffesor: boolean; VistaBienvenidaAlumno: boolean; }*/

  export class PermissionsService { 
   	   permisorPorRol: Record<Role, Permissions> = {
   	   	 alumno:{
          pudeModerarComentarios: false,
          puedeVerMaterialIndividual: true,
          puedeRegistrarCuentaAlumno: true,  //*
          puedeRegistrarCuentaProfesor: false, //*
          puedeGestionarMateriales: true, //*
          puedeGestionarMateriales_Alumno: false, //*
          puedeModerarComentarios: false,
          puedeSubirMateriales: false,
          puedeVisualizarBienvenidaRole2: false,
          puedeVisualizarBienvenidaRole1: true
   	   	 },

   	   	 professor:{
     	   	pudeModerarComentarios: true, //Teacher
          puedeVerMaterialIndividual: false,  //Student
          puedeRegistrarCuentaAlumno: false,  //Student
          puedeRegistrarCuentaProfesor: true,  //Teacher
          puedeGestionarMateriales: false, //Student
          puedeGestionarMateriales_Alumno: true, //Teacher
          puedeModerarComentarios: true,  //Teacher
          puedeSubirMateriales: true, //Student
          puedeVisualizarBienvenidaRole2: true,  //Teacher
          puedeVisualizarBienvenidaRole1: false
   	   	 },

   	   	 default: {
   	   	 	pudeModerarComentarios: false,
          puedeVerMaterialIndividual: false,
          puedeRegistrarCuentaAlumno: false,
          puedeRegistrarCuentaProfesor: false,
          puedeGestionarMateriales: false,
          puedeGestionarMateriales_Alumno: false,
          puedeModerarComentarios: false,
          puedeSubirMateriales: false,
          puedeVisualizarBienvenidaRole2: false,
          puedeVisualizarBienvenidaRole1: false
   	   	 }
   	   };

   	    constructor(private role:Role) {}
          // Obtener los permiso por rol
     	    getPermission(): Permissions{
     	   	  return this.permisorPorRol[this.role]|| this.permisorPorRol['default'];
     	     }
           // Verify si se tiene el permiso esp.
     	    hasPermission(permissionKey: keyof Permissions): boolean {
     	   	   this.getPermission()[permissionKey] || false;
     	    }
          // Efectuar cambio
     	    setRole(role: Role){
     	   	   this.role = role;
     	    }
   }
   // Revisara materialStore.js(genero la compilacion d TS)