   <!-- Quedaria en lugar del script del perfil, que esta en la raiz de
       vistas, no se llevo a cabo, porque garantizan caracteristicas no 
       contempladas. En lugar de ello, 'HomeView' tomara el credito
       siendo mas que una vista de Inicio, por eso en bolilerplate
       es funcional, pero no se ocupa en este proyecto porque 
       serian vistas con la funcionalidad muy parecida.  
     ./viewProfileUser.origin.vue -->
<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-600">Gestiona tu información personal</p>
      </div>
      
      <div class="text-right text-sm text-gray-600">
        <p>Actualizaciones restantes: <span class="font-semibold">{{ updatesRemaining }}</span></p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="spinner w-12 h-12"></div>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Foto de Perfil -->
        <div class="card text-center">
          <div class="relative inline-block">
            <img
              v-if="profile.photoURL"
              :src="profile.photoURL"
              alt="Foto de perfil"
              class="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
            />
            <div
              v-else
              class="w-32 h-32 rounded-full bg-gradient-student flex items-center justify-center mx-auto text-white text-4xl font-bold"
            >
              {{ getInitials(profile.nombre) }}
            </div>

            <!-- Botón de carga -->
            <label
              class="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg"
            >
              <span class="text-xl">📷</span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handlePhotoUpload"
              />
            </label>
          </div>

          <h3 class="mt-4 font-bold text-gray-900 text-lg">
            {{ profile.nombre }} {{ profile.apellido }}
          </h3>
          <p class="text-sm text-gray-600">{{ profile.email }}</p>
          
          <span 
            class="inline-block mt-2 badge"
            :class="profile.role === 'profesor' ? 'badge-info' : 'badge-primary'"
          >
            {{ profile.role === 'profesor' ? '👨‍🏫 Profesor' : '👨‍🎓 Estudiante' }}
          </span>

          <!-- Botones de acción -->
          <div class="mt-4 space-y-2">
            <button
              v-if="profile.photoURL"
              @click="deletePhoto"
              class="btn btn-ghost w-full text-sm"
            >
              🗑️ Eliminar foto
            </button>
          </div>
        </div>

        <!-- Menú de Navegación -->
        <div class="card">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3"
              :class="activeTab === tab.id 
                ? 'bg-primary-50 text-primary-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'"
            >
              <span class="text-xl">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="lg:col-span-2">
        <!-- Tab: Información Personal -->
        <div v-if="activeTab === 'personal'" class="card">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Información Personal</h2>
          
          <form @submit.prevent="updatePersonalInfo" class="space-y-4">
            <!-- Nombre -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Nombre *</label>
                <input
                  v-model="formData.nombre"
                  type="text"
                  class="input"
                  required
                />
              </div>

              <div>
                <label class="label">Apellido</label>
                <input
                  v-model="formData.apellido"
                  type="text"
                  class="input"
                />
              </div>
            </div>

            <!-- Email (solo lectura) -->
            <div>
              <label class="label">Correo Electrónico</label>
              <input
                :value="profile.email"
                type="email"
                class="input bg-gray-100 cursor-not-allowed"
                disabled
              />
              <p class="text-xs text-gray-500 mt-1">
                Para cambiar tu correo, ve a la pestaña "Seguridad"
              </p>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="label">Teléfono</label>
              <input
                v-model="formData.telefono"
                type="tel"
                class="input"
                placeholder="+52 123 456 7890"
              />
            </div>

            <!-- Campos específicos para estudiantes -->
            <div v-if="profile.role === 'alumno'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Carrera</label>
                <input
                  v-model="formData.carrera"
                  type="text"
                  class="input"
                />
              </div>

              <div>
                <label class="label">Curso</label>
                <input
                  v-model="formData.curso"
                  type="text"
                  class="input"
                />
              </div>
            </div>

            <!-- Biografía -->
            <div>
              <label class="label">Biografía</label>
              <textarea
                v-model="formData.biografia"
                class="input"
                rows="4"
                placeholder="Cuéntanos sobre ti..."
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 justify-end pt-4">
              <button
                type="button"
                @click="resetForm"
                class="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="saving"
              >
                <span v-if="!saving">💾 Guardar cambios</span>
                <span v-else class="flex items-center gap-2">
                  <span class="spinner"></span>
                  Guardando...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Tab: Seguridad -->
        <div v-if="activeTab === 'security'" class="space-y-6">
          <!-- Cambiar Contraseña -->
          <div class="card">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>
            
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="label">Contraseña Actual *</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.current"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="input pr-12"
                    required
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>

              <div>
                <label class="label">Nueva Contraseña *</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.new"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="input pr-12"
                    required
                    minlength="6"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {{ showNewPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label class="label">Confirmar Nueva Contraseña *</label>
                <input
                  v-model="passwordForm.confirm"
                  type="password"
                  class="input"
                  required
                />
              </div>

              <div class="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  @click="resetPasswordForm"
                  class="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="savingPassword"
                >
                  <span v-if="!savingPassword">🔒 Cambiar contraseña</span>
                  <span v-else class="flex items-center gap-2">
                    <span class="spinner"></span>
                    Cambiando...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Cambiar Email -->
          <div class="card">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Cambiar Correo Electrónico</h2>
            
            <form @submit.prevent="changeEmail" class="space-y-4">
              <div>
                <label class="label">Email Actual</label>
                <input
                  :value="profile.email"
                  type="email"
                  class="input bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label class="label">Nuevo Email *</label>
                <input
                  v-model="emailForm.newEmail"
                  type="email"
                  class="input"
                  required
                />
                <p v-if="profile.role === 'alumno'" class="text-xs text-gray-500 mt-1">
                  Debe ser un correo institucional @alumno.uaemex.mx
                </p>
              </div>

              <div>
                <label class="label">Contraseña Actual *</label>
                <input
                  v-model="emailForm.password"
                  type="password"
                  class="input"
                  required
                />
              </div>

              <div class="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  @click="resetEmailForm"
                  class="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="savingEmail"
                >
                  <span v-if="!savingEmail">📧 Cambiar email</span>
                  <span v-else class="flex items-center gap-2">
                    <span class="spinner"></span>
                    Cambiando...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tab: Estadísticas -->
        <div v-if="activeTab === 'stats'" class="card">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Estadísticas de Cuenta</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">Fecha de registro</span>
              <span class="font-semibold">{{ formatDate(profile.fechaActualizacion) }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">Actualizaciones de perfil</span>
              <span class="font-semibold">{{ profile.updateCount || 0 }} / {{ maxUpdates }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">Última actualización</span>
              <span class="font-semibold">{{ formatDate(profile.fechaActualizacion) }}</span>
            </div>

            <div class="flex items-center justify-between py-3">
              <span class="text-gray-600">Tipo de cuenta</span>
              <span class="badge" :class="profile.role === 'profesor' ? 'badge-info' : 'badge-primary'">
                {{ profile.role === 'profesor' ? 'Profesor' : 'Estudiante' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore2';
import { ProfileService } from '@/services/ProfileService';
import { ToastService } from '@/services/ToastService';
import type { ProfileData } from '@/services/ProfileService';

const authStore = useAuthStore();

// State
const loading = ref(false);
const saving = ref(false);
const savingPassword = ref(false);
const savingEmail = ref(false);
const activeTab = ref('personal');

const profile = ref<ProfileData>({
  nombre: '',
  email: '',
  role: 'alumno',
  updateCount: 0,
});

const formData = reactive({
  nombre: '',
  apellido: '',
  telefono: '',
  carrera: '',
  curso: '',
  biografia: '',
});

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: '',
});

const emailForm = reactive({
  newEmail: '',
  password: '',
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

// Tabs
const tabs = [
  { id: 'personal', label: 'Información Personal', icon: '👤' },
  { id: 'security', label: 'Seguridad', icon: '🔒' },
  { id: 'stats', label: 'Estadísticas', icon: '📊' },
];

// Computed
const isTeacher = computed(() => authStore.role === 'profesor');
const maxUpdates = computed(() => isTeacher.value ? 7 : 5);
const updatesRemaining = computed(() => 
  maxUpdates.value - (profile.value.updateCount || 0)
);

// Methods
const loadProfile = async () => {
  if (!authStore.user?.uid) return;

  loading.value = true;

  try {
    const data = await ProfileService.getProfile(authStore.user.uid, isTeacher.value);
    
    if (data) {
      profile.value = data;
      
      // Copiar a formData
      formData.nombre = data.nombre;
      formData.apellido = data.apellido || '';
      formData.telefono = data.telefono || '';
      formData.carrera = data.carrera || '';
      formData.curso = data.curso || '';
      formData.biografia = data.biografia || '';
    }
  } catch (error: any) {
    ToastService.error('Error', error.message || 'Error al cargar el perfil');
  } finally {
    loading.value = false;
  }
};

const updatePersonalInfo = async () => {
  if (updatesRemaining.value <= 0) {
    ToastService.error('Límite alcanzado', 'Has alcanzado el límite de actualizaciones');
    return;
  }

  saving.value = true;

  try {
    await ProfileService.updateProfile(
      authStore.user!.uid,
      isTeacher.value,
      formData
    );

    ToastService.success('¡Perfil actualizado!', 'Tus cambios han sido guardados');
    await loadProfile();
  } catch (error: any) {
    ToastService.error('Error', error.message || 'Error al actualizar el perfil');
  } finally {
    saving.value = false;
  }
};

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file || !authStore.user?.uid) return;

  loading.value = true;

  try {
    const photoURL = await ProfileService.uploadProfilePhoto(authStore.user.uid, file);
    
    profile.value.photoURL = photoURL;
    
    ToastService.success('¡Foto actualizada!', 'Tu foto de perfil ha sido actualizada');
  } catch (error: any) {
    ToastService.error('Error', error.message || 'Error al subir la foto');
  } finally {
    loading.value = false;
  }
};

const deletePhoto = async () => {
  if (!authStore.user?.uid) return;

  loading.value = true;

  try {
    await ProfileService.deleteProfilePhoto(authStore.user.uid);
    profile.value.photoURL = undefined;
    
    ToastService.success('Foto eliminada', 'Tu foto de perfil ha sido eliminada');
  } catch (error: any) {
    ToastService.error('Error', error.message || 'Error al eliminar la foto');
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    ToastService.error('Error', 'Las contraseñas no coinciden');
    return;
  }

  savingPassword.value = true;

  try {
    await ProfileService.changePassword(passwordForm.current, passwordForm.new);
    
    ToastService.success('¡Contraseña cambiada!', 'Tu contraseña ha sido actualizada');
    resetPasswordForm();
  } catch (error: any) {
    ToastService.error('Error', error.message || 'Error al cambiar la contraseña');
  } finally {
    savingPassword.value = false;
  }
};

const changeEmail = async () => {
  savingEmail.value = true;

  try {
    await ProfileService.changeEmail(
      emailForm.password,
      emailForm.newEmail,
      !isTeacher.value
    );
    
    ToastService.success('¡Email cambiado!', 'Tu correo ha sido actualizado. Por favor, verifica tu nuevo correo.');
    resetEmailForm();
    await loadProfile();
  } catch (error: any) {
    ToastService.error('Error', error.message || 'Error al cambiar el email');
  } finally {
    savingEmail.value = false;
  }
};

const resetForm = () => {
  formData.nombre = profile.value.nombre;
  formData.apellido = profile.value.apellido || '';
  formData.telefono = profile.value.telefono || '';
  formData.carrera = profile.value.carrera || '';
  formData.curso = profile.value.curso || '';
  formData.biografia = profile.value.biografia || '';
};

const resetPasswordForm = () => {
  passwordForm.current = '';
  passwordForm.new = '';
  passwordForm.confirm = '';
};

const resetEmailForm = () => {
  emailForm.newEmail = '';
  emailForm.password = '';
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: any): string => {
  if (!date) return 'N/A';
  
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Lifecycle
onMounted(() => {
  loadProfile();
});
</script>