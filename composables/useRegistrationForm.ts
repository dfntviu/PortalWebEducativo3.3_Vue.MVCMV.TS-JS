/**
 * @file useRegistrationForm.ts
 * @description Composable para manejo de formularios de registro
 * @author ChristopherSmart
 * @date 2026-02-07
 */

import { reactive } from 'vue';
import type { 
  RegistrationFormData, 
  ProfileFormData, 
  ValidationResult,
  UserRole 
} from '@/types/registration.types';
import type { ProfesorUser } from '@/interfaces/Profile.types';

// ══════════════════════════════════════════════════════
// INTERFAZ DEL COMPOSABLE
// ══════════════════════════════════════════════════════

interface UseRegistrationFormReturn {
  formData: RegistrationFormData;
  profileFormData: ProfileFormData;
  validateTraditionalForm: () => ValidationResult;
  isValidEmail: (email: string) => boolean;
  syncProfileToForm: (profile: ProfesorUser) => void;
  resetForm: () => void;
  resetProfileForm: () => void;
}

// ══════════════════════════════════════════════════════
// COMPOSABLE
// ══════════════════════════════════════════════════════

export function useRegistrationForm(): UseRegistrationFormReturn {
  
  // ══════════════════════════════════════════════════════
  // ESTADOS REACTIVOS
  // ══════════════════════════════════════════════════════
  
  const formData = reactive<RegistrationFormData>({
    name: '',
    lname: '',
    email: '',
    password: '',
    numCuenta: '',
    area: '',
    role: ''
  });

  const profileFormData = reactive<ProfileFormData>({
    name: '',
    lname: '',
    email: '',
    numCuenta: '',
    area: '',
    role: 'alumno'
  });

  // ══════════════════════════════════════════════════════
  // VALIDACIONES
  // ══════════════════════════════════════════════════════

  /**
   * Valida formato de email
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Valida el formulario tradicional completo
   */
  const validateTraditionalForm = (): ValidationResult => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validar nombre
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'El nombre es requerido';
      isValid = false;
    }

    // Validar apellido
    if (!formData.lname || formData.lname.trim() === '') {
      errors.lname = 'El apellido es requerido';
      isValid = false;
    }

    // Validar email
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'El correo es requerido';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'El formato del correo no es válido';
      isValid = false;
    }

    // Validar password
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe contener al menos 6 caracteres';
      isValid = false;
    }

    // Validar rol
    if (!formData.role || formData.role === '') {
      errors.role = 'Es obligatorio seleccionar un rol';
      isValid = false;
    }

    return { isValid, errors };
  };

  // ══════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════

  /**
   * Sincroniza datos del perfil al formulario de edición
   */
  const syncProfileToForm = (profile: ProfesorUser): void => {
    profileFormData.name = profile.nomb || '';
    profileFormData.lname = profile.apellido || '';
    profileFormData.email = profile.correo || '';
    profileFormData.numCuenta = profile.cuenta || '';
    profileFormData.area = profile.areaTr || '';
    profileFormData.role = (profile.role as UserRole) || 'alumno';
  };

  /**
   * Resetea el formulario de registro
   */
  const resetForm = (): void => {
    formData.name = '';
    formData.lname = '';
    formData.email = '';
    formData.password = '';
    formData.numCuenta = '';
    formData.area = '';
    formData.role = '';
  };

  /**
   * Resetea el formulario de perfil
   */
  const resetProfileForm = (): void => {
    profileFormData.name = '';
    profileFormData.lname = '';
    profileFormData.email = '';
    profileFormData.numCuenta = '';
    profileFormData.area = '';
    profileFormData.role = 'alumno';
  };

  // ══════════════════════════════════════════════════════
  // RETORNO
  // ══════════════════════════════════════════════════════

  return {
    formData,
    profileFormData,
    validateTraditionalForm,
    isValidEmail,
    syncProfileToForm,
    resetForm,
    resetProfileForm
  };
}