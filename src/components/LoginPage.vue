<template>
  <q-page class="q-pa-md">
    <q-page-container class="full-height">
      <q-page class="row items-center justify-center">
        <q-card class="q-col-gutter-md" style="width: 400px;">
          <q-card-section class="q-pt-auto">
            <h2 class="text-h5 text-center q-mb-md">Quasar App</h2> 
            <q-form @submit.prevent="handleLogin">
              <q-input v-model="email" label="Email" type="email" outlined dense class="q-mb-md" />
              <q-input v-model="password" label="Contraseña" type="password" outlined dense class="q-mb-md" />
              <q-btn type="submit" label="Iniciar Sesión" color="primary" class="q-mt-md" />
              <q-btn label="Registrarse" color="positive" @click="handleRegister" class="q-mt-md q-ml-md" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2'; 

const email = ref('');
const password = ref('');
const router = useRouter();

auth.onAuthStateChanged(function(user){
  if (user){
    router.push('/grid');
  }else{
    console.log("no hay una sesion")
  }
})

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/grid');
  } catch (error) {
    console.log(error);
  }
};

const handleRegister = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    
    Swal.fire({
      icon: 'success',
      title: 'Registro Exitoso',
      text: '¡Te has registrado correctamente!',
    });
    console.log("Se registro correctamente");
  } catch (error) {
    console.log(error);
  }
};
</script>









