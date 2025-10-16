<template>
  <v-container fluid class="pa-4 pa-md-6" style="background-color: #f3f6fa; min-height: 100%;">
    <!-- 1️⃣ Page Header Area -->
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h1 class="text-h4 text-md-h3 font-weight-bold primary--text mb-2">🗓️ Upcoming Events & Opportunities</h1>
        <p class="text-h6 font-weight-light grey--text text--darken-2">
          Discover events, workshops, and campaigns hosted by your alumni community.
        </p>
      </v-col>
    </v-row>

    <!-- 2️⃣ Search & Sort Section -->
    <v-card class="mb-8 pa-4 rounded-xl" style="backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.7);">
      <v-row align="center" dense>
        <v-col cols="12" md="7">
          <v-text-field
            v-model="q"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search events, topics, or organizers..."
            solo
            flat
            hide-details
            background-color="transparent"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
           <v-select
            v-model="sortBy"
            :items="['Soonest', 'Newest', 'Most Popular']"
            label="Sort by"
            prepend-inner-icon="mdi-sort"
            solo
            flat
            hide-details
            background-color="transparent"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="resultsPerPage"
            :items="[6, 9, 12]"
            label="Show"
            prepend-inner-icon="mdi-eye-outline"
            solo
            flat
            hide-details
            background-color="transparent"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- 3️⃣ Category Section -->
    <div class="mb-8">
      <h2 class="text-h5 font-weight-bold mb-4">Explore by Category</h2>
      <v-slide-group show-arrows>
        <v-slide-item v-for="category in categories" :key="category.key" class="mr-4">
          <v-card
            @click="selectCategory(category.key)"
            :class="['category-card', { 'active-category': selectedCategory === category.key }]"
            class="rounded-xl pa-4 text-center"
            width="180"
          >
            <v-avatar size="60" :color="category.color + ' lighten-4'" class="mb-3 elevation-2">
                <v-icon :color="category.color" size="32">{{ category.icon }}</v-icon>
            </v-avatar>
            <div class="font-weight-bold">{{ category.title }}</div>
             <v-chip v-if="selectedCategory === category.key" x-small color="primary" class="mt-2">Selected</v-chip>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </div>
    
    <!-- 5️⃣ Active Filters & View All -->
     <v-row align="center" class="mb-4">
      <v-col>
        <div class="d-flex align-center flex-wrap">
          <h2 class="text-h5 font-weight-bold mr-4">Upcoming Events</h2>
          <v-chip v-if="activeFilterText" class="mr-2" close @click:close="clearFilters">
            <v-icon left small>mdi-filter-variant</v-icon>
            {{ activeFilterText }}
          </v-chip>
        </div>
      </v-col>
      <v-col class="text-right">
        <v-btn outlined rounded color="primary" @click="clearFilters">
          <v-icon left>mdi-view-list</v-icon>
          View All
        </v-btn>
      </v-col>
    </v-row>

    <!-- 4️⃣ Events Grid Section -->
    <v-row>
      <template v-if="loading">
        <v-col v-for="n in resultsPerPage" :key="n" cols="12" sm="6" md="4">
          <v-skeleton-loader type="card-avatar, article, actions"></v-skeleton-loader>
        </v-col>
      </template>
      <template v-else-if="paginatedEvents.length > 0">
        <v-col v-for="event in paginatedEvents" :key="event.id" cols="12" sm="6" md="4">
          <v-hover v-slot="{ hover }">
            <v-card :elevation="hover ? 12 : 4" class="rounded-xl hover-card d-flex flex-column" height="100%">
              <v-img :src="event.image" height="200px" class="rounded-t-xl gradient-overlay">
                <div class="d-flex justify-space-between align-start pa-3">
                  <v-chip small :color="typeColor(event.type)" text-color="white" label class="font-weight-bold">
                    <v-icon left small>{{ typeIcon(event.type) }}</v-icon>
                    {{ event.type }}
                  </v-chip>
                  <v-chip small color="rgba(0,0,0,0.5)" text-color="white" label>
                    <v-icon left small>mdi-calendar</v-icon>
                    {{ formatEventDate(event.start) }}
                  </v-chip>
                </div>
              </v-img>

              <v-card-text class="flex-grow-1">
                <h3 class="text-h6 font-weight-bold mb-2">{{ event.title }}</h3>
                <div class="d-flex align-center grey--text text--darken-1 mb-3">
                    <v-icon small class="mr-2">mdi-clock-outline</v-icon>
                    <span class="caption">{{ formatDateTimeRange(event.start, event.end) }}</span>
                </div>
                <div class="d-flex align-center grey--text text--darken-1 mb-4">
                    <v-icon small class="mr-2">mdi-map-marker-outline</v-icon>
                    <span class="caption">{{ event.location }}</span>
                </div>
                <div class="d-flex align-center mb-4">
                   <v-avatar size="24" class="mr-2 elevation-1">
                       <v-icon small>mdi-account-circle</v-icon>
                   </v-avatar>
                   <span class="caption font-weight-medium">{{ event.organizer }}</span>
                </div>
                 <div class="d-flex justify-space-between">
                    <v-chip small outlined color="green">
                        <v-icon left small>mdi-seat</v-icon>
                        {{ event.seats }} seats left
                    </v-chip>
                     <v-chip small outlined color="orange">
                        <v-icon left small>mdi-timer-sand</v-icon>
                        {{ timeToStart(event.start) }}
                    </v-chip>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-4">
                <v-btn outlined rounded color="primary" class="text-none" @click="openView(event)">
                  <v-icon left>mdi-eye-outline</v-icon>View
                </v-btn>
                <v-spacer></v-spacer>
                 <v-btn icon @click.stop="shareEvent(event)">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
                <v-btn rounded depressed class="text-none white--text" style="background: linear-gradient(135deg, #0092FF, #00D4B4);" @click="openRsvp(event)">
                  <v-icon left>mdi-calendar-check</v-icon>RSVP
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
            <div class="text-center py-16">
                <v-icon size="80" color="grey lighten-1">mdi-calendar-search</v-icon>
                <h3 class="text-h5 mt-4">No Events Found</h3>
                <p class="grey--text">Try adjusting your filters or check back later!</p>
            </div>
        </v-col>
      </template>
    </v-row>
    
    <!-- 7️⃣ Pagination Section -->
    <v-row justify="center" class="mt-8" v-if="pageCount > 1">
        <v-pagination v-model="page" :length="pageCount" total-visible="7" circle></v-pagination>
    </v-row>

    <!-- 6️⃣ Modal Enhancements -->
    <v-dialog v-model="viewDialog" max-width="800px" persistent>
        <v-card v-if="activeEvent" class="rounded-xl">
            <v-img :src="activeEvent.image" height="300px" class="gradient-overlay">
                 <v-btn icon dark @click="viewDialog = false" class="ma-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-img>
            <v-card-title class="text-h5 font-weight-bold pt-4">{{ activeEvent.title }}</v-card-title>
            <v-card-subtitle>
                <v-chip small :color="typeColor(activeEvent.type)" text-color="white" class="mr-2">{{ activeEvent.type }}</v-chip>
                Organized by {{ activeEvent.organizer }}
            </v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="8">
                        <p class="body-1">{{ activeEvent.description }}</p>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-sheet rounded="lg" class="pa-4" color="grey lighten-4">
                            <div class="font-weight-bold mb-3">Event Details</div>
                             <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-calendar</v-icon> {{ formatDateTimeRange(activeEvent.start, activeEvent.end) }}</div>
                             <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-map-marker</v-icon> {{ activeEvent.location }}</div>
                             <div class="d-flex align-center"><v-icon small class="mr-2">mdi-seat-recline</v-icon> {{ activeEvent.seats }} seats available</div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
                <v-btn text @click="shareEvent(activeEvent)"><v-icon left>mdi-share-variant</v-icon>Share</v-btn>
                <v-spacer />
                <v-btn large rounded depressed class="text-none white--text" style="background: linear-gradient(135deg, #0092FF, #00D4B4);" @click="openRsvp(activeEvent)"><v-icon left>mdi-calendar-check</v-icon> RSVP Now</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="rsvpDialog" max-width="450px" class="rounded-xl">
        <v-card v-if="activeEvent" class="text-center pa-6">
             <v-scale-transition>
                  <v-icon v-if="rsvpSuccess" size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
            </v-scale-transition>
            <h2 class="text-h5 font-weight-bold mb-2">{{ rsvpSuccess ? 'Registration Confirmed!' : 'Confirm Your Seat' }}</h2>
            <p v-if="!rsvpSuccess">You're about to register for <strong>{{ activeEvent.title }}</strong>.</p>
             <p v-else>You're in! We're excited to see you at the event.</p>
            <v-card-actions class="justify-center mt-4">
                <v-btn v-if="!rsvpSuccess" text @click="rsvpDialog = false">Cancel</v-btn>
                <v-btn v-if="!rsvpSuccess" color="primary" depressed rounded large @click="confirmRsvp">Confirm</v-btn>
                <v-btn v-else color="primary" depressed rounded large @click="rsvpDialog = false">Done</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    
    <v-snackbar v-model="snackbar.show" :timeout="4000" top right color="success" class="rounded-xl">
      <v-icon left>mdi-check-circle</v-icon> {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'AlumniEvents',
  data() {
    return {
      q: '',
      sortBy: 'Soonest',
      resultsPerPage: 6,
      page: 1,
      loading: true,
      categories: [
        { key: 'All', title: 'All Categories', icon: 'mdi-apps', color: 'blue-grey' },
        { key: 'Workshop', title: 'Workshops', icon: 'mdi-school', color: 'blue' },
        { key: 'Campaign', title: 'Campaigns', icon: 'mdi-earth', color: 'green' },
        { key: 'Networking', title: 'Networking', icon: 'mdi-handshake', color: 'purple' },
        { key: 'Competition', title: 'Competitions', icon: 'mdi-trophy', color: 'orange' }
      ],
      events: [],
      viewDialog: false,
      rsvpDialog: false,
      rsvpSuccess: false,
      activeEvent: null,
      snackbar: { show: false, message: '' },
      selectedCategory: 'All'
    }
  },
  computed: {
    activeFilterText() {
        if (this.selectedCategory !== 'All') {
            return `Category: ${this.selectedCategory}`;
        }
        return '';
    },
    sortedEvents() {
        return [...this.events].sort((a, b) => {
            if (this.sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (this.sortBy === 'Most Popular') return b.seats - a.seats; // Simple popularity metric
            return new Date(a.start) - new Date(b.start); // Soonest
        });
    },
    filteredEvents() {
      const qLower = this.q.trim().toLowerCase();
      return this.sortedEvents.filter(ev => {
        const matchesQ = !qLower ||
          ev.title.toLowerCase().includes(qLower) ||
          ev.description.toLowerCase().includes(qLower) ||
          (ev.organizer && ev.organizer.toLowerCase().includes(qLower));
        const matchesCategory = this.selectedCategory === 'All' || ev.type === this.selectedCategory;
        return matchesQ && matchesCategory;
      });
    },
    paginatedEvents() {
      const start = (this.page - 1) * this.resultsPerPage;
      const end = start + this.resultsPerPage;
      return this.filteredEvents.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.filteredEvents.length / this.resultsPerPage);
    }
  },
  methods: {
    fetchEvents() {
        this.loading = true;
        // Simulate API call
        setTimeout(() => {
            this.events = [
                { id: 1, title: 'AI Bootcamp: Learn from Industry Leaders', start: '2025-10-20T10:00:00', end: '2025-10-20T16:00:00', type: 'Workshop', location: 'Online', description: 'Hands-on workshop on building intelligent chatbots using GPT models.', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', seats: 32, organizer: 'AI Club', createdAt: '2025-10-10T10:00:00' },
                { id: 2, title: 'Campus Cleanup Campaign', start: '2025-10-25T09:00:00', end: '2025-10-25T12:00:00', type: 'Campaign', location: 'College Auditorium', description: 'Join our drive to keep campus clean and green.', image: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', seats: 100, organizer: 'Environment Society', createdAt: '2025-10-12T10:00:00' },
                { id: 3, title: 'Tech Networking Night', start: '2025-11-02T18:00:00', end: '2025-11-02T21:00:00', type: 'Networking', location: 'Auditorium B', description: 'Meet alumni and recruiters for career conversations.', image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', seats: 50, organizer: 'Placement Cell', createdAt: '2025-10-11T10:00:00' },
                { id: 4, title: 'Hack & Build Competition', start: '2025-11-15T09:00:00', end: '2025-11-16T18:00:00', type: 'Competition', location: 'Online', description: 'Showcase your skills and win exciting prizes.', image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', seats: 120, organizer: 'Tech Club', createdAt: '2025-10-09T10:00:00' },
                { id: 5, title: 'Alumni Reunion Dinner', start: '2025-12-05T19:00:00', end: '2025-12-05T22:00:00', type: 'Networking', location: 'Grand Ballroom', description: 'Reconnect with old friends and faculty.', image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', seats: 200, organizer: 'Alumni Association', createdAt: '2025-10-14T10:00:00' },
                { id: 6, title: 'Data Science Workshop', start: '2025-11-22T09:00:00', end: '2025-11-22T17:00:00', type: 'Workshop', location: 'Computer Lab 3', description: 'A deep dive into modern data science techniques.', image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', seats: 40, organizer: 'Data Science Club', createdAt: '2025-10-15T10:00:00' },
            ];
            this.loading = false;
        }, 1000);
    },
    selectCategory(key) {
      this.selectedCategory = key;
      this.page = 1;
    },
    clearFilters() {
      this.selectedCategory = 'All';
      this.q = '';
      this.page = 1;
    },
    openView(event) {
      this.activeEvent = event;
      this.viewDialog = true;
    },
    openRsvp(event) {
      this.activeEvent = event;
      this.rsvpSuccess = false;
      this.rsvpDialog = true;
    },
    confirmRsvp() {
      this.rsvpSuccess = true;
      const e = this.events.find(ev => ev.id === this.activeEvent.id);
      if (e && e.seats > 0) e.seats -= 1;
      setTimeout(() => {
          this.snackbar.message = `You have successfully registered for "${this.activeEvent.title}"!`;
          this.snackbar.show = true;
      }, 300);
    },
    shareEvent(event) {
      // Basic share functionality
      if(navigator.share) {
        navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } else {
        // Fallback for desktop
        alert('Share this event via your favorite platform!');
      }
    },
    formatEventDate(start) {
        const s = new Date(start);
        return s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    },
    formatDateTimeRange(start, end) {
      const s = new Date(start);
      const e = new Date(end);
      const optsDate = { day: 'numeric', month: 'short', year: 'numeric' };
      const optsTime = { hour: 'numeric', minute: '2-digit' };
      const date = s.toLocaleDateString(undefined, optsDate);
      const startTime = s.toLocaleTimeString(undefined, optsTime);
      const endTime = e.toLocaleTimeString(undefined, optsTime);
      return `${date} • ${startTime} - ${endTime}`;
    },
    typeColor(type) {
      switch (type) {
        case 'Workshop': return 'blue';
        case 'Campaign': return 'green';
        case 'Competition': return 'orange';
        case 'Networking': return 'purple';
        default: return 'grey';
      }
    },
     typeIcon(type) {
      switch (type) {
        case 'Workshop': return 'mdi-school';
        case 'Campaign': return 'mdi-earth';
        case 'Competition': return 'mdi-trophy';
        case 'Networking': return 'mdi-handshake';
        default: return 'mdi-calendar';
      }
    },
    timeToStart(start) {
      const now = new Date();
      const s = new Date(start);
      const diff = s - now;
      if (diff <= 0) return 'Started';
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days > 1) return `in ${days} days`;
      if (days === 1) return 'Tomorrow';
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours > 0) return `in ${hours} hr`;
      const minutes = Math.floor(diff / (1000 * 60));
      return `in ${minutes} min`;
    }
  },
  created() {
      this.fetchEvents();
  }
}
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.hover-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.1) !important;
}
.gradient-overlay .v-image__image {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%);
}
.category-card {
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
}
.category-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0,0,0,0.08) !important;
}
.active-category {
    border-color: var(--v-primary-base);
    transform: scale(1.05);
}
</style>
