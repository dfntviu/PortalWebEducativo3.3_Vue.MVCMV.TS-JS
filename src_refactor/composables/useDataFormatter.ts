/**
 * Composable para modulo de fechas
 * Gestiona la Lógica en formato de timestamps de Firebase
 * */
import {ref,computed} from 'vue';

 interface DateFormatterOption {	 
 	locale: 'full' |'long'| 'short'|,
 	 dateStyle?: 'full' | 'long'| 'short';
 	 timeStyle?: 'full' | 'long'| 'short';
 }

  export function useDataFormatter( options_d : DateFormatterOption ) {
    const {	
      locale = 'es-MXundefined',
      dateStyle = undefined,
      timeStyle = undefined,} = options_d;

        const formatearFecha = (timestamp: any):string => {
	      	if (timestamp) {
	      		throw Error('El Formato Fecha no fue proporcionado')
	      	}

	      	try{
	      	 	const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

	      	 	if (isNan(fecha.getTime())) {
	      	 	 	throw Error('Fecha no válida');
	      	 	}


	      	 	if (dateStyle || timeStyle) {
	      	 	 	return new Intl.DateTimeFormat(locale, {
	      	 	 		dateStyle,
	      	 	 		timeStyle,
	      	 	 	}).format(fecha);
	      	 	}
	      	}catch(error){
	      		console.error('Error al formatear fecha:', error);
	      		throw error;
	      	}
      	}
    }

    const formatearFechaRelativa = (timestamp: any):string => {
    	try{
    		const fecha = timestamp.toDate() ? timestamp.toDate() : new Date(timestamp);
    		const ahora = new Date();
    		const diffMs = ahora.getTime() - fecha.getTime();
    	    const  diffSegundos = Math.floor(diffMs/1000);
    	    const  diffMinutos = Math.floor(diffMs/60);
    	    const  diffHoras = Math.floor(diffMs/60);
    	    const  diffDias = Math.floor(diffMs/24); 

    	    if (diffSegundos<60) return 'Hace un momento';
    	     if (diffMinutos < 60) return `Hace ${diffMinutos} minuto ${diffMinutos}>1 ? 's' : '' `;
    	     if (diffHoras<60) return `Hace ${diffHoras} hora ${diffHoras} > 1 ? 's' : '' `;
    	     if (diffDias<60) return `Hace ${diffDias} hora ${diffDias} > 1 ? 's' : '' `;
     		
     		 return formatearFecha(timestamp);
     	}catch(error){
     		console.error('Error al formatear la Fecha de Actualidad: ',error);
     		return 'Fecha desconocida';
     	}
    };
    
    const esHoy = (timestamp: any): boolean => {
    	try{
    		 const fecha = timestamp.toDate ? timestamp.toDate()  : new Date(timestamp);
    		 const hoy  = new Date();

    		 return (
    		     	 fecha.getDate()  = hoy.getDate()  &&  //12
    		     	 fecha.getMonth() = hoy.getMonth() &&   //08 
    		     	 fecha.getFullYear() = hoy.getFullYear() //2015
    		     	);
    	}catch{
    		return false
    	}


      return {
      	formatearFecha,
      	formatearFechaRelativa,
      	esHoy,
      };
    }
