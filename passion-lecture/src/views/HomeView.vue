<script setup></script>

<template>
  <div class="home">
    <h1><strong>Bienvenue sur ce site des ouvrages</strong></h1>
    <p class="site-description">
      Passion Lecture est une plateforme collaborative dédiée aux passionnés de livres. <br />
      Découvrez, partagez et commentez des ouvrages variés,<br />
      ajoutez vos propres livres et échangez avec la communauté !
    </p>
    <h1>Les 5 dernières ouvrages</h1>
    <a href="/books"><button class="explore-button">Explorer les livres</button></a>

    <!-- Pendant le chargement API, on affiche un message d'attente -->
    <div v-if="loading">Chargement...</div>

    <!-- Une fois les données reçues (loading = false), on affiche les livres -->
    <!-- v-for parcourt le tableau lastFiveBooks et crée une carte pour chaque livre -->
    <div v-else class="book-list">
      <div v-for="book in lastFiveBooks" :key="book.id" class="book-card">
        <router-link :to="{ name: 'BookDetails', params: { id: book.id } }">
          <img :src="book.coverImage || 'default-cover.jpg'" alt="Couverture" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p><strong>Année :</strong> {{ book.publishYear }}</p>
            <p><strong>Catégorie :</strong> {{ book.category }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================
//  HomeView.vue  —  Page d'accueil
// ============================================================
//
//  FLUX D'APPEL API ICI :
//  -----------------------
//  1. Le composant se monte (onMounted)
//  2. → fetchBooks() est appelée
//  3.   → getAllBooks() envoie GET /books via apiClient (axios.js)
//  4.     → json-server répond avec tous les livres en JSON
//  5.   → books.value reçoit le tableau (response.data)
//  6.   → loading.value passe à false
//  7. → Vue re-rend le template : v-if="loading" disparaît, v-else s'affiche
//  8. → lastFiveBooks (computed) filtre automatiquement les 5 plus récents
//
// ============================================================

import { ref, computed, onMounted } from 'vue'
import { getAllBooks } from '@/api/books' // On utilise la fonction centralisée de books.js

// ref() crée une variable réactive : quand sa valeur change, Vue met à jour le template
const books = ref([]) // Tableau vide au départ, sera rempli après l'appel API
const loading = ref(true) // true = "en cours de chargement", affiche le message d'attente

// computed() = valeur calculée automatiquement à chaque fois que books.value change.
// Pas besoin d'appeler une fonction, Vue recalcule tout seul.
const lastFiveBooks = computed(() => {
  // On copie le tableau avec [...] pour ne pas modifier l'original (immuabilité)
  // .sort() compare les dates : le plus récent (b - a) passe en premier
  // .slice(0, 5) garde seulement les 5 premiers
  return [...books.value].sort((a, b) => new Date(b.added) - new Date(a.added)).slice(0, 5)
})

const fetchBooks = async () => {
  try {
    // ↓ getAllBooks() retourne une Promise → await attend la réponse du serveur
    // ↓ La réponse axios a la forme : { data: [...], status: 200, headers: {...} }
    const response = await getAllBooks()
    books.value = response.data // On stocke le tableau de livres dans notre ref()
  } catch (error) {
    // Si l'API est hors ligne ou retourne une erreur, on l'affiche dans la console
    console.error('Erreur API', error)
  } finally {
    // finally s'exécute TOUJOURS (succès ou erreur) → on arrête le chargement
    loading.value = false
  }
}

// onMounted = hook de cycle de vie : s'exécute une seule fois, quand le composant
// est inséré dans le DOM. C'est le bon endroit pour charger des données.
onMounted(fetchBooks)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.home {
  font-family: 'Jaldi', sans-serif;
  justify-content: center;
  font-size: 23px;
  text-align: center;
}
.home a {
  text-decoration: none;
  color: black;
}
.book-list {
  display: flex;
  gap: 20px;
  justify-content: center;
}
.book-card {
  font-size: 20px;
  text-align: center;
  max-width: 200px;
}
.book-card img {
  height: 231px;
  align-items: center;
}
button {
  padding: 8px 16px;
  background-color: #148867;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
.explore-button {
  margin-bottom: 20px;
}
nav a.router-link-exact-active {
  color: #148867;
  font-weight: bold;
}
</style>
