<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.lgAndUp"
      color="grey-lighten-3"
    >
      <SideMenu />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        :class="{ 'd-none': $vuetify.display.lgAndUp }"
      ></v-app-bar-nav-icon>
      <AppHeader />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SideMenu from "../components/SideMenu.vue";
import AppHeader from "../components/AppHeader.vue";

const drawer = ref(true);
</script>
