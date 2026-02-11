<template>
  <div id="app">
    <HeaderVue />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Import the Header component
import HeaderVue from './components/HeaderVue.vue'
</script>

<style>
/* Global styles for the app layout */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  padding: 20px;
}
</style>
