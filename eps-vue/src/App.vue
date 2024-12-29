<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "../src/layout/DefaultLayout.vue";
import BlankLayout from "../src/layout/BlankLayout.vue";

type LayoutNames = "default" | "blank";
type Layouts = {
  [K in LayoutNames]: typeof DefaultLayout | typeof BlankLayout;
};

const layouts: Layouts = {
  default: DefaultLayout,
  blank: BlankLayout,
};

const route = useRoute();
const layout = computed(() => {
  const layoutName = (route.meta.layout as LayoutNames) || "default";
  return layouts[layoutName];
});
</script>
