<template>
  <v-card class="my-4 pa-5" id="projects">
    <h3 class="text-h6 font-weight-medium text-primary mb-3">Projects & Internships</h3>
    <h4 class="font-weight-medium mb-2">Projects</h4>
    <div v-if="projects && projects.length">
      <div v-for="(project, i) in projects" :key="`proj-${i}`" class="mb-2">
        <p class="font-weight-bold mb-0">{{project.title}}</p>
      </div>
    </div>
    <p v-else class="text-secondary">No projects added.</p>
    
    <v-divider class="my-4"></v-divider>
    
    <h4 class="font-weight-medium mb-2">Internships</h4>
     <div v-if="internships && internships.length">
      <div v-for="(internship, i) in internships" :key="`intern-${i}`" class="mb-2">
        <p class="font-weight-bold mb-0">{{internship.company}}</p>
      </div>
    </div>
    <p v-else class="text-secondary">No internships added.</p>
  </v-card>
</template>

<script>
export default {
  name: 'ProjectsSection',
  props: ['projects', 'internships']
}
</script>
