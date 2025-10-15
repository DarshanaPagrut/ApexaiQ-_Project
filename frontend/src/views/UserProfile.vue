<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>
        {{ user.name }} ({{ user.role }})
      </v-card-title>

      <v-card-text>
        <div v-if="user.role === 'alumni'">
          <p>Company: {{ user.company }}</p>
          <p>Industry: {{ user.industry }}</p>
          <p>Skills: {{ user.skills.join(', ') }}</p>
          <p>Location: {{ user.location }}</p>
          <p>Career Path: {{ user.career_path }}</p>
        </div>

        <div v-else-if="user.role === 'student'">
          <p>Year of Study: {{ user.year_of_study }}</p>
          <p>Branch: {{ user.branch }}</p>
          <p>Skills: {{ user.skills.join(', ') }}</p>
          <p>Location: {{ user.location }}</p>
          <p>Career Path: {{ user.career_path }}</p>
        </div>

        <div v-else-if="user.role === 'admin'">
          <p>Admin Code: {{ user.admin_code }}</p>
        </div>
      </v-card-text>
    </v-card>

    <v-alert v-else type="info">
      Loading user profile...
    </v-alert>
  </v-container>
</template>

<script>
// import api from '@/services/api'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null
    }
  },
//   async created() {
//     const userId = this.$route.params.userId
//     try {
//       const response = await api.getProfile(userId)
//       this.user = response.data
//     } catch (err) {
//       console.error(err)
//     }
//   }
}
</script>
