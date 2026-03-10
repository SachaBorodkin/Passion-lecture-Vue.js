<template>
  <div>
    <h2>Ajouter un utilisateur (POST)</h2>

    <!-- Formulaire lié au reactive object "formulaire" via v-model -->
    <form @submit.prevent="ajouterUtilisateur">
      <div>
        <label>Nom :</label>
        <!-- v-model synchronise la valeur du champ avec formulaire.nom en temps réel -->
        <input
          v-model="formulaire.nom"
          type="text"
          placeholder="Ex: Jean Dupont"
          required
        />
      </div>

      <div>
        <label>Email :</label>
        <input
          v-model="formulaire.email"
          type="email"
          placeholder="Ex: jean@example.com"
          required
        />
      </div>

      <div>
        <label>Age :</label>
        <!-- .number convertit automatiquement la valeur en nombre -->
        <input v-model.number="formulaire.age" type="number" min="1" required />
      </div>

      <!-- :disabled empêche le double envoi pendant le chargement -->
      <button type="submit" :disabled="envoi">
        {{ envoi ? "Envoi..." : "Ajouter" }}
      </button>
    </form>

    <!-- Message de succès après l'ajout -->
    <p v-if="succes" style="color: green">{{ succes }}</p>

    <!-- Message d'erreur -->
    <p v-if="erreur" style="color: red">{{ erreur }}</p>

    <!-- Affichage de la réponse brute reçue de l'API (utile pendant le dev) -->
    <div v-if="reponseAPI">
      <h4>Réponse de l'API :</h4>
      <!-- JSON.stringify avec indentation pour un affichage lisible -->
      <pre>{{ JSON.stringify(reponseAPI, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ExemplePOST",

  data() {
    return {
      // Objet lié au formulaire : sera envoyé tel quel dans le body de la requête
      formulaire: {
        nom: "",
        email: "",
        age: null,
      },
      envoi: false, // Empêche les doubles soumissions
      succes: null, // Message de confirmation
      erreur: null, // Message d'erreur
      reponseAPI: null, // Objet retourné par json-server après la création
    };
  },

  methods: {
    async ajouterUtilisateur() {
      this.envoi = true;
      this.succes = null;
      this.erreur = null;

      try {
        // POST : crée une nouvelle ressource
        // - 1er argument : URL de la collection
        // - 2ème argument : le body envoyé en JSON (axios le sérialise automatiquement)
        // json-server attribue automatiquement un id unique au nouvel objet
        const response = await axios.post(
          "http://localhost:3000/utilisateurs",
          this.formulaire,
        );

        // response.status === 201 : Created (standard REST pour une création réussie)
        this.succes = `Utilisateur créé avec l'ID : ${response.data.id}`;

        // On conserve la réponse pour l'afficher
        this.reponseAPI = response.data;

        // On remet le formulaire à zéro après un ajout réussi
        this.formulaire = { nom: "", email: "", age: null };
      } catch (err) {
        // axios place l'erreur HTTP dans err.response
        this.erreur = err.response
          ? `Erreur ${err.response.status} : ${err.response.statusText}`
          : "Erreur réseau : " + err.message;
      } finally {
        this.envoi = false;
      }
    },
  },
};
</script>
