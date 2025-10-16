<template>
  <v-container fluid>
    <!-- 1️⃣ Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Welcome back, Smita 👋</h1>
        <p class="text-subtitle-1 grey--text text--darken-1">Here’s what’s happening in your Alumni Network today.</p>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn to="/alumni/connections" block large class="text-none white--text" style="background: linear-gradient(135deg, #0092FF, #00D4B4);">
          <v-icon left>mdi-account-multiple-plus</v-icon>
          Connect Alumni
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn to="/alumni/events" block large class="text-none white--text" style="background: linear-gradient(135deg, #00D4B4, #00FFAA);">
          <v-icon left>mdi-calendar-star</v-icon>
          Upcoming Events
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn to="/alumni/donations" block large class="text-none" color="primary" outlined>
          <v-icon left>mdi-gift</v-icon>
          View Donations
        </v-btn>
      </v-col>
    </v-row>

    <!-- 2️⃣ Overview Cards Section -->
    <v-row>
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="4" lg="2">
        <v-card class="text-center pa-4 rounded-lg fill-height elevation-2">
          <v-avatar size="60" :color="stat.color + ' lighten-4'" class="mb-3">
            <v-icon :color="stat.color" size="30">{{ stat.icon }}</v-icon>
          </v-avatar>
          <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
          <div class="text-caption grey--text">{{ stat.title }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-8"></v-divider>

    <v-row>
      <!-- Left Column -->
      <v-col cols="12" lg="8">
        <!-- 3️⃣ Upcoming Events Section -->
        <v-card class="mb-8 rounded-lg" outlined>
          <v-card-title class="font-weight-bold">Upcoming Events & Activities</v-card-title>
          <v-slide-group class="pa-4" show-arrows>
            <v-slide-item v-for="event in upcomingEvents" :key="event.id" class="mr-4">
              <v-card width="300">
                <v-img :src="event.image" height="150"></v-img>
                <v-card-title class="text-subtitle-2">{{ event.title }}</v-card-title>
                <v-card-subtitle>{{ event.date }}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="primary" text to="/alumni/events">RSVP</v-btn>
                </v-card-actions>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-card>

        <!-- 4️⃣ Community Highlights -->
        <v-card class="rounded-lg" outlined>
          <v-card-title class="font-weight-bold">Community Highlights</v-card-title>
          <v-list two-line>
            <v-list-item v-for="item in communityHighlights" :key="item.title">
              <v-list-item-avatar>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" lg="4">
        <!-- 5️⃣ Donation Summary Widget -->
        <v-card class="mb-8 pa-4 rounded-lg text-center" color="primary" dark>
           <v-card-title class="justify-center font-weight-bold">Your Contribution Impact 💙</v-card-title>
          <v-progress-linear :value="75" height="10" rounded class="my-4"></v-progress-linear>
          <p>₹10,000 contributed to Alumni Scholarship Fund</p>
          <p class="mt-n2">Impact: Supported 3 students</p>
          <v-btn small outlined color="white" to="/alumni/donations">View Receipts</v-btn>
        </v-card>

        <!-- 7️⃣ Upcoming Feature Teaser -->
        <v-card class="rounded-lg" style="background: linear-gradient(135deg, #00D4B4, #00FFAA);">
          <v-card-title class="white--text font-weight-bold">📸 Memories are Coming Soon!</v-card-title>
          <v-card-text class="white--text">
            Soon you’ll be able to relive college memories, photos, and moments shared by your peers.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small outlined color="white">Notify Me</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

     <!-- 6️⃣ Connection Suggestions -->
    <v-row class="mt-8">
        <v-col cols="12">
            <h2 class="text-h5 font-weight-bold mb-4">People You May Know</h2>
            <v-slide-group show-arrows>
                 <v-slide-item v-for="person in connectionSuggestions" :key="person.name" class="mr-4">
                     <v-card class="text-center pa-4" width="200">
                         <v-avatar size="80" class="mb-3">
                             <img :src="person.avatar" :alt="person.name">
                         </v-avatar>
                         <div class="font-weight-bold">{{ person.name }}</div>
                         <div class="text-caption grey--text">{{ person.batch }} | {{ person.branch }}</div>
                         <v-btn small color="primary" class="mt-3 text-none">Connect</v-btn>
                     </v-card>
                 </v-slide-item>
            </v-slide-group>
        </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: 'AlumniDashboard',
  data() {
    return {
      stats: [
        { title: 'Connections', value: '48', icon: 'mdi-account-multiple', color: 'primary' },
        { title: 'Events Joined', value: '3', icon: 'mdi-calendar-check', color: 'success' },
        { title: 'Donations', value: '₹10,000', icon: 'mdi-gift', color: 'accent' },
        { title: 'Messages', value: '12', icon: 'mdi-message-text', color: 'warning' },
        { title: 'Mentorships', value: '2', icon: 'mdi-account-school', color: 'info' },
        { title: 'Memories', value: 'Soon', icon: 'mdi-camera', color: 'grey' }
      ],
      upcomingEvents: [
        { id: 1, title: 'Annual Alumni Meet 2025', date: 'Dec 20, 2025', image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { id: 2, title: 'Workshop on AI/ML', date: 'Nov 15, 2025', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { id: 3, title: 'Charity Drive for Education', date: 'Nov 01, 2025', image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { id: 4, title: 'Guest Lecture on Entrepreneurship', date: 'Oct 25, 2025', image: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      communityHighlights: [
        { title: 'New Campus Library Inaugurated', subtitle: 'A new state-of-the-art library is now open for all students.', icon: 'mdi-library' },
        { title: 'Alumnus Rohan Shah wins "Innovator of the Year"', subtitle: 'Rohan (Batch of 2015) was awarded for his work in sustainable tech.', icon: 'mdi-trophy-award' },
        { title: 'Call for Mentors: Batch 2026', subtitle: 'We are looking for alumni to mentor the upcoming batch of students.', icon: 'mdi-account-voice' }
      ],
      connectionSuggestions: [
          { name: 'Sameer Joshi', batch: '2018', branch: 'Computer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
          { name: 'Priya Mehta', batch: '2018', branch: 'Computer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
          { name: 'Amit Desai', batch: '2019', branch: 'IT', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
          { name: 'Sneha Rao', batch: '2017', branch: 'ENTC', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
          { name: 'Vikram Singh', batch: '2018', branch: 'Mechanical', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' }
      ]
    }
  }
}
</script>
