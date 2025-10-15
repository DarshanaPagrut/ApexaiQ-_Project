<template>
  <v-app-bar 
    app 
    flat 
    height="64"
    class="white elevation-1"
    :class="{ 'theme--dark': $store.state.darkMode }"
  >
    <!-- Mobile Menu Toggle -->
    <v-app-bar-nav-icon 
      app
      @click="toggleSidebar"
      class="d-md-none"
    />
    
    <!-- Logo and Title -->
    <div class="d-flex align-center">
      <v-icon size="32" color="primary" class="mr-2">
        mdi-school
      </v-icon>
      <div class="d-none d-sm-flex flex-column">
        <span class="text-h6 font-weight-bold primary--text">
          AlumniLink
        </span>
        <span class="text-caption grey--text" style="line-height: 1; margin-top: -4px;">
          Connecting graduates, building futures
        </span>
      </div>
      <span class="d-sm-none text-h6 font-weight-bold primary--text">
        AlumniLink
      </span>
    </div>
    
    <v-spacer />
    
    <!-- Search (Optional - can be added later) -->
    <v-text-field
      v-if="false"
      outlined
      dense
      hide-details
      placeholder="Search..."
      prepend-inner-icon="mdi-magnify"
      class="mr-4 d-none d-md-flex"
      style="max-width: 300px;"
    />
    
    <!-- Right Side Actions -->
    <div class="d-flex align-center">
      <!-- Dark Mode Toggle -->
      <v-btn 
        icon 
        @click="toggleDarkMode"
        class="mr-2"
      >
        <v-icon>
          {{ $store.state.darkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}
        </v-icon>
      </v-btn>
      
      <!-- Notifications -->
      <v-btn 
        icon 
        class="mr-2"
      >
        <v-badge
          color="error"
          content="3"
          overlap
          offset-x="10"
          offset-y="10"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      
      <!-- Profile Menu -->
      <v-menu
        offset-y
        left
        min-width="200"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="36" color="primary">
              <v-icon dark>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        
        <v-card>
          <v-card-text class="pa-0">
            <v-list dense>
              <v-list-item class="px-4 py-3">
                <v-list-item-avatar>
                  <v-avatar size="32" color="primary">
                    <v-icon dark small>mdi-account</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ $store.state.user?.name || 'User' }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-capitalize">
                    {{ $store.state.user?.role }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              
              <v-divider />
              
              <v-list-item @click="goToProfile" class="px-4">
                <v-list-item-icon class="mr-3">
                  <v-icon size="20">mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
              <v-list-item @click="goToSettings" class="px-4">
                <v-list-item-icon class="mr-3">
                  <v-icon size="20">mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
              <v-list-item @click="goToHelp" class="px-4">
                <v-list-item-icon class="mr-3">
                  <v-icon size="20">mdi-help-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Help</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
              <v-divider />
              
              <v-list-item @click="logout" class="px-4">
                <v-list-item-icon class="mr-3">
                  <v-icon size="20" color="error">mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="error--text">Log out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavbar',
  methods: {
    toggleSidebar() {
      this.$store.commit('TOGGLE_SIDEBAR')
    },
    toggleDarkMode() {
      this.$store.commit('TOGGLE_DARK_MODE')
    },
    goToProfile() {
      const role = this.$store.state.user?.role
      this.$router.push(`/${role}/profile`)
    },
    goToSettings() {
      const role = this.$store.state.user?.role
      this.$router.push(`/${role}/settings`)
    },
    goToHelp() {
      const role = this.$store.state.user?.role
      this.$router.push(`/${role}/help`)
    },
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>