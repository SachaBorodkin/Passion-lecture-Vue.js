<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
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
  try {
    const response = await axios.get(`http://localhost:3000/users?username=${username.value}`)
    const user = response.data[0]

    if (user && bcrypt.compareSync(password.value, user.password)) {
      // Store user info in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(user))
      alert(`Welcome back, ${user.username}!`)
      router.push('/')
    } else {
      alert('Invalid username or password')
    }
  } catch (error) {
    console.error('Login error', error)
  }
}
</script>
