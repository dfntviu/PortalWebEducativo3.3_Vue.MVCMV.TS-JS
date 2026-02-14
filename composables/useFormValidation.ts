/**
 * @file useFormValidation.ts
 * @description Composable para manejo de validaciones de formularios
 * @author ChristopherSmart
 * @date 2026-02-07
 */

import { ref, type Ref } from 'vue';
import type { ValidationErrors } from '@/types/registration.types';

// ══════════════════════════════════════════════════════
// INTERFAZ DEL COMPOSABLE
// ══════════════════════════════════════════════════════

interface UseFormValidationReturn {
  errors: Ref<ValidationErrors>;
  validateField: (field: string, message: string) => void;
  hasFieldError: (field: string) => boolean;
  getFieldError: (field: string) => string;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
}

// ══════════════════════════════════════════════════════
// COMPOSABLE
// ══════════════════════════════════════════════════════

export function useFormValidation(): UseFormValidationReturn {
  const errors = ref<ValidationErrors>({});

  /**
   * Registra un error de validación para un campo específico
   */
  const validateField = (field: string, message: string): void => {
    errors.value[field] = message;
  };

  /**
   * Verifica si un campo tiene errores
   */
  const hasFieldError = (field: string): boolean => {
    return !!errors.value[field];
  };

  /**
   * Obtiene el mensaje de error de un campo
   */
  const getFieldError = (field: string): string => {
    return errors.value[field] || '';
  };

  /**
   * Limpia todos los errores de validación
   */
  const clearErrors = (): void => {
    errors.value = {};
  };

  /**
   * Limpia el error de un campo específico
   */
  const clearFieldError = (field: string): void => {
    delete errors.value[field];
  };

  return {
    errors,
    validateField,
    hasFieldError,
    getFieldError,
    clearErrors,
    clearFieldError
  };
}