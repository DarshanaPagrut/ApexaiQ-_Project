<template>
  <v-app>
    <!-- Navbar always at the top full width -->
    <AppNavbar />

    <!-- Sidebar automatically sits below navbar -->
    <AppSidebar />

    <!-- Main content area -->
    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

export default {
  name: 'AdminLayout',
  components: {
    AppNavbar,
    AppSidebar
  }
}
</script>
