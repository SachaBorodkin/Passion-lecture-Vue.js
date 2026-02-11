<template>
  <header class="header">
    <img src="../assets/logo.svg" />
    <div class="auth-area">
      <nav>
        <router-link to="/">Accueil</router-link>
      </nav>
      <div v-if="user" class="profile">
        <img src="../assets/avatar.png" class="avatar" />
        <button @click="logout">Déconnexion</button>
      </div>
      <div v-else class="auth-links">
        <router-link to="/login">Se connecter</router-link>
        <span> | </span>
        <router-link to="/register">S'inscrire</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null)
const router = useRouter()

const updateStatus = () => {
  const data = localStorage.getItem('user')
  user.value = data ? JSON.parse(data) : null
}

const logout = () => {
  localStorage.removeItem('user')
  updateStatus()
  router.push('/login')
}

onMounted(() => {
  updateStatus()
  // Listen for the login event
  window.addEventListener('login-success', updateStatus)
})
</script>

<style scoped>
body {
  margin: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #0f172a;
}
.avatar {
  width: 30px;
  border-radius: 50%;
  margin-right: 5px;
}
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
