<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>Hello</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
          <template>
            <v-container fluid>
              <!-- Welcome Header -->
              <v-row>
                <v-col cols="12">
                  <h1 class="text-h4 font-weight-bold">Wel, {{ $store.state.user.name || 'Student' }}!</h1>
                  <p class="grey--text text--darken-1 text-body-1">Here's a snapshot of your AlumniLink activity and opportunities.</p>
                </v-col>
              </v-row>

              <!-- Quick Stats Cards -->
              <v-row>
                <v-col v-for="(stat, i) in stats" :key="i" cols="12" sm="6" md="3">
                  <v-card class="pa-4 rounded-lg elevation-2 d-flex align-center fill-height">
                    <v-avatar :color="stat.color + ' lighten-4'" size="60" class="mr-4">
                      <v-icon :color="stat.color" size="32">{{ stat.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <p class="text-h5 font-weight-bold mb-0">{{ stat.value }}</p>
                      <p class="text-body-2 grey--text text--darken-1 mb-0">{{ stat.title }}</p>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <!-- Main Column -->
                <v-col cols="12" lg="8">

                  <!-- Profile Completion Card -->
                  <v-card class="pa-4 rounded-lg elevation-2 mb-6">
                    <div class="d-flex flex-column flex-sm-row align-center">
                      <v-progress-circular :value="profileCompletion" size="100" width="8" color="primary" class="ma-4">
                        <span class="text-h6 font-weight-bold">{{ profileCompletion }}%</span>
                      </v-progress-circular>
                      <div class="text-center text-sm-left">
                        <v-card-title class="pa-0 font-weight-bold">Complete Your Profile</v-card-title>
                        <v-card-subtitle class="pa-0 pt-1">A complete profile attracts more mentors and opportunities.</v-card-subtitle>
                        <v-card-actions>
                          <v-btn color="primary" class="text-none" @click="$router.push('/student/profile')">
                            <v-icon left>mdi-arrow-right</v-icon>
                            Go to Profile
                          </v-btn>
                        </v-card-actions>
                      </div>
                    </div>
                  </v-card>

                  <!-- Upcoming Meetings Section -->
                  <v-card class="pa-4 rounded-lg elevation-2 mb-6">
                    <v-card-title class="font-weight-bold d-flex align-center">
                      <v-icon color="primary" class="mr-3">mdi-calendar-clock</v-icon>
                      Upcoming Meetings
                    </v-card-title>
                     <v-divider class="mb-2"></v-divider>
                    <v-list two-line v-if="upcomingMeetings.length">
                      <template v-for="(meeting, index) in upcomingMeetings">
                        <v-list-item :key="meeting.id">
                          <v-list-item-avatar color="primary lighten-4">
                            <v-icon color="primary">mdi-account-tie</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">{{ meeting.topic }}</v-list-item-title>
                            <v-list-item-subtitle>With <span class="font-weight-medium">{{ meeting.mentorName }}</span> on {{ meeting.date }} at {{ meeting.time }}</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn :href="meeting.meetLink" target="_blank" color="success" depressed class="text-none">
                              <v-icon left>mdi-video</v-icon>
                              Join Meet
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                        <v-divider v-if="index < upcomingMeetings.length - 1" :key="'divider-' + meeting.id"></v-divider>
                      </template>
                    </v-list>
                     <div v-else class="text-center pa-8 grey--text">
                        <v-icon large color="grey lighten-1" class="mb-3">mdi-calendar-remove</v-icon>
                        <p>No scheduled meetings.</p>
                    </div>
                  </v-card>

                  <!-- Upcoming Events -->
                  <v-card class="pa-4 rounded-lg elevation-2">
                    <v-card-title class="font-weight-bold">Upcoming Events & Workshops</v-card-title>
                    <v-list two-line>
                      <v-list-item v-for="event in upcomingEvents" :key="event.id" @click="viewEvent(event)" class="rounded-lg">
                        <v-list-item-avatar color="primary lighten-5" class="rounded-lg mr-4">
                          <div class="text-center">
                            <div class="primary--text font-weight-bold text-caption">{{ formatMonth(event.date) }}</div>
                            <div class="primary--text text-h6 font-weight-bold">{{ formatDay(event.date) }}</div>
                          </div>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{ event.title }}</v-list-item-title>
                          <v-list-item-subtitle>{{ event.location }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn small outlined color="primary" class="text-none">View</v-btn>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item v-if="!upcomingEvents.length">
                        <v-list-item-content>
                          <v-list-item-subtitle class="text-center">No upcoming events. Check back soon!</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" to="/student/events" class="text-none">View All Events</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <!-- Side Column -->
                <v-col cols="12" lg="4">
                  <!-- Recommended Mentors -->
                  <v-card class="pa-4 rounded-lg elevation-2 fill-height">
                    <v-card-title class="font-weight-bold">Recommended Mentors</v-card-title>
                    <v-list two-line>
                      <v-list-item v-for="mentor in recommendedMentors" :key="mentor.id" @click="viewProfile(mentor)" class="rounded-lg">
                        <v-list-item-avatar>
                          <v-avatar color="secondary lighten-4">
                            <span class="secondary--text text--darken-2 font-weight-bold">{{ mentor.name.charAt(0) }}</span>
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-medium">{{ mentor.name }}</v-list-item-title>
                          <v-list-item-subtitle>{{ mentor.role }} @ {{ mentor.company }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon small><v-icon>mdi-chevron-right</v-icon></v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                    <v-card-actions class="mt-auto">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" to="/student/directory" class="text-none">Find More Mentors</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard',
  data() {
    return {
      profileCompletion: 75,
      stats: [
        { title: 'Connections', value: '12', icon: 'mdi-account-multiple-outline', color: 'primary' },
        { title: 'Upcoming Events', value: '3', icon: 'mdi-calendar-star', color: 'success' },
        { title: 'Active Mentorships', value: '1', icon: 'mdi-account-supervisor-outline', color: 'info' },
        { title: 'Unread Messages', value: '5', icon: 'mdi-message-text-outline', color: 'warning' }
      ],
      upcomingEvents: [
        { id: 1, title: 'AI Bootcamp: Learn from Industry Leaders', date: '2025-10-20T10:00:00', location: 'Online' },
        { id: 2, title: 'Campus Cleanup Campaign', date: '2025-10-25T09:00:00', location: 'College Auditorium' },
        { id: 3, title: 'Tech Networking Night', date: '2025-11-02T18:00:00', location: 'Auditorium B' }
      ],
      recommendedMentors: [
        { id: 1, name: 'Priya Desai', role: 'Sr. Software Engineer', company: 'Google' },
        { id: 2, name: 'Dr. Rajesh Mehta', role: 'Data Scientist', company: 'Microsoft' },
        { id: 3, name: 'Ananya Sharma', role: 'Product Manager', company: 'Amazon' }
      ],
      upcomingMeetings: [
        {
          id: 1,
          mentorName: 'Priya Desai',
          date: 'October 17, 2025',
          time: '4:00 PM',
          topic: 'Resume Review and Career Q&A',
          meetLink: 'https://meet.google.com/xyz-abc-pqr'
        },
        {
          id: 2,
          mentorName: 'Dr. Rajesh Mehta',
          date: 'October 22, 2025',
          time: '11:00 AM',
          topic: 'Project Discussion: AI Chatbot',
          meetLink: 'https://meet.google.com/def-ghi-jkl'
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatMonth(dateString) {
      const options = { month: 'short' };
      return new Date(dateString).toLocaleDateString(undefined, options).toUpperCase();
    },
    formatDay(dateString) {
      const options = { day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    viewEvent(event) {
      this.$router.push('/student/events');
      console.log('Viewing event:', event);
    },
    viewProfile(mentor) {
      this.$router.push(`/student/profile/${mentor.id}`);
      console.log('Viewing profile:', mentor);
    }
  }
}
</script>

