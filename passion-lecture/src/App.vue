<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])

onMounted(async () => {
  try {
    const response = await fetch('/api/posts')
    posts.value = await response.json()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <div>
    <h1>Posts</h1>
    <ul></ul>
  </div>
</template>
