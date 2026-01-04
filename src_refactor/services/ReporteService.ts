 import { collection, query, where, getDocs, Timestamp, orderBy} from 'firebase/firestore';
 import { db } from '@/config/itializeFirebaseConf';
 import { ServiceFormatMaterials } from './ServiceFormatMaterials';
   import type { FormatType } from '@/types/interfces_formato.ts';
   import type { Material } from '@/types/interfces_formato2.ts';
   import JSZip from 'jszip';
   import  { saveAs } from 'file-saver';

 /**
  * ════════════════════════════════════════
  *    	INTERFACES Y TIPOS
  * ════════════════════════════════════════
  */

 interface MaterialReport {
 	id: string;
 	titulo: string;
 	descripcion: string;
 	autorNombre: string;
 	autorEmail: string;
 	autorId: string;
 	estado: 'approved'| 'rejected' | 'pending';
 	fechaDeCreacion: Date;
 	archivoURL: string;
 	archivoNombre?: string;
 	categoria: string;
 	tags: string[];
 	tamanioMB: number;
 	recientemente_aprobado: boolean; 
 }

 interface ReportData {
 	semanaPasada: MaterialReport[];
 	mesPasado: MaterialReport[];
 	totalSemanaPasada: number;
 	totalMesPasado: number;
 }

 interface DateRange {
 	comienzo: Date;
 	fin: Date;
 }

 /**
  *  ════════════════════════════════════════
  *       CLASE PRINCIPAL DEL SERVICIO
  *  ════════════════════════════════════════
  * */
   class ReportService {
   	   private readonly COLLECTION_NAME = 'materials';
   	   private readonly RECENT_APPROVAL_DAYS = 7;


   	   /**
   	    * ──────────────────────────────────────────
   	    *   OBTENCION DE DATOS
   	    * ──────────────────────────────────────────
   	    * */

   	   /**
   	    * Obtener Materiales por rango de fechas según el rol
   	    * */
   	  async obtenerMaterialesRango(
   	   	  role: 'alumno' | 'profesor',
   	   	  userId?: string
   	   	): Promise <ReportData> {
   	   	  	try{
				     const rangoSemanal = this.getDateRange(7);
				     const rangoMensual = this.getDateRange(30);

				    // Obtener materiales
				    const [semanaPasada, mesPasado] = await Promise.all([
                  this.fetchMaterialByRange(rangoSemanal, role, userId),
                  this.fetchMaterialByRange(rangoMensual, role, userId)
                ]);
                  return {
                    rangoSemanal,
                    rangoMensual,
                    totalSemanaPasada: semanaPasada.length,
                    totalMesPasado: mesPasado.length
                  };

   	   	  	}catch(error){
   	   	  		console.error('Error al obtener el material por Rango',error);
   	   	  		throw new Error('No fue posible, obtener los materiales al Reporte');
   	   	  	}
   	   }

          /**
           * Obtener rango de fechas desde hoy hacia atras
           * */
         private async obtenerFechaRango(dias: number): DateRange {
            const  fin = new Date();
            const  inicio = new Date();

            inicio.setDate(inicio.getDate() - dias);
            inicio.setHours(0 0 0 0);
            fin.setHours(23, 59, 59, 999);


            return { inicio, fin };
         }


         /**
          * Buscar Materiales en Firestore segun rango y rol
          * */
         private async recuperarMaterialesPorRango(rango: number, rol: 'alumno' | 'profesor', usuarioId?: string): 
         Promise<MaterialReport[]> 
         {
            try{
                 const  materialsRef = collection(db, this.COLLECTION_NAME)

                 let q;


                 if (role === 'alumno' && usuarioId) {
                      // Alumnos solo ven sus propios materiales
                     q = query(materialsRef,
                           where('autorId', '==', usuarioId),
                           where('fechaDeCreacion' , '>=', Timestamp.fromDate(rango.comienzo),
                           where('fechaDeCreacion',  '<=', Timestamp.fromDate(rango.fin),
                              orderBy('fechaDeCreacion', 'desc')
                              )
                            
                        );
                 } else if (rol === 'profesor') {
                     q = query(
                           materialsRef,
                           where('estado', 'in', ['approved','pending']),
                           where('fechaDeCreacion', '>=', Timestamp.fromDate(rango.comienzo)
                              orderBy('fechaDeCreacion', 'desc')
                        );
                 } else {
                     q = query( materialsRef,
                           where('fechaDeCreacion', '>=', Timestamp.fromDate(rango.comienzo)),
                           where('fechaDeCreacion', '<=', Timestamp.fromDate(rango.fin)),
                              orderBy('fechaDeCreacion', 'desc')
                        );
                 }

                  const snapshot = await getDocs(q);

                   return snapshot.docs( docs => {
                                  const data = doc.data() 
                                    return this.transformarMaterialEnReporte(doc.id, data);
                           });
            }catch(error){
               console.error('Error al obt. los materiales por Rango');
               throw error;
            }
         }

         /**
          * Tranformar documento de Firestore a Reporte Material
          * */
         private transformarMaterialEnReporte(id: string, data: any): MaterialReport {
            const fechaDeCreacion = data.fechaDeCreacion?.toDate() | new Date();
            const fechaAprobacion = data.fechaAprobacion?.toDate() | new Date();

            const recentlyApproved = this.esRecientementeAprobada(fechaAprobacion);

             return {
                id,
                titulo: data.titulo || 'Sin Título',
                descripcion: data.descripcion || '',
                autorNombre: data.autorNombre || '',
                autorEmail: data.autorEmail || '',
                autorId: data.autorId || 'pendiente',
                fechaDeCreacion,
                archivoURL: data.archivoURL || '' , 
                archivoNombre: data.archivoNombre || '', 
                categoria: data.categoria || 'Sin categoría',   
                tags: Array.isArray(data.tags) ? data.tags : [],
                tamanioMB: data.tamanioMB ? data.tamanioBytes / (1024 * 1024) : 0;
                recientemente_aprobado: recientemente_aprobado
             };
         }

         private esRecientementeAprobada(fechaAprobacion?: Date): boolean {
            if (!fechaAprobacion) return false;

            const ahora = new Date();

            const diferentesDias = Math.floor(
                (ahora.getTime() - fechaAprobacion.getTime()) / ( 1000 * 60 * 60 * 24)
               );

              diferentesDias <= this.RECENT_APPROVAL_DAYS;
         }


         async exportarAPDF(data: MaterialReport[], nombreArchivo: string): Promise<void> {
            try{
               
               const materiales = this.convertirReporteAMaterial(data);


               const resultado = await ServiceFormatMaterials.classifyForFormat(materiales, 'pdf', nombreArchivo);

                  if (!resultado.success) {
                      throw new Error(resultado.message);
                  }


            }catch(error){
               console.error('Error al exportar el Reporte de los últimos materiales a PDF', error);
                throw new Error('No fue posible generar el archivo PDF');
            }
         }

         async exportarAExcel(data: MaterialReport[], nombreArchivo: string): Promise<void>  {
            try{  
                  const materiales = this.convertirReporteAMaterial(data);

                  const resultado = ServiceFormatMaterials.classifyForFormat(materiales, 'xlsx', nombreArchivo);

                  if (!resultado.success) {
                     throw new Error(resultado.message);
                  }

            }catch(error){
               console.error('Error al exportar el Reporte de los últimos materiales a Excel', error);
                throw new Error('No fue posible generar el archivo Excel');
            }
         }


         async exportarADocx(data: MaterialReport[], nombreArchivo: string): Promise<void> {
            try{

               const materiales =  this.convertirReporteAMaterial(data);

               const resultado = await ServiceFormatMaterials.classifyForFormat(materiales, 'DOCX', nombreArchivo);

               if (!resultado.success) {
                   throw new Error(resultado.message)
               }

            }catch(error){
               console.error('Error al exportar el Reporte de los últimos materiales a DOCX', error);
                throw new Error('No fue posible generar el archivo en formato DOCX');
            }
         } 


         private convertirReporteAMaterial(reportes: MaterialReport[]): Material[] {
            return reportes.map( reporte => {
                id: report.id,
                titulo: report.titulo,
                descripcion: report.descripcion,
                autorNombre: report.autorNombre,
                autorEmail: report.autorEmail,
                autorId: report.autorId,
                estado: report.estado,
                fechaCreacion: report.fechaCreacion,
                archivoURL: report.archivoURL,
                archivoNombre: report.archivoNombre,
                categoria: report.categoria,
                tags: report.tags,
                tamanioBytes: report.tamanioMB * 1024 * 1024
            }) as Material[];
         }

         /**
          * Descarga de materiales de la semana como ZIP (unic. p/alumnos)
          * */
         async descargaSemanalMaterialesZIP(materialesZIP: MaterialReport[]): Promise<void> {
            try{

               if (!materiales.length) {
                   throw new Error('Ningún tipo de Material para su descarga');
               }

                const zip = new JSZip();
                const directorio = zip.folder('materiales-de-la_semana') as JSZip;

                // Descargar cada archivo y agregarlo a zip
                const downloandPromises = materiales.map(async (material, index) => {
                    try{
                       const respuesta =  await fetch(material.archivoURL);
                       const objDataIndiv = await respuesta.blob();

                          // Generar el nombre de archivo unico
                        const extension = materiales.archivoNombre?.split('').pop() || 'pdf';
                        const nombreArchivo = `${index + 1}_ ${this.sanitizarNombreArchivo(material.titulo)}.${extension}`;

                         directorio.file(nombreArchivo,objDataIndiv);

                    }catch(error){
                       console.error(`Error descargando: ${material.titulo}`, error);
                    }
               });

                await Promise.all(downloandPromises);

                const zipBlob = zip.generateAsync({ type: 'blob' });
                saveAs(zipBlob, `materiales-de-la_semana_ new_${Date().toISOString().split('T')[0]}.zip`);
            }catch(error){
               console.error(`Error descargando ${material.titulo}:`, error);
                throw new Error('No fue posible, generar el archivo ZIP');
            }
         }


         /**
          * Sanitizar el nombre del archivo
          * */
         private sanitizarNombreArchivo(nombreArchivo: string): string {
               return nombreArchivo
                .replace(/[^a-z0-9_-]/gi/, '_')
                .replace(/_+/g, '_')
                .substring(0,50);
         }

         /**
          *  ══════════════════════════════════════ 
          *         VALIDACIONES
          *  ══════════════════════════════════════*/

         /**
          *   Validar que los datos del reporte no esten vacios
          * */
         validarReportePorDia(data: MaterialReport[]): boolean {
             return Array.isArray(data) && data.length > 0;
         }

         /**
          *  Obtener formato recomendado segun la ctd de materiales
          * */
         obtenerElFormatoRecomendado(contador: number): FormatType {
            if (contador <= 20) return 'pdf';         //lectura inmediata
               if (contador <= 100) return 'docx';    // consigo la edicion del mat
                  return 'xlsx;'    //mejorar el analisis, si de graficos se trata
         }

         /**
          *  ══════════════════════════════════════ 
          *         EXPORTACION DEL SINGLETON
          *  ══════════════════════════════════════*/
         // convertirDeReport eAMaterial(reporetes: MaterialReport[], nombreArchivo: string): Promise<void> 
   }

   export const ReportService = new ReportService(); //sin clase, es r