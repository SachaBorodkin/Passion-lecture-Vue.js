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
          v-model="newBook.category"
          list="category-options"
          type="text"
          required
          placeholder="Choisir ou taper une catégorie"
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
// ============================================================
//  AddBook.vue  —  Formulaire d'ajout d'un livre
// ============================================================
//
//  FLUX D'APPEL API :
//  ------------------
//  Au montage :
//    1. fetchCategories() → GET /books → extrait les catégories pour la datalist
//
//  À la soumission du formulaire (addBook) :
//    2. createBook(bookToSave)          →  POST   /books         (CREATE)
//    3. getUserById(userId)             →  GET    /users/:id     (READ)
//    4. updateUser(userId, {bookNumber}) → PATCH  /users/:id     (UPDATE)
//
//  ORDRE IMPORTANT : on crée d'abord le livre, PUIS on met à jour le compteur user.
//  Si l'étape 2 échoue, les étapes 3 et 4 ne s'exécutent pas (le catch arrête tout).
//
// ============================================================

import { getAllBooks, createBook } from '@/api/books' // C(reate) + R(ead all)
import { getUserById, updateUser } from '@/api/users' // R(ead) + U(pdate)

export default {
  name: 'AddView',

  data() {
    return {
      newBook: this.getInitialBookState(), // État initial du formulaire (champs vides)
      availableCategories: [], // Rempli par fetchCategories()
    }
  },

  mounted() {
    this.fetchCategories() // Dès que le composant est prêt → on charge les catégories
  },

  methods: {
    // Retourne un objet avec tous les champs du formulaire à zéro
    // Utilisé au chargement ET après soumission (pour vider le formulaire)
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

    // ── READ ────────────────────────────────────────────────────────────────
    //  GET /books  → on récupère tous les livres juste pour extraire les
    //  catégories existantes et les proposer dans la datalist.
    //  On n'a pas besoin des livres eux-mêmes ici.
    async fetchCategories() {
      try {
        const { data: books } = await getAllBooks()
        // Destructuring : { data: books } extrait response.data et le renomme "books"
        const uniqueCategories = [...new Set(books.map((b) => b.category))].filter(Boolean)
        this.availableCategories = uniqueCategories.sort()
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      }
    },

    async addBook() {
      try {
        // Récupère l'ID de l'utilisateur connecté depuis le localStorage
        let userId = localStorage.getItem('userId') || localStorage.getItem('id')
        if (!userId && localStorage.getItem('user')) {
          const user = JSON.parse(localStorage.getItem('user'))
          userId = user.id
        }

        if (!userId) {
          alert('Erreur : Votre session a expiré. Reconnectez-vous.')
          return
        }

        // On construit l'objet complet à envoyer à l'API
        // ...this.newBook = on copie tous les champs du formulaire
        // puis on ajoute les champs auto-générés (userId, date, etc.)
        const bookToSave = {
          ...this.newBook,
          userId,
          userRating: 0,
          comments: [],
          added: new Date().toISOString().split('T')[0], // Date du jour : "2026-03-10"
        }

        // ── CREATE ──────────────────────────────────────────────────────────
        //  POST /books avec bookToSave dans le body
        //  json-server génère un ID et sauvegarde dans db.json
        await createBook(bookToSave)

        // ── READ ────────────────────────────────────────────────────────────
        //  GET /users/:id  → on relit l'utilisateur pour avoir son bookNumber actuel
        //  (on ne fait pas confiance au localStorage qui peut être désynchronisé)
        const { data: userData } = await getUserById(userId)
        const newNumber = (Number(userData.bookNumber) || 0) + 1

        // ── UPDATE ──────────────────────────────────────────────────────────
        //  PATCH /users/:id  → on incrémente uniquement le champ bookNumber
        //  PATCH ne touche pas aux autres champs (username, password, etc.)
        await updateUser(userId, { bookNumber: newNumber })

        alert('Livre ajouté avec succès !')
        this.newBook = this.getInitialBookState() // Vide le formulaire
        this.$router.push('/')
      } catch (error) {
        console.error("Erreur lors de l'ajout du livre:", error)
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jaldi:wght@400;700&display=swap');

.add-book {
  max-width: 860px;
  width: 600px;
  margin: 60px auto;
  padding: 56px 60px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.09);
  font-family: 'Jaldi', sans-serif;
}
.add-book h1 {
  text-align: center;
  margin-bottom: 44px;
  font-size: 28px;
  font-weight: 700;
  color: #0d1526;
  letter-spacing: 0.01em;
}
.form-group {
  margin-bottom: 28px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #374151;
  letter-spacing: 0.01em;
}
input,
textarea {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  box-sizing: border-box;
  font-family: 'Jaldi', sans-serif;
  font-size: 15px;
  color: #0d1526;
  background: #f8fafc;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;
}
input:focus,
textarea:focus {
  border-color: #3ecf8e;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(62, 207, 142, 0.15);
}
input::placeholder,
textarea::placeholder {
  color: #b0bec5;
}
textarea {
  resize: vertical;
  min-height: 120px;
}
.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 14px;
  margin-top: 40px;
}
button {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-family: 'Jaldi', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s,
    box-shadow 0.2s;
}
button[type='submit'] {
  background-color: #3ecf8e;
  color: #0d1526;
  box-shadow: 0 2px 8px rgba(62, 207, 142, 0.3);
}
button[type='submit']:hover {
  background-color: #2db87a;
  box-shadow: 0 4px 14px rgba(62, 207, 142, 0.4);
  transform: translateY(-1px);
}
button[type='submit']:active {
  transform: translateY(0);
}
.btn-cancel {
  background-color: transparent;
  color: #64748b;
  border: 1.5px solid #e2e8f0 !important;
  box-shadow: none !important;
}
.btn-cancel:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1 !important;
  color: #374151;
  transform: translateY(-1px);
}
</style>
