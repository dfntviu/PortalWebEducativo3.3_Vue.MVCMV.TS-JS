"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pinia_1 = require("pinia");
const AuthService_ts_1 = __importDefault(require("@/services/AuthService.ts"));
const useAuthStore = (0, pinia_1.defineStore)('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: "",
        errorHistory: [], //📌historial de errores
    }),
    getters: {
        isAuthenticated: (state) => state.user !== null,
        hasError: (state) => state.error !== "",
        userEmail: (state) => state.user?.email ?? null
    },
    actions: {
        /* ----------------
         *   SETTERS
         * ---------------- */
        setUser(user) {
            this.user = user;
        },
        setError(msg) {
            this.error = msg;
            //📌 Traza de Consola
            console.error("[Estado-Error] Error:", msg);
            // 📌 Guarda el historial de Errores
            this.errorHistory.push(`${new Date().toISOString()}- ${msg}`);
        },
        clearError() {
            this.error = "";
        },
        setLoading(value) {
            this.loading = value;
        },
        async login(email, password) {
            this.setLoading(true);
            this.clearError();
            try {
                const user = await AuthService_ts_1.default.login(email, password);
                this.setUser(user);
            }
            catch (err) {
                this.setError(err.message || 'Error de Login');
            }
            finally {
                this.setLoading(false);
            }
        },
        async logout() {
            this.setLoading(true);
            this.clearError();
            try {
                await AuthService_ts_1.default.logout();
                this.setUser(null);
            }
            catch (err) {
                this.setError(err.message || 'Error al cerrar Sesión');
            }
            finally {
                this.setLoading(false);
            }
        },
        async getCurrentUser() {
            this.setLoading(true);
            this.clearError();
            try {
                const user = await AuthService_ts_1.default.getCurrentUser();
                this.setUser(user);
            }
            catch (err) {
                this.setError(err.message || 'Error al Obtener el usuario Actual');
            }
            finally {
                this.setLoading(false);
            }
        },
        async credencialesDeSession(email, password) {
            this.setLoading(true);
            this.clearError();
            try {
                const email = await AuthService_ts_1.default.signInUser(email, null);
                const contrasenia = await AuthService_ts_1.default.signInUser(null, password);
                // this.setUser(user);
                return { Email, contrasenia };
            }
            catch (err) {
                this.setError(err.message || 'Error al Obtener el usuario Actual');
            }
            finally {
                this.setLoading(false);
            }
        },
    },
});
//# sourceMappingURL=authStore.js.map