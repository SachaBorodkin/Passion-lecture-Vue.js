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
        <input id="category" list="category-options" v-model="newBook.category" type="text" required autocomplete="off" />
        
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
  // Nom du composant, utile pour le débogage dans Vue DevTools
  name: 'AddView',
  
  // La fonction data retourne l'état réactif initial du composant
  data() {
    return {
      // On initialise l'objet newBook en appelant la méthode getInitialBookState
      newBook: this.getInitialBookState(),
      // Tableau pour stocker les catégories disponibles, qui peut être utilisé pour suggérer des options à l'utilisateur
      availableCategories: []
    }
  },
  mounted() {
    // Appel de la méthode pour charger les catégories disponibles dès que le composant est monté
    this.fetchCategories()
  },
  
  methods: {
    // Permet de facilement réinitialiser le formulaire en retournant un objet 
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
        // Appel API pour récupérer les catégories disponibles
        const response = await fetch('http://localhost:3000/books')
        if (response.ok) {
          const books = await response.json()
          // 1. books.map(book => book.category) crée un tableau avec uniquement les catégories de chaque livre
          // 2. new Set(...) supprime tous les doublons
          // 3. [... ] retransforme le Set en un tableau classique
          // 4. .filter(Boolean) retire les éventuelles catégories vides, null ou undefined
          const uniqueCategories = [...new Set(books.map(book => book.category))].filter(Boolean);
          
          // On met à jour notre liste avec les catégories triées par ordre alphabétique
          this.availableCategories = uniqueCategories.sort();
        } else {
          console.error('Erreur lors du chargement des catégories')
        }
      } catch (error) {
        console.error('Erreur réseau:', error)
      }
    },
    
    // Méthode asynchrone appelée lors de la soumission du formulaire
    async addBook() {
      try {
        // Création de l'objet final à envoyer à la base de données
        const bookToSave = {
          // L'opérateur de décomposition (spread operator '...') copie toutes les propriétés de this.newBook
          ...this.newBook,
          // Ajout de champs par défaut qui ne sont pas gérés par le formulaire utilisateur
          userRating: 0,
          comments: [],
          // Génère la date du jour au format YYYY-MM-DD
          added: new Date().toISOString().split('T')[0], 
        }

        // Appel API via fetch() pour envoyer les données au serveur local
        const response = await fetch('http://localhost:3000/books', {
          method: 'POST', // Indique qu'on veut créer une nouvelle ressource
          headers: {
            'Content-Type': 'application/json', // Précise que le corps de la requête est en JSON
          },
          body: JSON.stringify(bookToSave), // Convertit l'objet JavaScript en chaîne JSON
        })

        // Vérifie si la requête a réussi
        if (response.ok) {
          // Réinitialiser le formulaire visuellement en écrasant l'état actuel avec un état vide
          this.newBook = this.getInitialBookState()
          
          alert('Livre ajouté avec succès!')
          
          // Redirection de l'utilisateur vers la page d'accueil après l'ajout réussi
          this.$router.push('/')
        } else {
          // Gère le cas où le serveur a répondu, mais avec une erreur
          alert("Erreur lors de l'ajout du livre.")
        }
      } catch (error) {
        console.error('Erreur:', error)
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
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
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
  transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
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