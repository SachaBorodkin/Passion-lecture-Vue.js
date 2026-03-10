// ============================================================
//  src/api/axios.js  —  Configuration centrale d'Axios
// ============================================================
//
//  POURQUOI CE FICHIER ?
//  ---------------------
//  Au lieu d'appeler `axios.get('http://localhost:3000/books')` partout
//  dans l'appli, on crée UNE SEULE instance axios ("apiClient") avec
//  toutes les options communes (URL de base, headers…).
//  Tous les fichiers de l'api/ importent ce même apiClient.
//
//  FLUX GÉNÉRAL D'UN APPEL API DANS CETTE APPLI :
//  -----------------------------------------------
//   Vue (ex: HomeView.vue)
//     └─> importe une fonction de books.js  (ex: getAllBooks)
//           └─> books.js appelle  apiClient.get('/books')
//                 └─> axios.js : intercepteur REQUEST ajoute le header X-User-Id
//                       └─> Requête HTTP envoyée vers json-server (localhost:3000)
//                             └─> json-server répond avec les données JSON
//                       └─> axios.js : intercepteur RESPONSE gère les erreurs 401/403
//                 └─> books.js reçoit la réponse et la renvoie à la Vue
//           └─> La Vue met à jour ses variables réactives (ref/data)
//                 └─> Vue re-render le template automatiquement
//
// ============================================================

import axios from 'axios'

// axios.create() crée une instance axios personnalisée.
// Tous les appels faits avec cette instance utiliseront automatiquement
// ces options, sans avoir à les répéter à chaque fois.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // L'adresse de json-server (notre fausse base de données)
  headers: {
    'Content-Type': 'application/json', // On dit au serveur qu'on envoie/reçoit du JSON
  },
})

// ---------------------------------------------------------------
//  INTERCEPTEUR DE REQUÊTE (avant l'envoi)
// ---------------------------------------------------------------
//  Chaque fois qu'une requête est sur le point d'être envoyée,
//  cette fonction s'exécute. Elle peut modifier la requête.
//  Ici, on récupère l'utilisateur connecté dans localStorage
//  et on ajoute son ID dans les headers.
apiClient.interceptors.request.use(
  (config) => {
    // On lit l'utilisateur connecté depuis le localStorage
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user) // On convertit le texte JSON en objet JS
      // On ajoute un header personnalisé avec l'ID de l'utilisateur.
      // json-server l'ignore, mais un vrai serveur pourrait s'en servir.
      config.headers['X-User-Id'] = parsed.id
    }
    return config // OBLIGATOIRE : on retourne la config (modifiée ou non) pour continuer
  },
  (error) => Promise.reject(error), // Si l'intercepteur lui-même plante, on propage l'erreur
)

// ---------------------------------------------------------------
//  INTERCEPTEUR DE RÉPONSE (après réception)
// ---------------------------------------------------------------
//  Chaque fois qu'une réponse arrive du serveur, cette fonction
//  s'exécute. Elle peut traiter les erreurs de façon centralisée.
//  Cela évite de répéter la gestion des erreurs dans chaque Vue.
apiClient.interceptors.response.use(
  (response) => response, // Si la réponse est OK (2xx), on la laisse passer telle quelle
  (error) => {
    // Si la réponse contient une erreur HTTP (4xx, 5xx)
    const status = error.response?.status // Le ?. évite un crash si error.response est null
    if (status === 401 || status === 403) {
      // 401 = Non authentifié  /  403 = Pas les droits
      console.warn('Accès non autorisé — redirection vers /login')
      localStorage.removeItem('user') // On supprime la session
      window.location.href = '/login' // On redirige vers la page de connexion
    }
    return Promise.reject(error) // On propage l'erreur pour que le catch() dans la Vue la reçoive
  },
)

// On exporte l'instance pour que books.js et users.js puissent l'utiliser
export default apiClient
