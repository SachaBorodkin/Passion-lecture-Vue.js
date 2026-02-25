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
      <select v-model="selectedCategory" class="category-select">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
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
    .sort((a, b) => a.added - b.added)
})
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 20px;
  font-family: 'Jaldi', sans-serif;
}
.filters {
  margin-left: 20px;
}
.filters input {
  padding: 8px;
  width: 200px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
