<template>
  <div>
    <h2>Exemples avancés avec l'instance Axios centralisée</h2>

    <!-- ─── 1. RECHERCHE / FILTRAGE ─────────────────────────────── -->
    <section>
      <h3>1. Recherche avec paramètres de query</h3>

      <!-- v-model.lazy : met à jour uniquement quand l'input perd le focus (moins de requêtes) -->
      <input v-model.lazy="recherche" placeholder="Nom à chercher..." />
      <button @click="rechercherUtilisateur">Chercher</button>

      <ul>
        <!-- Si aucun résultat, on affiche un message -->
        <li v-if="resultatsRecherche.length === 0 && rechercheEffectuee">
          Aucun résultat
        </li>
        <li v-for="u in resultatsRecherche" :key="u.id">
          {{ u.nom }} — {{ u.email }}
        </li>
      </ul>
    </section>

    <hr />

    <!-- ─── 2. REQUÊTES PARALLÈLES ───────────────────────────────── -->
    <section>
      <h3>2. Requêtes parallèles avec Promise.all</h3>
      <button @click="chargerTout">
        Charger utilisateurs + produits en parallèle
      </button>

      <div v-if="donneesParalleles.utilisateurs.length">
        <strong>Utilisateurs :</strong>
        {{ donneesParalleles.utilisateurs.length }} chargés
      </div>
      <div v-if="donneesParalleles.produits.length">
        <strong>Produits :</strong>
        {{ donneesParalleles.produits.length }} chargés
      </div>
    </section>

    <hr />

    <!-- ─── 3. PAGINATION ────────────────────────────────────────── -->
    <section>
      <h3>3. Pagination côté serveur</h3>
      <button @click="pagePrecedente" :disabled="page <= 1">← Précédent</button>
      <span> Page {{ page }} </span>
      <button @click="pageSuivante">Suivant →</button>

      <ul>
        <li v-for="u in utilisateursPagines" :key="u.id">{{ u.nom }}</li>
      </ul>
      <p>
        <small>Total : {{ totalUtilisateurs }} utilisateurs</small>
      </p>
    </section>

    <hr />

    <!-- ─── 4. ANNULATION DE REQUÊTE ─────────────────────────────── -->
    <section>
      <h3>4. Annulation de requête (AbortController)</h3>
      <p>
        <small
          >Utile pour annuler une recherche si l'utilisateur tape vite</small
        >
      </p>
      <input
        v-model="rechercheAnnulable"
        placeholder="Tapez rapidement..."
        @input="rechercherAvecAnnulation"
      />
      <p v-if="statutAnnulation">{{ statutAnnulation }}</p>
    </section>
  </div>
</template>

<script>
// On utilise l'instance centralisée au lieu d'axios directement
import api from "./api.js";

export default {
  name: "ExempleAvance",

  data() {
    return {
      // Recherche simple
      recherche: "",
      resultatsRecherche: [],
      rechercheEffectuee: false,

      // Requêtes parallèles
      donneesParalleles: { utilisateurs: [], produits: [] },

      // Pagination
      page: 1,
      parPage: 2, // Nombre d'items par page
      utilisateursPagines: [],
      totalUtilisateurs: 0,

      // Annulation
      rechercheAnnulable: "",
      statutAnnulation: "",
      controller: null, // AbortController en cours
    };
  },

  methods: {
    // ── 1. FILTRAGE AVEC QUERY PARAMS ─────────────────────────────
    // json-server supporte le filtrage avec ?nom=valeur
    // Ex: GET /utilisateurs?nom=Alice
    async rechercherUtilisateur() {
      this.rechercheEffectuee = true;

      // On passe les paramètres dans l'option `params` : axios les encode en query string
      // Résultat : GET /utilisateurs?nom_like=alice  (json-server supporte _like pour la recherche partielle)
      const response = await api.get("/utilisateurs", {
        params: {
          nom_like: this.recherche, // _like = contient (insensible à la casse dans json-server)
        },
      });
      this.resultatsRecherche = response.data;
    },

    // ── 2. REQUÊTES EN PARALLÈLE ──────────────────────────────────
    // Promise.all lance toutes les requêtes SIMULTANÉMENT
    // et attend que TOUTES soient terminées avant de continuer.
    // Plus rapide que d'enchaîner les await un par un.
    async chargerTout() {
      const [resUsers, resProduits] = await Promise.all([
        api.get("/utilisateurs"),
        api.get("/produits"),
      ]);
      // Déstructuration des deux réponses en une seule ligne
      this.donneesParalleles.utilisateurs = resUsers.data;
      this.donneesParalleles.produits = resProduits.data;
    },

    // ── 3. PAGINATION ─────────────────────────────────────────────
    // json-server supporte nativement ?_page=1&_per_page=2
    // Il retourne aussi le total dans les headers (X-Total-Count)
    async chargerPage() {
      const response = await api.get("/utilisateurs", {
        params: {
          _page: this.page,
          _per_page: this.parPage,
        },
      });
      this.utilisateursPagines = response.data.data ?? response.data;

      // json-server v1 retourne le total dans les headers
      // json-server v0 le retourne dans X-Total-Count
      const total =
        response.headers["x-total-count"] ||
        response.data.items ||
        response.data.total;
      if (total) this.totalUtilisateurs = parseInt(total);
    },

    pagePrecedente() {
      if (this.page > 1) {
        this.page--;
        this.chargerPage();
      }
    },

    pageSuivante() {
      this.page++;
      this.chargerPage();
    },

    // ── 4. ANNULATION DE REQUÊTE ──────────────────────────────────
    // Quand l'utilisateur tape vite, on annule la requête précédente
    // avant d'en lancer une nouvelle (évite les réponses dans le désordre)
    rechercherAvecAnnulation() {
      // Si une requête est déjà en cours, on l'annule
      if (this.controller) {
        this.controller.abort();
        this.statutAnnulation = "Requête précédente annulée...";
      }

      // Crée un nouveau contrôleur pour la requête suivante
      this.controller = new AbortController();

      api
        .get("/utilisateurs", {
          params: { nom_like: this.rechercheAnnulable },
          // On passe le signal de l'AbortController à axios
          signal: this.controller.signal,
        })
        .then((response) => {
          this.statutAnnulation = `${response.data.length} résultat(s) trouvé(s)`;
          this.controller = null;
        })
        .catch((err) => {
          // axios.isCancel() détecte si l'erreur vient d'une annulation (pas un vrai problème)
          if (axios.isCancel?.(err) || err.name === "CanceledError") {
            // Requête annulée volontairement, on ne fait rien de particulier
          } else {
            this.statutAnnulation = "Erreur : " + err.message;
          }
        });
    },
  },

  mounted() {
    // Chargement de la première page au montage
    this.chargerPage();
  },
};
</script>
