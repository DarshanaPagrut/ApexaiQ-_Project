<template>
  <div>
    <v-row>
      <v-col cols="12">
        <!-- <h1 class="text-h4 font-weight-bold mb-6">Events & RSVP</h1> -->
        <v-card class="pa-6 rounded-lg elevation-2">
          <template>
            <v-container fluid>
              <!-- Header -->
              <!-- <div class="text-center mb-6">
                <div class="text-h4 font-weight-bold mb-2 primary--text">Events & Workshops</div>
                <div class="subtitle-1 grey--text">
                  Explore upcoming events and never miss a chance to learn, connect, or compete.
                </div>
                
              </div> -->

              <!-- Top Controls: Search / Sort / Filters -->
              <v-row align="center" class="mb-4">
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="q"
                    prepend-inner-icon="mdi-magnify"
                    label="Search events by title, description, or organizer..."
                    dense
                    outlined
                    clearable
                    
                    
                  />
                </v-col>

                <v-col cols="12" md="4" class="text-right">
                  <v-select
                    v-model="resultsPerPage"
                    :items="[3,6,9,12]"
                    label="Results per page"
                    dense
                    outlined
                    hide-details
                    class="d-inline-block"
                  />
                </v-col>
              </v-row>

              <!-- Category Selection -->
              <div class="font-weight-medium text-subtitle-1 mb-3">Explore by Category</div>
              <v-row class="mb-6">
                <v-col cols="12" sm="6" md="3" v-for="category in categories" :key="category.key">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      :elevation="hover ? 12 : 3"
                      class="rounded-xl pa-4 hoverable"
                      @click="selectCategory(category.key)"
                      role="button"
                    >
                      <div class="d-flex align-center justify-space-between mb-3">
                        <div class="d-flex align-center">
                          <v-icon large class="mr-3">{{ category.icon }}</v-icon>
                          <div>
                            <div class="font-weight-bold">{{ category.title }}</div>
                            <div class="caption grey--text">{{ category.subtitle }}</div>
                          </div>
                        </div>

                        <v-badge :content="countByCategory(category.key)" color="primary" overlap>
                          <v-icon small>mdi-bell-ring</v-icon>
                        </v-badge>
                      </div>

                      <div class="caption grey--text">Click to filter</div>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>

              <!-- Upcoming Events Header -->
              <div class="d-flex align-center justify-space-between mb-3">
                <div>
                  <div class="font-weight-medium text-subtitle-1">Upcoming Events</div>
                  <div class="caption grey--text">Stay ahead with the latest workshops, campaigns, and opportunities.</div>
                </div>

                <div>
                  <v-btn text small @click="clearFilters" v-if="activeFilterText">
                    <v-icon left small>mdi-filter-remove</v-icon> Clear Filters
                  </v-btn>
                </div>
              </div>

              <!-- Events Grid -->
              <v-row>
                <v-col
                  v-for="event in paginatedEvents"
                  :key="event.id"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card class="rounded-xl hoverable elevation-4">
                    <!-- Banner -->
                    <v-img :src="event.image" height="160px" class="rounded-t-xl">
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>

                      <v-chip
                        class="ma-3"
                        small
                        :color="typeColor(event.type)"
                        text-color="white"
                        label
                      >
                        {{ event.type }}
                      </v-chip>
                    </v-img>

                    <v-card-text>
                      <div class="d-flex justify-space-between align-center">
                        <div class="font-weight-bold subtitle-2">{{ event.title }}</div>
                        <div class="caption grey--text">{{ formatDateTimeRange(event.start, event.end) }}</div>
                      </div>

                      <div class="grey--text caption mb-2">📍 {{ event.location }}</div>

                      <div class="mb-3">
                        <div class="body-2 grey--text">{{ shortDescription(event.description) }}</div>
                      </div>

                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                          <v-icon small class="mr-1" title="Seats available">mdi-seat</v-icon>
                          <div class="caption mr-4">{{ event.seats }} seats</div>

                          <v-icon small class="mr-1" title="Starts in">mdi-clock-outline</v-icon>
                          <div class="caption">{{ timeToStart(event.start) }}</div>
                        </div>

                        <div>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn small text v-bind="attrs" v-on="on" @click="openView(event)">
                                <v-icon left>mdi-eye</v-icon> View
                              </v-btn>
                            </template>
                            <span>See full event poster and details</span>
                          </v-tooltip>

                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn small color="primary" @click="openRsvp(event)" v-bind="attrs" v-on="on">
                                <v-icon left>mdi-calendar-check</v-icon> RSVP
                              </v-btn>
                            </template>
                            <span>Reserve your seat before it's gone</span>
                          </v-tooltip>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- No events found -->
                <v-col cols="12" v-if="!filteredEvents.length">
                  <v-alert type="info" border="left" colored-border elevation="2">
                    No events right now — new opportunities coming soon!
                  </v-alert>
                </v-col>
              </v-row>

              <!-- Pagination -->
              <v-row justify="center" class="mt-6">
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  circle
                  total-visible="5"
                />
              </v-row>

              <!-- View Modal -->
              <v-dialog v-model="viewDialog" max-width="800px" persistent>
                <v-card>
                  <v-img :src="activeEvent.image" height="320px"></v-img>
                  <v-card-title class="font-weight-bold">{{ activeEvent.title }}</v-card-title>
                  <v-card-subtitle class="grey--text">
                    {{ formatDateTimeRange(activeEvent.start, activeEvent.end) }} • {{ activeEvent.location }}
                  </v-card-subtitle>

                  <v-card-text>
                    <div class="mb-3">
                      <v-chip small :color="typeColor(activeEvent.type)" text-color="white">{{ activeEvent.type }}</v-chip>
                      <v-chip small class="ml-2" color="accent" text-color="white">{{ activeEvent.organizer }}</v-chip>
                    </div>

                    <div class="body-1 mb-3">{{ activeEvent.description }}</div>

                    <div class="d-flex align-center">
                      <v-icon small class="mr-2">mdi-seat</v-icon>
                      <div class="caption mr-4">{{ activeEvent.seats }} seats available</div>

                      <v-icon small class="mr-2">mdi-map-marker</v-icon>
                      <div class="caption">{{ activeEvent.location }}</div>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="viewDialog = false">Close</v-btn>
                    <v-btn color="primary" @click="openRsvp(activeEvent)"><v-icon left>mdi-calendar-check</v-icon> RSVP</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- RSVP Confirmation Dialog -->
              <v-dialog v-model="rsvpDialog" max-width="520px">
                <v-card>
                  <v-card-title class="headline">Confirm Your Registration</v-card-title>
                  <v-card-text>
                    You're about to register for:
                    <div class="font-weight-bold mt-2">{{ activeEvent.title }}</div>
                    <div class="caption grey--text">{{ formatDateTimeRange(activeEvent.start, activeEvent.end) }}</div>
                    <div class="mt-2">Seats available: <strong>{{ activeEvent.seats }}</strong></div>
                    <div class="mt-3">Would you like to confirm your registration?</div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn text @click="rsvpDialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="confirmRsvp"><v-icon left>mdi-check</v-icon> Confirm</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Snackbar -->
              <v-snackbar v-model="snackbar.show" :timeout="4000" top right>
                <v-icon left>mdi-check-circle</v-icon> {{ snackbar.message }}
                <template v-slot:action>
                  <v-btn text @click="snackbar.show = false">Close</v-btn>
                </template>
              </v-snackbar>
            </v-container>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AlumniEvents',
  data() {
    return {
      q: '',
      resultsPerPage: 6,
      page: 1,
      categories: [
        { key: 'Workshop', title: 'Workshops', subtitle: 'Skill up with experts', icon: 'mdi-school' },
        { key: 'Campaign', title: 'Campaigns', subtitle: 'Be part of meaningful change', icon: 'mdi-earth' },
        { key: 'Networking', title: 'Networking', subtitle: 'Build your professional network', icon: 'mdi-handshake' },
        { key: 'Competition', title: 'Competitions', subtitle: 'Showcase your talent', icon: 'mdi-trophy' }
      ],
      events: [
        {
          id: 1,
          title: 'AI Bootcamp: Learn from Industry Leaders',
          start: '2025-10-20T10:00:00',
          end: '2025-10-20T16:00:00',
          type: 'Workshop',
          location: 'Online',
          description: 'Hands-on workshop on building intelligent chatbots using GPT models.',
          image: 'https://picsum.photos/seed/ai/800/400',
          seats: 32,
          organizer: 'AI Club'
        },
        {
          id: 2,
          title: 'Campus Cleanup Campaign',
          start: '2025-10-25T09:00:00',
          end: '2025-10-25T12:00:00',
          type: 'Campaign',
          location: 'College Auditorium',
          description: 'Join our drive to keep campus clean and green.',
          image: 'https://picsum.photos/seed/campaign/800/400',
          seats: 100,
          organizer: 'Environment Society'
        },
        {
          id: 3,
          title: 'Tech Networking Night',
          start: '2025-11-02T18:00:00',
          end: '2025-11-02T21:00:00',
          type: 'Networking',
          location: 'Auditorium B',
          description: 'Meet alumni and recruiters for career conversations.',
          image: 'https://picsum.photos/seed/network/800/400',
          seats: 50,
          organizer: 'Placement Cell'
        },
        {
          id: 4,
          title: 'Hack & Build Competition',
          start: '2025-11-15T09:00:00',
          end: '2025-11-16T18:00:00',
          type: 'Competition',
          location: 'Online',
          description: 'Showcase your skills and win exciting prizes.',
          image: 'https://picsum.photos/seed/comp/800/400',
          seats: 120,
          organizer: 'Tech Club'
        }
      ],
      viewDialog: false,
      rsvpDialog: false,
      activeEvent: {},
      snackbar: { show: false, message: '' },
      selectedCategory: 'All'
    }
  },
  computed: {
    activeFilterText() {
      if (this.selectedCategory !== 'All' || this.q) {
        return [this.selectedCategory !== 'All' ? this.selectedCategory : null, this.q ? `"${this.q}"` : null]
          .filter(Boolean)
          .join(' • ')
      }
      return ''
    },
    filteredEvents() {
      const q = this.q.trim().toLowerCase()
      return this.events.filter(ev => {
        const matchesQ =
          !q ||
          ev.title.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q) ||
          (ev.organizer && ev.organizer.toLowerCase().includes(q))
        const matchesCategory = this.selectedCategory === 'All' || ev.type === this.selectedCategory
        return matchesQ && matchesCategory
      })
    },
    paginatedEvents() {
      const start = (this.page - 1) * this.resultsPerPage
      const end = start + this.resultsPerPage
      return this.filteredEvents.slice(start, end)
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filteredEvents.length / this.resultsPerPage))
    }
  },
  methods: {
    selectCategory(key) {
      this.selectedCategory = key
      this.page = 1
    },
    clearFilters() {
      this.selectedCategory = 'All'
      this.q = ''
      this.page = 1
    },
    openView(event) {
      this.activeEvent = event
      this.viewDialog = true
    },
    openRsvp(event) {
      this.activeEvent = event
      this.rsvpDialog = true
    },
    confirmRsvp() {
      this.rsvpDialog = false
      this.snackbar.message = `You have successfully registered for "${this.activeEvent.title}"!`
      this.snackbar.show = true
      const e = this.events.find(ev => ev.id === this.activeEvent.id)
      if (e && e.seats > 0) e.seats -= 1
    },
    formatDateTimeRange(start, end) {
      const s = new Date(start)
      const e = new Date(end)
      const optsDate = { day: 'numeric', month: 'short', year: 'numeric' }
      const optsTime = { hour: 'numeric', minute: '2-digit' }
      const date = s.toLocaleDateString(undefined, optsDate)
      const startTime = s.toLocaleTimeString(undefined, optsTime)
      const endTime = e.toLocaleTimeString(undefined, optsTime)
      return `${date} • ${startTime} - ${endTime}`
    },
    shortDescription(desc) {
      return desc.length > 100 ? desc.slice(0, 97) + '...' : desc
    },
    typeColor(type) {
      switch (type) {
        case 'Workshop': return 'blue darken-1'
        case 'Campaign': return 'green darken-1'
        case 'Competition': return 'orange darken-1'
        case 'Networking': return 'purple darken-1'
        default: return 'grey'
      }
    },
    countByCategory(key) {
      return this.events.filter(e => e.type === key).length
    },
    timeToStart(start) {
      const now = new Date()
      const s = new Date(start)
      const diff = s - now
      if (diff <= 0) return 'Started'
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`
      const minutes = Math.floor(diff / (1000 * 60))
      return `Starts in ${minutes} min`
    }
  }
}
</script>
