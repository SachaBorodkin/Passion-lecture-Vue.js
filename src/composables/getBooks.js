import { ref } from 'vue'
import { getAllBooks } from '@/api/books'

export function getBooks() {
  const books = ref([]) //tableau pour les livres
  const loading = ref(true) // variable pour l'état de chargement

  const fetchBooks = async () => {
    try {
      //envoie de la requete dans db et sauvegarde dans response
      const response = await getAllBooks()
      books.value = response.data
    } catch (error) {
      console.error('Erreur API', error)
    } finally {
      loading.value = false
    }
  }
  return { books, loading, fetchBooks }
}
