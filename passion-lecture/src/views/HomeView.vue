<script setup></script>

<template>
  <div class="home">
    <h1><strong>Bienvenue sur ce site des ouvrages</strong></h1>
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
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.home {
  font-family: 'Jaldi', sans-serif;
  justify-content: center;
  font-size: 33px;
  text-align: center;
}
.home h1 {
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
</style>
