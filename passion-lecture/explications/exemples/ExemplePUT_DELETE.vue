<template>
  <div>
    <h2>Modifier / Supprimer un utilisateur (PUT & DELETE)</h2>

    <p v-if="chargement">Chargement...</p>
    <p v-if="message" :style="{ color: messageOk ? 'green' : 'red' }">
      {{ message }}
    </p>

    <ul>
      <li v-for="user in utilisateurs" :key="user.id">
        <!-- MODE LECTURE : affichage normal -->
        <span v-if="editionId !== user.id">
          <strong>{{ user.nom }}</strong> — {{ user.email }} ({{
            user.age
          }}
          ans)

          <!-- Bouton pour passer en mode édition : on copie les données dans le formulaire -->
          <button @click="activerEdition(user)">Modifier</button>

          <!-- Bouton de suppression : passe l'id de l'utilisateur à la méthode -->
          <button @click="supprimerUtilisateur(user.id)" style="color: red">
            Supprimer
          </button>
        </span>

        <!-- MODE ÉDITION : formulaire inline affiché uniquement pour la ligne en cours -->
        <span v-else>
          <input v-model="formulaireEdit.nom" placeholder="Nom" />
          <input v-model="formulaireEdit.email" placeholder="Email" />
          <input
            v-model.number="formulaireEdit.age"
            type="number"
            placeholder="Age"
          />

          <button @click="sauvegarderModification(user.id)">Sauvegarder</button>
          <!-- Annuler remet editionId à null pour fermer le formulaire -->
          <button @click="editionId = null">Annuler</button>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

// URL de base : on la centralise pour ne pas la répéter dans chaque méthode
const API_URL = "http://localhost:3000/utilisateurs";

export default {
  name: "ExemplePUT_DELETE",

  data() {
    return {
      utilisateurs: [],
      editionId: null, // ID de l'utilisateur en cours d'édition (null = aucun)
      formulaireEdit: {
        // Données préremplies dans le formulaire d'édition
        nom: "",
        email: "",
        age: null,
      },
      chargement: false,
      message: null, // Message de retour (succès ou erreur)
      messageOk: true, // true = vert, false = rouge
    };
  },

  mounted() {
    this.fetchUtilisateurs();
  },

  methods: {
    // Récupération initiale (même principe que l'exemple GET)
    async fetchUtilisateurs() {
      this.chargement = true;
      const response = await axios.get(API_URL);
      this.utilisateurs = response.data;
      this.chargement = false;
    },

    // Passe en mode édition : on copie les données de l'utilisateur dans le formulaire
    // en utilisant le spread operator {...} pour éviter la modification directe de l'objet
    activerEdition(user) {
      this.editionId = user.id;
      this.formulaireEdit = { ...user }; // Copie superficielle pour éviter la mutation directe
    },

    // PUT : remplace entièrement la ressource existante à l'URL /utilisateurs/:id
    // Différence PUT vs PATCH :
    //   - PUT   : remplace TOUT l'objet (tous les champs doivent être envoyés)
    //   - PATCH : met à jour PARTIELLEMENT (seuls les champs modifiés sont envoyés)
    async sauvegarderModification(id) {
      try {
        const response = await axios.put(
          `${API_URL}/${id}`,
          this.formulaireEdit,
        );

        // On met à jour localement le tableau sans refaire un appel GET
        // findIndex trouve la position de l'élément modifié
        const index = this.utilisateurs.findIndex((u) => u.id === id);
        this.utilisateurs[index] = response.data; // Remplace par les données renvoyées

        this.editionId = null; // Ferme le formulaire d'édition
        this.afficherMessage("Utilisateur modifié avec succès", true);
      } catch (err) {
        this.afficherMessage(
          "Erreur lors de la modification : " + err.message,
          false,
        );
      }
    },

    // DELETE : supprime la ressource à l'URL /utilisateurs/:id
    async supprimerUtilisateur(id) {
      // Confirmation native du navigateur avant de supprimer
      if (!confirm("Confirmer la suppression ?")) return;

      try {
        // DELETE ne retourne généralement pas de body (réponse 200 ou 204 vide)
        await axios.delete(`${API_URL}/${id}`);

        // On filtre localement pour retirer l'élément supprimé du tableau
        // sans avoir besoin de refaire un appel GET
        this.utilisateurs = this.utilisateurs.filter((u) => u.id !== id);

        this.afficherMessage("Utilisateur supprimé", true);
      } catch (err) {
        this.afficherMessage(
          "Erreur lors de la suppression : " + err.message,
          false,
        );
      }
    },

    // Méthode utilitaire : affiche un message pendant 3 secondes puis le cache
    afficherMessage(texte, ok) {
      this.message = texte;
      this.messageOk = ok;
      setTimeout(() => {
        this.message = null;
      }, 3000);
    },
  },
};
</script>
