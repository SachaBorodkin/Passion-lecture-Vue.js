import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginVue.vue'
import SignUp from '../views/SignUp.vue'
import BookPageView from '../views/BookPageView.vue'
import ListView from '@/views/ListView.vue'
import AddView from '../views/AddBook.vue'
import UserView from '@/views/UserView.vue'

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
  {
    path: '/edit-book/:id',
    name: 'edit-book',
    component: () => import('../views/EditBookView.vue'),
  },
  { path: '/list', name: 'list', component: ListView },
  { path: '/addBook', name: 'addBook', component: AddView },
  { path: '/user/:id', name: 'User', component: UserView, props: true },
]

// 1. Define the router FIRST
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 2. NOW you can use router.beforeEach
router.beforeEach((to, from, next) => {
  if (to.name === 'EditBook') {
    const currentUser = JSON.parse(localStorage.getItem('user'))

    // Note: 'fetchBookFromSomeSource' is pseudo-code.
    // You will need to implement actual data fetching here or
    // handle the check within the component itself.
    const bookToEdit = fetchBookFromSomeSource(to.params.id)

    if (currentUser && (currentUser.role === 'admin' || currentUser.id === bookToEdit.userId)) {
      next()
    } else {
      next({ name: 'home' }) // Ensure the name matches your route (case-sensitive)
    }
  } else {
    next()
  }
})

export default router
