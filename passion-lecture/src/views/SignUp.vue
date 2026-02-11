<template>
  <div class="signup-container">
    <h2>Créer un compte</h2>
    <form @submit.prevent="handleRegister" class="signup-form">
      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" required placeholder="Entrez votre nom" />
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input v-model="password" type="password" required placeholder="Créez un mot de passe" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Inscription en cours...' : "S'inscrire" }}
      </button>
    </form>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const checkUser = await axios.get(`http://localhost:3000/users?username=${username.value}`)
    if (checkUser.data.length > 0) {
      error.value = "Ce nom d'utilisateur est déjà pris."
      loading.value = false
      return
    }

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
    await axios.post('http://localhost:3000/users', newUser)

    alert('Compte créé avec succès !')
    router.push('/login')
  } catch (err) {
    error.value = "Une erreur est survenue lors de l'inscription."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.signup-container {
  font-family: 'Jaldi', sans-serif;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
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
