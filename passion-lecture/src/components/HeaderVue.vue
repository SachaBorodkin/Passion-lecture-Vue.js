<template>
  <header>
    <div class="header">
      <router-link to="/"><img src="../assets/logo.svg" class="logo" /></router-link>
      <div class="auth-area">
        <nav>
          <router-link to="/list">Ouvrages</router-link>
          <router-link to="/addbook">Ajouter un livre</router-link>

          <div v-if="user" class="profile">
            <p>Bonjour {{ user.username }}</p>
            <router-link :to="{ name: 'User', params: { id: user.id } }"
              ><img src="../../public/avatar.png" class="avatar"
            /></router-link>
          </div>
          <div v-else class="auth-links">
            <router-link to="/login">Se connecter</router-link>
            <span> | </span>
            <router-link to="/register">S'inscrire</router-link>
          </div>
        </nav>
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

header {
  width: 100%;
  background: #0d1526;
}
.header {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  height: 56px;
  box-sizing: border-box;
}

.logo {
  display: flex;
  height: 36px;
}

nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header a {
  text-decoration: none;
  font-family: 'Jaldi', sans-serif;
  font-size: 17px;
  color: #e2e8f0;
  transition: color 0.2s ease;
}

.header a:hover {
  color: #ffffff;
}

.header a.router-link-active {
  color: #3ecf8e;
}

.header p {
  font-family: 'Jaldi', sans-serif;
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #334155;
  display: block;
  transition: border-color 0.2s;
}

.avatar:hover {
  border-color: #3ecf8e;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-links span {
  color: #475569;
  font-family: 'Jaldi', sans-serif;
  font-size: 16px;
}
</style>
