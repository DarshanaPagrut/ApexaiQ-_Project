<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Events & RSVP</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
          <template>
            <v-container fluid>
            <v-row class="d-flex align-center justify-space-between pa-3">
            <div>
            <v-container class="text-center py-0">
  <div class="text-h4 font-weight-bold mb-2 primary--text">
    Connect. Collaborate. Grow.
  </div>
  <div class="subtitle-1 font-weight-medium grey--text text--darken-1">
    Explore alumni and students who share your journey.
    Filter by expertise, interests, or career path.
  </div>
</v-container>

            </div>
            </v-row>
            </v-container>
            <v-container fluid class="pa-6">
              

              <!-- Tabs -->
              <v-tabs
                v-model="tab"
                centered
                background-color="primary"
                dark
                class="rounded-lg"
              >
                <v-tab>
                  <v-icon left>mdi-briefcase</v-icon>
                  Alumni Directory
                </v-tab>

                <v-tab>
                  <v-icon left>mdi-school</v-icon>
                  Student Directory
                </v-tab>
              </v-tabs>

              <!-- Tabs Content -->
              <v-tabs-items v-model="tab" class="mt-6">
                <v-tab-item>
                  <alumni-section />
                </v-tab-item>

                <v-tab-item>
                  <student-section />
                </v-tab-item>
              </v-tabs-items>
            </v-container>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AlumniSection from '@/components/AlumniSection.vue'
import StudentSection from '@/components/StudentSection.vue'
export default {
  name: "StudentDirectory",
  components: { 
     AlumniSection,
    StudentSection 
  },
  data() {
    return {
      tab: 0
    }
  }
};
</script>
