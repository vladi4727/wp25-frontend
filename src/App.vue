<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios'

const jwt = localStorage.getItem('jwt')
if (jwt) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
}
</script>

<template>
  <div class="relative w-full min-h-dvh bg-[#0b0d12]">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-1 min-h-dvh bg-black-500">
      <div
        class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl animate-pulse delay-200"
      ></div>
      <div
        class="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse delay-500"
      ></div>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
