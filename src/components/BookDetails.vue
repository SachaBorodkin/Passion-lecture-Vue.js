<script setup>
const props = defineProps({
  book: Object,
  loading: Boolean,
  canModify: Boolean
})
const emit = defineEmits(['edit', 'delete'])
</script>
<template>
    <div v-if="props.loading">Chargement du livre...</div>

<div v-else-if="props.book" class="book-details-wrapper">
    <div class="book-details">
      <div class="image-section">
        <img :src="props.book.coverImage || '/default-cover.jpg'" :alt="props.book.title" />
      </div>

      <div class="info-section">
        <div class="left">
          <h1>{{ props.book.title }}</h1>
          <p class="year"><strong>Année :</strong> {{ props.book.publishYear }}</p>
          <p class="category"><strong>Catégorie(s) :</strong> {{ props.book.category }}</p>
          <p class="description">{{ props.book.description }}</p>
          <p class="author"><strong>Auteur(ice) :</strong> {{ props.book.author }}</p>
          <p class="extrait">
            <strong>Extrait : </strong>
            <a :href="props.book.excerpt" download="extrait_livre.pdf"> Télécharger l'extrait </a>
          </p>
        </div>

        <div v-if="props.canModify" class="actions">
          <button @click="emit('edit', props.book.id)">Modifier</button>
          <button @click="emit('delete', props.book.id)" class="delete-btn">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
button { align-self: flex-end; padding: 8px 16px; background-color: #148867; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
.book-details { font-family: 'Jaldi', sans-serif; display: flex; gap: 40px; margin-top: 20px; }
.actions { gap: 20px; display: flex; align-items: center; margin-top: 20px; }
img { max-width: 150px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
.info-section { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.delete-btn { background-color: #ff4d4d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }</style>