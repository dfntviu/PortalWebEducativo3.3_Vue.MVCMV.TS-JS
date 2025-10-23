"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
function useHighLight() {
    const estado = (0, vue_1.ref)("normal");
    function activar(tipo) {
        estado.value = tipo;
        setTimeOut(() => {
            estado.value = "normal";
        }, 5000); //## regresa a estado base después de 5s##
    }
    return { estado, activar };
}
//# sourceMappingURL=useHighlight.js.map