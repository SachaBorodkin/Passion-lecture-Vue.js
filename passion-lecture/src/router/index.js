import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginVue.vue'
import SignUp from '../views/SignUpVue.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
