"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstruirArchivo = reconstruirArchivo;
const from = __importStar(require("fs"));
const fragment_ts_1 = require("./fragment.ts");
function reconstruirArchivo(bloques, outPath) {
    // Logic of bussines for build block of give the other f(n) main
    const bloquesOrdenados = bloques.sort((a, b) => a.bloque);
    const archivo = fs.openSync(outPath, 'w');
    let offsetEsperado = 0;
    for (const bloque of bloquesOrdenados) {
        if (bloque.offsetInicio !== offsetEsperado) {
            throw new Error(`Desalineacion en el bloque ${bloque.bloque}`);
        }
        if (bloque.offsetFinal !== bloque.offsetInicio + bloque.tamanio - 1) {
            throw new Error(`Tamaño inválido en el bloque ${bloque.bloque}`);
        }
        const checkSumActual = (0, fragment_ts_1.calculaCheckSum)(bloque.data);
        if (checkSumActual !== bloque.checksum) {
            throw new Error(`el checksum es invalido en el bloque${bloque.bloque}`);
        }
        // Deberá escribirse la nueva informacion dividida
        fs.writeSync(archivo, bloque.data, 0, bloque.tamanio, offsetEsperado);
        offsetEsperado += bloque.tamanio;
    }
    fs.closeSync(archivo);
}
//# sourceMappingURL=reconstruct.js.map