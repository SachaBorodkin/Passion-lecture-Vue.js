// api.js — Instance Axios centralisée (bonne pratique)
// -----------------------------------------------------------
// Au lieu de répéter 'http://localhost:3000' dans chaque composant,
// on crée une instance Axios configurée une fois pour toutes.
// On peut aussi y injecter des headers globaux (ex: token JWT).

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // URL de base commune à toutes les requêtes
  timeout: 5000, // Annule la requête après 5s sans réponse
  headers: {
    "Content-Type": "application/json",
    // Exemple avec token : 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

// INTERCEPTEUR DE REQUÊTE
// Exécuté avant chaque envoi — utile pour ajouter un token dynamiquement
api.interceptors.request.use(
  (config) => {
    // Exemple : ajouter un token depuis le localStorage si présent
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// INTERCEPTEUR DE RÉPONSE
// Exécuté après chaque réponse — utile pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response, // Succès : on laisse passer la réponse telle quelle
  (error) => {
    // Erreur globale centralisée (ex: rediriger vers /login si 401)
    if (error.response?.status === 401) {
      console.error("Non autorisé — redirection vers login");
    }
    return Promise.reject(error);
  },
);

export default api;
