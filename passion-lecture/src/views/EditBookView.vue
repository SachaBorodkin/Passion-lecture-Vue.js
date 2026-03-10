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

      <label for="edit-category">Catégorie</label>
      <input
        id="edit-category"
        v-model="book.category"
        list="category-options"
        type="text"
        autocomplete="off"
      />
      <datalist id="category-options">
        <option v-for="cat in availableCategories" :key="cat" :value="cat"></option>
      </datalist>

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
// ============================================================
//  EditBookView.vue  —  Modifier un livre existant
// ============================================================
//
//  FLUX D'APPEL API :
//  ------------------
//  Au montage :
//    1. getBookById(id)  →  GET /books/:id   → charge le livre à modifier
//    2. getAllBooks()     →  GET /books       → extrait les catégories pour la datalist
//
//  À la soumission (saveChanges) :
//    3. updateBook(id, {...})  →  PATCH /books/:id  → sauvegarde les modifications
//
//  POURQUOI PATCH ET PAS PUT ?
//  ---------------------------
//  On n'envoie que les champs modifiables (titre, auteur, etc.)
//  Les autres champs (comments, userNotes, ratings…) restent intacts sur le serveur.
//  PUT remplacerait TOUT l'objet et effacerait ces données importantes !
//
// ============================================================

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookById, getAllBooks, updateBook } from '@/api/books' // R + R + U

const availableCategories = ref([])
const route = useRoute() // Accès aux paramètres de l'URL (/edit-book/:id)
const router = useRouter() // Pour naviguer après la sauvegarde
const id = String(route.params.id) // Récupère l'id depuis l'URL : /edit-book/42 → "42"

const book = ref(null) // Sera rempli avec les données du livre
const loading = ref(true) // Affiche "Chargement..." pendant la requête
const errorMessage = ref('') // Message d'erreur en cas d'échec

onMounted(async () => {
  try {
    // ── READ (1) ────────────────────────────────────────────────────────────
    //  GET /books/:id → récupère le livre à modifier
    //  On pré-remplit le formulaire avec ses données actuelles
    const { data } = await getBookById(id)
    // Destructuring : { data } est identique à écrire response.data
    book.value = data

    // ── READ (2) ────────────────────────────────────────────────────────────
    //  GET /books → récupère tous les livres pour extraire les catégories uniques
    const { data: allBooks } = await getAllBooks()
    availableCategories.value = [...new Set(allBooks.map((b) => b.category))].filter(Boolean).sort()
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
  } finally {
    loading.value = false // Arrête le spinner dans tous les cas
  }
})

async function saveChanges() {
  try {
    // ── UPDATE ──────────────────────────────────────────────────────────────
    //  PATCH /books/:id → on envoie SEULEMENT les champs éditables
    //  book.value contient TOUS les champs (avec userNotes, comments, etc.)
    //  mais on choisit explicitement ce qu'on envoie pour ne pas écraser
    //  des données que d'autres utilisateurs ont pu ajouter.
    await updateBook(id, {
      title: book.value.title,
      author: book.value.author,
      publishYear: book.value.publishYear,
      category: book.value.category,
      description: book.value.description,
      coverImage: book.value.coverImage,
    })
    router.push(`/book/${id}`) // Redirige vers la page du livre après sauvegarde
  } catch (err) {
    console.error('Erreur:', err)
    errorMessage.value = 'Une erreur est survenue lors de la sauvegarde.'
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
