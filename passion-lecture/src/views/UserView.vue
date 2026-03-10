<script setup>
// ============================================================
//  UserView.vue  —  Page de profil de l'utilisateur connecté
// ============================================================
//
//  FLUX D'APPEL API :
//  ------------------
//  Au montage :
//    1. getUserById(localUser.id)  →  GET /users/:id
//       → On recharge les données fraîches depuis la DB (pas juste le localStorage)
//       → Utile si d'autres onglets ont modifié les compteurs
//
//  Au clic "Supprimer le compte" :
//    2. deleteUser(id)  →  DELETE /users/:id
//       → json-server supprime l'entrée dans db.json
//
//  POURQUOI RELIRE L'API AU LIEU DU LOCALSTORAGE SEUL ?
//  -----------------------------------------------------
//  Le localStorage peut être désynchronisé (bookNumber ancien, etc.)
//  On lit depuis l'API pour avoir les données les plus à jour.
//
// ============================================================

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserById, deleteUser } from '@/api/users' // R + D

const router = useRouter()
const currentUser = ref(null) // Données de l'utilisateur connecté
const loading = ref(true)

onMounted(async () => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    // Pas de session → redirige vers login
    router.push('/login')
    return
  }

  const localUser = JSON.parse(userData) // Données locales (potentiellement périmées)

  try {
    // ── READ ──────────────────────────────────────────────────────────────
    //  GET /users/:id → charge les données fraîches depuis la DB
    //  Si l'utilisateur a ajouté des livres dans un autre onglet,
    //  bookNumber sera à jour ici.
    const { data: freshData } = await getUserById(localUser.id)
    currentUser.value = freshData
    localStorage.setItem('user', JSON.stringify(freshData)) // Synchronise le localStorage
  } catch (err) {
    console.error('Failed to sync user data:', err)
    currentUser.value = localUser // Fallback : on utilise les données locales si l'API plante
  } finally {
    loading.value = false
  }
})

function logout() {
  localStorage.removeItem('user') // Supprime la session locale
  window.location.href = '/' // Recharge la page (pour réinitialiser tous les states)
}

async function deleteAccount() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'))
    return

  try {
    // ── DELETE ────────────────────────────────────────────────────────────
    //  DELETE /users/:id → supprime définitivement le compte dans db.json
    await deleteUser(currentUser.value.id)
    localStorage.removeItem('user') // Supprime aussi la session locale
    alert('Compte supprimé avec succès.')
    window.location.href = '/' // Retour à l'accueil
  } catch (err) {
    console.error('Error deleting account:', err)
  }
}
</script>

<template>
  <div class="profile-container">
    <div v-if="loading">Chargement du profil...</div>

    <div v-else-if="currentUser" class="profile-card">
      <header class="profile-header">
        <h1>Bonjour, {{ currentUser.username }} !</h1>
        <span v-if="currentUser.isAdmin" class="admin-badge">Administrateur</span>
      </header>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.bookNumber || 0 }}</span>
          <span class="stat-label">Livres ajoutés</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.rateNumber || 0 }}</span>
          <span class="stat-label">Notes données</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.commentnumber || 0 }}</span>
          <span class="stat-label">Commentaires</span>
        </div>
      </div>

      <hr />

      <div class="account-settings">
        <h3>Paramètres du compte</h3>
        <p><strong>Membre depuis le :</strong> {{ currentUser.entryDate }}</p>
        <p><strong>ID Utilisateur :</strong> {{ currentUser.id }}</p>

        <div class="actions">
          <button @click="logout" class="btn-logout">Se déconnecter</button>
          <button @click="deleteAccount" class="btn-delete">Supprimer le compte</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.profile-container {
  font-family: 'Jaldi', sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}
.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}
.admin-badge {
  background: #ff4757;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
  text-align: center;
}
.stat-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}
.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #148867;
}
.stat-label {
  font-size: 0.9rem;
  color: #666;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-logout {
  background-color: #148867;
  color: black;
}
.btn-delete {
  background-color: #f1f1f1;
  color: #ff4757;
}
button:hover {
  opacity: 0.8;
}
hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
</style>
