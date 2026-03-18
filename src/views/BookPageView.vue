<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookById, updateBook, deleteBook } from '@/api/books'
import { updateUser } from '@/api/users'
import ShowComments from '@/components/ShowComments.vue'
import BookDetails from '@/components/BookDetails.vue'
const currentUserId = ref(null)
const currentUser = ref(null)
const route = useRoute()
const router = useRouter()
const hoverRating = ref(0)
const id = String(route.params.id)
const book = ref(null)
const loading = ref(true)

const canModify = computed(() => {
  if (!currentUser.value || !book.value) return false
  const isAdmin = currentUser.value.isAdmin === true
  const isOwner = currentUser.value.id === book.value.userId
  return isAdmin || isOwner
})

onMounted(async () => {
  try {
    // GET /books/:id — load book details
    const { data } = await getBookById(id)
    book.value = data
  } catch (err) {
    console.error('Erreur lors de la récupération du livre:', err)
    book.value = null
  } finally {
    loading.value = false
  }

  const userData = localStorage.getItem('user')
  if (userData) {
    currentUser.value = JSON.parse(userData)
    currentUserId.value = currentUser.value.id
  }
})


const averageRating = computed(() => {
  if (!book.value || !book.value.ratingCount || book.value.ratingCount === 0) return '0.0'
  return (book.value.totalPoints / book.value.ratingCount).toFixed(1)
})

const userNote = computed(() => {
  if (!book.value || !book.value.userNotes || !currentUserId.value) return 0
  const noteObj = book.value.userNotes.find((n) => n.userId === currentUserId.value)
  return noteObj ? noteObj.note : 0
})

function editBook(bookId) {
  router.push(`/edit-book/${bookId}`)
}

async function handleDeleteBook(bookId) {
  if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
    try {
      // DELETE /books/:id
      await deleteBook(bookId)
      router.push('/list')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }
}

async function rateBook(star) {
  if (!book.value || !currentUserId.value) return

  const existing = book.value.userNotes?.find((n) => n.userId === currentUserId.value)
  if (existing) {
    alert('Vous avez déjà noté ce livre !')
    return
  }

  const newNotes = book.value.userNotes ? [...book.value.userNotes] : []
  newNotes.push({ userId: currentUserId.value, note: star })

  const totalPoints = newNotes.reduce((acc, n) => acc + n.note, 0)
  const ratingCount = newNotes.length

  try {
    // PATCH /books/:id — save the new rating
    await updateBook(book.value.id, { totalPoints, ratingCount, userNotes: newNotes })
    book.value.userNotes = newNotes
    book.value.totalPoints = totalPoints
    book.value.ratingCount = ratingCount

    // PATCH /users/:id — increment rateNumber counter
    const newRateCount = (currentUser.value.rateNumber || 0) + 1
    await updateUser(currentUserId.value, { rateNumber: newRateCount })
    currentUser.value.rateNumber = newRateCount
    localStorage.setItem('user', JSON.stringify(currentUser.value))
  } catch (err) {
    console.error('Erreur lors de la notation:', err)
  }
}
</script>

<template>
  <div class="container">
<BookDetails 
      :book="book" 
      :loading="loading" 
      :canModify="canModify"
      @edit="editBook"
      @delete="handleDeleteBook"
    />

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
      <hr />
<ShowComments 
        :book="book" 
        :currentUser="currentUser" 
        @commentAdded="onCommentAdded" 
      />
      </div>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.container { width: 1400px; margin: 0 auto; padding: 20px; }
.book-details { font-family: 'Jaldi', sans-serif; display: flex; gap: 40px; margin-top: 20px; }
.star { color: #ccc; cursor: pointer; font-size: 1.5rem; }
textarea { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; resize: vertical; }.actions { gap: 20px; display: flex; align-items: center; }
.star.active { color: #ffca08; }
.score { font-size: 2rem; font-weight: bold; }
.rating-box { display: flex; flex-direction: row; gap: 15px; font-family: 'Jaldi', sans-serif; }
img { max-width: 150px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
.info-section { justify-content: space-between; }
</style>
