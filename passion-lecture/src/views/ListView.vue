<template>
  <div class="home">
    <h1><strong>Liste de tous les ouvrages</strong></h1>
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
      <div v-if="loading">Chargement...</div>
      <div v-else class="book-list">
        <div v-for="book in filteredBooks" :key="book.id" class="book-card">
          <img :src="book.coverImage || 'default-cover.jpg'" alt="Couverture" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p><strong>Année :</strong> {{ book.publishYear }}</p>
            <p><strong>Catégorie :</strong> {{ book.category }}</p>
          </div>
        </div>
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
    .sort((a, b) => b.added - a.added)
})
</script>

<style scoped>
.home {
  font-family: 'Jaldi', sans-serif;
  padding: 10px;
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
  border: rgb(171, 171, 171) 1px solid;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  min-height: 470px;
}

.book-card img {
  height: 340px;
  border-bottom: 1px solid #eee;
}

.book-info {
  padding: 7px 10px 0 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}
.book-info h3 {
  margin: 0 0 8px 0;
}

.book-info p {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #666;
}
</style>
