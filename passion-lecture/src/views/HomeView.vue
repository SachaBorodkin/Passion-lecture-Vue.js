<script setup></script>

<template>
  <div class="home">
    <h1>Ma Passion Lecture</h1>

    <div v-if="loading">Chargement du contenu...</div>

    <div v-else class="content-grid">
      <div v-for="book in books" :key="book.id" class="content-card">
        <h3>{{ book.title }}</h3>
        <p><strong>Auteur:</strong> {{ book.author }}</p>
        <p>{{ book.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const loading = ref(true)

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
  fetchContent()
})
</script>

<style scoped>
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}
.content-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #fff;
}
</style>
