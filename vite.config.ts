import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path, {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

 export default defineConfig({
 	root: './',
 	plugins: [vue()],
 	resolve:{
 		alias: {
 			'@': path.resolve(__dirname,'.'),
 			'@composables': path.resolve(__dirname,'./composables')
 			// '@components': path.resolve(__dirname,'components'),
 		}
 	},
 	server:{
 		port: 5173,// differet (el puerto fue variado en el swtich controlado)
 	},
 
 });

 /*Nota el src  era src_ref y el src_legacy fue src*/