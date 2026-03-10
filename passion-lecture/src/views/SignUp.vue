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
// ============================================================
//  SignUp.vue  —  Inscription d'un nouvel utilisateur
// ============================================================
//
//  FLUX D'APPEL API :
//  ------------------
//  1. handleRegister() est appelée
//  2.   → getUserByUsername(username)
//           GET /users?username=alice
//           → vérifie si ce username est déjà pris
//           → si data.length > 0 → username pris → on arrête
//  3. Si username disponible :
//       → hashage du mot de passe avec bcrypt (côté client)
//       → createUser(newUser)
//           POST /users avec les données du nouveau compte
//           → json-server génère un ID et sauvegarde
//  4. Redirection vers /login
//
//  ORDRE : on vérifie le doublon (READ) AVANT de créer (CREATE).
//  Si on créait sans vérifier, on pourrait avoir deux users avec le même username.
//
// ============================================================

import { ref } from 'vue'
import { getUserByUsername, createUser } from '@/api/users' // R + C
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
    // ── READ ────────────────────────────────────────────────────────────────
    //  GET /users?username=alice → vérifie si le username est déjà utilisé
    const checkUser = await getUserByUsername(username.value)
    if (checkUser.data.length > 0) {
      // Si le tableau n'est pas vide → quelqu'un a déjà ce username
      error.value = "Ce nom d'utilisateur est déjà pris."
      loading.value = false
      return // On arrête ici, pas de création
    }

    // Hashage du mot de passe AVANT de l'envoyer au serveur
    // bcrypt.genSaltSync(10) génère un "sel" aléatoire (10 = niveau de complexité)
    // bcrypt.hashSync() combine le mot de passe + le sel pour créer un hash
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password.value, salt)

    // Objet complet pour le nouvel utilisateur
    const newUser = {
      username: username.value,
      password: hashedPassword, // Jamais le mot de passe en clair !
      entryDate: new Date().toISOString().split('T')[0], // "2026-03-10"
      bookNumber: '0',
      rateNumber: 0,
      commentnumber: 0,
      isAdmin: false,
    }

    // ── CREATE ──────────────────────────────────────────────────────────────
    //  POST /users → json-server crée l'utilisateur et lui attribue un ID
    await createUser(newUser)

    alert('Compte créé avec succès !')
    router.push('/login') // Redirige vers la connexion
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
