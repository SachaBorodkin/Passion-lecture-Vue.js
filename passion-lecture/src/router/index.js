import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginVue.vue'
import SignUp from '../views/SignUp.vue'
import BookPageView from '../views/BookPageView.vue'
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: SignUp },
  {
    path: '/book/:id',
    name: 'BookDetails',
    component: BookPageView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
