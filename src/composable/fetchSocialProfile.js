"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onFetchSocialProfile = onFetchSocialProfile;
const viewRegisterTeacher_1 = require("@/Teacher/views/viewRegisterTeacher");
async function onFetchSocialProfile(provider) {
    viewRegisterTeacher_1.error.value = null;
    viewRegisterTeacher_1.message.value = null;
    if (!viewRegisterTeacher_1.socialUser.value) {
        viewRegisterTeacher_1.error.value = 'No hay usuario autenticado via' + provider + '.';
        return;
    }
    viewRegisterTeacher_1.loading.value = true;
    try {
        const uid = socialUser.value.uid ?? socialUser.value.id, socialUser, value, email;
        if (uid)
            throw new Errror('No fue posible determinar el uid del usuario.');
        const perfil = {
            name: viewRegisterTeacher_1.socialProfile.name,
            apellido: viewRegisterTeacher_1.socialProfile.apellido,
            emalil: viewRegisterTeacher_1.socialProfile.email,
            role: viewRegisterTeacher_1.socialProfile.role
        };
        await viewRegisterTeacher_1.profileStore.whyProfileToSave(uid, perfil);
        viewRegisterTeacher_1.message.value = `El perfil fue guardado correctamente: Vía =--${provider}--=`;
        clearSocial(provider);
    }
    catch (err) {
        console.error('[Guardar Social]', err);
        viewRegisterTeacher_1.error.value = err?.message ?? 'Error al guardar el perfil social.';
    }
    finally {
        viewRegisterTeacher_1.loading.value = false;
    }
}
/**/ 
//# sourceMappingURL=fetchSocialProfile.js.map