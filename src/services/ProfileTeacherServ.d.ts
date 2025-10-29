import type Profile from '@/types/interf.index.ts';
export declare class ProfileTeachersService {
    static collectionNameR2: string;
    static getTeacherById(id: string): Promise<{
        id: string;
    } | null>;
    static saveTeacherProfile(teacher: {
        id?: string;
        nombre: string;
        email: string;
        asignaturas?: string[];
    }): Promise<{
        nombre: string;
        email: string;
        asignaturas: string[];
        fechaActualizacion: Date;
        id: string;
    }>;
    /** Metodos de Actualizacion & Obtencion del Perfil **/
    static signInAndSaveGmailTeacher(): Promise<{
        uid: any;
        nombre: any;
        apellido: any;
        email: any;
        role: string;
        fechaRegistro: Date;
    }>;
    static getTeacherProfile(id: string): Promise<Profile | null>;
}
//# sourceMappingURL=ProfileTeacherServ.d.ts.map