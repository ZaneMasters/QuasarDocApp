<template>
  <q-page class="q-pa-md q-gutter-md" style="max-width: 500px; margin: auto;">
    <q-card class="full-width">
      <q-card-section class="text-h6 text-center">Ingreso de los datos de los Archivos</q-card-section>
      <div class="q-pa-md">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model="fileData.documentId" label="Número de Identificación" type="number" outlined />
        <q-input v-model="fileData.name" label="Nombre" outlined />
        <q-input v-model="fileData.surname" label="Apellido" outlined />
        <q-input v-model="fileData.fileName" label="Nombre del archivo" outlined />
        <q-input v-model="fileData.pageCount" label="Cantidad de páginas" type="number" outlined />
        <q-file v-model="fileData.file" label="Subir archivo" outlined > 
          
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-file>
        
        <q-input v-model="fileData.generatedId" label="Número autogenerado" outlined readonly />
        <div class="text-center q-my-md">
          <q-btn type="submit" label="Guardar" color="primary" />
        </div>
      </q-form>
    </div>
    </q-card>
  </q-page>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useFileStore } from 'src/stores/fileStore';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const fileData = ref({
  documentId: 0,
  name: '',
  surname: '',
  fileName: '',
  pageCount: 0,
  file: null,
  generatedId: '',
});

const fileStore = useFileStore();
const router = useRouter();

const generateId = () => {
  
  return Math.random().toString(36).substr(2, 10); 
};

onMounted(() => {
  fileData.value.generatedId = generateId();
});

const handleSubmit = async () => {
  try {
    await fileStore.addFile(fileData.value);
    Swal.fire({
      icon: 'success',
      title: 'Archivo Guardado',
      text: 'Se Guardo Correctamente',
    }).then(() => {
      router.push('/grid');
    });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al subir el archivo',
      text: 'Ocurrió un error al subir el archivo. Por favor, inténtalo de nuevo.',
    });
  }
};
</script>

  

