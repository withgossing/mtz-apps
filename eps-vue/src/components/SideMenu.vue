<template>
  <v-list>
    <v-list-item
      v-for="item in menuItems"
      :key="item.path"
      :prepend-icon="item.icon"
      :to="item.path"
      :value="item.path"
      color="primary"
    >
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const menuItems = [
  {
    name: "대시보드",
    path: "/",
    icon: "mdi-view-dashboard",
  },
  {
    name: "사용자 관리",
    path: "/users",
    icon: "mdi-account-group",
  },
  {
    name: "설정",
    path: "/settings",
    icon: "mdi-cog",
  },
];
</script>
