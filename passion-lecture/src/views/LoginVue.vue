<template>
  <div class="auth-form">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Nom d'utilisateur" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  const { data } = await axios.get(`http://localhost:3000/users?username=${username.value}`)
  const user = data[0]

  if (user && bcrypt.compareSync(password.value, user.password)) {
    localStorage.setItem('user', JSON.stringify(user))
    // Trigger event for HeaderVue to update
    window.dispatchEvent(new Event('login-success'))
    router.push('/')
  } else {
    alert('Identifiants incorrects')
  }
}
</script>
