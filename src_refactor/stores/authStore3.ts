// stores/authStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { onAuthStateChanged, type User } from 'firebase/auth';
// import { initializeFirebaseStorage } from '@/config/initializeFirebaseConf.ts'; 
import { AuthService } from '@/services/Auth_Service.ts';
import type { ProfileTeacher, ProfileStudent, UserRole } from '@/types/interfacesv2';

/**
 * AuthStore - Store de autenticación multiusuario
 * Maneja el estado de autenticación y perfil del usuario
 * Sigue el patrón Services-Stores-Views
 */
 // const { auth } = initializeFirebaseStorage();

export const useAuthStore3 = defineStore('auth', () => {
  
  // =====================================================
  // ESTADO
  // =====================================================
  
  // Estado de carga
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // Usuario de Firebase Auth
  const currentUser = ref<User | null>(null);
  
  // Perfil del usuario (teacher o student)
  const userProfile = ref<ProfileTeacher | ProfileStudent | null>(null);
  
  // Rol del usuario
  const userRole = ref<UserRole | null>(null);
  
  // Estado de autenticación
  const isAuthenticated = ref<boolean>(false);
  
  // Flag para saber si se completó la inicialización
  const isInitialized = ref<boolean>(false);

  // =====================================================
  // GETTERS
  // =====================================================
  
  const userId = computed(() => currentUser.value?.uid || null);
  
  const userEmail = computed(() => currentUser.value?.email || null);
  
  const userName = computed(() => userProfile.value?.name || '');
  
  const isTeacher = computed(() => userRole.value === 'professor');
  
  const isStudent = computed(() => userRole.value === 'alumno');

  // =====================================================
  // ACCIONES - INICIALIZACIÓN
  // =====================================================
  
  /**
   * Inicializa el listener de autenticación de Firebase
   * Debe llamarse una sola vez al inicio de la aplicación
   */
  function initAuthListener(): void {
    onAuthStateChanged(auth, async (user) => {
      try {
        loading.value = true;
        
        if (user) {
          currentUser.value = user;
          
          // Determinar el rol del usuario
          const role = await authService.getUserRole(user.uid);
          
          if (role) {
            userRole.value = role;
            
            // Cargar el perfil según el rol
            const profile = await authService.getUserProfile(user.uid, role);
            userProfile.value = profile;
            
            isAuthenticated.value = true;
          } else {
            // Usuario autenticado pero sin perfil en Firestore
            console.warn('Usuario autenticado sin perfil en Firestore');
            await handleLogout();
          }
        } else {
          // Usuario no autenticado
          resetState();
        }
      } catch (err: any) {
        console.error('Error en auth listener:', err);
        error.value = err.message;
        resetState();
      } finally {
        loading.value = false;
        isInitialized.value = true;
      }
    });
  }

  /**
   * Verifica si existen usuarios en el sistema
   */
  async function checkSystemInitialization(): Promise<boolean> {
    try {
      loading.value = true;
      return await authService.anyUserExists();
    } catch (err: any) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Inicializa el primer usuario del sistema
   */
  async function initializeFirstUser(): Promise<{
    success: boolean;
    email: string;
    password: string;
    message: string;
  }> {
    try {
      loading.value = true;
      error.value = null;
      
      const result = await authService.initializeFirstTeacher();
      return result;
    } catch (err: any) {
      error.value = err.message;
      return {
        success: false,
        email: '',
        password: '',
        message: err.message
      };
    } finally {
      loading.value = false;
    }
  }

  // =====================================================
  // ACCIONES - AUTENTICACIÓN
  // =====================================================
  
  /**
   * Inicia sesión con email y password
   */
  async function login(email: string, password: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      loading.value = true;
      error.value = null;
      
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      // Validar formato de email
      if (!authService.validateEmail(email)) {
        throw new Error('Formato de email inválido');
      }
      
      // Validar contraseña
      const passwordValidation = authService.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }
      
      // Realizar login
      const user = await authService.login(email, password);
      
      // El estado se actualizará automáticamente por el listener
      // Solo retornamos éxito
      return {
        success: true,
        message: 'Inicio de sesión exitoso'
      };
    } catch (err: any) {
      error.value = err.message;
      return {
        success: false,
        message: err.message
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Cierra la sesión actual
   */
  async function logout(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      loading.value = true;
      error.value = null;
      
      await authService.logout();
      
      // Limpiar estado
      resetState();
      
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (err: any) {
      error.value = err.message;
      return {
        success: false,
        message: err.message
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Maneja el cierre de sesión (wrapper para consistencia)
   */
  async function handleLogout(): Promise<void> {
    await logout();
  }

  // =====================================================
  // ACCIONES - PERFIL
  // =====================================================
  
  /**
   * Recarga el perfil del usuario actual
   */
  async function reloadProfile(): Promise<void> {
    try {
      if (!currentUser.value || !userRole.value) {
        throw new Error('No hay usuario autenticado');
      }
      
      loading.value = true;
      
      const profile = await authService.getUserProfile(
        currentUser.value.uid,
        userRole.value
      );
      
      userProfile.value = profile;
    } catch (err: any) {
      console.error('Error recargando perfil:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // =====================================================
  // UTILIDADES
  // =====================================================
  
  /**
   * Resetea todo el estado del store
   */
  function resetState(): void {
    currentUser.value = null;
    userProfile.value = null;
    userRole.value = null;
    isAuthenticated.value = false;
    error.value = null;
  }

  /**
   * Limpia el error actual
   */
  function clearError(): void {
    error.value = null;
  }

  // =====================================================
  // RETURN
  // =====================================================
  
  return {
    // Estado
    loading,
    error,
    currentUser,
    userProfile,
    userRole,
    isAuthenticated,
    isInitialized,
    
    // Getters
    userId,
    userEmail,
    userName,
    isTeacher,
    isStudent,
    
    // Acciones
    initAuthListener,
    checkSystemInitialization,
    initializeFirstUser,
    login,
    logout,
    handleLogout,
    reloadProfile,
    clearError,
    resetState
  };
});