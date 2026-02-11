<template>
  <div class="auth-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
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

const handleSignUp = async () => {
  // Hash password with salt rounds (10)
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password.value, salt)

  const newUser = {
    username: username.value,
    password: hashedPassword,
    entryDate: new Date().toISOString().split('T')[0],
    bookNumber: '0',
    rateNumber: 0,
    commentnumber: 0,
    isAdmin: false,
  }

  try {
    await axios.post('http://localhost:3000/users', newUser)
    alert('Registration successful!')
    router.push('/login')
  } catch (error) {
    console.error('Signup failed', error)
  }
}
</script>
