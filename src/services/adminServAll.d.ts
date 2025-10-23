import type Profile from '@/types/interf.index.ts';
export declare class adminAllServices {
    static todos_alumnos: string;
    static adminAlumnos(nombre: any): Promise<Profile[]>;
    static adminMaterials(): Promise<any>;
    static totalDeMateriales(material_id: string): Promise<void>;
    static totalDeAlumnos(): Promise<void>;
    static getAllAlumnos(): Promise<any>;
    /** Estadisticas de uso de los materiales **/
    static getResumenDiario(profesorId: string): Promise<string>;
}
//# sourceMappingURL=adminServAll.d.ts.map