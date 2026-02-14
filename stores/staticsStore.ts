/**
 * @store Statictics unificado de Estadistícas para todos los roles
 * @description Store unificado de Estadistícas para todos los roles
 * 
 * BASADO EN: materialStore.ts
 * FILE IN USE: StacticsService.ts
 * 
 * CARACTERÍSTICAS
 * - Cacheo de Estadísticas por Role
 * - Auto-Refresh Configurable
 * - Getters Reactivos
 * - Manejo de Errores robusto 
 * */
  import defineStore from 'pinia';
  import {StaticsService, type TeacherStatics,  type StudentStactics type AdminStatictics type DailySummary };

   // ============
   //	  TIPOS
   // =============

   interface StacticsStoreState {
   		// Estadisticas Por Rol
   	  teacherStats: TeacherStatics| null;
   	  studentStats: StudentStactics| null;
   	  adminStats: AdminStatictics| null;
   	  // Resumen Temporal
   	  dailiSummary: DailySummary| null;
   	  semesterSummary: DailySummary | null;
   	  // Estados de Carga
   	   loading: boolean;
   	   loadingTeacher: boolean;
   	   loadingStudent: boolean;
   	   loadingAdmin: boolean;
       loadingDaily: boolean;
   	   loadingSemester: boolean;
   	   // Errores
   	   error: string;
   	   erroHistory: string[];


   	    lastUpdated:{
   	   	 teacher:Date | null;
   	   	 student: Date | null;
   	   	 admin: Date | null;
   	   	  daily: Date | null;
   	   	  semestrer: Date: | null;
   	    }
   }
  
    const usestaticStore = defineStore('stactics', => {
   	    state (): StacticsStoreState =>({
   	    	// Estadisticas
   	   	  teacherStats: null,
   	   	  studentStats: null,
   	   	  adminStats: null,
   	   	  	// temporales
   	   	  dailiSummary: null,
   	   	  semesterSummary: null,
   	   	  		// Estados
   	   	  loading: false,
   	   	  loadingTeacher: false,
   	   	  loadingStudent: false,
   	   	  loadingSemester: false,
   	   	  	// Errores
   	   	  error: '',
   	   	  erroHistory: [],
   	   	  // TimeStamp

   	   	  lastUpdated {
   	   	  	 teacher: null,
			 student: null,
			  admin : null,
			   daily: null,
		   semestrer: null,
   	   	  }
   	    }),
   	     // =====================
    	 // GETTERS
    	 // =====================
   	    
        getters:{
   	     // ======================
    	 //	ESTADISTÍCAS ESTUDIANTE
    	 // ======================
       	    	/**
       	    	 * Total de Materiales*/
       	    totalMaterials: (state): number=> {
       	    	return state.teacherStats?.totalMaterials ?? 0;
       	    },

       	    /**
       	     * Aprobados*/
       	    approvedMaterials:(state):number => {
       	     	 return state.teacherStats?.approvedMaterials ?? 0;
       	    },		

       	     /**
       	     * Rechazados*/
       	    reajectedMaterials:(state):number => {
       	     	 return state.teacherStats?.reajectedMaterials ?? 0;
       	    },

       	     /**
       	     *Pendientes*/
       	    pendingMaterials:(state):number => {
       	     	 return state.teacherStats?.pendingMaterials ?? 0;
       	    },

       	     /**
       	     * Mat en Revision*/
       	    inReviewMaterials:(state):number => {
       	     	 return state.teacherStats?.inReviewMaterials ?? 0;
       	    },

       	     /**
       	      * Comentarios enviados por el profesor
       	      * */
       	    commentsCount:(state): number => {
       	     		return state.teacherStats.rejectedCommentsCount ?? 0;
       	    },

       	    hastTeachesStats:(state): boolean => {
       	     	return state.teacherStats !== null;
       	    }

       	     /**
       	      * Porcentaje de Aprobación
       	      * */
       	    teacherApprovaRate:(state): number => {
       	     	return (!state.teacherStats) return 0;
       	     	    const total = state.teacherStats.totalMaterials;
       	     	  if (total === 0) return 0;
       	     	    return Math.round(
       	     	    		(state.teacherStats.approvedMaterials / total )* 100 *100)/100;
       	    },

   	   		 //  =======================
   	    	 // 		ESTADIST. ALUMNO
   	    	 //  =======================
   	    	/**
   	    	 * Total de Materiales Profesor*/
   	        mytotalMaterials: (state): number=> {
   	       	 return state.studentStats?.totalMaterials ?? 0;
   	        }

       	    /**
       	     * Aprobados*/
       	    myApproved:(state):number => {
       	     	 return state.studentStats?.appoved ?? 0;
       	    },		

       	     /**
       	     * Rechazados*/
       	    myReajected:(state):number => {
       	     	 return state.studentStats?.reajected ?? 0;
       	    },

       	     /**
       	     *Pendientes*/
       	    myPending:(state):number => {
       	     	 return state.studentStats?.pending ?? 0;
       	    },

       	     /** Tasa aprobacion Material()
       	      * */
       	    myApprovalRate:(state):string => {
       	     	return state.studentStats?.approvalRateMat ?? '';
       	    }

       	     /**
       	     * Cargar las estadisticas generales del Alumno*/
       	    hasStudentStats:(state):boolean => {
       	     	 return state.studentStats !== null;
       	    },

       	     /**
       	      * Estado de rendimiedo del material*/
       	    materialPerformanceLevel: (state): 'complete'| 'incompleted'| 'illegible' | 'need_review' |'unknown' => {
       	     		if (!state.studentStats) return 'unknown';
       	     			const rate = state.approvalRateMat;
       	     			if (rate === 'approved') return 'complete'
       	     			if (rate === 'disapproved') return 'incompleted'
       	     			if (rate === 'postponed') return 'need_review'
       	     				return 'illegible';
       	    },

             //  =======================
             //      ESTADISTICAS ADMIN
             //  =======================
       	    /**
       	     * Total de estudiantes(admin) 
       	     * */
            totalStudents: (state): number => {
                state.adminStats?.totalStudents ?? 0;
            }

            /**
             * Total de Profesores(admin)
             * */
            totalTeachers: (state): number=> {
                state.adminStats?.totalStudents ?? 0;
            },

            /**
             * Total de usuarios(admin) 
             * */
            totalUsers: (state): number => {
                if (!state.adminStats) return 0;
                  return state.studentStats.totalStudents + state.studentStats.totalTeachers;
            }

            globalMaterails: (state) => {
                if (state.adminStats) return null; 
                return{
                    state.adminStats.totalStudents,
                    state.adminStats.materialsApproved,
                    state.adminStats.materialsRejected,
                    state.adminStats.materialsPendig,
                };
            }

            /**
             * Tiene Estadistícas de admin cargadas
             * */
            hasAdminStats: (state): boolean => {
                state.adminStats !== null;
            }

            todayActivities: (state) =>{
                return state.studentStats.dailiSummary?.activities ?? [];
            }

            todayActivitiesCount: (state):number => {
                state.studentStats.dailiSummary?.activitiesCount ?? 0;
            }

            semesterActivities: (state): number =>{
                state.semesterSummary?.activitiesCount ?? 0;
            }

             //  =======================
             //      ESTADDOS GENERALES
             //  =======================
            isLoading: (state): boolean => {
                return state.loading ||
                    state.loadingTeacher ||
                    state.loadingAdmin  ||
                    state.loadingDaily ||
                    state.loadingSemester;
            }
            /**
             * Existe error alguno
             * */
            hasError:(state): boolean => {
                state.error.length > 0;
            }

            /**
             * Tiempo desde la ultima act(profesor) */
            teacherStatsAge: (state): number | null => {
                if (state.lastUpdated.teacher) return null;
                 return Date.now() - state.lastUpdated.teacher.getTime();
            }

            /**
             * Necesita Refresh(mas de 5 minutos) 
             * */
            needsRefresh: (state) => (type: keyof StacticsStoreState['lastUpdated']): boolean=>{
                const lastUpdate = state.lastUpdated[type];
                    if (!lastUpdated) return true;

                    const FIVE_MINUTES = 5 * 60 * 1000;
                     return (Date.now() - lastUpdated.getTime()) > FIVE_MINUTES;
            }
        },
   	     // =====================
    	 // ACCIONES
    	 // =====================
   	    actions: {
            
            // =====================
            //      UTILIDADES
            // =====================
            /**
             * Establece error
             */
            setError(message: string) {
                this.error = message;
                this.errorHistory.push(`[${new Date().toISOString()}] ${message}`);
                console.error('[StatisticsStore] Error:', message);
            },

            cleanError(){
                this.error = '';
            },

            clearHistory(){
                this.erroHistory = [];
            },

             // ====================================
             //    CARGAR ESTADISTÍCAS DEL PROFESOR
             // ====================================
            /**
             * Carga estadísticas completas de profesor
             */
            async loadTeacherStactics(teacherId?: string, forceRefresh = false) {
                /*Verificar si necesita actualizarse(verificarse) */
                if (forceRefresh && this.teacherStats &&  this.needsRefresh('teacher')) {
                    console.log('[StaticStre] Usando stats de profesor cacheadas');
                     return;    
                }

                this.loadingTeacher = true;
                this.clearError();

                try{
                    this.teacherStats = StudentStactics.getTeacherStatistics(teacherId);
                    this.lastUpdated.teacher = new Date();

                    console.log('[StactisticsStore] Estadistícas del Profesor cargadas',this.teacherStats);
                }catch(err: any){
                     this.setError(err.message || 'Error al cargar estadísticas de profesor');
                     throw err;
                }finally{
                    this.loadingTeacher = false;
                }
            },

            /**
             * Cargar métrica individual de Profesor
             * */
            async loadTeacherMetric(metric: 'total'| 'appoved'| 'rejected' | 'pending' |'inReview'| 'comments'): Promise<number>{
                this.loading = true;
                this.clearError();

                try{
                    let value: number;

                    switch(metric){
                        case 'total':
                            value = await StaticsService.getTotalDeMateriales();
                        break;
                        case 'appoved':
                             value = await StaticsService.getApprovedMaterials();
                        break;
                        case 'rejected':
                            value = await StaticsService.getRejectedMaterials();
                        break;
                        case 'pending':
                            value = await StaticsService.getPendingReview();
                        break;
                        
                        case 'inReview':
                            value = await StaticsService.getInReviewMaterials();
                        break;

                        case: 'comments':
                            value = await StaticsService.getReactedCommentsCount();
                        break;
                    }   
                        console.log(`[StaticStre] Métrica ${metric}cargada: `,value);
                         return value;
                }catch(err: any){
                    this.setError(err.message || `Error al cargar métrica ${metric}`);
                     throw err;
                }finally {
                    this.loading = false;
                }
            },

            /**
             * Cargar Estadísticas completas de Alumno
             * */
            async loadStudentStatistics(studentId: string, forceRefresh = false) {
                if (forceRefresh && this.teacherStats &&  this.needsRefresh('teacher')) {
                    console.log('[StaticStre] Usando stats de profesor cacheadas');
                     return;    
                }

                this.loadingStudent = true;
                this.clearError();

                try{
                    this.studentStats = await StaticsService.getStudentStadistics(studentId);
                    this.lastUpdated.student = new Date();

                    console.log('[StacticsStore] Estadistícas de alumno cargadas:', this.studentStats);
                }catch(err: any){
                    this.setError(err.message || 'Error al cargar Estadistícas de Alumno');
                     throw err;
                } finally {
                     this.loadingStudent = false;
                }
            },
            /**
             * Carga solo la tasa de aprobación del alumno
             * */
            async loadStudentApprovalRate(studentId: string): Promise<number>{
                    this.loading = true;
                    this.cleanError();|

                try{
                    const rate = await StaticsService.getStudentApprovalRate(studentId);

                    console.log('[StaticStre] Tasa de Aprobación cargada: ',rate);
                     return rate;

                }catch(err: any){
                    this.setError(err.message || 'Error al cargar la tasa de Aprobación');
                    throw err;
                } finally {
                    this.loading = false;
                }
            },

            // ===================================
            //      CARGAR ESTADISTÍCAS DE ADMIN
            // ===================================

            /**
             * Carga Estadistícas completas de admin*/

            async loadAdminStatistics(forceRefresh = false){
                if (!forceRefresh && this.adminStats && !this.needsRefresh('admin')) {
                    console.log('[StacticsSte]: Usando stats antes de admin cacheadas ');
                     return;
                }

                this.loadingAdmin = true;
                this.cleanError();

                try{
                    this.adminStats = await StaticsService.getAdminStatictics();
                    this.lastUpdated.admin = new Date();

                    console.log('[StacticsStore] Estadistícas de admins cargadas: ', this.adminStats);

                }catch(err: any){
                    this.setError(err.message || 'Error al cargar estadistícas de admin');
                     throw err;
                }finally {
                    this.loadingAdmin = true;
                }
            }

            async loadAdminMetric(metric: 'students'| 'teachers'): Promise<number> {

                this.loadingAdmin = true;
                this.cleanError();

                try{
                    this.value = metric === 'students'
                    ? StaticsService.getTotalStudents()
                    : StaticsService.getTotalTeachers();

                    console.log(`[StacticsStore] Métrica admin:  ${metric} cargada`,value);
                    return value;

                }catch(err: any){
                    this.setError(err.message ||`Error al cargar la métrica ${metric}` );
                     throw err;
                }finally {
                    this.loadingAdmin = true;
                }
            },
            // ==================================
            //     CARGAR RESUMENES TEMPORALES
            // ==================================
            
            /**
             * Cargar resumen diario
             * */
            async loadingDailySummary(professorId: string, forceRefresh = false){
                if (!forceRefresh && this.adminStats && !this.needsRefresh('daily')){
                    console.log('[StacticsStore] Usando resumen diario cacheado');
                     return;
                }

                this.loadingDaily = true;
                this.cleanError();

                try{
                    this.dailySummary = await StaticsService.getDailySummary(professorId);
                    this.lastUpdate.daily = new Date();

                    console.log('[StaticStre] Resumen diario cargado: ',this.dailySummary);
                }catch(err: any){
                    this.setError(err.message ||'Error al cargar el Resumen Diario' );
                     throw err;
                } finally {
                     this.loadingDaily = false;
                 }
            },

            async loadingSemesterSummary(professorId: string, forceRefresh = false){
                if (!forceRefresh && this.adminStats && !this.needsRefresh('semester')){
                    console.log('[StacticsStore] Usando resumen semestral cacheado');
                     return;
                }

                this.loadingSemester = true;
                this.cleanError();

                try{
                    this.semesterSummary = await StaticsService.getSemesterSummary(professorId);
                    this.lastUpdate.semester = new Date();

                    console.log('[StaticStre] Resumen semestral cargado: ',this.semesterSummary);
                }catch(err: any){
                    this.setError(err.message ||'Error al cargar el Resumen semestral');
                     throw err;
                } finally {
                     this.loadingSemester = false;
                 }
            }, 

            /**
             * Cargar Estadistícas según el rol del usuario actual
             * */
            async loadCurrentUserStactistics(forceRefresh= false){
                const profileStore = useProfileStore();

                if (!profile) {
                    throw new Error('No hay usuario autenticado');
                }

                this.loading = true;


                try{
                    switch(profile.role){
                         case 'student':
                          await this.loadStudentStatistics(profile.uid, forceRefresh);
                         break;

                        case 'teacher':
                            await this.loadTeacherStactics(profile.uid, forceRefresh);
                        break;
                        case: 'admin'
                                await this.loadAdminStatistics(forceRefresh);
                        break;

                        default:  
                             throw new Error(`Rol desconocido: ${profile.role}`);             
                    }
                    console.log(`[StacticsStore]: Estadistícas cargadas para rol: ${profile.role}`);
                }catch(err: any){
                    this.setError(err.message || 'Error al cargar las Estadistícas');
                     throw err;
                }finally{
                    this.loading = false;
                }
            },

            // ======================
            //      REFRESH
            // ======================

            async refreshAll(){
                const profileStore = useProfileStore();
                const profile = profileStore.profile;

                if (!profile) return;

                this.loading = true;
                console.log('[StacticsStore] Refrescando todas las estadísticas...');

                try{
                    const promises: Promise<any>[] = [];

                    // refrescar según el rol
                    if (profile.role == 'teacher') {
                        promises.push(this.loadTeacherStactics(profile.uid,true));
                        promises.push(this.loadingDailySummary(profile.uid,true));
                    }else if(profile.role === 'student'){
                        promises.push(this.loadStudentStatistics(profile.uid,true));
                    }

                    await Promise.all(promises);
                    console.log('[StacticsStore] Todas las Estadistícas refrescadas ');
                }catch(){
                    this.setError('Error al refrescar Estadísticas');
                    console.error('[StacticsStore] Error en refresh: ',err);
                } finally {
                     this.loading = false;
                }
            },

            /**
             * Resetea el store a su estado inicial
             * */
            $reset(){
                this.teacherStats = null;
                this.studentStats = null;
                this.adminStats = null;
                this.dailySummary = null;
                this.getSemesterSummary = null;

                this.loading = false;
                this.loadingTeacher = false;
                this.loadingStudent = false;
                this.loadingAdmin = false;
                this.loadingDaily = false;
                this.loadingSemester = false;

                this.error = '';
                this.errorHistory = [];

                this.lastUpdated = {
                    teacher: null;
                    student: null;
                    admin: null;
                    daily: null;
                    semestrer: null;
                }; 

                console.log('[StacticsStore] Store reseteado');
            }
   	    },
       // },
    });