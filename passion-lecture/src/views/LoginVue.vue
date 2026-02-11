<template>
  <div class="signup-container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin" class="signup-form">
      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input v-model="username" placeholder="Nom d'utilisateur" />
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input v-model="password" type="password" placeholder="Mot de passe" />
      </div>
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
    window.dispatchEvent(new Event('login-success'))
    router.push('/')
  } else {
    alert('Identifiants incorrects')
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.signup-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Jaldi', sans-serif;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.signup-form input {
  padding: 8px;
  margin-top: 5px;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}
.error-msg {
  color: red;
  margin-top: 10px;
}
</style>
