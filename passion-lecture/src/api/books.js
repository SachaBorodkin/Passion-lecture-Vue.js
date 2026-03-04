import apiClient from './axios'

/**
 * Books API — RESTful service layer
 * Maps to json-server endpoints:  GET/POST /books  |  GET/PATCH/DELETE /books/:id
 */

// GET /books
export const getAllBooks = () => apiClient.get('/books')

// GET /books/:id
export const getBookById = (id) => apiClient.get(`/books/${id}`)

// POST /books
export const createBook = (bookData) => apiClient.post('/books', bookData)

// PATCH /books/:id  (partial update)
export const updateBook = (id, fields) => apiClient.patch(`/books/${id}`, fields)

// DELETE /books/:id
export const deleteBook = (id) => apiClient.delete(`/books/${id}`)
