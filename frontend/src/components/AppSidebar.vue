<template>
  
  <v-navigation-drawer
  v-model="drawer"
  :temporary="$vuetify.breakpoint.smAndDown"
  :permanent="!$vuetify.breakpoint.smAndDown"
  width="260"
  class="elevation-1 custom-sidebar"
  style="margin-top: 64px;"
>

    <div class="pt-16 fill-height d-flex flex-column">
      
      <v-container fill-height class="pa-0">
        <v-row no-gutters align="center" class="flex-grow-1">
          <v-col>
            <v-list dense nav class="pa-0">
              <v-list-item
                v-for="item in menuItems"
                :key="item.name"
                :to="item.to"
                router
                exact
                class="my-1 mx-2 rounded-lg"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon class="primary--text">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-navigation-drawer>
</template>

<script>

export default {
  name: 'AppSidebar',
  data() {
    return {
      adminMenuItems: [
        {
          name: 'dashboard',
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: '/admin/dashboard'
        },
        {
          name: 'alumni-management',
          title: 'Alumni Management',
          icon: 'mdi-account-group',
          to: '/admin/alumni-management'
        },
        {
          name: 'directory',
          title: 'Directory',
          icon: 'mdi-book-open-page-variant',
          to: '/admin/directory'
        },
        {
          name: 'events',
          title: 'Events & Campaigns',
          icon: 'mdi-calendar-multiple',
          to: '/admin/events'
        },
        {
          name: 'mentorship',
          title: 'Mentorship Management',
          icon: 'mdi-account-tie',
          to: '/admin/mentorship'
        },
        {
          name: 'analytics',
          title: 'Analytics',
          icon: 'mdi-chart-line',
          to: '/admin/analytics'
        }
      ],
      alumniMenuItems: [
        {
          name: 'dashboard',
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: '/alumni/dashboard'
        },
        {
          name: 'connections',
          title: 'Connections',
          icon: 'mdi-account-network',
          to: '/alumni/connections'
        },
        {
          name: 'events',
          title: 'Events & RSVP',
          icon: 'mdi-calendar-check',
          to: '/alumni/events'
        },
        {
          name: 'mentorship',
          title: 'Mentorship',
          icon: 'mdi-account-tie',
          to: '/alumni/mentorship'
        },
        {
          name: 'memories',
          title: 'Memories',
          icon: 'mdi-image-multiple',
          to: '/alumni/memories'
        },
        {
          name: 'groups',
          title: 'Groups Chats',
          icon: 'mdi-forum',
          to: '/alumni/groups'
        }
      ],
      studentMenuItems: [
        {
          name: 'dashboard',
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: '/student/dashboard'
        },
        {
          name: 'directory',
          title: 'Directory',
          icon: 'mdi-book-open-page-variant',
          to: '/student/directory'
        },
        {
          name: 'events',
          title: 'Events & Workshops',
          icon: 'mdi-calendar-clock',
          to: '/student/events'
        },
        {
          name: 'mentorship',
          title: 'Mentorship',
          icon: 'mdi-account-supervisor',
          to: '/student/mentorship'
        }
      ]
    }
  },
  computed: {
    drawer: {
      get() {
        return !this.$store.state.sidebarCollapsed
      },
      set(value) {
        if (!value) {
          this.$store.commit('TOGGLE_SIDEBAR')
        }
      }
    },
    sidebarWidth() {
      return this.miniVariant ? 64 : 260
    },
    miniVariant() {
      return this.$vuetify.breakpoint.lg && this.$store.state.sidebarCollapsed
    },
    userRole() {
      return this.$store.state.user?.role
    },
    menuItems() {
      if (this.userRole === 'admin') return this.adminMenuItems
      if (this.userRole === 'alumni') return this.alumniMenuItems
      if (this.userRole === 'student') return this.studentMenuItems
      return []
    }
  }
}
</script>