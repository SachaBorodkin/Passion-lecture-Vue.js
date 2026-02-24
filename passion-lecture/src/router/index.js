import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
<<<<<<< HEAD
import Login from '../views/LoginVue.vue'
import SignUp from '../views/SignUp.vue'
import BookPageView from '../views/BookPageView.vue'
=======
import Login from '../views/LoginVue.vue' // Your existing login
import SignUp from '../views/SignUp.vue' // The new component
import ListView from '@/views/ListView.vue'

>>>>>>> 1af5852e9406e3342ef4f89916c33aa6df32cced
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: SignUp },
<<<<<<< HEAD
  {
    path: '/book/:id',
    name: 'BookDetails',
    component: BookPageView,
    props: true,
  },
=======
  { path: '/list', name: 'list', component: ListView },
>>>>>>> 1af5852e9406e3342ef4f89916c33aa6df32cced
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
