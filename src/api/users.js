import apiClient from './axios'

/**
 * Users API — RESTful service layer
 * Maps to json-server endpoints:  GET/POST /users  |  GET/PATCH/DELETE /users/:id
 */

// GET /users?username=xxx  (used for login / duplicate check)
export const getUserByUsername = (username) =>
  apiClient.get('/users', { params: { username } })

// GET /users/:id
export const getUserById = (id) => apiClient.get(`/users/${id}`)

// POST /users  (register)
export const createUser = (userData) => apiClient.post('/users', userData)

// PATCH /users/:id  (partial update — counters, profile fields)
export const updateUser = (id, fields) => apiClient.patch(`/users/${id}`, fields)

// DELETE /users/:id
export const deleteUser = (id) => apiClient.delete(`/users/${id}`)
