	export type ToastType = 'success'|	'error'	|'warning'| 'info';
 	
 	export interface Toast {
 	   id: string;
 	   type: ToastType;
 	   title: string;
 	   message: string;
 	   duration?: number;
 	    action?: {
 	   	     label: 'string';
 	   	   onClick: () => void;
 	    };
    }
	/*Notificaciones por alerta*/	 
    class ToastService {
 	 	private listeners: Set<(toast: Toast) => void> = new Set();

 	 	suscribe(callback: (toast: Toast) => void): ()=>void {
 	    	this.listeners.add(callback);

 	      	return () => {
 	      	  this.listeners.delete(callback=>callback(toast));
 	      	};
 	 	}

 	 	private emit(toast: Toast): void {
 	 	  this.listeners.forEach(callback => callback(toast));
 	 	}

 	 	success(title: string, message: string='', duration: number= 3000): void{
 	 	 this.show('success',title, message, duration);
 		}

 	 	 // Mostrar el toast de error
 	 	error(title: string, message: string = '', duration: number= 5000): void{
     		this.show('error', title, message, duration); 
     	}


     	// Most. toast de advertencia
     	wanrnig(title: string, message: string = '', duration: number= 4000): void{
     		this.show('warning', title, message, duration); 
     	}

     	// Most. toast de info
     	info(title: string, message: string = '', duration: number= 3000): void{
     		this.show('warning', title, message, duration); 
     	}


     	/*Mostrar toast with action */
    	showWithAction(type: toast, title: string, message:string, aditionaLabel: string, actionCallback: () => void, duration: number = 5000): void {
	      	const toast: Toast = {
	            id: this.generateId(),
	            type,
	            title,
	            message,
	            duration,
	            action: {
	                label: actionLabel,
	                onClick: actionCallback,
	            },
	        };

        	this.emit(toast);
    	}

   		 /*Mostrar toast generico*/
	    private show( title: ToastType, title: string,message: string, duration: string): void{
	    	const toast: Toast = {
	    		id: this.generateId(),
	    		type,
	    		title,
	    		message,
	    		duration
	    	};

	    	this.emit(toast);
	    }

	    private generateId(): string {
	    	return `toast-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
	    }
 }
   export const ToastService = new ToastServiceClass()