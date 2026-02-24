<template>
  <header class="header">
    <img src="../assets/logo.svg" class="logo" />
    <div class="auth-area">
      <nav>
        <router-link to="/list">Ouvrages</router-link>
        <router-link to="/addbook">Ajouter un livre</router-link>
        <router-link to="/">Accueil</router-link>

        <div v-if="user" class="profile">
          <p v-show="user.isAdmin == true">Bonjour Admin</p>
          <button @click="logout">Déconnexion</button>
          <a href="/user"><img src="../../public/avatar.png" class="avatar" /></a>
        </div>
        <div v-else class="auth-links">
          <router-link to="/login">Se connecter</router-link>
          <span> | </span>
          <router-link to="/register">S'inscrire</router-link>
        </div>
      </nav>
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
  window.addEventListener('login-success', updateStatus)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
body {
  margin: 0;
}
.header a,
.header p {
  text-decoration: none;
  color: white;
  font-family: 'Jaldi', sans-serif;
  font-size: 32px;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #0f172a;
  align-items: center;
}
nav {
  display: flex;
  align-items: center;
  gap: 20px;
}
.avatar {
  width: 80px;
  border-radius: 50%;
  margin-right: 5px;
}
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  height: 63px;
}
</style>
