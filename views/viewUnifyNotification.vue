<template>
	<div class="bg-gradient-to-br min-h-screen from-gray-50 dark:from-gray-900">
		<div class="max-w-6xl mx-auto px-4 py-6">
			<!-- Header Principal -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
					<div>
						<h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
							<span class="text-4xl">🔔</span>
							<span>Notificaciones</span>
						</h1>
						<p class="text-gray-600 dark:text-gray-400 mt-1">
							{{ unreadCount }} Sin Leer de {{ totalNotifications }}
						</p>
					</div>

					<div class="flex gap-3">
						<button
							v-if="unreadCount > 0"
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
							@click="handleMarkAllAsRead"
						>
							<span class="text-lg">✓</span>
							<span class="hidden sm:inline">Marcar todas</span>
						</button>
						<button
							class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							:disabled="loading"
							@click="loadNotifications"
						>
							<span :class="{ 'animate-spin': loading }" class="text-lg">🔄</span>
						</button>
					</div>
				</div>

				<!-- Alerta de Error -->
				<Transition name="fade">
					<div
						v-if="error"
						class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
					>
						<div class="flex items-start gap-3">
							<span class="text-2xl flex-shrink-0">⚠️</span>
							<div class="flex-1">
								<h3 class="font-semibold text-red-800 dark:text-red-300">Error</h3>
								<p class="text-red-700 dark:text-red-400 text-sm mt-1">{{ error }}</p>
							</div>
							<button
								class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
								@click="clearError"
							>
								✕
							</button>
						</div>
					</div>
				</Transition>
			</div>

			<!-- Tabs de Filtrado -->
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl mb-6 p-4">
				<div class="flex flex-wrap gap-2">
					<button
						v-for="tab in availableTabs"
						:key="tab.id"
						:class="[
							'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
							activeTab === tab.id
								? 'bg-blue-600 text-white shadow-lg'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
						]"
						@click="activeTab = tab.id"
					>
						<span class="text-lg">{{ tab.icon }}</span>
						<span>{{ tab.label }}</span>
						<span
							v-if="tab.count > 0"
							class="ml-1 px-2 py-0.5 text-xs rounded-full"
							:class="activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'"
						>
							{{ tab.count }}
						</span>
					</button>
				</div>
			</div>

			<!-- Contenido Principal -->
			<div class="space-y-4">
				<!-- Estado de Carga -->
				<div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-12 text-center">
					<div class="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
					<p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
						Cargando Notificaciones...
					</p>
				</div>

				<!-- Estado Vacío -->
				<div
					v-else-if="filteredNotifications.length === 0"
					class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-12 text-center"
				>
					<div class="text-8xl mb-4">📭</div>
					<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						No hay Notificaciones
					</h3>
					<p class="text-gray-600 dark:text-gray-400">
						{{ getEmptyMessage() }}
					</p>
				</div>

				<!-- Lista de Notificaciones -->
				<TransitionGroup v-else name="notification-list" tag="div" class="space-y-4">
					<div
						v-for="notification in filteredNotifications"
						:key="notification.id"
						:class="[
							'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl',
							!notification.leido && 'ring-2 ring-blue-500/50'
						]"
					>
						<div class="p-6">
							<div class="flex items-start justify-between">
								<div class="flex items-start gap-4 flex-1">
									<!-- Indicador de Estado -->
									<div
										:class="[
											'w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
											notification.leido
												? 'bg-gray-300 dark:bg-gray-600'
												: 'bg-blue-500 animate-pulse'
										]"
									></div>

									<div class="flex-1 min-w-0">
										<!-- Mensaje -->
										<p class="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
											{{ notification.mensaje }}
										</p>

										<!-- Metadatos -->
										<div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
											<span class="flex items-center gap-1">
												🕐 {{ formatDate(notification.timestamp) || notification.fecha }}
											</span>

											<span
												v-if="notification.estado"
												:class="[
													'px-2 py-0.5 rounded-full text-xs font-medium',
													notification.estado === 'aprobado'
														? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
														: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
												]"
											>
												{{ notification.estado === 'aprobado' ? '✓ Aprobado' : '✕ Rechazado' }}
											</span>

											<span
												v-if="!notification.leido"
												class="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
											>
												📫 Nueva
											</span>
										</div>
									</div>
								</div>

								<!-- Menú de Acciones -->
								<div class="relative ml-4">
									<button
										class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
										@click.stop="toggleMenu(notification.id)"
									>
										<span class="text-xl">⋮</span>
									</button>

									<!-- Dropdown Menu -->
									<Transition name="menu">
										<div
											v-if="activeMenu === notification.id"
											class="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
										>
											<button
												v-if="!notification.leido"
												class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
												@click="handleMarkAsRead(notification.id)"
											>
												<span class="text-lg">✓</span>
												Marcar como leída
											</button>

											<button
												v-if="notification.leido"
												class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
												@click="handleMarkAsUnread(notification.id)"
											>
												<span class="text-lg">📩</span>
												Marcar como NO leída
											</button>

											<button
												v-if="isTeacher && notification.materialId"
												class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
												@click="openStatusModal(notification)"
											>
												<span class="text-lg">📝</span>
												Actualizar estado
											</button>

											<button
												class="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors text-red-600 dark:text-red-400"
												@click="confirmDelete(notification.id)"
											>
												<span class="text-lg">🗑️</span>
												Eliminar
											</button>
										</div>
									</Transition>
								</div>
							</div>
						</div>
					</div>
				</TransitionGroup>
			</div>
		</div>

		<!-- Modal de Confirmación de Eliminación -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showDeleteModal"
					class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					@click.self="showDeleteModal = false"
				>
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
						<div class="text-center mb-6">
							<div class="text-6xl mb-4">⚠️</div>
							<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								¿Deseas Eliminar Notificación?
							</h3>
							<p class="text-gray-600 dark:text-gray-400">
								Esta acción no se puede deshacer
							</p>
						</div>

						<div class="flex gap-3">
							<button
								class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
								@click="showDeleteModal = false"
							>
								Cancelar
							</button>
							<button
								class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
								@click="handleDelete"
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>

		<!-- Modal de Actualización de Estado (Profesores) -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showStatusModal"
					class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					@click.self="showStatusModal = false"
				>
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 transform transition-all">
						<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
							<span class="text-3xl">📝</span>
							Actualizar Estado del Material
						</h3>

						<!-- Selector de Estado -->
						<div class="space-y-4 mb-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Estado
								</label>
								<div class="flex gap-3">
									<button
										:class="[
											'flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
											statusForm.estado === 'aprobado'
												? 'bg-green-600 text-white shadow-lg'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
										]"
										@click="statusForm.estado = 'aprobado'"
									>
										<span>✓</span> Aprobar
									</button>
									<button
										:class="[
											'flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
											statusForm.estado === 'rechazado'
												? 'bg-red-600 text-white shadow-lg'
												: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
										]"
										@click="statusForm.estado = 'rechazado'"
									>
										<span>✕</span> Rechazar
									</button>
								</div>
							</div>

							<!-- Comentario -->
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Comentario
								</label>
								<textarea
									v-model="statusForm.comentario"
									rows="4"
									placeholder="Escribe un comentario acerca de tu decisión..."
									class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 resize-none"
								></textarea>
							</div>
						</div>

						<div class="flex gap-3">
							<button
								class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
								@click="showStatusModal = false"
							>
								Cancelar
							</button>
							<button
								:disabled="!statusForm.estado || !statusForm.comentario.trim()"
								class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								@click="handleUpdateStatus"
							>
								Actualizar
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore.ts';
import { useProfileStore } from '@/stores/profileStore.ts';
import type { Notification } from '@/interfaces/Profile.types.ts';//Camb. por el universal

// =====================
//        STORES
// =====================
const notificationStore = useNotificationStore();
const profileStore = useProfileStore();

// =====================
//        TYPES
// =====================
type TabId = 'all' | 'unread' | 'read' | 'approved' | 'rejected';

   interface Tab {
		id: TabId;
		label: string;
		icon: string;
		count: number;
	}

	interface StatusForm {
		estado: 'aprobado' | 'rechazado' | '';
		comentario: string;
	}

// =====================
//        STATE
// =====================
const activeTab = ref<TabId>('all');
const activeMenu = ref<string | null>(null);
const showDeleteModal = ref<boolean>(false);
const showStatusModal = ref<boolean>(false);
const notificationToDelete = ref<string | null>(null);
const selectedNotification = ref<Notification | null>(null);

const statusForm = ref<StatusForm>({
	estado: '',
	comentario: ''
});

// =====================
//       COMPUTED
// =====================
const loading = computed<boolean>(() => notificationStore.loading);
const error = computed<string | null>(() => notificationStore.error);
const unreadCount = computed<number>(() => notificationStore.unreadCount);
const totalNotifications = computed<number>(() => notificationStore.notifications.length);
const isTeacher = computed<boolean>(() => profileStore.profile?.role === 'teacher');

const availableTabs = computed<Tab[]>(() => {
	const tabs: Tab[] = [
		{
			id: 'all',
			label: 'Todas',
			icon: '📋',
			count: notificationStore.notifications.length
		},
		{
			id: 'unread',
			label: 'No Leídas',
			icon: '📫',
			count: notificationStore.unreadCount
		},
		{
			id: 'read',
			label: 'Leídas',
			icon: '✅',
			count: notificationStore.readNotifications.length
		}
	];

	if (isTeacher.value) {
		tabs.push(
			{
				id: 'approved',
				label: 'Aprobadas',
				icon: '✓',
				count: notificationStore.getNotificationsByStatus('aprobado').length
			},
			{
				id: 'rejected',
				label: 'Rechazadas',
				icon: '✕',
				count: notificationStore.getNotificationsByStatus('rechazado').length
			}
		);
	}

	return tabs;
});

const filteredNotifications = computed<Notification[]>(() => {
	switch (activeTab.value) {
		case 'unread':
			return notificationStore.unreadNotifications;
		case 'read':
			return notificationStore.readNotifications;
		case 'approved':
			return notificationStore.getNotificationsByStatus('aprobado');
		case 'rejected':
			return notificationStore.getNotificationsByStatus('rechazado');
		case 'all':
		default:
			return notificationStore.notifications;
	}
});

// =====================
//       METHODS
// =====================

// --- Data Loading ---
const loadNotifications = async (): Promise<void> => {
	try {
		await notificationStore.loadNotifications();
	} catch (err) {
		console.error('Error al cargar notificaciones:', err);
	}
};

const clearError = (): void => {
	notificationStore.clearError();
};

// --- Mark as Read/Unread ---
const handleMarkAsRead = async (notificationId: string): Promise<void> => {
	try {
		await notificationStore.markAsRead(notificationId);
		activeMenu.value = null;
	} catch (err) {
		console.error('Error al marcar como leída:', err);
	}
};

const handleMarkAsUnread = async (notificationId: string): Promise<void> => {
	try {
		await notificationStore.markAsUnread(notificationId);
		activeMenu.value = null;
	} catch (err) {
		console.error('Error al marcar como no leída:', err);
	}
};

const handleMarkAllAsRead = async (): Promise<void> => {
	try {
		await notificationStore.markAllAsRead();
	} catch (err) {
		console.error('Error al marcar todas como leídas:', err);
	}
};

// --- Delete ---
const confirmDelete = (notificationId: string): void => {
	notificationToDelete.value = notificationId;
	showDeleteModal.value = true;
	activeMenu.value = null;
};

const handleDelete = async (): Promise<void> => {
	if (!notificationToDelete.value) return;

	try {
		await notificationStore.deleteNotification(notificationToDelete.value);
		showDeleteModal.value = false;
		notificationToDelete.value = null;
	} catch (err) {
		console.error('Error al eliminar la notificación:', err);
	}
};

// --- Status Update (Teachers) ---
const openStatusModal = (notification: Notification): void => {
	selectedNotification.value = notification;
	statusForm.value = {
		estado: '',
		comentario: ''
	};
	showStatusModal.value = true;
	activeMenu.value = null;
};

const handleUpdateStatus = async (): Promise<void> => {
	if (!selectedNotification.value || !statusForm.value.estado || !statusForm.value.comentario.trim()) {
		return;
	}

	try {
		await notificationStore.updateMaterialStatus(
			selectedNotification.value.id,
			statusForm.value.estado,
			statusForm.value.comentario
		);
		showStatusModal.value = false;
		selectedNotification.value = null;
	} catch (err) {
		console.error('Error al actualizar estado:', err);
	}
};

// --- UI Helpers ---
const toggleMenu = (notificationId: string): void => {
	activeMenu.value = activeMenu.value === notificationId ? null : notificationId;
};

const formatDate = (date: unknown): string => {
	if (!date) return 'Fecha no disponible';

	try {
		const d = (date as { toDate?: () => Date }).toDate
			? (date as { toDate: () => Date }).toDate()
			: new Date(date as string | number);

		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Justo ahora';
		if (minutes < 60) return `Hace ${minutes} min`;
		if (hours < 24) return `Hace ${hours} horas`;
		if (days < 7) return `Hace ${days} días`;

		return d.toLocaleDateString('es-MX', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	} catch {
		return 'Fecha inválida';
	}
};

const getEmptyMessage = (): string => {
	switch (activeTab.value) {
		case 'unread':
			return 'No tienes notificaciones sin leer';
		case 'read':
			return 'No tienes notificaciones leídas';
		case 'approved':
			return 'No hay materiales aprobados';
		case 'rejected':
			return 'No hay materiales rechazados';
		default:
			return 'Todavía no tienes notificaciones';
	}
};

const handleClickOutside = (event: MouseEvent): void => {
	const target = event.target as HTMLElement;
	if (!target.closest('.relative')) {
		activeMenu.value = null;
	}
};

// =====================
//     LIFECYCLE
// =====================
onMounted(async () => {
	await loadNotifications();
	document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Animaciones para lista de notificaciones */
.notification-list-enter-active,
.notification-list-leave-active {
	transition: all 0.3s ease;
}

.notification-list-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.notification-list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.notification-list-move {
	transition: transform 0.3s ease;
}

/* Animación del menú dropdown */
.menu-enter-active,
.menu-leave-active {
	transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
	transform: translateY(-10px) scale(0.95);
}

/* Animación de modales */
.modal-enter-active,
.modal-leave-active {
	transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
	transform: scale(0.9) translateY(20px);
}

/* Animación fade para alertas */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>