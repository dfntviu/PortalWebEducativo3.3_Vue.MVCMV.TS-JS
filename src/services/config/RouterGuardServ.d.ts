import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
export declare class RouterGuardService {
    private role;
    private permissionsService;
    constructor(role: Role);
    globalGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void>;
}
//# sourceMappingURL=RouterGuardServ.d.ts.map