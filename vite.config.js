import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; //new library

 export default defineConfig({
 	plugins: [vue()],
 	base: "/", //no ayuda
 	server:{  //nuevo
 		port:5173,
 	}, //end_servidor
 	resolve: {  //new_aniadir_config abrev
 		alias:{  
 			'@': path.resolve(__dirname, 'src'),
 			'@components': path.resolve(__dirname,'./src/components'),
 			// '@views': path.resolve(__dirname,'./src/views'),
 		},
 	}, //end_new
 	//build:{  new_feature_[28/10/25]
 		// base:'@/App.vue', 
 	//},  #define_init_route
 });