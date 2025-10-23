  <template>
      <div v-if="props.event?.role === 'profesor'" class="upload-panel">
        <h2 class="title">Subir Material Educativo</h2>

        <div class="form-container">
           <!-- Entrada del Archivo -->
          <input type="file" @change="handlePDFUpload" accept="application/pdf" class="input-file" />
           <!-- Campos Adicionales al Formulario -->
          <input v-model="form.material_title" placeholder="Título" />
          <input v-model="form.classification" placeholder="Apellido" />
          <input v-model="form.date" placeholder="Fecha" />

            <!-- Vista Previa del Documento(Material) -->
           <div  v-if="pdfBase64" class="preview-container">
              <embed src="embed " type="application/pdf"  width="400px">
           </div>

           <button @click="uploadContent" class="upload-btn">Subir</button>
        </div>
          <!-- Contenedor de Vista Previa -->
        <transition name="fade-slide">
          <div v-if="pdfBase64" class="preview-container">
            <h3 class="subtitle">Vista Previa del Material</h3>
            <embed src="" type="">
          </div>
        </transition>
      </div>
    </template>

<script setup>

 import { ref,defineProps} from 'vue';
 import { useMaterialStore } from '@/stores/materialStore';
 import { useAuthStore } from '@/stores/authStore';  // verficar el inicio de sesion del usuario
  import {materialesValidations, validateMaterialActual, stateOfMaterial} from '@/utils/validations.origin/validationsMaterials.js'; /* *|. * */
  import  {materialAdmValidations} from '@/utils/validations.origin/validationsAdminMaterials.js';
    // import { storage } from '../firebase/config';


      /* -------------------- Stores (estados) -------------------- */
  const auth_store     = useAuthStore();
  const material_store = useMaterialStore();

      /* -------------------- References(referencias) -------------------- */
        const file = ref(null);
  const  pdfBase64 = ref(null);

  const props = defineProps({ event: Object });

  const  form = ref({
    material_title: '',
    classification: '' || null,
              date: new Date().toISOString(),
  });
    
    materialAdmValidations.handlePDFUpload();
    /* -------------------- Manejar el PDF(validar) -------------------- */
  /*function handlePDFUpload(event) {
    const uploaded = event.target.files[0];
      if (uploaded?.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => { 
           pdfBase64.value = reader.result; //estaba aqui  (Intro)
           file.value = uploaded;
       };
            reader.readAsDataURL(uploaded);  
      } else {
        alert("Solo se aceptan archivos PDF.");
      }
  }*/

    /* -------------------- Subida del Material -------------------- */
        async function uploadContent() {
          try{
              /* Validar el inicio de sesion actual */
              if (!auth_store.user || !auth_store.isLoggedInd) {
                 alert('Debese iniciar sesión antes de subir el Material Educativo');
                  return;
              }
                /* Validar que selecciono el Material*/
              if (!file.value) {
                 alert('Por favor selecciona un Material(archivo PDF) antes de subir');
                  return;
              }

                /* Construir las propiedades de material */
                const  material_ready = ref({
                   file_material: file.value,
                  material_title: form.value.material_title,
                  classification: form.value.classification,
                    user_Id: auth_store.user.uid || auth_store.user.email,
                  user_name: auth_store.user.displayName || 'sin registro',
                  email: auth_store.user.email || '',
                   date: form.value.date,
                });

                   // Llamar al metodo del store(aqui se manip el servicio y el estado) 
                  material_store.guardarMateriales(material_ready.value.file_material);

                   // Informamos y/o alertamos al usuario
                 alert(`El material: ${form.value.material_title}, fue subido correctamente`);
          }catch(error){
              console.error(`Error al subir el Material; `,error);
               alert('Ocurrio un error durante la subida del material PDF:', error); 
          }
        }
</script>

<style scoped>
  .upload-panel {
     max-width: 800px;
     margin:  2rem auto;
     padding: 2rem;
     border-radius: 16px;
     background: linear-gradient(135deg, #e9f3ff, #f7fbff);
     box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
     font-family: 'Poppins', sans-serif;
     animation: fadeIn  0.8s ease-out;
     /*display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 500px;*/
  }

  .preview-container {
    margin-top: 10px;
    border: 1px solid #ccc;
     border-radius: 6px;
     overflow: hidden;
  }
  
  .title {
    text-align: center;
    color: #003366;
    margin-bottom: 1.5rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
  
  .form-container {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 10px rgb(0, 0, 0 0.08);
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
     transition:  transform 0.3s ease, box-shadow 0.3s ease;
  }

  .form-container:hover {
    transform: scale(1.01);
    box-shadow: 0 16px 16px rgba(0, 0, 0, 0.012);
  }

  .input-text, .input-file {
     border: 1px solid #c9d7e8;
     border-radius: 8px;
     padding: 10px;
     font-size: 0.95rem;
      transition: all 0.2s ease;
  } 

  .input-text:focus, .input-file:focus {
    border-color: #ob7bff;
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
  }

  .upload-btn {
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
     font-size: 1rem;
     cursor: pointer;
     transition:  background 0.3s ease,transform 0.3s ease;
  }

  .upload-btn: hover {
      background-color: #0056b3;
      transform: translateY(-2px);
  }

  .preview-container {
     margin-top: 2rem;
      background: #fdfdfd;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      padding: 1rem;
      transition: all 0.4s ease;
  }

  .subtitle {
     margin-bottom: 1rem;
     color: #004080;
     font-weight: 500;
     text-align: center;
  }

  /*Animaciones*/

  .fade-slide-enter-active {
     transition:  all  0.5s ease;
  }

  .fade-slide-leave-active {
     transition: all 0.4s ease;
     opacity: 0;
     transform: translateY(10px);
  }


  .fade-slide-enter-from {
    opacity: 0;
     transform: translateY(-15px);
  }

  .fade-slide-enter-to {
       opacity: 1;
     transform: translateY(0);
  }

  @keyframes fadeIn {
      from  {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
  }
</style>