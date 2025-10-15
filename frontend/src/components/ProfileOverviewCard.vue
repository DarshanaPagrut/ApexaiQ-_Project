<template>
  <v-card class="pa-4 rounded-xl elevation-6" color="#0046FF" dark>
    <v-row align="center">
      <v-col cols="12" md="3" class="text-center">
        <v-avatar size="120" class="elevation-2">
          <img :src="student.profilePicture || 'student_profile.jpg'" alt="Profile Picture" />
        </v-avatar>
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="white--text mb-1">{{ student.name }}</h2>
        <div class="subtitle-1 white--text">{{ student.branch }} | Year {{ student.yearOfStudy }}</div>
        <div class="subtitle-2 white--text">{{ student.email }}</div>
        <v-btn outlined color="#73C8D2" class="ma-2" small @click="$emit('fetch-linkedin')">
          <v-icon left>fab fa-linkedin</v-icon>
          Fetch from LinkedIn
        </v-btn>
        <v-btn outlined color="#FF9013" class="ma-2" small @click="$emit('edit-profile')">
          <v-icon left>fas fa-edit</v-icon>
          Edit Profile
        </v-btn>
      </v-col>

      <v-col cols="12" md="3" class="text-center">
        <v-progress-circular
          :value="profileCompletion"
          size="80"
          width="8"
          color="#FF9013"
        >
          {{ profileCompletion }}%
        </v-progress-circular>
        <div class="mt-2 white--text">Profile Completed</div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'ProfileOverviewCard',
  props: {
    student: Object,
    profileCompletion: Number
  }
}
</script>
