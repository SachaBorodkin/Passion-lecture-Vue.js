/**
 * EXEMPLE 2 : CRUD Utilisateurs avec validation de formulaire
 *
 * Concepts illustrés :
 * - Formulaire structuré avec plusieurs champs
 * - Validation basique avant ajout/modification
 * - Mode "ajout" vs mode "édition" avec le même formulaire
 * - Computed properties pour les statistiques
 */
const UserCrud = {
  template: `
    <div>
      <h2>👤 CRUD - Gestion des Utilisateurs</h2>

      <!-- ============ FORMULAIRE (CREATE / UPDATE) ============ -->
      <form @submit.prevent="submitForm">
        <div>
          <label>Nom : </label>
          <!-- v-model lie chaque champ du formulaire à l'objet "form" -->
          <input v-model="form.name" placeholder="Nom complet" />
        </div>
        <div>
          <label>Email : </label>
          <input v-model="form.email" type="email" placeholder="email@exemple.com" />
        </div>
        <div>
          <label>Rôle : </label>
          <!-- Select pour choisir un rôle parmi une liste prédéfinie -->
          <select v-model="form.role">
            <option value="">-- Choisir --</option>
            <option value="admin">Administrateur</option>
            <option value="editor">Éditeur</option>
            <option value="viewer">Lecteur</option>
          </select>
        </div>

        <!-- Affichage des erreurs de validation -->
        <p v-for="error in errors" :key="error" class="error">⚠️ {{ error }}</p>

        <!-- Le texte du bouton change selon le mode (ajout ou édition) -->
        <button type="submit">{{ isEditing ? '💾 Mettre à jour' : '➕ Ajouter' }}</button>
        <!-- Bouton annuler visible uniquement en mode édition -->
        <button v-if="isEditing" type="button" @click="cancelEdit">Annuler</button>
      </form>

      <!-- ============ STATISTIQUES (computed) ============ -->
      <p><strong>Total :</strong> {{ users.length }} utilisateur(s) | 
         <strong>Admins :</strong> {{ adminCount }}</p>

      <!-- ============ READ ============ -->
      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <!-- Affichage du rôle avec un label lisible -->
            <td>{{ roleLabel(user.role) }}</td>
            <td>
              <button @click="editUser(user)">✏️ Modifier</button>
              <!-- Confirmation avant suppression -->
              <button @click="deleteUser(user.id)">🗑️ Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Aucun utilisateur enregistré.</p>
    </div>
  `,

  data() {
    return {
      nextId: 1,
      // Objet formulaire réactif : contient les valeurs des champs
      form: { name: "", email: "", role: "" },
      // Tableau des utilisateurs
      users: [],
      // ID de l'utilisateur en cours d'édition (null = mode ajout)
      editingId: null,
      // Tableau des messages d'erreur de validation
      errors: [],
    };
  },

  computed: {
    /**
     * Propriété calculée : retourne true si on est en mode édition
     * Se recalcule automatiquement quand editingId change
     */
    isEditing() {
      return this.editingId !== null;
    },

    /**
     * Propriété calculée : compte le nombre d'administrateurs
     */
    adminCount() {
      return this.users.filter((u) => u.role === "admin").length;
    },
  },

  methods: {
    /**
     * Convertit la valeur du rôle en texte lisible
     */
    roleLabel(role) {
      const labels = {
        admin: "🔑 Administrateur",
        editor: "📝 Éditeur",
        viewer: "👁️ Lecteur",
      };
      return labels[role] || role;
    },

    /**
     * Validation du formulaire
     * Retourne true si le formulaire est valide
     */
    validate() {
      this.errors = [];
      if (!this.form.name.trim()) this.errors.push("Le nom est obligatoire.");
      if (!this.form.email.trim()) this.errors.push("L'email est obligatoire.");
      // Validation basique du format email avec une regex
      else if (!/\S+@\S+\.\S+/.test(this.form.email))
        this.errors.push("Format d'email invalide.");
      if (!this.form.role) this.errors.push("Veuillez choisir un rôle.");
      return this.errors.length === 0;
    },

    /**
     * Soumission du formulaire : appelle create ou update selon le mode
     */
    submitForm() {
      if (!this.validate()) return;

      if (this.isEditing) {
        // UPDATE : on trouve l'utilisateur et on met à jour ses propriétés
        const user = this.users.find((u) => u.id === this.editingId);
        if (user) {
          // Object.assign copie les propriétés de form vers user
          Object.assign(user, {
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            role: this.form.role,
          });
        }
        this.editingId = null;
      } else {
        // CREATE : on ajoute un nouvel utilisateur
        this.users.push({
          id: this.nextId++,
          name: this.form.name.trim(),
          email: this.form.email.trim(),
          role: this.form.role,
        });
      }

      // Réinitialisation du formulaire
      this.form = { name: "", email: "", role: "" };
    },

    /**
     * UPDATE - Charge les données d'un utilisateur dans le formulaire
     */
    editUser(user) {
      this.editingId = user.id;
      // On copie les données dans le formulaire avec le spread operator
      // pour ne pas modifier directement l'objet original
      this.form = { name: user.name, email: user.email, role: user.role };
      this.errors = [];
    },

    /**
     * Annule le mode édition et réinitialise le formulaire
     */
    cancelEdit() {
      this.editingId = null;
      this.form = { name: "", email: "", role: "" };
      this.errors = [];
    },

    /**
     * DELETE - Supprime un utilisateur après confirmation
     */
    deleteUser(id) {
      if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        this.users = this.users.filter((u) => u.id !== id);
        // Si on supprime l'utilisateur en cours d'édition, on annule l'édition
        if (this.editingId === id) this.cancelEdit();
      }
    },
  },
};
