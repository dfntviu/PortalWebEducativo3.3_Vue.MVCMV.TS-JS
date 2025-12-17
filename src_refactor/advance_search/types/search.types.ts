export   interface SearchFilters {
 	 searchTerm?: string;


 	  searchStudents?: boolean;
 	  searchTeachers?: boolean;
 	 searchMaterials?: boolean;

 	 // Filtros de Estudiantes
 	 studentEmail?:boolean;
 	 searchInStudentName?:boolean;

 	 teacherArea?: string;
 	 searchInTeacherName?: boolean;

 	 materialCategory?: string;
 	 materialSubject?: string;
 	 materialStatus?:  'approved' | 'pending' | 'rejected';
 	 dateFrom?: Date;
 	   dateTo?: Date;
 	 uploadedBy?: string;

 	 shortBy?: 'uploadDate' | 'title' | 'relevance';
 	 sortOrder?: 'asc' | 'desc';
    }

  export  interface SearchResults {
  	   students: StudentProfile[];
 	   teachers: TeacherProfile[];
 	  materials: Material;
 	  totalResults: number;
 	   searchTerm?: string; 
 	     timestamp: Date;
    }

   export interface Material{
  	  searchTerm?: string;
  	 category?:string
  	  subject?: string
  	 dateFrom?: Date;
  	   dateTo?: Date;
  	 uploadedBy: string;
  	 status?: 'approved' | 'pending' | 'rejected';
  	 sortBy?:  'uploadDate' | 'title' | 'relevance';
  	 sortOrder?: 'asc' | 'desc';
    }

 export  interface StudentProfile{
  	    uid?: string;
  	  email?:string
  	  displayName?: string;
  	  photoURL?: string;
  	  Name?: string;
  	  Surname: string;
  	  typeMaterial: string;
    }

   export interface TeacherProfile{
  	  uid?: string;
  	  email?:string
  	  displayName?: string
  	  photoURL?: string
  	  area?:string
  	  materials?: string[];
    }

   export interface MatearialSearchParams {
 	  searchTerm?: string;
 	  category?: string;
 	  subject?:  string;
 	  dateFrom?:Date;
	  dateTo?:Date;
      uploadBy?: string;
  	  status?: 'approved' | 'pending' | 'rejected';
 	  sortBy?:  'uploadDate' | 'title' | 'relevance'
 	  startOrder?: 'asc' | 'desc';
    }

    interface ProfileSearchParams{
   	 searchTerm?: string;
   	 searchField?: 'name' | 'email' | 'all';
   	 limit?: number;
    }