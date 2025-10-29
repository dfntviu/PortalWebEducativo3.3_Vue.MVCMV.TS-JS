 import {fragmentarArchivo} from './fragment.ts';
 import {reconstruirArchivo} from './fragment.ts'; 	

 /*Files for utility(archivos a utilizar) */
  const orginalPathFile = 'nombreArchivo.pdf';
  const destinyFileRecBuild = 'archivoReconstruido.pdf';
  /* Resultado de la invoacion -> resultados (3 archivos diferentes del original)*/
  const bloques =  fragmentarArchivo(orginalPathFile);
   reconstruirArchivo(bloques,destinyFileRecBuild);

   ├── fragment.ts        ← fragmenta archivo original
├── reconstruct.ts     ← reconstruye desde los bloques
├── types.ts           ← (opcional) tipos comunes como Bloque
├── baeTest.ts            ← ejemplo de uso