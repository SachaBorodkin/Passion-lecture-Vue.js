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
// ============================================================
//  LoginVue.vue  —  Connexion d'un utilisateur
// ============================================================
//
//  FLUX D'APPEL API :
//  ------------------
//  1. L'utilisateur soumet le formulaire → handleLogin()
//  2.   → getUserByUsername(username)
//           GET /users?username=alice
//           → json-server filtre et renvoie les users avec ce username
//           → data[0] = le premier résultat (ou undefined si introuvable)
//  3. On compare le mot de passe entré avec le hash stocké (bcrypt)
//  4. Si OK → on stocke l'utilisateur dans localStorage + redirection
//
//  IMPORTANT : On ne fait qu'UN seul appel API ici (le READ).
//  Le mot de passe n'est jamais stocké en clair : bcrypt.compareSync()
//  vérifie le hash sans avoir besoin de le décrypter.
//
// ============================================================

import { ref } from 'vue'
import { getUserByUsername } from '@/api/users' // READ : cherche le user par username
import bcrypt from 'bcryptjs'
import { useRouter } from 'vue-router'

const username = ref('') // Lié à l'input v-model
const password = ref('') // Lié à l'input v-model
const router = useRouter()

const handleLogin = async () => {
  // ── READ ──────────────────────────────────────────────────────────────────
  //  GET /users?username=alice
  //  json-server filtre les users dont le champ "username" === "alice"
  //  Réponse : tableau ([] si aucun résultat, [user] si trouvé)
  const { data } = await getUserByUsername(username.value)
  const user = data[0] // On prend le premier (et normalement unique) résultat

  if (user && bcrypt.compareSync(password.value, user.password)) {
    // bcrypt.compareSync(motDePasseSaisi, hashStocké)
    // Retourne true si le mot de passe correspond au hash → connexion OK

    localStorage.setItem('user', JSON.stringify(user)) // Sauvegarde la session
    window.dispatchEvent(new Event('login-success')) // Notifie le header pour mettre à jour la nav
    router.push('/') // Redirige vers l'accueil
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
