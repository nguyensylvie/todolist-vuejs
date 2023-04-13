<template>
  <p :class="`${theme ? 'textInfoLight' : 'textInfoDark'}`">
    Les tâches peuvent être déplacées d'une liste à l'autre en utilisant la
    fonctionnalité de glisser-déposer.
  </p>
  <div class="toggleTheme">
    <v-btn icon @click="props.toggleTheme" :theme="props.themeMode">
      <v-icon :color="iconColor">{{ icon }}</v-icon>
      <v-tooltip activator="parent" location="start center" origin="auto">{{
        modeText
      }}</v-tooltip>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  toggleTheme: Function,
  theme: Boolean,
  themeMode: String,
});

const icon = computed(() =>
  props.theme ? "mdi-moon-waning-crescent" : "mdi-white-balance-sunny"
);

const iconColor = computed(() => (props.theme ? "" : "white"));

const modeText = computed(() => (props.theme ? "Mode clair" : "Mode sombre"));
</script>

<script lang="ts">
export default {
  name: "ToggleThemeBtn",
};
</script>

<style scoped>
.toggleTheme {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
p {
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-size: 14px;
  padding: 5px;
  border-radius: 3px;
}
.textInfoLight {
  background-color: #eeeeee;
  color: black;
}
.textInfoDark {
  background-color: #202225;
  color: white;
}
</style>
