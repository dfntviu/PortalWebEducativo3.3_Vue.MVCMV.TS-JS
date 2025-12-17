/**
 * @service AuthService
 * @description Servicio centralizado para autenticación con Firebase
 * 
 * Responsabilidades:
 * - Crear usuarios en Firebase Authentication
 * - Login/Logout
 * - Manejo de errores de autenticación con mensajes amigables
 * 
 * @nota Este servicio NO maneja Firestore, solo Firebase Auth
 */

import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type User
} from 'firebase/auth';

export class AuthService {
    
    /**
     * Crea un nuevo usuario en Firebase Authentication
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña (mínimo 6 caracteres)
     * @returns Usuario creado de Firebase Auth
     * @throws Error con mensaje amigable si falla
     */
    static async createUser(email: string, password: string): Promise<User> {
        try {
            const auth = getAuth();
            
            console.log('[AuthService] Creando usuario en Firebase Auth:', email);
            
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                email, 
                password
            );
            
            console.log('[AuthService] Usuario creado exitosamente:', userCredential.user.uid);
            
            return userCredential.user;
            
        } catch (error: any) {
            console.error('[AuthService] Error al crear usuario:', error);
            throw this.parseAuthError(error.code);
        }
    }
    
    /**
     * Inicia sesión con email y contraseña
     * @param email - Correo electrónico
     * @param password - Contraseña
     * @returns Usuario autenticado
     */
    static async login(email: string, password: string): Promise<User> {
        try {
            const auth = getAuth();
            
            console.log('[AuthService] Iniciando sesión:', email);
            
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            
            console.log('[AuthService] Sesión iniciada:', userCredential.user.uid);
            
            return userCredential.user;
            
        } catch (error: any) {
            console.error('[AuthService] Error al iniciar sesión:', error);
            throw this.parseAuthError(error.code);
        }
    }
    
    /**
     * Cierra la sesión actual
     */
    static async logout(): Promise<void> {
        try {
            const auth = getAuth();
            await signOut(auth);
            
            console.log('[AuthService] Sesión cerrada exitosamente');
            
        } catch (error: any) {
            console.error('[AuthService] Error al cerrar sesión:', error);
            throw new Error('Error al cerrar sesión');
        }
    }
    
    /**
     * Obtiene el usuario actualmente autenticado
     * @returns Usuario actual o null si no hay sesión
     */
    static getCurrentUser(): User | null {
        const auth = getAuth();
        return auth.currentUser;
    }
    
    /**
     * Convierte códigos de error de Firebase en mensajes amigables
     * @param code - Código de error de Firebase
     * @returns Error con mensaje en español
     */
    private static parseAuthError(code: string): Error {
        const errorMessages: Record<string, string> = {
            // Errores de registro
            'auth/email-already-in-use': 'Este correo ya está registrado. Intenta iniciar sesión.',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
            'auth/invalid-email': 'El correo electrónico no es válido.',
            
            // Errores de login
            'auth/user-not-found': 'No existe una cuenta con este correo.',
            'auth/wrong-password': 'La contraseña es incorrecta.',
            'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
            
            // Errores de red
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
            
            // Error por defecto
            'default': 'Error de autenticación. Intenta nuevamente.'
        };
        
        return new Error(errorMessages[code] || errorMessages['default']);
    }

}