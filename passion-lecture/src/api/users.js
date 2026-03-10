// ============================================================
//  src/api/users.js  —  Couche service pour les utilisateurs (CRUD)
// ============================================================
//
//  CRUD utilisateurs :
//    C  —  Create  →  createUser()          →  POST   /users
//    R  —  Read    →  getUserByUsername()   →  GET    /users?username=xxx
//                  →  getUserById()         →  GET    /users/:id
//    U  —  Update  →  updateUser()          →  PATCH  /users/:id
//    D  —  Delete  →  deleteUser()          →  DELETE /users/:id
//
// ============================================================

import apiClient from './axios'

// ---------------------------------------------------------------
//  READ — Chercher un utilisateur par son nom d'utilisateur
// ---------------------------------------------------------------
//  Requête :  GET http://localhost:3000/users?username=alice
//             Le ?username=alice est un query param : json-server filtre le tableau
//             et ne renvoie que les users dont le champ "username" vaut "alice"
//  Réponse :  response.data = tableau (peut être vide [] ou contenir 1 résultat)
//
//  Utilisé dans : LoginVue.vue (vérifier le mot de passe), SignUp.vue (vérifier doublon)
export const getUserByUsername = (username) => apiClient.get('/users', { params: { username } })
// { params: { username } } est équivalent à écrire ?username=valeur dans l'URL

// ---------------------------------------------------------------
//  READ — Récupérer un utilisateur par son ID
// ---------------------------------------------------------------
//  Requête :  GET http://localhost:3000/users/5  (si id = 5)
//  Réponse :  response.data = { id: 5, username: "...", bookNumber: 3, ... }
//
//  Utilisé dans : UserView.vue, AddBook.vue (pour lire le compteur bookNumber)
export const getUserById = (id) => apiClient.get(`/users/${id}`)

// ---------------------------------------------------------------
//  CREATE — Créer un nouvel utilisateur (inscription)
// ---------------------------------------------------------------
//  Requête :  POST http://localhost:3000/users
//             body = userData (objet avec username, password hashé, etc.)
//  Réponse :  le user créé avec son ID généré
//
//  Utilisé dans : SignUp.vue
export const createUser = (userData) => apiClient.post('/users', userData)

// ---------------------------------------------------------------
//  UPDATE — Modifier partiellement un utilisateur
// ---------------------------------------------------------------
//  Requête :  PATCH http://localhost:3000/users/5
//             body = { bookNumber: 4 }  ← on ne met à jour que ce champ
//  Réponse :  le user complet mis à jour
//
//  Utilisé dans : AddBook.vue (incrémenter bookNumber),
//                 BookPageView.vue (incrémenter commentnumber, rateNumber)
export const updateUser = (id, fields) => apiClient.patch(`/users/${id}`, fields)

// ---------------------------------------------------------------
//  DELETE — Supprimer un utilisateur
// ---------------------------------------------------------------
//  Requête :  DELETE http://localhost:3000/users/5
//  Réponse :  204 No Content = suppression réussie
//
//  Utilisé dans : UserView.vue (supprimer son propre compte)
export const deleteUser = (id) => apiClient.delete(`/users/${id}`)
