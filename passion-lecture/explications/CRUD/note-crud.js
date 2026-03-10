/**
 * EXEMPLE 4 : CRUD de Notes avec persistance localStorage
 *
 * Concepts illustrés :
 * - Persistance des données dans le navigateur (localStorage)
 * - Watcher (watch) pour sauvegarder automatiquement à chaque modification
 * - Lifecycle hook "mounted" pour charger les données au démarrage
 * - Textarea pour du contenu multi-lignes
 * - Horodatage (date de création / modification)
 */
const NoteCrud = {
  template: `
    <div>
      <h2>🗒️ CRUD - Notes (avec localStorage)</h2>
      <p style="color:gray;">Les données sont sauvegardées automatiquement dans votre navigateur.</p>

      <!-- ============ CREATE / UPDATE ============ -->
      <form @submit.prevent="submitForm">
        <div>
          <input v-model="form.title" placeholder="Titre de la note" style="width:100%;" />
        </div>
        <div>
          <!-- textarea pour le contenu multi-lignes -->
          <textarea v-model="form.content" placeholder="Contenu..." rows="4" style="width:100%;"></textarea>
        </div>
        <!-- Sélecteur de couleur pour catégoriser visuellement -->
        <div>
          🎨 Couleur :
          <label v-for="color in colors" :key="color" style="margin-right:10px;">
            <input type="radio" v-model="form.color" :value="color" />
            <span :style="{ background: color, padding: '2px 12px', borderRadius: '4px' }">
              &nbsp;
            </span>
          </label>
        </div>
        <button type="submit">{{ editingId ? '💾 Sauver' : '➕ Créer la note' }}</button>
        <button v-if="editingId" type="button" @click="cancelEdit">Annuler</button>
      </form>

      <!-- ============ READ ============ -->
      <!-- Affichage sous forme de "cartes" plutôt qu'un tableau -->
      <div v-if="notes.length === 0" style="margin-top:20px;">
        <p>📭 Aucune note. Créez-en une !</p>
      </div>
      <div v-else style="display:flex; flex-wrap:wrap; gap:10px; margin-top:15px;">
        <!-- Chaque note est affichée comme une carte colorée -->
        <div
          v-for="note in notes"
          :key="note.id"
          :style="{
            background: note.color,
            padding: '12px',
            borderRadius: '8px',
            width: '220px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }"
        >
          <strong>{{ note.title }}</strong>
          <!-- white-space:pre-wrap conserve les retours à la ligne -->
          <p style="white-space:pre-wrap; font-size:0.9em;">{{ note.content }}</p>
          <small style="color:#555;">
            Créé : {{ formatDate(note.createdAt) }}<br/>
            <!-- Affiche "Modifié" seulement si la note a été éditée -->
            <span v-if="note.updatedAt">Modifié : {{ formatDate(note.updatedAt) }}</span>
          </small>
          <div style="margin-top:8px;">
            <button @click="editNote(note)">✏️</button>
            <button @click="deleteNote(note.id)">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Bouton pour tout effacer -->
      <div v-if="notes.length > 0" style="margin-top:15px;">
        <button @click="clearAll" style="background:#ff4444;color:white;border:none;padding:8px 16px;">
          🧹 Tout supprimer
        </button>
      </div>
    </div>
  `,

  data() {
    return {
      nextId: 1,
      form: { title: "", content: "", color: "#fffacd" },
      notes: [],
      editingId: null,
      // Palette de couleurs disponibles pour les notes
      colors: ["#fffacd", "#d4edda", "#cce5ff", "#f8d7da", "#e2d5f1"],
    };
  },

  /**
   * LIFECYCLE HOOK : mounted()
   * Appelé automatiquement quand le composant est inséré dans le DOM.
   * On en profite pour charger les données depuis localStorage.
   */
  mounted() {
    const saved = localStorage.getItem("vue-crud-notes");
    if (saved) {
      try {
        // JSON.parse convertit la chaîne JSON en objet JavaScript
        const data = JSON.parse(saved);
        this.notes = data.notes || [];
        this.nextId = data.nextId || 1;
      } catch (e) {
        // Si les données sont corrompues, on repart de zéro
        console.warn("Données localStorage corrompues, réinitialisation.");
      }
    }
  },

  watch: {
    /**
     * WATCHER : surveille le tableau "notes" en profondeur (deep: true)
     * À chaque modification (ajout, suppression, édition),
     * on sauvegarde automatiquement dans localStorage.
     */
    notes: {
      deep: true,
      handler() {
        this.saveToLocalStorage();
      },
    },
  },

  methods: {
    /**
     * Sauvegarde les notes dans localStorage
     * localStorage ne stocke que des chaînes → on utilise JSON.stringify
     */
    saveToLocalStorage() {
      localStorage.setItem(
        "vue-crud-notes",
        JSON.stringify({
          notes: this.notes,
          nextId: this.nextId,
        }),
      );
    },

    /**
     * Formate un timestamp ISO en date lisible
     */
    formatDate(isoString) {
      return new Date(isoString).toLocaleString("fr-FR");
    },

    /**
     * CREATE / UPDATE
     */
    submitForm() {
      const { title, content, color } = this.form;
      if (!title.trim()) return;

      if (this.editingId) {
        // UPDATE : on cherche la note et on met à jour ses propriétés
        const note = this.notes.find((n) => n.id === this.editingId);
        if (note) {
          note.title = title.trim();
          note.content = content.trim();
          note.color = color;
          // On enregistre la date de modification
          note.updatedAt = new Date().toISOString();
        }
        this.editingId = null;
      } else {
        // CREATE : nouvelle note avec horodatage
        this.notes.push({
          id: this.nextId++,
          title: title.trim(),
          content: content.trim(),
          color: color,
          createdAt: new Date().toISOString(), // Date de création
          updatedAt: null, // Pas encore modifiée
        });
      }

      this.form = { title: "", content: "", color: "#fffacd" };
    },

    /**
     * UPDATE - Charge une note dans le formulaire
     */
    editNote(note) {
      this.editingId = note.id;
      this.form = {
        title: note.title,
        content: note.content,
        color: note.color,
      };
    },

    cancelEdit() {
      this.editingId = null;
      this.form = { title: "", content: "", color: "#fffacd" };
    },

    /**
     * DELETE - Supprime une note
     */
    deleteNote(id) {
      this.notes = this.notes.filter((n) => n.id !== id);
      if (this.editingId === id) this.cancelEdit();
      // Le watcher sauvegarde automatiquement dans localStorage
    },

    /**
     * DELETE ALL - Supprime toutes les notes
     */
    clearAll() {
      if (confirm("Supprimer TOUTES les notes ?")) {
        this.notes = [];
        this.editingId = null;
        // On nettoie aussi le localStorage
        localStorage.removeItem("vue-crud-notes");
      }
    },
  },
};
