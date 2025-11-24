 export definStore from 'pinia';
 import ToastService from '@/services/ToastService';
 import type {Toast} from '@/services/ToastService';

  export const useToastStore = definStore('toast', {
  	 state: ()=>({
  	 	toasts: [] as Toast[],
  	 	// .
  	 	// ..
  	 }),

  	 actions: {
  	 	 // Agregar Toast
  	 	add(toast: Toast){
  	 		this.toast.push(toast);
  	 		//  
  	 		if (toast.duration && toast.duration > 0) {
  	 			setTimeOut(()=>{
  	 			  	this.remove(toast.id),
  	 			}, toast.duration);
  	 		}
  	 	},

  	 	// Remover Toast
  	 	remove(id: Toast){
  	 		const index = this.toasts.findIndex(t => t.id === id);
  	 		  if (index > 1) {
  	 		  	 this.toasts.splice(index,1);
  	 		  }
  	 		//  
  	    },

  	    clear(){
  	    	this.toasts = [];
  	    },
  	},
});