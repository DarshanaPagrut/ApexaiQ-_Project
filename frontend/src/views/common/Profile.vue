<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Groups Chats</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
          <profile-overview-card
      :student="student"
      :profile-completion="profileCompletion"
      @fetch-linkedin="fetchLinkedIn"
      @edit-profile="editProfile"
    />

    <!-- Info Tabs -->
    <profile-tabs :student="student" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProfileOverviewCard from '@/components/ProfileOverviewCard.vue';
import ProfileTabs from '@/components/ProfileTabs.vue';
export default {
  name: 'ProfilePage',
  components: {
    ProfileOverviewCard,
    ProfileTabs
  },
  data() {
    return {
      student: {
        name: 'Darshana Pagrut',
        branch: 'Information Technology',
        yearOfStudy: 3,
        email: 'darshana.ssgm@example.com',
        linkedin: '',
        description: 'Aspiring software engineer with interests in MERN stack and AI.',
        skills: ['JavaScript', 'Vue.js', 'Python', 'Machine Learning'],
        education: [
          { institution: 'SSGM College', degree: 'B.Tech IT', year: '2022-2026' },
          { institution: 'XYZ High School', degree: 'High School', year: '2020-2022' }
        ]
      },
      profileCompletion: 80
    }
  },
  methods: {
    fetchLinkedIn() {
      // Call Vuex action or API to fetch LinkedIn data
      console.log('Fetching LinkedIn data...');
    },
    editProfile() {
      this.$router.push({ name: 'EditProfile' });
    }
  }
}
</script>