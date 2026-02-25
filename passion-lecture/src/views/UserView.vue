<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const loading = ref(true)

onMounted(async () => {
  const userData = localStorage.getItem('user')

  if (!userData) {
    // If no user is logged in, redirect to login or home
    router.push('/login')
    return
  }

  const localUser = JSON.parse(userData)

  try {
    // Fetch fresh data from the DB to get the latest comment/rate counts
    const response = await fetch(`http://localhost:3000/users/${localUser.id}`)
    if (response.ok) {
      const freshData = await response.json()
      currentUser.value = freshData
      // Sync localStorage with the latest stats from DB
      localStorage.setItem('user', JSON.stringify(freshData))
    } else {
      currentUser.value = localUser
    }
  } catch (err) {
    console.error('Failed to sync user data:', err)
    currentUser.value = localUser
  } finally {
    loading.value = false
  }
})

function logout() {
  localStorage.removeItem('user')
  router.push('/')
}

async function deleteAccount() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'))
    return

  try {
    const response = await fetch(`http://localhost:3000/users/${currentUser.value.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      localStorage.removeItem('user')
      router.push('/')
      alert('Compte supprimé avec succès.')
    }
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
