<script setup></script>

<template>
  <div class="home">
    <h1><strong>Bienvenue sur ce site des ouvrages</strong></h1>
    <h1>Les 5 dernières ouvrages</h1>

    <div v-if="loading">Chargement...</div>

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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const loading = ref(true)

const lastFiveBooks = computed(() => {
  //copie la liste des livres, prends les plus récents et prends 5 livres les plus récents
  return [...books.value].sort((a, b) => new Date(b.added) - new Date(a.added)).slice(0, 5)
})

const fetchBooks = async () => {
  try {
    //envoie de la requete dans db et sauvegarde de la réponse
    const response = await axios.get('http://localhost:3000/books')
    books.value = response.data
  } catch (error) {
    console.error('Erreur API', error)
  } finally {
    loading.value = false
  }
}
onMounted(fetchBooks)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.home {
  font-family: 'Jaldi', sans-serif;
  justify-content: center;
  font-size: 33px;
  text-align: center;
}
.home a {
  text-decoration: none;
  color: black;
}
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
nav a.router-link-exact-active {
  color: #148867;
  font-weight: bold;
}
</style>
