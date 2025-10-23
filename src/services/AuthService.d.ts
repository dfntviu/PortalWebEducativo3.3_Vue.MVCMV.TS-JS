/**
 * @file Servicio de Autentificacion
 * @decription Servicio de autentificación: Inicio, cierre y obtención del usuario actual
 *  **/
import { User } from '@/types/interf.index.js';
export declare class AuthService {
    static login(email: string, password: string): Promise<User>;
    static logout(): Promise<void>;
    static getCurrentUser(): Promise<User | null>;
    static signInUser(email: string, password: string): Promise<User | null>;
}
//# sourceMappingURL=AuthService.d.ts.map