import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; //new library

 export default defineConfig({
 	plugins: [vue()],
 	base: "/", // app en la raiz
 	server:{  // Config del servidor de desarrollo
 		port:5173, // Puerto predeterminado de Vite
 		hmr:{
 	     overlay: false,  //Desacrivar solo en errores en HMR
 	    },
 	}, //end_server
 	resolve: {  // Alias Generic, facilita la importacion
 		alias:{  
 			'@': path.resolve(__dirname, 'src'), // Alias para el directory source
 			'@components': path.resolve(__dirname,'./src/components'),  // alias para componentes
 			// '@views': path.resolve(__dirname,'./src/views'),
 		},
 	}, //end_resolve
 	optimizeDeps:{
 		include: ['vue', 'vue-router'],  // Optm. las dependencias para HMR
 	}, //end_dependencies
 	esbuild: {
 		format: 'esm',
 	},
 });