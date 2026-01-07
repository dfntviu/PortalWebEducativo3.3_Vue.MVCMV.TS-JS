import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
//import path from 'path'; new library

 export default defineConfig({
 	root: './',
 	plugins: [vue()],
 	resolve:{
 		alias: {
 			'@': '/src_refactor'  //src-refactor/ >> subdirectorio paralelo
 		} 
 	},
 	server:{
 		port: 5174, // differet
 	},
 
 });