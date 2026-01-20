 <script setup lang="ts">
   import { ref, computed, onMounted, watch, nextTick } from 'vue';
   import { ReportService } from '@/services/ReportService';
   import { ToastService } from '@/services/ToastService'
   import { ReportData, MaterialReport} from '@/services/ReportService'

   // ══════════════════════════════════════════
 	//		 PROPS Y EMITS
	// ══════════════════════════════════════════

   const props = defineProps<{
   	 isOpen: boolean;
   	   role: 'alumno' | 'profesor';
   	  userId?: string;
   }>();

   const emit = defineEmits<{
   	    close: [];
   	 minimize: [boolean];
   }>();

	// ══════════════════════════════════════════
	// 			STATE
	// ══════════════════════════════════════════

     const     loading = ref(false);
     const   exporting = ref(false);
     const downloading = ref(false);
     const isMinimized = ref(false); 
     const  activeTab = ref< 'week' | 'month'>('week');
     const exportFormat = ref< 'pdf' | 'xlsx'| 'docx'>('pdf');
     const reportData = ref<ReportData | null>(null);
    const visibleRows = ref<string[]>(null);

     // Canvas refs  --> (etiquetas p/definir <> modales )
      const weekCanvas = ref<HTMLCanvasElement | null>(null);
     const monthCanvas = ref<HTMLCanvasElement | null>(null);	

    // ══════════════════════════════
	// 			COMPUTED
	// ══════════════════════════════
    const currentMaterials = computed(() => {
     	if (!reportData.value) return [];
     		 return activeTab.value === 'week'
     		  ? reportData.value.semanaPasada
     		  : reportData.value.semanaMes;
    });

  // ════════════════════════════════
  //    METHODS - UI CONTROL
  // ════════════════════════════════

   function closeModal(){
      emit('close');
   }

   function toggleMinimize() {
       isMinimized.value = !isMinimized.value;
       emit('minimize', isMinimized.value);
   }


   function toggleRowVisibility(id: string) {
       const index = visibleRows.value.indexOf(id);

      if(index > -1){
          visibleRows.value.splice(index, 1);
      } else {
         visibleRows.value.push(id);
      }

   }

    // ════════════════════════════════
    //     METHODS - DATA LOADING
    // ════════════════════════════════

   async function loadReport() {
        try{
            reportData.value = await ReportService.recuperarMaterialesPorRango(props.role, props.userId);

              // Animar canvas despues de cargar datos
            nextTick( () => {
               animateWeekCanvas();
               animateMonthCanvas();
            });
        } catch(error){
            console.log('Error al cargar reporte:', error);
            // ToastService
        } finally {
           loading.value = false;
        }
   } 

    // ════════════════════════════════
    //     METHODS - DATA LOADING
    // ════════════════════════════════

   async function handleExport() {
       if(!reportData.value) return;

       exporting.value = true;

      try{

         const data = currentMaterials.value;   
         const filename = `reporte_materiales_ ${activeTab.value}_ ${new Date().toISOString().split('T')[0]}`;

         if(exportFormat.value === 'pdf'){
               await ReportService.exportarAPDF(data,filename);                
         } else if(exportFormat.value === 'xlsx'){
               await ReportService.exportarAExcel(data,filename);
         } else if(exportFormat.value === 'docx'){
               await ReportService.exportarADocx(data,filename);
         }

           // ToastService

      }catch(error){
         console.error('Error al exportar:', error);
         // ToastService.error('','');
      } finally {
          exporting.value = false;
      }
   }

   async function handleDownloadZip() {
      if(!reportData.value?.semanaPasada.length) return;

      downloading.value = true;
      
      try{
          await ReportService.descargaSemanalMaterialesZIP(reportData.value.semanaPasada);

          ToastService.success('','');
      
      }catch(error){
         console.error('Error al descargar ZIP', error);
         ToastService.error('', '');
      }finally{
         downloading.value = false;
      }
   }
   
   // ════════════════════════════════
   //    METHODS - CANVAS ANIMATIONS
   // ════════════════════════════════

   function animateWeekCanvas() {
         if(!weekCanvas.value) return;

         const ctx = weekCanvas.value.getContext('2d');
         if(!ctx) return;

         let progress = 0;

      const animate = () => {
            ctx.clearReact(0, 0, 60, 60);

            // Circulo en progreso
         ctx.beginPath();
         ctx.arc(30,30,20, -Math.PI /2, -Math.PI/2 + (progress * 2 * Math.PI), false);
         ctx.lineWidth = 4;
         ctx.strokeStyle = '#3b82f6'  // blue-500
         ctx.stroke();

            progress += 0.002;

         if(progress < 1){
            requestAnimationFrame(animate);
         }
      };

         animate();
   }

   function animateMonthCanvas() {
      if(!monthCanvas.value) return;

      const ctx = monthCanvas.value.getContext('2d');
      if(!ctx) return;

      let progress = 0;

      const animate = () => {
         ctx.clearReact(0,0,60, 60);

         ctx.beginPath();
         ctx.arc(30,30,20, -Math.PI /2, -Math.PI/2 +(progress*2*Math.PI), false);
         ctx.lineWidth = 4;
         ctx.strokeStyle = '#a855f7';  //purple-500
         ctx.stroke();

         progress += 0.015;

         if(progress<1){
            requestAnimationFrame(animate);
         }

      };
   }

   // ════════════════════════════
   //    WATCHERS
   // ════════════════════════════

   watch( () props.isOpen, (newVal) => {

      if(newVal && !reportData.value){
         loadReport();
      }
   });

   // ════════════════════════════
   //    LYFECICLE
   // ════════════════════════════

   onMounted(() => {
      if(props.isOpen){
          loadReport();
      }
   });

 </script><!-- $$ CULMINATED $$  -->