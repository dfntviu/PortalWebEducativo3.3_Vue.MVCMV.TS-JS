import type Profile from '@/types/interf.index.ts';
export declare class ProfileStudentService {
    static collectionName: string;
    static getStudentById(id: string, role: 'alumno'): Promise<{
        id: string;
    } | null>;
    static saveStudentProfile(student: {
        id?: string;
        nombre: string;
        apellido: string;
        email: string;
        carrera: string;
        curso?: string;
        edad: number;
    }): Promise<{
        nombre: string;
        apellido: string;
        email: string;
        carrera: string;
        curso: string;
        fechaActualizacion: Date;
        edad: number;
        id: string;
    }>;
    static updateStudentProfile(id: string, data: Materiales<Profile>): Promise<void>;
    static mostrarCambiosAplicados(id: string, data: Materiales<Profile>): Promise<void>;
    static getDeleteById(id: string, role: 'alumno'): Promise<boolean>;
    static getStudentProfile(id: string): Promise<Profile | null>;
    static signInAndSaveFBStudent(): {
        uid: any;
        nombre: any;
        apellido: any;
        email: any;
        name_usr: any;
        role: string;
    };
    /** Metodo Lógico_4 -> (29/09/2025)
     * Nuevo Met. de Cambio de Password: Cambiar la contrase del Rol de Estudiante -> [trasladado 29/09/25] */
    static changePasswordAlumno(passwd: any, new_passwd: any): Promise<void>;
    static busquedaDelAlumnoPorNombre(nombre: any): Promise<any>;
    static loadUserProfile(email: string, password: string, role: 'alumno' | 'profesor'): Promise<{
        email: any;
        nombre: any;
        apellido: any;
        fullName: string;
        role: "profesor" | "alumno";
    }>;
}
//# sourceMappingURL=ProfileStudentServ.d.ts.map