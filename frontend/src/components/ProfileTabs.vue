<template>
  <v-tabs background-color="#F5F1DC" grow class="mt-4" slider-color="#0046FF">
    <v-tab>About</v-tab>
    <v-tab>Education</v-tab>
    <v-tab>Skills & Interests</v-tab>
    <v-tab>Achievements</v-tab>
    <v-tab>Projects & Internships</v-tab>
    <v-tab>Co-Curricular</v-tab>

    <!-- About -->
    <v-tab-item>
      <v-card class="pa-4">
        <h3>About Me</h3>
        <p>{{ student.description }}</p>
      </v-card>
    </v-tab-item>

    <!-- Education -->
    <v-tab-item>
      <v-card class="pa-4">
        <h3>Education History</h3>
        <education-timeline :education="student.education" />
      </v-card>
    </v-tab-item>

    <!-- Skills -->
    <v-tab-item>
      <v-card class="pa-4">
        <h3>Skills & Areas of Interest</h3>
        <skill-chips :skills="student.skills" />
      </v-card>
    </v-tab-item>

    <!-- Achievements -->
    <v-tab-item>
      <v-card class="pa-4">
        <h3>Achievements</h3>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="i in 4" :key="i">
            <v-card class="pa-3 elevation-2 d-flex align-center">
              <v-icon color="#FF9013" class="mr-2">fas fa-trophy</v-icon>
              <span>Achievement {{ i }}</span>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import SkillChips from './SkillChips.vue';
import EducationTimeline from './EducationTimeline.vue';

export default {
  name: 'ProfileTabs',
  components: { SkillChips, EducationTimeline },
  props: {
    student: Object
  }
}
</script>
