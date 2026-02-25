<template>
  <h1><strong>Liste de tous les ouvrages</strong></h1>
  <div class="home">
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par titre..."
        class="search-input"
      />
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
          <option value="added">Date d'ajout</option>
          <option value="title">Titre (A-Z)</option>
          <option value="titleDesc">Titre (Z-A)</option>
          <option value="year">Année (croissant)</option>
          <option value="yearDesc">Année (décroissant)</option>
        </select>
      </div>
    </div>
    <div v-if="loading">Chargement...</div>
    <div v-else class="book-list">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card">
        <router-link :to="{ name: 'BookDetails', params: { id: book.id } }">
          <img :src="book.coverImage || 'default-cover.jpg'" alt="Couverture" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p><strong>Année :</strong> {{ book.publishYear }}</p>
            <p><strong>Catégorie :</strong> {{ book.category }}</p>
            <p><strong>Description :</strong> {{ book.summary }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const loading = ref(true)

const searchQuery = ref('')
const selectedCategory = ref('')
const sortOption = ref('added')

const categories = computed(() => {
  const allCats = books.value.map((b) => b.category)
  return [...new Set(allCats)]
})

const fetchContent = async () => {
  try {
    const response = await axios.get('http://localhost:3000/books')
    books.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement du contenu', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  return fetchContent()
})

const filteredBooks = computed(() => {
  return books.value
    .filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory =
        selectedCategory.value === '' || book.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortOption.value) {
        case 'title':
          return a.title.localeCompare(b.title) // compare les titres des livres deux par deux
        case 'titleDesc':
          return b.title.localeCompare(a.title)
        case 'year':
          return a.publishYear - b.publishYear // fait un calcul et si retourne un nombre négatif -> a avant b
        case 'yearDesc':
          return b.publishYear - a.publishYear
        case 'added':
        default:
          return a.added - b.added
      }
    })
})
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
}
.trier-livres {
  display: flex;
  align-items: center;
  margin-left: auto;
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
.book-info p:last-child {
  margin-top: auto;
  font-size: 0.85rem;
  color: #8d8d8d;
}
</style>
