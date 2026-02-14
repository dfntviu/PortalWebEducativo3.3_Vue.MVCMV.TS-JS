  /**
 * useNotification.ts
 * Composable para gestión centralizada de notificaciones
 * 
 * Uso:
 * import { useNotification } from '@/composables/useNotification';
 * const { showError, showSuccess, showWarning, showInfo } = useNotification();
 * showError('Hubo un error al procesar la solicitud');
 */

import { ref, readonly } from 'vue';
import type { Component } from 'vue';

// ====================================
//   TIPOS
// ====================================
export type NotificationType = 'error' | 'warning' | 'success' | 'info';

export interface Notification {
  id: string;
  message: string;
  title?: string;
  type: NotificationType;
  duration?: number;
  persistent?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

  interface NotificationOptions {
   title?: string;
   duration?: number;
   persistent?: boolean;
   position?: Notification['position'];
  }

 // ====================================
 //   ESTADO GLOBAL
 // ====================================
 const notifications = ref<Notification[]>([]);
 let notificationIdCounter = 0;

  // ====================================
  //   FUNCIONES PRIVADAS
  // ====================================
  function generateId(): string {
    return `notification-${Date.now()}-${++notificationIdCounter}`;
  }

  function addNotification(notification: Notification): void {
    notifications.value.push(notification);
  }

  function removeNotification(id: string): void {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

// ====================================
//   API PÚBLICA
// ====================================

/**
 * Muestra una notificación genérica
 */
export function notify(
  message: string,
  type: NotificationType = 'info',
  options: NotificationOptions = {}
): string {
  const notification: Notification = {
    id: generateId(),
    message,
    type,
    title: options.title,
    duration: options.duration ?? 5000,
    persistent: options.persistent ?? false,
    position: options.position ?? 'top-right',
  };

  addNotification(notification);
  return notification.id;
}

/**
 * Muestra una notificación de error
 */
export function notifyError(
  message: string,
  options: NotificationOptions = {}
): string {
  return notify(message, 'error', {
    title: options.title ?? 'Error',
    duration: options.duration ?? 6000,
    ...options,
  });
}

/**
 * Muestra una notificación de éxito
 */
export function notifySuccess(
  message: string,
  options: NotificationOptions = {}
): string {
  return notify(message, 'success', {
    title: options.title ?? 'Éxito',
    duration: options.duration ?? 4000,
    ...options,
  });
}

/**
 * Muestra una notificación de advertencia
 */
export function notifyWarning(
  message: string,
  options: NotificationOptions = {}
): string {
  return notify(message, 'warning', {
    title: options.title ?? 'Advertencia',
    duration: options.duration ?? 5000,
    ...options,
  });
}

/**
 * Muestra una notificación informativa
 */
export function notifyInfo(
  message: string,
  options: NotificationOptions = {}
): string {
  return notify(message, 'info', {
    title: options.title ?? 'Información',
    duration: options.duration ?? 4000,
    ...options,
  });
}

/**
 * Cierra una notificación específica
 */
export function dismissNotification(id: string): void {
  removeNotification(id);
}

/**
 * Cierra todas las notificaciones
 */
export function dismissAll(): void {
  notifications.value = [];
}

/**
 * Composable principal
 */
export function useNotification() {
  return {
    // Estado (readonly para evitar mutaciones externas)
    notifications: readonly(notifications),

    // Métodos públicos
    notify,
    notifyError,
    notifySuccess,
    notifyWarning,
    notifyInfo,
    dismiss: dismissNotification,
    dismissAll,

    // Aliases para conveniencia
    showError: notifyError,
    showSuccess: notifySuccess,
    showWarning: notifyWarning,
    showInfo: notifyInfo,
  };
}

// ====================================
//   HELPERS PARA MANEJO DE ERRORES
// ====================================

/**
 * Extrae mensaje de error de diferentes tipos
 */
export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return err.message || err.msg || err.error || 'Error desconocido';
  }

  return 'Error desconocido';
}

/**
 * Muestra notificación desde un error capturado
 */
export function notifyFromError(
  error: unknown,
  fallbackMessage: string = 'Ocurrió un error inesperado'
): string {
  const message = extractErrorMessage(error) || fallbackMessage;
  return notifyError(message);
}

// ====================================
//   HELPERS PARA CASOS COMUNES
// ====================================

/**
 * Notificación de carga exitosa
 */
export function notifyLoadSuccess(itemName: string = 'datos'): string {
  return notifySuccess(`${itemName} cargados correctamente`);
}

/**
 * Notificación de guardado exitoso
 */
export function notifySaveSuccess(itemName: string = 'cambios'): string {
  return notifySuccess(`${itemName} guardados correctamente`);
}

/**
 * Notificación de eliminación exitosa
 */
export function notifyDeleteSuccess(itemName: string = 'elemento'): string {
  return notifySuccess(`${itemName} eliminado correctamente`);
}

/**
 * Notificación de acción pendiente
 */
export function notifyPending(message: string = 'Procesando...'): string {
  return notifyInfo(message, { duration: 2000 });
}

/**
 * Notificación de validación fallida
 */
export function notifyValidationError(message: string): string {
  return notifyWarning(message, { title: 'Validación Fallida' });
}

/**
 * Notificación de permiso denegado
 */
export function notifyPermissionDenied(
  message: string = 'No tienes permisos para realizar esta acción'
): string {
  return notifyError(message, { title: 'Permiso Denegado' });
}

/**
 * Notificación de operación cancelada
 */
export function notifyCancelled(message: string = 'Operación cancelada'): string {
  return notifyInfo(message);
}