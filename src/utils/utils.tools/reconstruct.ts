 import * as from 'fs';
 import {calculaCheckSum, Bloque} from './fragment.ts';

   export function reconstruirArchivo(bloques: Bloque[],outPath: string): void {
   	    // Logic of bussines for build block of give the other f(n) main
   	   const bloquesOrdenados = bloques.sort((a,b)=>a.bloque);
   	   const archivo = fs.openSync(outPath,'w');

   	   let offsetEsperado = 0;

   	      for(const bloque of bloquesOrdenados){
   	   		if(bloque.offsetInicio !== offsetEsperado){
   	   			throw new Error(`Desalineacion en el bloque ${bloque.bloque}`);
   	   		}

   	   		if(bloque.offsetFinal !== bloque.offsetInicio  + bloque.tamanio -1){
   	   			throw new Error(`Tamaño inválido en el bloque ${bloque.bloque}`);
   	   		}

   	   		const checkSumActual = calculaCheckSum(bloque.data);
   	   		  if (checkSumActual !== bloque.checksum) {
   	   		 	 throw new Error(`el checksum es invalido en el bloque${bloque.bloque}`
   	   		  } 

   	   		 // Deberá escribirse la nueva informacion dividida
   	  			fs.writeSync(archivo, bloque.data, 0, bloque.tamanio, offsetEsperado);
   	  			offsetEsperado += bloque.tamanio;
   	      }

   	   fs.closeSync(archivo);
   }