<template>
  <v-app style="background-color: #f3f6fa;">
    <!-- Fixed full-width navbar -->
    <AppNavbar />

    <!-- Layout container -->
    <div class="main-layout">
      <!-- Sidebar -->
      <AppSidebar v-if="!$store.state.sidebarCollapsed" class="sidebar" />

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
  name: 'StudentLayout',
  components: {
    AppNavbar,
    AppSidebar
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: calc(100vh - 64px); /* Subtract navbar height */
}

.sidebar {
  width: 260px;
  background-color: #fff;
  border-right: 1px solid #ddd;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>
