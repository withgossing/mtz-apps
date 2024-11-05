<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SideNav from './components/SideNav.vue';

</script>

<template>
  <header>
    <div class="wrapper">
      <SideNav />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
