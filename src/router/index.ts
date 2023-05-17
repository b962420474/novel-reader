import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/main/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/read',
    name: 'read',
    component: () => import('../views/reader/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
