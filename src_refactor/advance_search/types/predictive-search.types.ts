
   export interface PredictiveSuggestion {
   	   id: string;
   	   type: 'student' | 'teacher' 	| 'material';
   	   title: string;
   	   description: string;
   	   icon: string;
   	   score: number
 	 // Filtros de Estudiantes
 	 	data: any;

 	 /*materialStatus?:  'approved' | 'pending' | 'rejected';
 	 dateTo?:Date;
 	 sortOrder?: 'asc' | 'desc';*/
    }

    export interface PredictiveSearchOptions {
 	   includeStudents?: boolean;
 	   includeTeachers?: boolean; 
 	   includeMaterials: boolean;
 	   nexResults?: boolean;
    }

    export interface PredictiveSearchStates {
      suggestions: PredictiveSuggestion[];
      isLoading: boolean;
      error: string | null;
      selectedIndex: number;
      query: string;
    }

