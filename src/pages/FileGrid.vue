<template>
  <q-page>
    <q-toolbar class="q-mt-lg">
      <q-toolbar-title>Documentos</q-toolbar-title>
      <router-link to="/form">
        <q-btn label="Agregar Archivo" />
      </router-link>
    </q-toolbar>
    <q-page-container style="padding-left: 0; padding-right: 0; margin-top: 0;">
      <q-page class="q-pa-md">
        <div class="row justify-center">
          <div class="col-md-10">
            <div class="row justify-center">
              <q-card v-for="file in files" :key="file.id" class="col-md-4 col-sm-6 q-mb-md q-col-gutter-md" :class="{ 'selected-card': file.pinned }" style="margin: 20px;">
                <q-card-section class="q-pa-none">
                  <q-item>
                    <q-item-section>
                      <div class="text-h6">{{ file.fileName }}</div>
                      <div class="text-subtitle2">{{ file.name }} {{ file.surname }}</div>
                    </q-item-section>
                    <q-item-section side class="text-right">
                      <q-checkbox v-model="file.pinned" label="Fijar" />
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <div class="image-container" style="height: 300px;">
                  <!-- Aplicamos un estilo para mantener una proporción de aspecto 1:1 -->
                  <q-img :src="file.fileUrl" class="q-ma-md" style="width: 85%; height: 100%; object-fit: cover;" />
                </div>
                <q-card-actions align="around">
                  <router-link :to="`/file/${file.id}`">
                    <q-btn icon="info" />
                  </router-link>
                  <q-btn icon="edit" @click="editFile(file)" />
                  <q-btn icon="delete" @click="deleteFile(file.id)" :disable="file.pinned" />
                  <q-btn icon="send" @click="sendFile(file.id)" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="editPopup">
      <q-card style="width: 80vw; max-width: 600px;">
        <q-card-section class="q-pa-lg">
          <q-input v-model="editedFile.name" label="Nombre" />
          <q-input v-model="editedFile.surname" label="Apellido" />
          <q-input v-model="editedFile.fileName" label="Nombre del Archivo" />
          <q-input v-model="editedFile.pageCount" label="Cantidad de Páginas" type="number" />
        </q-card-section>
        <q-card-actions align="right" class="q-ma-md">
          <q-btn label="Cancelar" color="negative" @click="closeEditPopup" />
          <q-btn label="Guardar" color="primary" @click="saveEditedFile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useFileStore } from 'src/stores/fileStore';
import Swal from 'sweetalert2';

const fileStore = useFileStore();
const files = ref([]);
const editedFile = ref({
  id: null,
  name: '',
  surname: '',
  fileName: '',
  pageCount: 0,
  fileUrl: '',
  pinned: false
});
const editPopup = ref(false);

const fetchFiles = async () => {
  await fileStore.fetchFiles();
  files.value = fileStore.files;
};

onMounted(fetchFiles);

const editFile = (file) => {
  editedFile.value = { ...file }; 
  editPopup.value = true;
};

const closeEditPopup = () => {
  editPopup.value = false;
};

const saveEditedFile = async () => {
  try {
    await fileStore.updateFile(editedFile.value.id, editedFile.value);
    Swal.fire({
      icon: 'success',
      title: 'Archivo Actualizado',
      text: 'Los cambios han sido guardados correctamente.',
    });
    editPopup.value = false;
    const index = files.value.findIndex(f => f.id === editedFile.value.id);
    if (index !== -1) {
      files.value[index] = { ...editedFile.value };
    }
  } catch (error) {
    console.error('Error al guardar el archivo:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al guardar el archivo. Por favor, inténtalo de nuevo más tarde.',
    });
  }
};

const deleteFile = async (id) => {
  const result = await Swal.fire({
    title: '¿Estás Seguro de Eliminar?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  if (result.isConfirmed) {
    await fileStore.deleteFile(id);
    Swal.fire('Eliminado', 'El archivo ha sido eliminado.', 'success');
    files.value = files.value.filter(f => f.id !== id);
  }
};

const sendFile = (id) => {
};

watch(() => fileStore.files, (newValue) => {
  files.value = newValue;
});
</script>

<style scoped>
.image-container {
  width: 100%;
  max-height: 250px;
  overflow: hidden;
  position: relative;
}

.selected-card {
  background-color: #f0f0f0;
  transform: scale(0.98);
  transition: background-color 0.3s, transform 0.3s;
}

.q-toolbar {
  justify-content: flex-start;
}

.q-card {
  max-width: 800px; /* Ajusta el ancho de la tarjeta según tus necesidades */
  margin: auto;
}
</style>
