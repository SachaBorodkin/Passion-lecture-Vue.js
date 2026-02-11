<template>
  <header class="app-header">
    <nav>
      <router-link to="/">Accueil</router-link>

      <div v-if="isLoggedIn" class="user-profile">
        <img
          src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
          alt="Avatar"
          class="avatar"
        />
        <span>{{ currentUser.username }}</span>
        <button @click="logout" class="logout-btn">Déconnexion</button>
      </div>

      <router-link v-else to="/login" class="login-link"> Se connecter </router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(false)
const currentUser = ref(null)
const router = useRouter()

const checkLoginStatus = () => {
  const user = localStorage.getItem('user')
  if (user) {
    isLoggedIn.value = true
    currentUser.value = JSON.parse(user)
  } else {
    isLoggedIn.value = false
    currentUser.value = null
  }
}

const logout = () => {
  localStorage.removeItem('user')
  checkLoginStatus()
  router.push('/login')
}

// Check status when component loads
onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #ccc;
}

.login-link {
  text-decoration: none;
  font-weight: bold;
  color: #42b983;
}

.logout-btn {
  background: none;
  border: 1px solid #ccc;
  cursor: pointer;
  padding: 2px 8px;
  font-size: 0.8rem;
}
</style>
