/**
 * EXEMPLE 1 : CRUD de Todos (tâches)
 *
 * Concepts illustrés :
 * - CREATE : ajout d'une nouvelle tâche via un champ texte
 * - READ   : affichage de la liste des tâches
 * - UPDATE : modification du texte d'une tâche (mode édition inline)
 * - DELETE : suppression d'une tâche
 */
const TodoCrud = {
  template: `
    <div>
      <h2>📝 CRUD - Liste de Tâches</h2>

      <!-- ============ CREATE ============ -->
      <!-- Formulaire d'ajout : on écoute l'événement "submit" -->
      <!-- .prevent empêche le rechargement de la page -->
      <form @submit.prevent="addTodo">
        <!-- v-model lie la valeur de l'input à la variable "newTodo" -->
        <input v-model="newTodo" placeholder="Nouvelle tâche..." />
        <button type="submit">Ajouter</button>
      </form>

      <!-- Message affiché si la liste est vide -->
      <p v-if="todos.length === 0">Aucune tâche pour le moment.</p>

      <!-- ============ READ ============ -->
      <!-- Boucle sur chaque tâche pour l'afficher -->
      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th>Tâche</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- v-for parcourt le tableau "todos" -->
          <!-- :key est obligatoire pour que Vue identifie chaque élément -->
          <tr v-for="(todo, index) in todos" :key="todo.id">
            <td>{{ index + 1 }}</td>
            <td>
              <!-- ============ UPDATE ============ -->
              <!-- Si cette tâche est en mode édition, on affiche un input -->
              <input
                v-if="editingId === todo.id"
                v-model="editText"
                @keyup.enter="saveEdit(todo)"
              />
              <!-- Sinon, on affiche simplement le texte -->
              <!-- :style applique un style barré si la tâche est terminée -->
              <span v-else :style="{ textDecoration: todo.done ? 'line-through' : 'none' }">
                {{ todo.text }}
              </span>
            </td>
            <td>
              <!-- Checkbox pour basculer le statut fait/pas fait -->
              <input type="checkbox" v-model="todo.done" />
              {{ todo.done ? '✅ Fait' : '⏳ En cours' }}
            </td>
            <td>
              <!-- Bouton pour entrer en mode édition ou sauvegarder -->
              <button v-if="editingId === todo.id" @click="saveEdit(todo)">💾 Sauver</button>
              <button v-else @click="startEdit(todo)">✏️ Modifier</button>
              <!-- ============ DELETE ============ -->
              <button @click="deleteTodo(todo.id)">🗑️ Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,

  data() {
    return {
      // Compteur auto-incrémenté pour générer des IDs uniques
      nextId: 1,
      // Texte du champ de saisie pour une nouvelle tâche
      newTodo: "",
      // Tableau contenant toutes les tâches
      todos: [],
      // ID de la tâche actuellement en cours d'édition (null = aucune)
      editingId: null,
      // Texte temporaire pendant l'édition
      editText: "",
    };
  },

  methods: {
    /**
     * CREATE - Ajoute une nouvelle tâche au tableau
     */
    addTodo() {
      // On vérifie que le champ n'est pas vide (après trim)
      const text = this.newTodo.trim();
      if (!text) return;

      // On pousse un nouvel objet dans le tableau
      this.todos.push({
        id: this.nextId++, // ID unique auto-incrémenté
        text: text, // Texte de la tâche
        done: false, // Par défaut, la tâche n'est pas terminée
      });

      // On vide le champ de saisie
      this.newTodo = "";
    },

    /**
     * UPDATE - Active le mode édition pour une tâche
     */
    startEdit(todo) {
      this.editingId = todo.id; // On mémorise quel todo on édite
      this.editText = todo.text; // On copie le texte actuel dans le champ d'édition
    },

    /**
     * UPDATE - Sauvegarde les modifications
     */
    saveEdit(todo) {
      const text = this.editText.trim();
      if (text) {
        todo.text = text; // On met à jour le texte de la tâche
      }
      this.editingId = null; // On quitte le mode édition
      this.editText = "";
    },

    /**
     * DELETE - Supprime une tâche par son ID
     */
    deleteTodo(id) {
      // filter() crée un nouveau tableau sans l'élément supprimé
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
  },
};
