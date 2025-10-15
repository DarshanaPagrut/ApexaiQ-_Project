<template>
  <v-card class="my-4 pa-5" id="education">
    <h3 class="text-h6 font-weight-medium text-primary mb-3">Education History</h3>
    <v-timeline v-if="education && education.length" align-top dense>
      <v-timeline-item
        v-for="(edu, i) in education"
        :key="i"
        color="primary"
        small
      >
        <v-row class="pt-1">
          <v-col cols="3">
            <strong>{{ edu.year }}</strong>
          </v-col>
          <v-col>
            <strong>{{ edu.institution }}</strong>
            <div class="text-caption">
              {{ edu.degree }}
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
    <p v-else class="text-secondary">No education history added.</p>
  </v-card>
</template>

<script>
export default {
  name: 'EducationSection',
  props: ['education']
}
</script>
