<template>
  <h1><strong>Liste de tous les ouvrages</strong></h1>
  <div class="home">
    <div class="filters">
      <div class="recherche">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par titre..."
          class="search-input"
          @keyup.enter="applySearch"
        />
        <button type="button" @click="applySearch">
          <img src="../assets/icons8-loupe.svg" class="loupe-recherche" />
        </button>
      </div>
      <div class="filtrer-livres">
        <h3>Filtrer par catégorie :</h3>
        <select v-model="selectedCategory" class="category-select">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="trier-livres">
        <h3>Trier par :</h3>
        <select v-model="sortOption" class="category-select">
          <option value="addedDesc">Ajoutés récemment</option>
          <option value="added">Plus anciens d'abord</option>
          <option value="title">Titre (A - Z)</option>
          <option value="titleDesc">Titre (Z - A)</option>
          <option value="year">Année (croissant)</option>
          <option value="yearDesc">Année (décroissant)</option>
        </select>
      </div>
    </div>
    <div v-if="loading">Chargement...</div>
    <div v-else class="book-list">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card">
        <router-link :to="{ name: 'BookDetails', params: { id: book.id } }">
          <!-- faire l'objet cliquable -->
          <img :src="book.coverImage || 'default-cover.jpg'" alt="Couverture" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p><strong>Année :</strong> {{ book.publishYear }}</p>
            <p><strong>Catégorie :</strong> {{ book.category }}</p>
            <p><strong>Description :</strong> {{ book.summary }}</p>
            <p class="added-book"><strong>Ajouté le :</strong> {{ book.added }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================
//  ListView.vue  —  Liste de tous les livres avec filtres/tri
// ============================================================
//
//  FLUX D'APPEL API :
//  ------------------
//  1. onMounted → fetchContent()
//  2.   → getAllBooks()  :  GET /books  → tous les livres dans books.value
//  3. loading passe à false → les livres s'affichent
//
//  PAS D'AUTRE APPEL API ICI : la recherche, le filtre et le tri
//  sont faits LOCALEMENT dans le computed filteredBooks, sans retourner
//  au serveur. On charge tout une fois, on filtre côté client.
//
// ============================================================

import { ref, computed, onMounted } from 'vue'
import { getAllBooks } from '@/api/books' // READ : récupère tous les livres

// --- Variables réactives ---
const books = ref([]) // Tous les livres reçus de l'API
const loading = ref(true) // Indicateur de chargement

const searchQuery = ref('') // Ce que l'utilisateur tape dans l'input
const activeSearch = ref('') // Ce qui est réellement appliqué au filtre (déclenché par Entrée ou bouton)

const selectedCategory = ref('') // Catégorie sélectionnée dans le <select>
const sortOption = ref('addedDesc') // Option de tri sélectionnée

// computed : extrait les catégories uniques de tous les livres pour le <select>
// Set() supprime les doublons, [...new Set()] reconvertit en tableau
const categories = computed(() => {
  const allCats = books.value.map((b) => b.category)
  return [...new Set(allCats)]
})

// Appel API : GET /books → stocke tous les livres dans books.value
const fetchContent = async () => {
  try {
    const response = await getAllBooks() // Attend la réponse du serveur
    books.value = response.data // response.data = tableau de tous les livres
  } catch (error) {
    console.error('Erreur lors du chargement du contenu', error)
  } finally {
    loading.value = false // Qu'il y ait une erreur ou non, on arrête le chargement
  }
}

// S'exécute au montage du composant (une seule fois)
onMounted(() => {
  return fetchContent()
})

// computed : calcule dynamiquement la liste affichée selon les filtres et le tri.
// Se recalcule automatiquement quand books.value, activeSearch, selectedCategory
// ou sortOption changent.
const filteredBooks = computed(() => {
  return books.value
    .filter((book) => {
      // Vérifie que le titre contient la recherche (insensible à la casse)
      const matchesSearch = book.title.toLowerCase().includes(activeSearch.value.toLowerCase())
      // Vérifie la catégorie (si '' = toutes les catégories → toujours true)
      const matchesCategory =
        selectedCategory.value === '' || book.category === selectedCategory.value
      return matchesSearch && matchesCategory // Les deux conditions doivent être vraies
    })
    .sort((a, b) => {
      // .sort() compare deux éléments a et b :
      //   retourne < 0 → a avant b
      //   retourne > 0 → b avant a
      //   retourne 0   → ordre inchangé
      switch (sortOption.value) {
        case 'title':
          return a.title.localeCompare(b.title) // Tri alphabétique A→Z
        case 'titleDesc':
          return b.title.localeCompare(a.title) // Tri alphabétique Z→A
        case 'year':
          return a.publishYear - b.publishYear // Année croissante
        case 'yearDesc':
          return b.publishYear - a.publishYear // Année décroissante
        case 'added':
          return a.added - b.added // Date d'ajout croissante
        case 'addedDesc':
        default:
          return new Date(b.added) - new Date(a.added) // Plus récents en premier (par défaut)
      }
    })
})

// Déclenché par le bouton ou la touche Entrée : applique la recherche
const applySearch = () => {
  activeSearch.value = searchQuery.value
}
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 20px;
  font-family: 'Jaldi', sans-serif;
}
.filters {
  display: flex;
  align-items: center;
  margin: 0 20px 0 20px;
  height: 35px;
}
.filters input {
  padding: 8px;
  width: 200px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.filters h3 {
  font-size: 1rem;
  margin-right: 10px;
}
.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.filtrer-livres {
  display: flex;
  align-items: center;
  margin-left: 15px;
}
.trier-livres {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.recherche {
  display: flex;
  align-items: center;
  background-color: #fdfdfd;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.recherche input {
  border: none;
  margin-right: 0;
}
button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #dbdbdb;
}

.loupe-recherche {
  width: 24px;
  height: 24px;
  display: block;
}
.home {
  font-family: 'Jaldi', sans-serif;
  padding: 10px;
  width: 1050px;
  margin: 0 auto;
}
.home a {
  text-decoration: none;
  color: black;
}
.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  padding: 20px;
}

.book-card {
  background: #ffffff;
  overflow: hidden;
  border: rgb(199, 199, 199) 1px solid;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  min-height: 470px;
  width: 100%;
  border-radius: 5px;
}

.book-card img {
  display: inline;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.book-info {
  padding: 0 10px 5px 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}
.book-info h3 {
  margin: 0;
  text-decoration: none;
  color: black;
}

.book-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #464646;
  text-decoration: none;
}
.book-info p:nth-child(4) {
  font-size: 0.85rem;
  color: #8d8d8d;
}
.book-info p:last-child {
  margin-top: auto;
  bottom: 0;
  font-size: 0.85rem;
  color: #8d8d8d;
}
</style>
