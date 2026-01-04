export interface Material {
      id: string;
      titulo: string;
      descripcion: string;
      autorNombre: string;
      autorEmail: string;
      autorId: string;
      estado: MaterialStatus;
      fechaCreacion: Date;
      fechaActualizacion?: Date;
      fechaAprobacion?: Date;
      archivoURL: string;
      archivoNombre?: string;
      archivoTipo?: string;
      categoria: string;
      tags: string[];
      tamanioBytes: number;
      moderadorId?: string;
      moderadorNombre?: string;
      visitas?: number;
      descargas?: number;
    }

		
	export type MaterialStatus = 'aprobado' | 'rechazado' | 'pendiente';
	
	/* ═════════════════════════*/
	/* 		TIPOS P/MATERIALES*/
	/* ═════════════════════════*/

   export interface MaterialReport extends Omit<Material, 'tamanioBytes'> {
   	  tamanioMB: number;
   	  recientemente_aprobado: boolean;
   }

   export interface ReportData {
   	  semanaPasada: MaterialReport[];
   	     mesPasado: MaterialReport[];
   	  totalSemanaPasada: number;
   	  totalMesPasado: number;
   }

   export interface DataRange {
   	  comienzo: Date;
   	  fin: Date;
   }

    export type ReportPeriod = 'week' | 'month' | 'custom';

     export interface ReportFilters {
     	  periodo: ReportPeriod;
     	  fechaRango: DataRange;
     	  categoria?: string;
     	  estado?: MaterialStatus;
     	  autorId?: string;
     	}

     export interface ReporteEstadisticas {
      	  totalMateriales: number;
      	  aprobados: number;
      	  rechazados: number;
      	  pendientes: number;
      	  aprobados: number;
      	  categorias: Record<string, number>;
      	  tamanioPromedioMB: number;
      	  tamanioTotalMB: number;
      	  recientementeAprobados: number;
      	  archivosGrandes: number; //>5MB
      }

      /**
 		* ══════════════════════════════════════════
 		*   TIPOS PARA TOASTS/NOTIFICACIONES
 		* ══════════════════════════════════════════
 	  */


 	 enum ToastType {
	 	 SUCCESS = 'success'
	 	 ERROR = 'error'
	 	 WARNING = 'warning'
	 	 INFO = 'info'
 	 }	

 	 enum ToastPosition {
 	 	TOP_RIGTH;
 	 	TOP_LEFT;
 	 	TOP_CENTER;
 	 	BOTTOM_RIGTH;
 	 	BOTTOM_CENTER;
 	 }

 	 export interface ToastOptions {
 	 	titulo:
 	 	mensaje:
 	 	tipo:
 	 	duracion:
 	 	posicion:
 	 	desestimable:
 	 	icono:
 	 	onClose:
 	 }

 	 export interface ToastType extends ToastOptions {
 	 	id: string;
 	 	timestamp: Date;
 	 	isVisible: boolean;
 	 }


 	/**
 	 * ══════════════════════════════════════════
 	 *      TIPOS PARA USUARIOS (para el modal de reportes- [Welcomes- Vws-Bienvenida])
 	 * ══════════════════════════════════════════*/ 	
 	 export UserRole = 'alumno' | 'profesor';  /*| 'admin';*/


 	 	export interface UserProfile {
  			uid: string;
  			name: string;
  			apellido: string;
  			email: string;	
  			role: UserRole;
  			carrera?: string;
  			numCuenta?: string;
  			// photoURL?: string;
  			createdAt: Date;
  			lastLogin?: Date;	
	   }
	