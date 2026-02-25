<template>
  <div class="container">
    <div v-if="loading">Chargement...</div>

    <form v-else-if="book" @submit.prevent="saveChanges" class="edit-form">
      <h2>Modifier le livre</h2>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <label
        >Titre
        <input v-model="book.title" required />
      </label>

      <label
        >Auteur(ice)
        <input v-model="book.author" required />
      </label>

      <label
        >Année de publication
        <input v-model="book.publishYear" type="number" />
      </label>

      <label
        >Catégorie
        <input v-model="book.category" />
      </label>

      <label
        >Description
        <textarea v-model="book.description" rows="5"></textarea>
      </label>

      <label
        >URL de couverture
        <input v-model="book.coverImage" />
      </label>

      <div class="buttons">
        <button type="submit">Sauvegarder</button>
        <button type="button" @click="router.back()">Annuler</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)

const book = ref(null)
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/books/${id}`) // cherche le livre dans le serveur par son id
    if (response.ok) {
      book.value = await response.json()
    }
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
  } finally {
    loading.value = false
  }
})

async function saveChanges() {
  try {
    const response = await fetch(`http://localhost:3000/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: book.value.title,
        author: book.value.author,
        publishYear: book.value.publishYear,
        category: book.value.category,
        description: book.value.description,
        coverImage: book.value.coverImage,
      }),
    })

    if (response.ok) {
      router.push(`/book/${id}`)
    } else {
      errorMessage.value = 'Erreur lors de la sauvegarde.'
    }
  } catch (err) {
    console.error('Erreur:', err)
    errorMessage.value = 'Une erreur est survenue.'
  }
}
</script>

<style scoped>
.container {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Jaldi', sans-serif;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: bold;
}
input,
textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.buttons {
  display: flex;
  gap: 10px;
}
button {
  padding: 8px 16px;
  background-color: #148867;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.error {
  color: red;
}
</style>
