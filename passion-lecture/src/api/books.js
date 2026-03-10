// ============================================================
//  src/api/books.js  —  Couche service pour les livres (CRUD)
// ============================================================
//
//  RÔLE DE CE FICHIER :
//  ---------------------
//  Ce fichier est le "pont" entre les Vues (.vue) et le serveur.
//  Chaque fonction = UNE opération CRUD sur la ressource /books :
//
//    C  —  Create  →  createBook()    →  POST   /books
//    R  —  Read    →  getAllBooks()   →  GET    /books
//                  →  getBookById()  →  GET    /books/:id
//    U  —  Update  →  updateBook()   →  PATCH  /books/:id
//    D  —  Delete  →  deleteBook()   →  DELETE /books/:id
//
//  POURQUOI PAS AXIOS DIRECTEMENT DANS LES VUES ?
//  ------------------------------------------------
//  Si l'URL change (/livres au lieu de /books), on ne modifie
//  que CE fichier, pas chaque Vue. Séparation des responsabilités.
//
// ============================================================

import apiClient from './axios' // L'instance configurée dans axios.js

// ---------------------------------------------------------------
//  READ — Récupérer TOUS les livres
// ---------------------------------------------------------------
//  Requête :  GET http://localhost:3000/books
//  Réponse :  response.data = [ { id, title, author, ... }, { ... }, ... ]
//
//  Utilisé dans : HomeView.vue, ListView.vue, AddBook.vue, EditBookView.vue
export const getAllBooks = () => apiClient.get('/books')

// ---------------------------------------------------------------
//  READ — Récupérer UN seul livre par son ID
// ---------------------------------------------------------------
//  Requête :  GET http://localhost:3000/books/42  (si id vaut 42)
//  Réponse :  response.data = { id: 42, title: "...", author: "...", ... }
//
//  Utilisé dans : BookPageView.vue, EditBookView.vue
export const getBookById = (id) => apiClient.get(`/books/${id}`)

// ---------------------------------------------------------------
//  CREATE — Créer un nouveau livre
// ---------------------------------------------------------------
//  Requête :  POST http://localhost:3000/books
//             body (corps) = bookData converti automatiquement en JSON par axios
//  Réponse :  response.data = le livre créé avec son ID auto-généré par json-server
//
//  Utilisé dans : AddBook.vue
export const createBook = (bookData) => apiClient.post('/books', bookData)

// ---------------------------------------------------------------
//  UPDATE — Modifier PARTIELLEMENT un livre existant
// ---------------------------------------------------------------
//  Requête :  PATCH http://localhost:3000/books/42
//             body = { title: "Nouveau titre" }  ← seul ce champ est modifié
//  Réponse :  le livre complet avec les champs mis à jour
//
//  ⚠️ PATCH vs PUT :
//     PATCH → modifie seulement les champs envoyés (les autres restent intacts) ✅
//     PUT   → remplace TOUT l'objet (les champs non envoyés sont effacés) ❌
//
//  Utilisé dans : EditBookView.vue, BookPageView.vue (commentaires, notes)
export const updateBook = (id, fields) => apiClient.patch(`/books/${id}`, fields)

// ---------------------------------------------------------------
//  DELETE — Supprimer un livre
// ---------------------------------------------------------------
//  Requête :  DELETE http://localhost:3000/books/42
//  Réponse :  réponse vide (204 No Content) = suppression réussie
//
//  Utilisé dans : BookPageView.vue
export const deleteBook = (id) => apiClient.delete(`/books/${id}`)
