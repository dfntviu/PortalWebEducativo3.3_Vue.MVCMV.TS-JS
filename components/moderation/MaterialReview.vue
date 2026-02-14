<template>
  <article class="material-review">
    <!-- Header -->
    <header class="review-header">
      <div class="header-content">
        <h3 class="material-title">{{ material.titulo }}</h3>
        <span class="status-badge pending">⏳ Pendiente</span>
      </div>
      <time class="upload-date" :datetime="material.fechaSubida">
        {{ formatFullDate(material.fechaSubida) }}
      </time>
    </header>

    <!-- Información del Alumno -->
    <section class="student-info">
      <h4 class="section-title">Información del Alumno</h4>
      <div class="info-grid">
        <div class="info-item">
          <div class="avatar">
            {{ getInitials(material.alumnoNombre) }}
          </div>
          <div class="info-details">
            <span class="info-label">Nombre</span>
            <span class="info-value">{{ material.alumnoNombre }}</span>
          </div>
        </div>

        <div v-if="material.numeroControl" class="info-item">
          <span class="info-icon">🎓</span>
          <div class="info-details">
            <span class="info-label">Número de Control</span>
            <span class="info-value">{{ material.numeroControl }}</span>
          </div>
        </div>

        <div v-if="material.alumnoEmail" class="info-item">
          <span class="info-icon">📧</span>
          <div class="info-details">
            <span class="info-label">Email</span>
            <span class="info-value">{{ material.alumnoEmail }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Detalles del Material -->
    <section class="material-details">
      <h4 class="section-title">Detalles del Material</h4>
      
      <!-- Descripción -->
      <div v-if="material.descripcion" class="detail-block">
        <span class="detail-label">Descripción</span>
        <p class="detail-description">{{ material.descripcion }}</p>
      </div>

      <!-- Metadata en chips -->
      <div class="metadata-chips">
        <span v-if="material.materia" class="chip materia">
          📚 {{ material.materia }}
        </span>
        <span v-if="material.categoria" class="chip categoria">
          🏷️ {{ material.categoria }}
        </span>
        <span v-if="material.archivoTipo" class="chip archivo">
          📄 {{ material.archivoTipo.toUpperCase() }}
        </span>
        <span v-if="material.archivoTamano" class="chip tamano">
          💾 {{ formatFileSize(material.archivoTamano) }}
        </span>
      </div>

      <!-- Tags -->
      <div v-if="material.tags && material.tags.length > 0" class="tags-container">
        <span class="detail-label">Etiquetas</span>
        <div class="tags-list">
          <span v-for="tag in material.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>
    </section>

    <!-- Acciones de Archivo -->
    <section v-if="material.archivoUrl" class="file-actions">
      <a 
        :href="material.archivoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="file-action-btn preview"
      >
        <span class="btn-icon">👁️</span>
        <span>Vista Previa</span>
      </a>
      <a 
        :href="material.archivoUrl"
        :download="material.titulo"
        class="file-action-btn download"
      >
        <span class="btn-icon">⬇️</span>
        <span>Descargar</span>
      </a>
    </section>

    <!-- Acciones de Moderación -->
    <section class="moderation-actions">
      <button
        class="action-btn approve"
        :disabled="loading"
        @click="handleApprove"
      >
        <span v-if="loading" class="loading-spinner small"></span>
        <span v-else class="btn-icon">✅</span>
        <span>{{ loading ? 'Procesando...' : 'Aprobar Material' }}</span>
      </button>

      <button
        class="action-btn reject"
        :disabled="loading"
        @click="showRejectModal = true"
      >
        <span class="btn-icon">❌</span>
        <span>Rechazar Material</span>
      </button>
    </section>

    <!-- Modal de Rechazo -->
    <Teleport to="body">
      <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
        <div class="modal-container" role="dialog" aria-labelledby="modal-title">
          <header class="modal-header">
            <h3 id="modal-title" class="modal-title">Rechazar Material</h3>
            <button
              class="modal-close"
              aria-label="Cerrar modal"
              @click="closeRejectModal"
            >
              ✕
            </button>
          </header>

          <div class="modal-body">
            <p class="modal-description">
              Proporciona un motivo claro y constructivo para el rechazo. 
              Este mensaje será visible para el alumno.
            </p>

            <div class="form-group">
              <label for="reject-reason" class="form-label">
                Motivo del rechazo *
              </label>
              <textarea
                id="reject-reason"
                v-model="rejectReason"
                class="form-textarea"
                :class="{ 'has-error': rejectError }"
                placeholder="Ejemplo: El contenido no cumple con los requisitos mínimos de calidad..."
                rows="5"
                maxlength="500"
              ></textarea>
              
              <div class="textarea-footer">
                <span v-if="rejectError" class="error-message">
                  {{ rejectError }}
                </span>
                <span class="char-counter">
                  {{ rejectReason.length }} / 500
                </span>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button
              class="modal-btn secondary"
              @click="closeRejectModal"
            >
              Cancelar
            </button>
            <button
              class="modal-btn danger"
              :disabled="loading"
              @click="handleReject"
            >
              <span v-if="loading" class="loading-spinner small"></span>
              <span v-else>Confirmar Rechazo</span>
            </button>
          </footer>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Material } from '@/types/interfaces4';

// ====================================
//   PROPS
// ====================================
interface Props {
  material: Material;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// ====================================
//   EMITS
// ====================================
interface Emits {
  (e: 'approve', materialId: string, alumnoId: string): void;
  (e: 'reject', materialId: string, alumnoId: string, reason: string): void;
}

const emit = defineEmits<Emits>();

// ====================================
//   ESTADO LOCAL
// ====================================
const showRejectModal = ref(false);
const rejectReason = ref('');
const rejectError = ref('');

// ====================================
//   MÉTODOS
// ====================================

/**
 * Formatea la fecha completa
 */
function formatFullDate(fecha: string | Date): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Obtiene las iniciales del nombre
 */
function getInitials(nombre: string): string {
  if (!nombre) return 'A';
  
  const words = nombre.trim().split(' ');
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  
  return nombre.substring(0, 2).toUpperCase();
}

/**
 * Formatea el tamaño del archivo
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Valida el motivo de rechazo
 */
function validateRejectReason(): boolean {
  rejectError.value = '';
  
  const trimmed = rejectReason.value.trim();
  
  if (!trimmed) {
    rejectError.value = 'El motivo de rechazo es obligatorio';
    return false;
  }
  
  if (trimmed.length < 10) {
    rejectError.value = 'El motivo debe tener al menos 10 caracteres';
    return false;
  }
  
  if (trimmed.length > 500) {
    rejectError.value = 'El motivo no puede exceder 500 caracteres';
    return false;
  }
  
  return true;
}

/**
 * Handler para aprobar material
 */
function handleApprove(): void {
  if (props.loading) return;
  
  const confirmed = confirm(
    `¿Estás seguro de aprobar el material "${props.material.titulo}"?`
  );
  
  if (confirmed) {
    emit('approve', props.material.id, props.material.alumnoId);
  }
}

/**
 * Handler para rechazar material
 */
function handleReject(): void {
  if (!validateRejectReason()) return;
  
  emit('reject', props.material.id, props.material.alumnoId, rejectReason.value.trim());
  closeRejectModal();
}

/**
 * Cierra el modal de rechazo
 */
function closeRejectModal(): void {
  showRejectModal.value = false;
  rejectReason.value = '';
  rejectError.value = '';
}
</script>

<style scoped>
/* ====================================
   CONTENEDOR PRINCIPAL
   ==================================== */
.material-review {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  border: 2px solid #e5e7eb;
}

/* ====================================
   HEADER
   ==================================== */
.review-header {
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.material-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
}

.status-badge {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
  white-space: nowrap;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.upload-date {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
}

/* ====================================
   SECCIONES
   ==================================== */
.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

/* ====================================
   INFORMACIÓN DEL ALUMNO
   ==================================== */
.student-info {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 50%;
}

.info-icon {
  font-size: 1.5rem;
}

.info-details {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.9375rem;
  color: #111827;
  font-weight: 600;
}

/* ====================================
   DETALLES DEL MATERIAL
   ==================================== */
.detail-block {
  margin-bottom: 1rem;
}

.detail-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.detail-description {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
}

.metadata-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 0.375rem;
  white-space: nowrap;
}

.chip.materia {
  background: #dbeafe;
  color: #1e40af;
}

.chip.categoria {
  background: #fce7f3;
  color: #9f1239;
}

.chip.archivo {
  background: #f3e8ff;
  color: #6b21a8;
}

.chip.tamano {
  background: #d1fae5;
  color: #065f46;
}

.tags-container {
  margin-top: 1rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.tag {
  padding: 0.25rem 0.625rem;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

/* ====================================
   ACCIONES DE ARCHIVO
   ==================================== */
.file-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.file-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.file-action-btn.preview {
  color: #3b82f6;
  border-color: #3b82f6;
}

.file-action-btn.preview:hover {
  background: #eff6ff;
}

.file-action-btn.download {
  color: #22c55e;
  border-color: #22c55e;
}

.file-action-btn.download:hover {
  background: #f0fdf4;
}

/* ====================================
   ACCIONES DE MODERACIÓN
   ==================================== */
.moderation-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f3f4f6;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn.approve {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
}

.action-btn.approve:hover:not(:disabled) {
  box-shadow: 0 4px 6px rgba(34, 197, 94, 0.3);
  transform: translateY(-1px);
}

.action-btn.reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.action-btn.reject:hover:not(:disabled) {
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.25rem;
}

/* ====================================
   LOADING SPINNER INLINE
   ==================================== */
.loading-spinner {
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.loading-spinner.small {
  width: 1rem;
  height: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ====================================
   MODAL
   ==================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  margin: 0 0 1.5rem 0;
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #111827;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea.has-error {
  border-color: #ef4444;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
}

.error-message {
  font-size: 0.8125rem;
  color: #ef4444;
  font-weight: 500;
}

.char-counter {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
  margin-left: auto;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.secondary {
  color: #374151;
  background: white;
  border: 2px solid #d1d5db;
}

.modal-btn.secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.modal-btn.danger {
  color: white;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.modal-btn.danger:hover:not(:disabled) {
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.modal-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====================================
   RESPONSIVE
   ==================================== */
@media (max-width: 768px) {
  .material-review {
    padding: 1.25rem;
  }

  .material-title {
    font-size: 1.125rem;
  }

  .moderation-actions {
    flex-direction: column;
  }

  .file-actions {
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>