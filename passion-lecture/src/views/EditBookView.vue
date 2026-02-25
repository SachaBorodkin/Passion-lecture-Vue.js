<template>
  <div class="add-book">
    <h1>Ajouter un livre</h1>
    <form @submit.prevent="addBook">
      <div class="form-group">
        <label for="title">Titre :</label>
        <input id="title" v-model="newBook.title" type="text" required />
      </div>

      <div class="form-group">
        <label for="author">Auteur :</label>
        <input id="author" v-model="newBook.author" type="text" required />
      </div>

      <div class="form-group">
        <label for="category">Catégorie :</label>
        <input
          id="category"
          list="category-options"
          v-model="newBook.category"
          type="text"
          required
          autocomplete="off"
        />

        <datalist id="category-options">
          <option v-for="cat in availableCategories" :key="cat" :value="cat"></option>
        </datalist>
      </div>

      <div class="form-group">
        <label for="publishYear">Année de publication :</label>
        <input id="publishYear" v-model.number="newBook.publishYear" type="number" required />
      </div>

      <div class="form-group">
        <label for="pageCount">Nombre de pages :</label>
        <input id="pageCount" v-model.number="newBook.pageCount" type="number" required />
      </div>

      <div class="form-group">
        <label for="summary">Résumé :</label>
        <textarea id="summary" v-model="newBook.summary" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label for="coverImage">Image de couverture (URL) :</label>
        <input id="coverImage" v-model="newBook.coverImage" type="text" required />
      </div>

      <div class="form-actions">
        <button type="submit">Ajouter le livre</button>
        <button type="button" class="btn-cancel" @click="$router.back()">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddView',
  data() {
    return {
      newBook: this.getInitialBookState(),
      availableCategories: [],
    }
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    getInitialBookState() {
      return {
        title: '',
        author: '',
        category: '',
        publishYear: null,
        pageCount: null,
        summary: '',
        coverImage: '',
      }
    },
    async fetchCategories() {
      try {
        const response = await fetch('http://localhost:3000/books')
        if (response.ok) {
          const books = await response.json()
          const uniqueCategories = [...new Set(books.map((book) => book.category))].filter(Boolean)
          this.availableCategories = uniqueCategories.sort()
        } else {
          console.error('Erreur lors du chargement des catégories')
        }
      } catch (error) {
        console.error('Erreur réseau:', error)
      }
    },
    async addBook() {
      try {
        const bookToSave = {
          ...this.newBook,
          userRating: 0,
          comments: [],
          added: new Date().toISOString().split('T')[0],
        }

        const response = await fetch('http://localhost:3000/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookToSave),
        })

        if (response.ok) {
          this.newBook = this.getInitialBookState()
          alert('Livre ajouté avec succès!')
          this.$router.push('/')
        } else {
          alert("Erreur lors de l'ajout du livre.")
        }
      } catch (error) {
        console.error('Erreur:', error)
      }
    },
  },
}
</script>

<style scoped></style>
