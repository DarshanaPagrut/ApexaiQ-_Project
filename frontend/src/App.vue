<template>
  <v-app :dark="$store.state.darkMode">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('initializeAuth')
    // Initialize dark mode from localStorage
    const darkMode = localStorage.getItem('darkMode')
    if (darkMode === 'true') {
      this.$store.commit('TOGGLE_DARK_MODE')
    }
  },
  watch: {
    '$store.state.darkMode': function(newVal) {
      this.$vuetify.theme.dark = newVal
      localStorage.setItem('darkMode', newVal.toString())
    }
  }
}
</script>

<!-- in App.vue (add in <style> block at bottom) -->
<style>
/* Very small helpers only — Vuetify utilities should be preferred. */
.hover-elevate {
  transition: transform .18s ease, box-shadow .18s ease;
}
.hover-elevate:hover {
  transform: translateY(-6px);
}
.gradient-cta {
  background: linear-gradient(135deg, #0092FF, #00D4B4, #00FFAA);
  color: white;
}
.gradient-top-border {
  border-top: 4px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(90deg, #0092FF, #00D4B4, #00FFAA);
}
.glass-card {
  backdrop-filter: blur(6px);
  background: rgba(255,255,255,0.66);
}
</style>
