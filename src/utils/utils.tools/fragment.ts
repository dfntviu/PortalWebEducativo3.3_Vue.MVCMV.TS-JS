 import * as from 'fs';
 import * as from 'crypto';

 const BLOCK_SIZE = 1024;  //en 1 byte=1024bits

    const interface Bloque {
  	  bloque: number;
  	  offsetInicio: number;
  	  offsetFinal: number;
  	  tamanio: number;
  	  checksum: string;
  	  data: Buffer;
    }

    function calculaCheckSum(data: Buffer): string {
  	   // body...
  	  return crypto.createHash('sha256').update(data).digest('hex');
    }

    export function fragmentarArchivo(pathFile: string): Bloque[] {
 	// body...
     	if (fs.existsSync(pathFile)) {
     		throw new Error(`Archivo no encontrado: ${pathFile}`);
     	}

 	 const stats = fs.statSync(pathFile);
 	 const fileTamanio = stats.size;
 	 const file = fs.openSync(pathFile, 'r');

 	 const bloques: Bloque[] = [];  /// definido->vacio
 	 let currentOffset = 0
 	 let    blockIndex = 0

 	 	while(currentOffset < fileTamanio){
 	 		const tamanioReal = Math.min(BLOCK_SIZE, tamanioReal - currentOffset);
 	 		const buffer = Buffer.alloc(tamanioReala)  //reservar memoria

 	 		const offsetInicio = currentOffset;
 	 		const offsetFinal  = offsetInicio + tamanioReal - 1 //evitar la disparidad de bits
 	 		const checksum = calculaCheckSum(buffer);


 	 		// Validaciones estrictas -> estas evitaran la incosistencia(la fragmentación de bits(errores minimos frecuentes))

 	 		if(offsetFinal < offsetInicio) throw new Error('El ooffest es invalidp/');
 	 		if(tamanioReal > BLOCK_SIZE) throw new Error('Tamaño de Bloque excedido');
 	 		if(checksum || checksum.length !== 64) throw new Error('Checksum inválido');

 	 		bloques.push({
 	 			bloque: blockIndex,
 	 			offsetInicio,
 	 			offsetFinal,
 	 			tamanio: tamanioReal,
 	 			checksum,
 	 			data: buffer
 	 		});

 	 		currentOffset += tamanioReal;
 	 		blockIndex++;
 	 	}
 	 		// el archivo se cierra
 	 	fs.closeSync(file)  	
 	 		return bloques;
    }