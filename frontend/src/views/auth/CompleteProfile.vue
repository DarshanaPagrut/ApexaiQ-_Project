<template>
  <v-container class="fill-height justify-center align-center">
    <v-card class="pa-8 rounded-lg" width="800">
      <h1 class="text-h4 font-weight-bold text-center primary--text mb-2">Complete Your Profile</h1>
      <p class="text-center text-secondary mb-6">Let's build a profile that stands out. This helps alumni connect with you!</p>
      
      <v-stepper v-model="step" vertical class="elevation-0">
        <v-stepper-step :complete="step > 1" step="1">
          Professional Summary
          <small>A brief introduction about yourself</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-textarea v-model="profile.description" label="About Me" outlined rows="3"></v-textarea>
          <v-btn color="primary" @click="nextStep">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">
          Education History
          <small>Your academic background</small>
        </v-stepper-step>
        <v-stepper-content step="2">
           <div v-for="(edu, i) in profile.educationHistory" :key="i" class="d-flex align-center mb-2">
            <v-text-field v-model="edu.institution" label="Institution" outlined dense class="mr-2"></v-text-field>
            <v-text-field v-model="edu.degree" label="Degree/Course" outlined dense class="mr-2"></v-text-field>
            <v-text-field v-model="edu.year" label="Year" outlined dense class="mr-2"></v-text-field>
            <v-btn icon @click="profile.educationHistory.splice(i, 1)"><v-icon color="error">mdi-delete</v-icon></v-btn>
          </div>
          <v-btn text @click="profile.educationHistory.push({})"><v-icon left>mdi-plus</v-icon>Add Education</v-btn>
          <v-divider class="my-4"></v-divider>
          <v-btn text @click="step--">Back</v-btn>
          <v-btn color="primary" @click="nextStep">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="step > 3" step="3">
          Skills & Interests
          <small>What you're good at and what you love</small>
        </v-stepper-step>
        <v-stepper-content step="3">
          <v-combobox v-model="profile.skills" label="Skills (e.g., Python, Vue.js)" multiple chips deletable-chips outlined></v-combobox>
          <v-combobox v-model="profile.interests" label="Interests (e.g., AI, Open Source)" multiple chips deletable-chips outlined></v-combobox>
          <v-divider class="my-4"></v-divider>
          <v-btn text @click="step--">Back</v-btn>
          <v-btn color="primary" @click="nextStep">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="step > 4" step="4">
          Projects & Internships
        </v-stepper-step>
        <v-stepper-content step="4">
          <h3 class="mb-2">Projects</h3>
          <div v-for="(proj, i) in profile.projects" :key="`p-${i}`" class="mb-2">
             <v-text-field v-model="proj.title" label="Project Title" outlined dense></v-text-field>
          </div>
          <v-btn text @click="profile.projects.push({})"><v-icon left>mdi-plus</v-icon>Add Project</v-btn>
          <h3 class="mt-4 mb-2">Internships</h3>
           <div v-for="(intern, i) in profile.internships" :key="`i-${i}`" class="mb-2">
             <v-text-field v-model="intern.company" label="Company" outlined dense></v-text-field>
          </div>
          <v-btn text @click="profile.internships.push({})"><v-icon left>mdi-plus</v-icon>Add Internship</v-btn>
          <v-divider class="my-4"></v-divider>
          <v-btn text @click="step--">Back</v-btn>
          <v-btn color="primary" @click="nextStep">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-step step="5">Finish</v-stepper-step>
        <v-stepper-content step="5">
            <p>You're all set! Click finish to go to your dashboard.</p>
            <v-btn text @click="step--">Back</v-btn>
            <v-btn color="primary" @click="finishProfile">Finish</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CompleteProfile',
  data() {
    return {
      step: 1,
      profile: {
        description: '',
        educationHistory: [{}],
        skills: [],
        interests: [],
        achievements: [{}],
        projects: [{}],
        internships: [{}],
        cocurricular: [{}]
      }
    };
  },
  computed: {
      ...mapState('profile', ['isComplete']),
      ...mapState(['user']),
  },
  methods: {
    ...mapActions('profile', ['saveProfile', 'updateAndSaveSection']),
    nextStep() {
        this.updateAndSaveSection({section: Object.keys(this.profile)[this.step - 1], data: this.profile[Object.keys(this.profile)[this.step - 1]]})
        this.step++;
    },
    finishProfile() {
      this.$store.commit('profile/CALCULATE_COMPLETION'); // Final calculation
      this.saveProfile().then(() => {
          this.$router.push(`/${this.user.role}/dashboard`);
      });
    },
  },
};
</script>
