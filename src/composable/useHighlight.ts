 import { ref } from 'vue';

  function useHighLight(){
  	const estado = ref<"normal" | "destacado" | "nodestacado">("normal");

  	function activar(tipo: "destacado" | "nodestacado") {
  	  estado.value = tipo;
    	setTimeOut( ()=>{
    	  	estado.value = "normal";
    	}, 5000); //## regresa a estado base después de 5s##
  	} 

  	 return {estado activar};
  }
