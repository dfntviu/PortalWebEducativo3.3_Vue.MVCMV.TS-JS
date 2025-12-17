	/**
	 *  Personality.types.ts 
	 *  Definicion de tipos para el Sistema de personalizacion de Temas
	 *  del Port Educativo
	 * */
	
		export type PaletteType = 'clasic' | 'vibrant' | 'pastel' | 'dark';
		export type ProfilePhotoStyle = 'oval' | 'circle' | 'square' | 'hexagon';
		export type  UserRole = 'student' | 'teacher' | 'admin';

	/**
	 * Paleta de Colores para personalizacion
	 * */	
   export interface ColorPalette {
   	id: string;
  	 url: string;
  	 thumbail: string;
  	 name: string;
  	 role: UserRole;
   }
  	/**
	 * Configuracion de Imagen de Fondo
	 * */	
   export interface BackgroundImage{
  	   id:string;
	  url:string;
	 thumbail:string;
	  name:string;
	  role: UserRole;
   }
  /**
	 * Opciones de personalizacion por Rol
	 * */	
   interface RoleThemeOptions{
  	 role: UserRole;
  	 availablePalettes: ColorPalette[];
  	 availableBackgrounds: BackgroundImage[];
  	 defaultTheme: Partial<ThemePreferences>;
   }

  /**
	 * Preferencias del Tema de Usuario
	 * */	
   interface ThemePreferences{
  	 userId: string;
  	 palette: PaletteType;
  	 backgroundColor: string;
  	 borderColor: string;
  	 BackgroundImageId: string | null;
  	 BackgroundImageUrl: string |  null;
  	 profilePhotoStyle: ProfilePhotoStyle;
  	   customColors?:{
  	   	 cardBorder?: string;	
		   workspaceBackground: string;
  	   };
  	   createdAt:Date
  	   updateAt: Date;	
   }
  /**
	 * Opciones de Tema Aplicado actualmente
	 * */	
    interface AppliedTheme{
   	  palette: ColorPalette;
   	  backgroundImage: BackgroundImage | null;
   	  profilePhotoStyle: ProfilePhotoStyle;
   	    customColors:{
  	   	   cardBorder: string;	
		   workspaceBackground: string;
  	   };

    }
   /**
	 * Respuesta del Servicio de Personalización
	 * */	
    interface PersonalityServiceResponse{
   		success: boolean;
   		data?: T;
   		error?: string;
    }
   /**
	 * Configuración de Variables CSS
	 * */	
    export interface CSSVariables {
 	 '--primary-color': string;
 	 '--secondary-color': string;
 	 '--accent-color': string;
 	 '--bg-color': string;
 	 '--card-border-color': string;
 	 '--text-primary': string;
 	 '--text-secondary': string;
 	 '--bg-image-url':  string;
 	 '--profile-style': string;
    }