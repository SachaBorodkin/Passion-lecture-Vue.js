<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
const currentUserId = ref(null)
const route = useRoute()
const hoverRating = ref(0)
const id = Number(route.params.id)
const book = ref(null)
const loading = ref(true) // Add this

onMounted(async () => {
  try {
    // Ensure the ID is passed clearly
    const response = await fetch(`http://localhost:3000/books/${id}`)

    if (response.ok) {
      book.value = await response.json()
    } else {
      // If we get a 404 or other error, set book to null
      console.warn(`Server responded with: ${response.status}`)
      book.value = null
    }
  } catch (err) {
    console.error('Failed to fetch book:', err)
  } finally {
    loading.value = false
  }
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    currentUserId.value = user.id // Access the ID from the stored object
  }
})

// Calculate average safely
const averageRating = computed(() => {
  // If book hasn't loaded yet, or no one has rated, return 0
  if (!book.value || !book.value.ratingCount || book.value.ratingCount === 0) {
    return '0.0'
  }
  return (book.value.totalPoints / book.value.ratingCount).toFixed(1)
})

async function rateBook(star) {
  if (!book.value || !currentUserId.value) return

  // Vérifie si l'utilisateur a déjà noté
  const existing = book.value.userNotes?.find((n) => n.userId === currentUserId.value)
  if (existing) {
    alert('Vous avez déjà noté ce livre !')
    return
  }

  // Ajoute la note de l'utilisateur
  const newNotes = book.value.userNotes ? [...book.value.userNotes] : []
  newNotes.push({ userId: currentUserId.value, note: star })

  const totalPoints = newNotes.reduce((acc, n) => acc + n.note, 0)
  const ratingCount = newNotes.length

  const response = await fetch(`http://localhost:3000/books/${book.value.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ totalPoints, ratingCount, userNotes: newNotes }),
  })

  if (response.ok) {
    book.value.userNotes = newNotes
    book.value.totalPoints = totalPoints
    book.value.ratingCount = ratingCount
  }
}
</script>

<template>
  <div class="container">
    <div v-if="loading">Chargement du livre...</div>

    <div v-else-if="book" class="book-details-wrapper">
      <div class="book-details">
        <div class="image-section">
          <img :src="book.coverImage || '/default-cover.jpg'" :alt="book.title" />
        </div>

        <div class="info-section">
          <h1>{{ book.title }}</h1>
          <p class="year"><strong>Année :</strong> {{ book.publishYear }}</p>
          <p class="category"><strong>Catégorie(s) :</strong> {{ book.category }}</p>
          <p class="description">{{ book.description }}</p>
          <p class="author"><strong>Auteur(ice) :</strong>{{ book.author }}</p>
        </div>
      </div>

      <hr />

      <div class="rating-box">
        <span class="score">{{ averageRating }}</span>
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ active: star <= (hoverRating || userNote) }"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            @click="rateBook(star)"
          >
            ★
          </span>
        </div>
        <p>({{ book.ratingCount || 0 }} avis)</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.book-details {
  font-family: 'Jaldi', sans-serif;
  display: flex;
  gap: 40px;
  margin-top: 20px;
}
.star {
  color: #ccc;
  cursor: pointer;
  font-size: 1.5rem;
}
.star.active {
  color: #ffca08;
}
.score {
  font-size: 2rem;
  font-weight: bold;
}
img {
  max-width: 150px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.back-btn {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #42b983;
}
</style>
