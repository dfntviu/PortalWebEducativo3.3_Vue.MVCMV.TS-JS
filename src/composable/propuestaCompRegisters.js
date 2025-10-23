"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const authStore_ts_1 = require("@/stores/authStore.ts");
const profileStore_ts_1 = require("@/stores/profileStore.ts");
// Importar componentes por tipo de registro
const PanelTradicional_vue_1 = __importDefault(require("./panels/PanelTradicional.vue"));
const PanelFacebook_vue_1 = __importDefault(require("./panels/PanelFacebook.vue"));
const PanelGoogle_vue_1 = __importDefault(require("./panels/PanelGoogle.vue"));
const authStore = (0, authStore_ts_1.useAuthStore)();
const profileStore = (0, profileStore_ts_1.useProfileStore)();
const tipoRegistro = (0, vue_1.ref)('');
const animatePanel = (0, vue_1.ref)(false);
const loading = (0, vue_1.ref)(false);
const error = (0, vue_1.ref)(null);
const message = (0, vue_1.ref)(null);
function seleccionarTipo(tipo) {
    tipoRegistro.value = tipo;
    animatePanel.value = false;
    requestAnimationFrame(() => animatePanel.value = true);
}
// Computed para seleccionar el componente correspondiente
const panelActual = (0, vue_1.computed)(() => {
    switch (tipoRegistro.value) {
        case 'tradicional': return PanelTradicional_vue_1.default;
        case 'facebook': return PanelFacebook_vue_1.default;
        case 'google': return PanelGoogle_vue_1.default;
        default: return null;
    }
});
(0, vue_1.onMounted)(() => {
    tipoRegistro.value = 'tradicional';
    animatePanel.value = true;
});
//# sourceMappingURL=propuestaCompRegisters.js.map