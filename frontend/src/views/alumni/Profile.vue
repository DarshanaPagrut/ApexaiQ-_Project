<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">Alumni Profile</v-card-title>
      <v-card-text v-if="user">
        <v-row>
          <v-col cols="12" md="4">
            <v-avatar size="150" class="elevation-4">
              <img :src="user.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" :alt="user.name">
            </v-avatar>
          </v-col>
          <v-col cols="12" md="8">
            <h2 class="text-h4 font-weight-bold">{{ user.name }}</h2>
            <p class="text-h6 font-weight-light">{{ user.current_role }} at {{ user.current_company }}</p>
            <p class="subtitle-1">{{ user.location }}</p>
            <v-chip color="primary" class="mr-2">{{ user.branch }}</v-chip>
            <v-chip color="secondary">Batch of {{ user.graduation_year }}</v-chip>
          </v-col>
        </v-row>
        <v-divider class="my-6"></v-divider>
        <h3 class="text-h5 font-weight-bold mb-4">Career Path</h3>
        <p>{{ user.career_path }}</p>
        <h3 class="text-h5 font-weight-bold mb-4">Areas of Expertise</h3>
        <div>
          <v-chip v-for="skill in user.skills" :key="skill" class="ma-2">
            {{ skill }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-text v-else>
        <p>Loading alumni profile...</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AlumniProfile',
  data() {
    return {
      user: null
    };
  },
  created() {
    // In a real application, you would fetch this data from an API
    this.user = {
      id: this.$route.params.userId || '1',
      name: 'John Doe',
      current_role: 'Senior Software Engineer',
      current_company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      branch: 'Computer Engineering',
      graduation_year: '2015',
      career_path: 'Started as a junior developer and progressed to a senior role, specializing in full-stack development with a focus on cloud technologies.',
      skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'System Design'],
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
    };
  }
};
</script>
