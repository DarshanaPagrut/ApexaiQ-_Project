<template>
  <v-app style="background-color: #f3f6fa;">
    <!-- Navbar stays at the top full width -->
    <AppNavbar />

    <!-- Layout container -->
    <div class="main-layout">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main content -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
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

<style scoped>
.main-layout {
  display: flex;
  margin-top: 64px; /* Adjust for the height of the AppNavbar */
  height: calc(100vh - 64px);
}
.sidebar {
  width: 260px;
  margin-top: 20px; 
  background-color: #fff;
  border-right: 1px solid #ddd;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>

