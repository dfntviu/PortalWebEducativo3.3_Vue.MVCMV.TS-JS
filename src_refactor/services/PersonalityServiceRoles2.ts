/**
 * PersonalityServiceRoles2.ts
 * Servicio que puede gestionar la personalización de temas por rol
 * Arquitectura: Services Layer 
 * */
  import {doc, getDoc, setDoc, updateDoc, serverTimestamp, type Firestore} from 'firebase/firestore';
  import { db } from '@/config/firebase';
    import type { ThemePreference, RoleThemeOptions, ColorPalette, BackgroundImage, UserRole, PaletteType, ProfilePhotoStyle, PersonalityServiceResponse,
   	  AppliedTheme} from '@/types/personality.types';

   	/**
   	 * Paleta de Colores predefinidas
   	 * */
    const COLOR_PALETTES:  ColorPalette[] = [
    	 	{
    	 		id: 'classic',
    	 		name: 'Clásico',
    	 		description: 'Paleta Tradicional y profesional',
    	 		 	colors:{
    	 		  	  primary: '',
    	 		  	  secondary:'',
    	 		  	  accent:'',
    	 		  	  backgroung: '',
    	 		  	  cardBorder: '',
    	 		  	  textPrimary: '',
    	 		  	  textSecondary: ''
    	 		  	}
    	 	},
    	 	{
    	 		id:
 			name:
 			description:
 			colors:{
 			  primary:
 			  secondary:
 			  accent:
 			  backgroung:
 			  cardBorder:
 			  textPrimary:
 			  textSecondary:
    	 	    }
    	 	},
    	 	{
    	 		id:
 			name:
 			description:
 			colors:{
 			  primary:
 			  secondary:
 			  accent:
 			  backgroung:
 			  cardBorder:
 			  textPrimary:
 			  textSecondary:
    	 	    }
    	 	},
    	 	{
    	 		id:
 			name:
 			description:
 			colors:{
 			  primary:
 			  secondary:
 			  accent:
 			  backgroung:
 			  cardBorder:
 			  textPrimary:
 			  textSecondary:
    	 	    }
    	 	}
 	]

   	 	/**
   	 	 * Imágenes de Fondo predeterminadas
   	 	 * Nota: Las URLs deben apuntar a Firebase Storage
   	 	 * */
   	 	const BACKGROUND_IMAGES: Record<UserRole, BackgroundImage[]> = {
   	 		student: [
   	 			{
   	 				id: 'student-bg-1'
   	 				url:  'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Student%1/bydefault-themeImg01.png'
   	 				thumbmail:
   	 				name: 'Biblioteca Moderna'
	 				role:  'student'
   	 			},
   	 			{
   	 				id: 'student-bg-2'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Student%1/bydefault-themeImg02.png'
   	 				thumbmail:
   	 				name: 'Campus Verde'
	 				role: 'student'
   	 			},
   	 			{
   	 				id: 'student-bg-3'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Student%1/bydefault-themeImg03.png'
   	 				thumbmail:
   	 				name: 'Aula Digital'
	 				role: 'student'
   	 			},
   	 			{
   	 				id: 'student-bg-4'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Student%1/bydefault-themeImg04.png'
   	 				thumbmail:
   	 				name: 'Laboratorio Cientifíco'
	 				role: 'student'
   	 			},
   	 			{
   	 				id: 'student-bg-5'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Student%1/bydefault-themeImg05.png'
   	 				thumbmail:
   	 				name: 'Espacio Creativo'
	 				role: 'student'
   	 			}
   	 		],
   	 		teacher: [
   	 			{
   	 				id:  'teacher-bg-1'
   	 				url:  'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Teacher%2/bydefault-themeImg01.jpg'
   	 				thumbmail:
   	 				name: 'Oficina Profesional'
   	 				role:  'teacher'
   	 			},
   	 			{
   	 				id: 'teacher-bg-2'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Teacher%2/bydefault-themeImg02.jpg'
   	 				thumbmail:
   	 				name: 'Sala de Maestros'
   	 				role: 'teacher'
   	 			},
   	 			{.jpg
   	 				id: 'teacher-bg-3'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Teacher%2/bydefault-themeImg03.jpg'
   	 				thumbmail:
   	 				name: 'Pizarra Interactiva'
   	 				role: 'teacher'
   	 			},
   	 			{
   	 				id: 'teacher-bg-4'
   	 				url: 'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Teacher%2/bydefault-themeImg04.jpg'
   	 				thumbmail:
   	 				name: 'Escritorio Educativo'
   	 				role:  'teacher'
   	 			},
   	 			{
   	 				id:
   	 				url:  'https://console.firebase.google.com/project/portalweb-educativo1-8/storage/defaults%Teacher%2/bydefault-themeImg05.jpg'
   	 				thumbmail:
   	 				name: 'Conferencia Virtual'
   	 				role: 'teacher'
   	 			}
   	 		],
   	 		admin: [] // Es ineceasrio contar con fondos personalizados(pero por si acaso)
   	 	};

   	 	/**
   	 	 * Servicio de Personalización por Roles
   	 	 * */
  class PersonalityServiceRoles {
  	  private firestore: Firestore;
  	  private colectionName = 'userThemePreferences';

  	  constructor(firestoreInstance: Firestore = db ){
  	  	  this.firestore = firestoreInstance;
  	  }

  	  /**
  	   * Obtiene las opciones de personalización disponibles por rol
  	   * */
  	  getRoleThemeOptions(role: UserRole): RoleThemeOptions {
  	  	return{
  	  		 role,
  	  		 availablePalettes: COLOR_PALETTES,
  	  		 availableBackgrounds: BACKGROUND_IMAGES[role]||[],
  	  		 defaultTheme: this.getDeafaultTheme(role)
  	  	};
  	  }

  	  	private getDeafaultTheme(role: UserRole):Partial(ThemePreference){
  	  	  const defaultTheme: PaletteType = role === 'student' ? 'classic' : 'vibrant'; 

  	  	  return {
  	  	  	  palette:
  	  	  	  backgroundColor:
  	  	  	  borderColor:
  	  	  	  backgroundImageId:
  	  	  	  backgroundImageURL:
  	  	  	  profilePhotoStyle: 'circle'
  	  	  };
   	  	}

   	  	/**
   	  	 * Funcion para obtener las preferencias del Usuario
   	  	 * */
   	  	async getUserThemePreferences(userId: string): Promise<PersonalityServiceResponse<ThemePreference| null> >{
   	  		try{	

   	  				const docRef = await doc(this.firestore, this.colectionName, userId);
   	  				const docSnap = getDoc(docRef);

   	  				if (docSnap.exists()) {
   	  				    const data = docSnap.data();
   	  				     return {
   	  				     	 success: true,
   	  				     	 ...data,
   	  				     	 createdAt: data.createAt?.toDate(),
   	  				     	 updatedAt:data.createAt?.toDate(),
   	  				     } as ThemePreference
   	  				};

   	  				return {
   	  					success: true,
   	  					data: null
   	  				};

   	  		}catch(error){
   	  			// console.error('Error getting user theme preferences',error);
   	  			 return{
   	  			 	success: false,
   	  			 	error: 'Error al obtener las preferencias del Tema'
   	  			 };
   	  		}
   	  	}


   	  	/**
   	  	 * Guardar o actualizar las preferencias del Tema de Usuario
   	  	 * */
   	  	async saveUserThemePreferences(preferences: Omit<ThemePreference, 'createAt' | 'updateAt'> )
   	  		:Promise<PersonalityServiceResponse <void>>{

   	  		try{
   	  		
   	  		  const docRef = await doc(this.firestore, this.colectionName, userId);
   	  				const docSnap = getDoc(docRef);

   	  				if (docSnap.exists()){
   	  					 updateDoc(docRef,{
   	  					 	...preferences,
   	  					 	updatedAt: serverTimestamp
   	  					 });
   	  				} else {
   	  					 setDoc(docRef,{
   	  					 	...preferences,	
   	  					 	createdAt: serverTimestamp(),
   	  					 	updatedAt: serverTimestamp()
   	  					 });
   	  				}

   	  				return {
   	  					success: true
   	  				};
   	  		 }catch(error){
   	  		 	console.error('Error saving user Theme Preferences', error);
   	  		 	 return {
   	  		 	 	success: false;
   	  		 	 	 error: 'Error al guardar las preferencias del Tema.'
   	  		 	 };
   	  		 }
   	  	}

   	  	/**
   	  	 * Metodos de apoyo (metodos getters) 
   	  	 * */	

   	  	/**
   	  	 * Obtiene una paleta especifica por Id*/
   	  	getPaletteById(paletteId: PaletteType): ColorPalette | undefined {
   	  		return COLOR_PALETTES.find( p=>p.id === paletteId );
   	  	}

   	  	getBackgroundImageById(imageId: string, role: UserRole): BackgroundImage | undefined {
   	  		return BACKGROUND_IMAGES[role]?.find( b=>b.id === imageId );
   	  	}	


   	  	/**
   	  	 * Obtiene todas paletas de Colores -> [Especificadad de Tipo]*/
   	  	 getPalettess(): ColorPalette[] {
   	  	 	 return COLOR_PALETTES;
   	  	 }


   	  	 /**
   	  	  * Obtiene todas las imágenes de fondo por un rol: Teacher - Student
   	  	  * */
   	  	 getBackgroundsByRole(role: UserRole): BackgroundImage {
   	  	 	 return BACKGROUND_IMAGES[role] || [];
   	  	 }


   	  	 /**
   	  	  * Construye el tema Aplicado basado en las preferencias
   	  	  * */
   	  	async buildAppliedTheme(preferences: ThemePreference,
   	  	 		role: UserRole)Promise<AppliedTheme>{
 
   	  	 	 const palette = this.getPaletteById(preferences.palettte)|| COLOR_PALETTES[0];

   	  	 	  let backgroundImage: BackgroundImage | null = null;

   	  	 	   if (preferences.backgroundImageId) {
   	  	 	   	   backgroundImageId =  this.getBackgroundImageById(preferences.backgroundImageId, role) || null;
   	  	 	   }

   	  	 	   return {
   	  	 	   	 palette,
   	  	 	   	 backgroundImage,
   	  	 	   	 profilePhotoStyle: preferences.profilePhotoStyle,
   	  	 	   	   customColors: {
   	  	 	   	   	 cardBorder:  preferences.customColors?.cardBorder  || preferences.borderColor
   	  	 	   	   	 workspaceBackground: preferences.customColors?.workspaceBackground || preferences.backgroundColor
   	  	 	   	   }
   	  	 	   };
   	  	}

   	  	/**
   	  	 * Resete el tema de valores por defecto
   	  	 * */
   	  	async resetToDefaultTheme(
   	  		userId: string, role: UserRole): Promise<PersonalityServiceResponse<void>>{
   	  		  const defaultTheme =  this.getDeafaultTheme({
   	  		  	userId,
   	  		  	palette: defaultTheme.backgroundColor!,  
   	  		  	backgroundColor: defaultTheme.backgroundColor!, 
   	  		  	borderColor:  defaultTheme.borderColor,
   	  		  	backgroundImageId: null,
   	  		  	backgroundImageURL: null,
   	  		  	profilePhotoStyle: defaultTheme.profilePhotoStyle
   	  		  });
   	  	}

   	  	/**
   	  	 * Valida las preferencias de tema previo al guardado del Tema
   	  	 * */
   	  	validateThemePreferences(preferences: Partial<ThemePreference>):{
   	  		 isValid: boolean,
   	  		 errors: string[];
   	  	}{
   	  		  // const errors = string[] = [];

   	  		   // Validamos que exista paleta de colors
   	  		  if (preferences.palettte && COLOR_PALETTES.find(p => p.id === preferences.palettte)) {
   	  		  	 errors.push('Paleta de colores valida')
   	  		  }

   	  		  const validaStyles: ProfilePhotoStyle[] = ['oval', 'circle' 'square' 'hexagon' ]
   	  		   if (preferences.profilePhotoStyle && validStyles.includes(preferences.profilePhotoStyle)) {
   	  		   		error.push('Estilo de foto de Perfil no encontrado o no valido')
   	  		   }
   	  		   	const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
   	  		   if (preferences.borderColor && !hexRegex.test(preferences.backgroundColor)) {
   	  		   		errors.push('Color de borde no valido');
   	  		   }

   	  		    if (preferences.borderColor && hexRegex.test(preferences.borderColor)) {
   	  		   		errors.push('Color de borde no valido');
   	  		    }

   	  		   return {
   	  		   		isValid: errors.length === 0,
   	  		   		errors
   	  		   }
   	  	}
  }
  	// Enviar la instancia del servicio
  export const personalityService = new PersonalityServiceRoles();
  export default personalityService;