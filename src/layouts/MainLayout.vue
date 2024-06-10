<template>
  <q-layout view="lHh Lpr lff" class="bg-gray">
      <q-header elevated class="bg-cyan-9" v-if="!isLoginPage">
        <q-toolbar>
          <q-toolbar-title class="q-ma-md">Aplicacion de Documentos</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="600"
        v-if="!isLoginPage"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>
              <q-item-section>
                <router-link to="/form">Nuevo</router-link>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <router-link to="/grid">Archivos</router-link>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple class="q-mt-xl">
              <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>
              <q-item-section>
                <span @click="salir">Salir</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-weight-bold">{{idUser}}</div>
            <div>{{ emailUser }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container class="q-pa-md">
        <router-view />
      </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../firebase'

const drawer = ref(false)
const route = useRoute()
const router = useRouter()

const emailUser = ref('')
const idUser = ref('')
const isLoginPage = ref(route.path === '/login')

watch(() => route.path, (newPath) => {
  isLoginPage.value = newPath === '/login' 

if (newPath === '/') {
        router.push("/login");
      }

  auth.onAuthStateChanged(function(user){
    if(user){
      emailUser.value = user.email
      idUser.value = user.uid
    }else{
      router.push("/login")
    }
  })

})


function salir(){
  auth.signOut();
  router.push("/login")
}

</script>





