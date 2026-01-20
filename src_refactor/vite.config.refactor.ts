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
 			'@':path.resolve(__dirname,'src_refactor')  //src-refactor >> Es el subdirectorio paralelo
 		} 
 	},
 	server:{
 		port: 5174, // differet
 	},
 
 });