/** Fecha: 09/Oct/2025
 * Autor: Daniel Gómez
 * Validaciónes de registro por Rol
 *  Estructura: validationsRoleRegister = {common, teacher, student, dispatchValidation()}
 * */
export declare const validationsRoleRegister: {
    common: {
        isValidEmail(email: string): boolean;
        isEmailRegistered(email: string): Promise<boolean>;
        isPasswordConfirmed(contrasena: string, confirm: string): boolean;
        isSecurePassword(passwd: string): boolean;
        hasValidateName(name: string): boolean;
        hasValidateSurname(surname: string): boolean;
        aceptarTerminosYCondiciones(accepted: boolean): boolean;
        hasEmptyFields(obj: Record<string, any>): boolean;
        isValidRegisterType(tipoRegistro: string): boolean;
    };
    teacher: {
        hasValidNumCuenta(numCuenta: string): boolean;
        hasValidAcademicArea(area: string): boolean;
        /** Menu de validaciones totales: Formulario Profesor **/
        validateTeacherForm(data: any): boolean;
    };
    student: {
        isCollegeEmail(email: string): boolean;
        isInvalidDomain(email: string): boolean;
        hasValidateAge(age?: number): boolean;
        isUniqueAccount(numCuenta: string, existsAccounts: string[]): boolean;
        accepterTermsStorage(checked: boolean): boolean;
        hasLastName(apellido: string): boolean;
        hasValidEnrollmentYear(email: string): boolean;
        validateStudentForm(data: any): boolean;
    };
    /** * COORDINADOR de validaciones según corresponda su ROL* **/
    dispatchValidation(role: "profesor" | "alumno", formData: any): Promise<boolean>;
};
//# sourceMappingURL=validationsRoleRegister.d.ts.map