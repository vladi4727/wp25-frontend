<template>
  <main>
    <Header />
    <div class="pt-[20px]">
      <Chat />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Chat from '@/components/Chat.vue'

const route = useRoute()
const matchId = route.params.id as string
</script>
