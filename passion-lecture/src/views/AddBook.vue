<template>
    <div class="add-book">
        <h1>Ajouter un livre</h1>
        <form @submit.prevent="addBook">
            
            <div class="form-group">
                <label for="title">Titre :</label>
                <input
                    id="title"
                    v-model="newBook.title"
                    type="text"
                    required
                />
            </div>

            <div class="form-group">
                <label for="author">Auteur :</label>
                <input
                    id="author"
                    v-model="newBook.author"
                    type="text"
                    required
                />
            </div>

            <div class="form-group">
                <label for="category">Catégorie :</label>
                <input
                    id="category"
                    v-model="newBook.category"
                    type="text"
                    required
                />
            </div>

            <div class="form-group">
                <label for="publishYear">Année de publication :</label>
                <input
                    id="publishYear"
                    v-model.number="newBook.publishYear"
                    type="number"
                    required
                />
            </div>

            <div class="form-group">
                <label for="pageCount">Nombre de pages :</label>
                <input
                    id="pageCount"
                    v-model.number="newBook.pageCount"
                    type="number"
                    required
                />
            </div>

            <div class="form-group">
                <label for="summary">Résumé :</label>
                <textarea
                    id="summary"
                    v-model="newBook.summary"
                    rows="4"
                ></textarea>
            </div>

            <div class="form-group">
                <label for="coverImage">Image de couverture (URL) :</label>
                <input
                    id="coverImage"
                    v-model="newBook.coverImage"
                    type="text"
                    required
                />
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
            newBook: this.getInitialBookState()
        };
    },
    methods: {
        // Permet de facilement réinitialiser le formulaire
        getInitialBookState() {
            return {
                title: '',
                author: '',
                category: '',
                publishYear: null,
                pageCount: null,
                summary: '',
                coverImage: ''
                 
            };
        },
        async addBook() {
            try {
                // Création de l'objet final à envoyer à la DB avec les champs automatiques
                const bookToSave = {
                    ...this.newBook,
                    userRating: 0,
                    comments: [],
                    added: new Date().toISOString().split('T')[0] // Génère la date du jour au format YYYY-MM-DD
                };

                const response = await fetch('http://localhost:3000/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookToSave)
                });

                if (response.ok) {
                    // Réinitialiser le formulaire
                    this.newBook = this.getInitialBookState();
                    alert('Livre ajouté avec succès!');
                    // Optionnel : rediriger l'utilisateur après l'ajout
                    this.$router.push('/'); 
                } else {
                    alert('Erreur lors de l\'ajout du livre.');
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    }
};
</script>

<style scoped>
.add-book {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.add-book h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}

input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* S'assure que le padding ne dépasse pas les 100% */
    font-family: inherit;
}

textarea {
    resize: vertical; /* Permet d'agrandir la zone de texte uniquement en hauteur */
}

.form-actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
}

button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

.btn-cancel {
    background-color: #6c757d;
}

.btn-cancel:hover {
    background-color: #5a6268;
}
</style>