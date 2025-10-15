<template>
  <v-app>
    <!-- Navbar stays at the top full width -->
    <AppNavbar />

    <v-main>
      <!-- Sidebar should be inside v-main but still fixed on the side -->
      <AppSidebar />

      <!-- Main content -->
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from '../components/AppSidebar.vue'

export default {
  name: 'AlumniLayout',
  components: {
    AppNavbar,
    AppSidebar
  }
}
</script>