<template>
  <div>
    <h2>Liste des utilisateurs</h2>

    <!-- Affiché pendant le chargement -->
    <p v-if="chargement">Chargement en cours...</p>

    <!-- Affiché si une erreur survient -->
    <p v-if="erreur" style="color: red">{{ erreur }}</p>

    <!-- Bouton pour déclencher manuellement la récupération -->
    <button @click="fetchUtilisateurs">Recharger</button>

    <!-- Tableau affiché une fois les données reçues -->
    <table v-if="utilisateurs.length > 0" border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <!-- v-for : on boucle sur le tableau d'utilisateurs reçu de l'API -->
        <tr v-for="user in utilisateurs" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.nom }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// On importe axios pour faire des requêtes HTTP
import axios from "axios";

export default {
  name: "ExempleGET",

  data() {
    return {
      utilisateurs: [], // Tableau qui contiendra les données reçues de l'API
      chargement: false, // Indicateur visuel de chargement
      erreur: null, // Contiendra le message d'erreur si la requête échoue
    };
  },

  // mounted() est appelé automatiquement quand le composant est inséré dans le DOM
  // C'est l'endroit idéal pour récupérer des données initiales
  mounted() {
    this.fetchUtilisateurs();
  },

  methods: {
    async fetchUtilisateurs() {
      this.chargement = true; // On active l'indicateur de chargement
      this.erreur = null; // On réinitialise l'erreur précédente

      try {
        // GET : récupère tous les utilisateurs depuis json-server
        // json-server expose automatiquement /utilisateurs grâce à db.json
        const response = await axios.get("http://localhost:3000/utilisateurs");

        // response.data contient le tableau JSON retourné par l'API
        this.utilisateurs = response.data;
      } catch (err) {
        // En cas d'échec réseau ou erreur serveur, on affiche un message
        this.erreur = "Impossible de charger les utilisateurs : " + err.message;
      } finally {
        // finally s'exécute toujours, succès ou échec
        this.chargement = false;
      }
    },
  },
};
</script>
