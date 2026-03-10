/**
 * EXEMPLE 3 : CRUD Produits avec simulation d'appels API asynchrones
 *
 * Concepts illustrés :
 * - Simulation de délai réseau (setTimeout / Promises)
 * - État de chargement (loading)
 * - Recherche / filtrage en temps réel
 * - Tri des données
 * - async / await dans les méthodes Vue
 */
const ProductCrud = {
  template: `
    <div>
      <h2>📦 CRUD - Produits (simulation API)</h2>

      <!-- ============ FORMULAIRE CREATE / UPDATE ============ -->
      <form @submit.prevent="submitForm">
        <input v-model="form.name" placeholder="Nom du produit" />
        <input v-model.number="form.price" type="number" step="0.01" placeholder="Prix (€)" />
        <input v-model.number="form.stock" type="number" placeholder="Stock" />
        <button type="submit" :disabled="loading">
          {{ loading ? '⏳...' : (editingId ? '💾 Modifier' : '➕ Ajouter') }}
        </button>
        <button v-if="editingId" type="button" @click="cancelEdit">Annuler</button>
      </form>

      <!-- ============ BARRE DE RECHERCHE ============ -->
      <!-- v-model met à jour "search" en temps réel -->
      <div style="margin-top:10px;">
        🔍 <input v-model="search" placeholder="Rechercher un produit..." />
        <!-- Sélecteur de tri -->
        <select v-model="sortBy">
          <option value="name">Trier par nom</option>
          <option value="price">Trier par prix</option>
          <option value="stock">Trier par stock</option>
        </select>
      </div>

      <!-- Indicateur de chargement -->
      <p v-if="loading">⏳ Chargement en cours...</p>

      <!-- ============ READ (avec filtrage et tri) ============ -->
      <table v-if="filteredProducts.length > 0">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- On itère sur la computed "filteredProducts" (filtrée + triée) -->
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.price.toFixed(2) }} €</td>
            <!-- Coloration conditionnelle du stock -->
            <td :style="{ color: product.stock < 5 ? 'red' : 'green' }">
              {{ product.stock }} {{ product.stock < 5 ? '⚠️ Stock bas' : '' }}
            </td>
            <td>
              <button @click="editProduct(product)" :disabled="loading">✏️</button>
              <button @click="deleteProduct(product.id)" :disabled="loading">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!loading">Aucun produit trouvé.</p>
    </div>
  `,

  data() {
    return {
      nextId: 1,
      form: { name: "", price: 0, stock: 0 },
      products: [],
      editingId: null,
      loading: false, // Indique si une opération async est en cours
      search: "", // Texte de recherche
      sortBy: "name", // Critère de tri actuel
    };
  },

  computed: {
    /**
     * Propriété calculée : filtre ET trie les produits
     * Se recalcule automatiquement quand products, search ou sortBy changent
     */
    filteredProducts() {
      let result = this.products;

      // FILTRAGE : on garde seulement les produits dont le nom contient le texte recherché
      if (this.search.trim()) {
        const s = this.search.toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(s));
      }

      // TRI : on trie selon le critère sélectionné
      const key = this.sortBy;
      // On crée une copie avec [...result] pour ne pas muter le tableau original
      return [...result].sort((a, b) => {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
        return a[key] - b[key]; // Tri numérique pour prix et stock
      });
    },
  },

  methods: {
    /**
     * Simule un appel API avec un délai de 500ms
     * Retourne une Promise qui se résout après le délai
     */
    fakeApiCall(data) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 500);
      });
    },

    /**
     * CREATE / UPDATE - Soumission du formulaire (asynchrone)
     */
    async submitForm() {
      const { name, price, stock } = this.form;
      if (!name.trim() || price < 0) return;

      // On active l'indicateur de chargement
      this.loading = true;

      if (this.editingId) {
        // UPDATE : on simule un appel API PUT
        await this.fakeApiCall();
        const product = this.products.find((p) => p.id === this.editingId);
        if (product) {
          product.name = name.trim();
          product.price = price;
          product.stock = stock;
        }
        this.editingId = null;
      } else {
        // CREATE : on simule un appel API POST
        const newProduct = await this.fakeApiCall({
          id: this.nextId++,
          name: name.trim(),
          price: price,
          stock: stock,
        });
        this.products.push(newProduct);
      }

      // On désactive le chargement et on réinitialise le formulaire
      this.loading = false;
      this.form = { name: "", price: 0, stock: 0 };
    },

    /**
     * UPDATE - Pré-remplit le formulaire avec les données du produit
     */
    editProduct(product) {
      this.editingId = product.id;
      this.form = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
    },

    cancelEdit() {
      this.editingId = null;
      this.form = { name: "", price: 0, stock: 0 };
    },

    /**
     * DELETE - Supprime un produit (asynchrone)
     */
    async deleteProduct(id) {
      if (!confirm("Supprimer ce produit ?")) return;
      this.loading = true;
      // Simulation d'un appel API DELETE
      await this.fakeApiCall();
      this.products = this.products.filter((p) => p.id !== id);
      if (this.editingId === id) this.cancelEdit();
      this.loading = false;
    },
  },
};
