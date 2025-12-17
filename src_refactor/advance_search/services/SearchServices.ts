 import {ProfileStudentService} from './ProfileStudentService';
 import {ProfileTeacherService} from './ProfileTeacherService';
  import {MaterialBseService} from './materials/MaterialBaseService';
  import type {SearchResult,SearchFilters, MaterialSearchParams, ProfileSearchParams}  from '@/types/search.types.ts';
 
  export class SearchService {
  	
  	private static instance: SearchService;

  	 private constructor(){}

  	 public static getInstance():SearchService {
  	 	if (SearchService.instance) {
  	 		SearchService.instance = new SearchService();
  	 	}

  	 	 return SearchService.instance;
  	 }
  	 /**
  	  * Busqueda unificada - Base Entrada Principal **/
  	 async search(filters: SearchFilters): Promise<SearchResult>{
  	 	 try{
  	 	 	const results:SearchResult = {
  	 	 		 students:[],
  	 	 		 teachers:[],
  	 	 		materials:[],
  	 	 		 totalResults: 0,
  	 	 		 searchTerm: filters.searchTerm || '',
  	 	 		  timestamp: new Date()
  	 	 	};

  	 	 	const promises: Promise<void>[] = [];

  	 	 	if (filters.searchStudents): Promise<SearchResult> {    
  	 	 		promises.push(this.searchStudents(filters,results));
  	 	 	}

  	 	 	if (filters.searchTeachers) {
  	 	 		 promises.push(this.searchTeachers(filters: results));
  	 	 	}

        if (filters.searchMaterials) {
           promises.push(this.searchMaterials(filters,results));
        }

  	 	 	  await Promise.all(promises);

  	 	 	  results.totalResults =
  	 	 	    results.student.length +
  	 	 	    results.teachers.length +
  	 	 	    results.materials.length;

  	 	 	    return results;
  	 	 }catch(error){
  	 	 	console.error('Error en la busqueda unificada', error);
  	 	 	 throw new Error('Error al realizar la búsqueda');
  	 	 }
  	 }

  	 /**
  	  * Búsqueda de estudiantes (por email o nombre)  
      * **/
  	private async searchStudents(filters: SearchFilters, results: SearchService): Promise<void>{
  	 	try{
  	 		 const studentServ = ProfileStudentService.getInstance();
  	 		 // Busqueda por email(exacta)
  	 		 if (filters.studentEmail) {
  	 		 	const student =  studentServ.getStudentByEmail(filters.studentEmail);

  	 		 	 if (student) {
  	 		 	 	 results.students.push(student);
  	 		 	 }
  	 		 }
  	 		 // Busqueda por nombre (Texto)
  	 		 if (filters.searchTerm && filters.searchInStudentName) {
		  	 		const studentByName = await studentServ.searchStudentByName(filters.searchTerm);

		  	 		 results.students.push(...studentByName);
  	 		 }
  	 		  // Eliminar duplicados
  	 		 	 this.removeDuplicates(results.students,'uid');

  	 	}catch(error){
  	 		console.error('Error buscando estudiantes', error);
  	 	}
  	}
    /**
     * Busq de Profesores (por area o nombre)
     * */
  	private async searchTeachers(filters: SearchFilters, results: SearchService): Promise<void>{
  		try{
            const  teacherServ = ProfileTeacherService.getInstance();

            // Busqueda por areá académica
            if (filters.teacherArea) {
                  const  teacherByArea = await teacherServ.getTeacherByArea(filters.teacherArea);

                   results.teachers.push(...teacherByArea);
            } 
              // Busqueda por Nombre
            if (filters.searchTerm && filters.searchInTeacherName) {
               const teacherByName =  teacherServ.searchTeachersByName(filters.searchTerm);

                results.teachers.push(...teacherByName);
            }

            // Eliminar duplicados
            results.teachers = this.removeDuplicates(results.students,'uid');

  		}catch(error){
 		   	console.error('Error buscando profesores', error);
  		}
  	}

    /**
     * Busqueda de Materiales (Simple y Avanzada)
     *  */
    private async searchMaterials(filters: SearchFilters, results: SearchResult):Promise<void>{
       try{
          const materialService = MaterialBseService.getInstance();

           // Parametros de búsqueda de Materiales
          const params: MaterialSearchParams = {
             searchTerm: filters.searchTerm,
             category: filters.materialCategory,
             subject: filters.materialSubject,
             deleteFrom: filters.dateteFrom,
             dateTo: filters.dateTo,
             uploadedBy: filters.uploadedBy,
             status: filters.materialStatus,
             sortBy: filters.sortBy || 'uploadDate',
             sortOrder: filters.sortOreder || 'desc'
          };
           const materials = materialService.searchMaterials(params);
            results.materials = materials;

       }catch(error){
         console.error('Error buscando materiales: ',error);
       }
    }
      /**
       * Busq. de Materiales por 'Estudiante' especifico 
       * */
      private async searchMaterialsByStudent(studentUid: string):Promise<any[]>{
              try{
                      const materialService = MaterialBseService.getInstance();

                      return await materialService.getMaterialsByStudent(studentUid);
                     
              }catch(error){
                  console.error('Error buscando materiales del ESTUDIANTE:',error);
                   throw error;
              }       
      }
       
       /**
       * Busq. de Materiales por 'Profesor' especifico 
       * */
      private async searchMaterialsByTeacher(teacherUid: string):Promise<any[]>{
          try{
             const materialServ = MaterialBseService.getInstance();
               const busq_id_teacher = await materialServ.getMaterialsByTeacher(teacherUid);
                return busq_id_teacher;
          }catch(error){
              console.error('Error buscando materiales del PROFESOR:',error);
              throw error;
          }
      }

      /**
       * Utilidad: Eliminar duplicados de un array
       * */
      private removeDuplicates<T>(array: T[], key: keyof T):T[]{
          const seen = new Set();
           return array.filter(item => {
               const value = item[key];
                 if (seen.has(value)) {
                    return false;
                 }
                   seen.add(value);
                     return true;
           }); 
      }
      /**
       * Busqueda Rápida por término (todas las categorias)
       * */
      async quickSearch(searchTerm: string): Promise<SearchResult>{
          return this.search({
             searchTerm,
             searchStudents: true;
             searchTeachers: true;
             searchMaterials: true;
             searchInStudentName: true;
             searchInTeacherName: true;
          });
      }
  }

  export default SearchService.getInstance();