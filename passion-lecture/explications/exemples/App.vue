<template>
  <div id="app">
    <h1>Exemples Axios + json-server</h1>

    <!-- Navigation par onglets pour switcher entre les exemples -->
    <nav>
      <button
        v-for="onglet in onglets"
        :key="onglet.id"
        :class="{ actif: ongletActif === onglet.id }"
        @click="ongletActif = onglet.id"
      >
        {{ onglet.label }}
      </button>
    </nav>

    <hr />

    <!-- v-show conserve le DOM mais cache/affiche via CSS (mieux que v-if pour des onglets) -->
    <ExempleGET v-show="ongletActif === 'get'" />
    <ExemplePOST v-show="ongletActif === 'post'" />
    <ExemplePUT_DELETE v-show="ongletActif === 'put_delete'" />
    <ExempleAvance v-show="ongletActif === 'avance'" />
  </div>
</template>

<script>
// Import des composants créés dans les fichiers séparés
import ExempleGET from "./ExempleGET.vue";
import ExemplePOST from "./ExemplePOST.vue";
import ExemplePUT_DELETE from "./ExemplePUT_DELETE.vue";
import ExempleAvance from "./ExempleAvance.vue";

export default {
  name: "App",

  // Déclaration des composants enfants utilisés dans le template
  components: {
    ExempleGET,
    ExemplePOST,
    ExemplePUT_DELETE,
    ExempleAvance,
  },

  data() {
    return {
      ongletActif: "get", // Onglet affiché au démarrage
      onglets: [
        { id: "get", label: "1. GET — Lire les données" },
        { id: "post", label: "2. POST — Ajouter" },
        { id: "put_delete", label: "3. PUT / DELETE — Modifier / Supprimer" },
        { id: "avance", label: "4. Exemples avancés" },
      ],
    };
  },
};
</script>

<style>
nav button {
  margin-right: 8px;
  padding: 6px 12px;
  cursor: pointer;
}
nav button.actif {
  font-weight: bold;
  background: #42b983;
  color: white;
  border: none;
}
</style>
