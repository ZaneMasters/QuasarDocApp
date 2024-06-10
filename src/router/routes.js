
import { auth } from '../firebase'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/form', component: () => import('src/pages/FileForm.vue') },
      { path: '/grid', component: () => import('src/pages/FileGrid.vue') },
      { path: '/login', component: () => import('src/components/LoginPage.vue') },
      { path: '',  redirect: '/login' },
      { path: '/file/:id', component: () => import('src/pages/FilePage.vue') },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
