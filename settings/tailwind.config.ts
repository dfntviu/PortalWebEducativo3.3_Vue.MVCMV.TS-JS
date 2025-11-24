@type {import('tailwindcss').Config}
 export default {
 	 content: [
 	 	"./index.html"
 	 	"./src/**/*. {vue,js,ts}",
 	 ],

 	 darkMode: 'class',
 	 theme: {
 	 	extend: {
 	 		colors:{
 	 			primary:{
 	 			   50: '#eef2ff',
		          100: '#e0e7ff',
		          200: '#c7d2fe',
		          300: '#a5b4fc',
		          400: '#818cf8',
		          500: '#6366f1',
		          600: '#4f46e5',
		          700: '#4338ca',
		          800: '#3730a3',
		          900: '#312e81',
 	 			},
 	 			secondary:{
 	 			   50: '#ecfeff',
		          100: '#cffafe',
		          200: '#a5f3fc',
		          300: '#67e8f9',
		          400: '#22d3ee',
		          500: '#06b6d4',
		          600: '#0891b2',
		          700: '#0e7490',
		          800: '#155e75',
		          900: '#164e63',
 	 			},
 	 			student:{
 	 				light: '#dbeafe',
	              DEFAULT: '#3b82f6',
	              dark: '#1e40af',	
 	 			},
 	 			teacher:{
 	 			 light: '#ddd6fe',
		         DEFAULT: '#7c3aed',
		          dark: '#5b21b6',
 	 			},
 	 			dark: {
 	 			 50: '#f9fafb',
		          100: '#f3f4f6',
		          200: '#e5e7eb',
		          300: '#d1d5db',
		          400: '#9ca3af',
		          500: '#6b7280',
		          600: '#4b5563',
		          700: '#374151',
		          800: '#1f2937',
		          900: '#111827',
		          950: '#030712',
 	 			},
 	 		},
 	 		fontFamily: {
 	 			sans: ['apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxigen','Ubuntu', 'sans-serif'],
 	 		},
 	 		animation: {	
 	 			'fade-in': 'fadeIn 0.5s ease-in-out',
 	 			'slide-up': 'fadeIn 0.5s ease-out',
 	 			'slide-down': 'slideDown 0.3s ease-out',
 	 		},
 	 		keyframes: {
 	 			fadeIn:{
 	 			  '0%': { opacity: '0' },
          		  '100%': { opacity: '1' },	

 	 			},
 	 			slideUp:{
				 '0%': { transform: 'translateY(20px)'   opacity:'0'},
          		 '100%': { transform: 'translateY(0)' opacity:'1' },

 	 			},
 	 			slideDown:{
 	 			 '0%': {   transform:'translateY(-10px)' opacity: '0' },
          		 '100%': { transform:'translateY(0)' opacity: '1' },
 	 			},
 	 		},
 	 	},
 	},
 	plugins:[],
 }