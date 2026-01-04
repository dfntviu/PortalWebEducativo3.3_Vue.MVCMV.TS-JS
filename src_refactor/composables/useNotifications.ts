/**
 * Composable para modulo de notificaciones
 * Gestiona las Notificaciones toast con auto-cierre
 * */

 import {ref,computed} from 'vue';
  type NotificatioType = 'success' |'error'| 'info'| 'warning';

  interface NotificationsOptions {
  	 duracion?:  number
  	 autoCerrar?: boolean
  }

    function useNotifications(options: NotificationsOptions) {
   	   const {
   	   	  duracion = 5000,
   	   	  autoCerrar = true
   	   } = options;


       // ════════════════════════
       //     STATE STORE
       // ════════════════════════
        const mostrarNotificacion = ref<boolean| null>(null);
        const notificacionMensaje = ref<boolean| null>(null);
        const notificacionTipo    = ref<NotificatioType| null>(null);
          
       let timeoutId: NodeJS.Timeout | null = null;


       // ════════════════════════
       //     PROPERTIE COMPUTED
       // ════════════════════════
        const notificationClass = computed<string>(()=> {
             const baseClasses = 'border-l-4';

            const typeClasses: Record<NotificatioType, string> = {
              success: 'border-green-500',
              error: 'border-red-500',
              warning: 'border-yellow-500',
              info: 'border-blue-500',
            };

            return `${baseClasses} ${typeClasses[notificacionTipo.value]}`;

        });

        const notificationIconClass = computed<string>(()=>{
            const typeClasses: Record<NotificatioType, string> = {
                success:  'text-green-600 dark:text-green-400',
                error:  'text-red-600 dark:text-red-400',
                warning:  'text-yellow-600 dark:text-yellow-400',
                info:  'text-blue-600 dark:text-blue-400',
            }

            return typeClasses[notificacionTipo.value]
        });

        /**
         * Muestra notificacion
         * */
        const mostrar = (mensaje: string, tipo: NotificatioType = 'info'): void => {
            if (!timeoutId) {
                clearTimeout(timeoutId); 
                 timeoutId = null;
            }

             notificacionMensaje.value = mensaje;
             notificacionTipo.value = tipo;
             mostrarNotificacion.value = true;

                if(autoCerrar){
                  timeoutId = setTimeout( () =>{
                                cerrar();
                            },duracion);
                }
        };


        function cerrar = (): void => {
            mostrarNotificacion.value = false;

             if (timeoutId) {
                clearTimeout(timeoutId);
                 timeoutId = null;
             } 
        };

        const success  = (mensaje: string): void => mostrar(mensaje,'success');
        const error    = (mensaje: string): void => mostrar(mensaje, 'error');
        const warning  = (mensaje: string): void => mostrar(mensaje, 'warning');
        const informar = (mensaje: string): void => mostrar(mensaje, 'info');   


        return {
             // Estado
            mostrarNotificacion,
            notificacionMensaje
            notificacionTipo
            // Prop computadas
            notificationClass
            notificationIconClass
            // Metodos
            mostrar,
            cerrar,
            success,
            error,
            warning,
            informar,
        };
    }