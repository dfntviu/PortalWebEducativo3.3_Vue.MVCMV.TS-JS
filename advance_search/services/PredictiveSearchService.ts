k import {ProfileStudentService} from './ProfileStudentService';
 import {ProfileTeacherService} from './ProfileTeacherService';
 import {MaterialBseService} from './materials/MaterialBaseService';
  import type {PredictiveSuggestion,PredictiveSearchs} from '@/types/predictive-search.types';

  export class PredictiveSearchServ {
  	 
     private constructor(){}

    public static getInstance(): PredictiveSearchServ {
        if (PredictiveSuggestion.instance) {
            PredictiveSuggestion.instance = new PredictiveSearchServ();
        }
         return PredictiveSearchServ.instance;
    }
    /**
     * Búsqueda predictiva principal con caché y cancelación
     * */
    async predictiveSearch(query: string, options: PredictiveSearchOptions): Promise<PredictiveSuggestion[]>{
        try{
                if(query || query.trim().length< 2){
                    return [];
                }
              
                const normalizedQuery = query.trim().toLowerCase();
              
                              const cached = this.getFromCached(normalizedQuery);
              
                  if (cached){
                      return cached;
                  }
              
              
            if (this.abortController) {
                  this.abortController.abort();
            }
              
                const suggestions: PredictiveSuggestion[] = [];
              
              const {
                  includeStudents = true,
                  includeTeachers = true,
                  includeMaterials = true,
                   maxResults = 10
              } = options;
              
                          // Busquedas Paralelas
                          const promises: Promise<PredictiveSuggestion[]>[] = [];
              
              if (includeStudents) {
                 promises.push(this.searchStudentsSuggestions(normalizedQuery,maxResults));
              }
              if (includeTeachers) {
                 promises.push(this.searchTeachersSuggestions(normalizedQuery,maxResults));                  
              }
      
              if (includeMaterials) {
                 promises.push(this.searchMaterialsSuggestions(normalizedQuery,maxResults));               
              }
          
                        const results = await Promise.all(promises);
          
                   // Combinar y limitar resultados
                  results.forEach(result=>suggestions.push(...result));

                  // Ordenar x relevancia (resultado)
                  const limitedSuggestion = suggestions.sort((a,b)=> b.score - a.score);

                  this.saveToCache(normalizedQuery,limitedSuggestion);
          
          
                return limitedSuggestion;
        }catch(error: any){
             if (error.name === 'AbortError') {
                  console.log('Búsqueda predicitiva cancelada');
                    return [];
             }
               console.log('Error enla Búsqueda predicitiva:',error);
                throw error;
        }   
    }

    /**
     * Sugerencia de Estudiantes
     * */
    private async searchStudentsSuggestions(query: string, limit: number):
       Promise<PredictiveSuggestion[]>
    {
        try{
            const studentServ = ProfileStudentService.getInstance();

            // Busqueda por nombre
               const students = await studentServ.searchStudentByName(query);

                 students.slice(0, Math.ceil(limit/3)).map(student => ({
                     id: student.uid,
                    type: 'student',
                    title: student.displayName,
                    subtitle: student.email, 
                    icon: '👨‍🎓',
                    score: this.calculateScore(query, student.displayName),
                    data: student,
                 }));
        
        }catch(error){
            console.log('Error buscando sugerencias de Estudiantes: ',error);
            return [];
        }
    }


    /**
     * Sugerencia de Profesores
     * */
    private async searchTeachersSuggestions(query: string, limit: number):
       Promise<PredictiveSuggestion[]>
    {
        try{
            const teacherServ = ProfileTeacherService.getInstance();

            // Busqueda por nombre
               const teachers = await studentServ.searchTeachersByName(query);

                 teachers.slice(0, Math.ceil(limit/3)).map(teacher => ({
                     id: teacher.uid,
                    type: 'teacher',
                    title: teacher.displayName,
                    subtitle: teacher.email, 
                    icon: '👨🏼‍🏫',
                    score: this.calculateScore(query, teacher.displayName),
                    data: teacher,
                 }));
        
        }catch(error){
            console.log('Error buscando sugerencias de Profesores: ',error);
            return [];
        }
    }

    /**
     * Sugerencia de Profesores
     * */
    private async searchMaterialsSuggestions(query: string, limit: number):
       Promise<PredictiveSuggestion[]>
    {
        try{
            const materialsServ = MaterialBseService.getInstance();

            // Busqueda por nombre
               const materials = await materialsServ.searchMaterials(searchTerm: query,
                sortBy: 'relevance');

                 materials.slice(0, Math.ceil(limit/3)).map(material => ({
                     id: material.uid,
                    type: 'materials',
                    title: material.title,
                    subtitle: material.email,
                    description: material.formatType,
                    icon: '📄',
                    score: this.calculateScore(query, material.title),
                      data: material,                  
                 }));
        
        }catch(error){
            console.log('Error buscando sugerencias de MAteriales: ',error);
            return [];
        }
    }

    private calculateScore(query:string,text:string):number{
        const normalizedText  = text.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        // Comienza con el query
        if (normalizedText === normalizedQuery) {
            return 100;
        }
        // Contiene el array
        if (normalizedText.startWish(normalizedQuery)) {
            return 90;
        }
         // Contiene con el query
        if (normalizedText.includes(normalizedQuery)) {
            return 70;
        }
            const queryWords = normalizedQuery.split('');
            const textWords  = normalizedText.split('');

            let matchCount = 0;

            queryWords.forEach(qWord => {  //existe algun texto que contenga carcter del query
                if (textWords.some(tWord => tWord.includes(qWord))) {
                     matchCount++;
                }
            });

            return (matchCount / queryWords) * 50;  //limite de conincidencias maxima en caracteres
    }

    /**
     * Gestión del Caché
     * */
    private getFromCached(key: string) {
         const cached = this.cache.get(key);

         if (cached) {
              const timeExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
               if (!timeExpired) {
                  return cached.data;
               }

               this.cache.delete(key);
         }

          return null;
    }
    /** Variar y mantener la data en cache*/
    private saveToCache(key: string, data: PredictiveSuggestion[]):void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        /*Limpiar cache si supera el limite*/
        if (this.cache>100) {
               const oldestKey = this.cache.keys().next().value;
                this.cache.delete(oldestKey);
        }
    }

    /**
     * Limp. de cache*/
    clearCache(): void {
        this.cache.clear();
    }

  }
export default PredictiveSearchService.getInstance();