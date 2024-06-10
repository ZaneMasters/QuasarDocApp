<template>
    <q-page padding>
      <q-toolbar class="q-mt-lg">
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <q-toolbar-title>Detalles del Archivo</q-toolbar-title>
      </q-toolbar>
      <q-page-container style="padding-left: 0; padding-right: 0; margin-top: 0;">
        <q-card class="q-ma-md" flat bordered>
          <q-card-section>
            <div class="text-h6">{{ file.fileName }}</div>
            <div class="text-subtitle2">{{ file.name }} {{ file.surname }}</div>
          </q-card-section>
          <q-img :src="file.fileUrl" class="q-ml-xl" style="height: 300px; max-width: 210px" />
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>ID:</q-item-section>
                <q-item-section>{{ file.documentId }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Nombre:</q-item-section>
                <q-item-section>{{ file.name }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Apellido:</q-item-section>
                <q-item-section>{{ file.surname }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Nombre del archivo:</q-item-section>
                <q-item-section>{{ file.fileName }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>Cantidad de páginas:</q-item-section>
                <q-item-section>{{ file.pageCount }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn icon="edit" label="Editar" @click="openEditPopup" />
            <q-btn icon="delete" label="Eliminar" color="negative" @click="confirmDelete" />
          </q-card-actions>
        </q-card>
      </q-page-container>

      <q-dialog v-model="editPopup" >
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
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useFileStore } from 'src/stores/fileStore';
  import Swal from 'sweetalert2';
  
  const route = useRoute();
  const router = useRouter();
  const fileStore = useFileStore();
  const file = ref({});
  const editPopup = ref(false);
  const editedFile = ref({});
  
  const fetchFile = async () => {
    const fileId = route.params.id;
    file.value = fileStore.files.find(f => f.id === fileId);
    editedFile.value = { ...file.value }; 
    if (!file.value) {
      router.push('/');
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  const openEditPopup = () => {
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
      file.value = { ...editedFile.value };
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el archivo. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };
  
  const confirmDelete = () => {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFile();
      }
    });
  };
  
  const deleteFile = async () => {
    try {
      await fileStore.deleteFile(file.value.id);
      router.push('/');
      Swal.fire({
        icon: 'success',
        title: 'Archivo Eliminado',
        text: 'El archivo ha sido eliminado correctamente.',
      });
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar el archivo. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };
  
  onMounted(fetchFile);
  </script>
  



  
  <style scoped>
  .q-toolbar {
    justify-content: flex-start;
  }
  
  .q-card {
    max-width: 800px; 
    margin: auto;
  }
  </style>
  
  
  
  