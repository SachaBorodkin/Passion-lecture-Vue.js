<template>
  <div class="comments-section">
    <h3>Commentaires ({{ book?.comments?.length || 0 }})</h3>

    <div v-if="currentUser" class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="Partagez votre avis sur ce livre..."
        rows="3"
      ></textarea>
      <button @click="handleCommentSubmit" :disabled="!newComment.trim() || isSubmitting">
        {{ isSubmitting ? 'Publication...' : 'Publier le commentaire' }}
      </button>
    </div>
    <p v-else><em>Connectez-vous pour laisser un commentaire.</em></p>

    <div class="comments-list">
      <div v-for="comment in book?.comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <strong>{{ comment.username }}</strong>
          <span class="comment-date">{{ comment.date }}</span>
        </div>
        <p>{{ comment.text }}</p>
      </div>
      <p v-if="!book?.comments?.length">Aucun commentaire pour le moment.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { updateBook } from '@/api/books'

const props = defineProps({
  book: Object,
  currentUser: Object
})

const emit = defineEmits(['commentAdded'])
const newComment = ref('')
const isSubmitting = ref(false)

async function handleCommentSubmit() {
  if (!newComment.value.trim() || !props.currentUser) return
  
  isSubmitting.value = true
  const commentObj = {
    id: Date.now(),
    userId: props.currentUser.id,
    username: props.currentUser.username,
    text: newComment.value,
    date: new Date().toLocaleDateString('fr-FR'),
  }

  const updatedComments = props.book.comments
    ? [...props.book.comments, commentObj]
    : [commentObj]

  try {

    await updateBook(props.book.id, { comments: updatedComments })
    
    newComment.value = ''

    emit('commentAdded', updatedComments)
  } catch (err) {
    console.error('Erreur lors de la publication:', err)
    alert('Impossible de publier le commentaire.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.comments-section { margin-top: 30px; font-family: 'Jaldi', sans-serif; text-align: left; }
.comment-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
textarea { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; resize: vertical; }
button { align-self: flex-end; padding: 8px 16px; background-color: #148867; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
button:disabled { background-color: #ccc; cursor: not-allowed; }
.comment-item { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.comment-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; }
.comment-date { color: #888; }
</style>