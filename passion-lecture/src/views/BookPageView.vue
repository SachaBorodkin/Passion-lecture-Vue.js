<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookById, updateBook, deleteBook } from '@/api/books'
import { updateUser } from '@/api/users'

const currentUserId = ref(null)
const currentUser = ref(null)
const route = useRoute()
const router = useRouter()
const hoverRating = ref(0)
const id = String(route.params.id)
const book = ref(null)
const loading = ref(true)
const newComment = ref('')

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

async function submitComment() {
  if (!newComment.value.trim() || !currentUserId.value) return

  const commentObj = {
    id: Date.now(),
    userId: currentUserId.value,
    username: currentUser.value.username,
    text: newComment.value,
    date: new Date().toLocaleDateString('fr-FR'),
  }

  const updatedComments = book.value.comments
    ? [...book.value.comments, commentObj]
    : [commentObj]

  try {
    // PATCH /books/:id — add the new comment to the book
    await updateBook(book.value.id, { comments: updatedComments })
    book.value.comments = updatedComments
    newComment.value = ''

    // PATCH /users/:id — increment commentnumber counter
    const newCommentCount = (currentUser.value.commentnumber || 0) + 1
    await updateUser(currentUserId.value, { commentnumber: newCommentCount })
    currentUser.value.commentnumber = newCommentCount
    localStorage.setItem('user', JSON.stringify(currentUser.value))
  } catch (err) {
    console.error('Erreur lors de la publication du commentaire:', err)
  }
}

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
    <div v-if="loading">Chargement du livre...</div>

    <div v-else-if="book" class="book-details-wrapper">
      <div class="book-details">
        <div class="image-section">
          <img :src="book.coverImage || '/default-cover.jpg'" :alt="book.title" />
        </div>

        <div class="info-section">
          <div class="left">
            <h1>{{ book.title }}</h1>
            <p class="year"><strong>Année :</strong> {{ book.publishYear }}</p>
            <p class="category"><strong>Catégorie(s) :</strong> {{ book.category }}</p>
            <p class="description">{{ book.description }}</p>
            <p class="author"><strong>Auteur(ice) :</strong>{{ book.author }}</p>
            <p class="extrait">
              <strong>Extrait : </strong>
              <a :href="book.excerpt" download="extrait_livre.pdf"> Télécharger l'extrait </a>
            </p>
          </div>
          <div v-if="canModify" class="actions">
            <button @click="editBook(book.id)">Modifier</button>
            <button @click="handleDeleteBook(book.id)" class="delete-btn">Supprimer</button>
          </div>
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
      <hr />

      <div class="comments-section">
        <h3>Commentaires ({{ book.comments?.length || 0 }})</h3>

        <div v-if="currentUserId" class="comment-form">
          <textarea
            v-model="newComment"
            placeholder="Partagez votre avis sur ce livre..."
            rows="3"
          ></textarea>
          <button @click="submitComment" :disabled="!newComment.trim()">
            Publier le commentaire
          </button>
        </div>
        <p v-else><em>Connectez-vous pour laisser un commentaire.</em></p>

        <div class="comments-list">
          <div v-for="comment in book.comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <strong>{{ comment.username }}</strong>
              <span class="comment-date">{{ comment.date }}</span>
            </div>
            <p>{{ comment.text }}</p>
          </div>
          <p v-if="!book.comments?.length">Aucun commentaire pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');
.container { width: 1400px; margin: 0 auto; padding: 20px; }
.book-details { font-family: 'Jaldi', sans-serif; display: flex; gap: 40px; margin-top: 20px; }
.star { color: #ccc; cursor: pointer; font-size: 1.5rem; }
.comments-section { margin-top: 30px; font-family: 'Jaldi', sans-serif; text-align: left; }
.comment-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
textarea { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; resize: vertical; }
button {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #148867;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
button:disabled { background-color: #ccc; cursor: not-allowed; }
.comment-item { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.comment-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; }
.actions { gap: 20px; display: flex; align-items: center; }
.comment-date { color: #888; }
.star.active { color: #ffca08; }
.score { font-size: 2rem; font-weight: bold; }
.rating-box { display: flex; flex-direction: row; gap: 15px; font-family: 'Jaldi', sans-serif; }
img { max-width: 150px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
.info-section { justify-content: space-between; }
</style>
