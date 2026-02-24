import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginVue.vue' // Your existing login
import SignUp from '../views/SignUp.vue' // The new component
import AddView from '../views/AddBook.vue' // The new component

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: SignUp },
  { path: '/addBook', name: 'addBook', component: AddView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
