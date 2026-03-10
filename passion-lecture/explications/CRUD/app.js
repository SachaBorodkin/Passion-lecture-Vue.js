// Création de l'application Vue principale
const app = Vue.createApp({
  data() {
    return {
      // Liste des onglets disponibles
      tabs: ["Todos", "Users", "Products", "Notes"],
      // Onglet actuellement sélectionné
      currentTab: "Todos",
    };
  },
});

// Enregistrement de chaque composant CRUD dans l'application
app.component("todo-crud", TodoCrud);
app.component("user-crud", UserCrud);
app.component("product-crud", ProductCrud);
app.component("note-crud", NoteCrud);

// Montage de l'application sur l'élément #app
app.mount("#app");
