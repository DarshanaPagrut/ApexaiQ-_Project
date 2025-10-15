<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Student Dashboard</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
          <v-icon size="48" color="primary" class="mb-4">
            mdi-view-dashboard
          </v-icon>
          <h2 class="text-h5 mb-3">Hello, this is the Student Dashboard!</h2>
          <p class="text-body-1 grey--text">
            Welcome! Connect with alumni, find mentors, and participate in 
            events to enhance your academic and professional journey.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard'
}
</script>