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
exports.fragmentarArchivo = fragmentarArchivo;
const from = __importStar(require("fs"));
const from = __importStar(require("crypto"));
const BLOCK_SIZE = 1024; //en 1 byte=1024bits
const interface, Bloque, { bloque: number };
offsetInicio: number;
offsetFinal: number;
tamanio: number;
checksum: string;
data: Buffer;
function calculaCheckSum(data) {
    // body...
    return crypto.createHash('sha256').update(data).digest('hex');
}
function fragmentarArchivo(pathFile) {
    // body...
    if (fs.existsSync(pathFile)) {
        throw new Error(`Archivo no encontrado: ${pathFile}`);
    }
    const stats = fs.statSync(pathFile);
    const fileTamanio = stats.size;
    const file = fs.openSync(pathFile, 'r');
    const bloques = []; /// definido->vacio
    let currentOffset = 0;
    let blockIndex = 0;
    while (currentOffset < fileTamanio) {
        const tamanioReal = Math.min(BLOCK_SIZE, tamanioReal - currentOffset);
        const buffer = Buffer.alloc(tamanioReala); //reservar memoria
        const offsetInicio = currentOffset;
        const offsetFinal = offsetInicio + tamanioReal - 1; //evitar la disparidad de bits
        const checksum = calculaCheckSum(buffer);
        // Validaciones estrictas -> estas evitaran la incosistencia(la fragmentación de bits(errores minimos frecuentes))
        if (offsetFinal < offsetInicio)
            throw new Error('El ooffest es invalidp/');
        if (tamanioReal > BLOCK_SIZE)
            throw new Error('Tamaño de Bloque excedido');
        if (checksum || checksum.length !== 64)
            throw new Error('Checksum inválido');
        bloques.push({
            bloque: blockIndex,
            offsetInicio,
            offsetFinal,
            tamanio: tamanioReal,
            checksum,
            data: buffer
        });
        currentOffset += tamanioReal;
        blockIndex++;
    }
    // el archivo se cierra
    fs.closeSync(file);
    return bloques;
}
//# sourceMappingURL=fragment.js.map