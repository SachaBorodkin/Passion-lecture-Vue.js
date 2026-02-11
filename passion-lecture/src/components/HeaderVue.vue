<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)

const checkUser = () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
}

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  window.location.reload() // Simple way to refresh UI
}

onMounted(() => {
  checkUser()
})
</script>

<template>
  <header class="main-header">
    <div class="logo">My App</div>

    <nav>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>

        <li v-if="!user"><a href="/signup">Create Account</a></li>

        <li v-else>
          <span
            >Welcome, <strong>{{ user.username }}</strong></span
          >
          <button @click="logout" class="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  </header>
</template>
