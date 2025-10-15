<template>
  <v-timeline dense>
    <v-timeline-item
      v-for="(edu, index) in education"
      :key="index"
      color="#0046FF"
    >
      <strong>{{ edu.institution }}</strong> - {{ edu.degree }}
      <div>{{ edu.year }}</div>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  name: 'EducationTimeline',
  props: {
    education: Array
  }
}
</script>
