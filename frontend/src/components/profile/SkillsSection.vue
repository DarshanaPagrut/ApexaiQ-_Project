<template>
  <v-card class="my-4 pa-5" id="skills">
    <h3 class="text-h6 font-weight-medium text-primary mb-3">Skills & Interests</h3>
    <v-row>
        <v-col cols="12" md="6">
            <h4 class="font-weight-medium mb-2">Skills</h4>
            <div v-if="skills && skills.length">
                <v-chip v-for="skill in skills" :key="skill" class="ma-1" color="primary" outlined>
                    <v-icon left small>mdi-star-circle-outline</v-icon>
                    {{ skill }}
                </v-chip>
            </div>
            <p v-else class="text-secondary">No skills listed.</p>
        </v-col>
        <v-col cols="12" md="6">
            <h4 class="font-weight-medium mb-2">Interests</h4>
            <div v-if="interests && interests.length">
                <v-chip v-for="interest in interests" :key="interest" class="ma-1" color="secondary" outlined>
                     <v-icon left small>mdi-heart-outline</v-icon>
                    {{ interest }}
                </v-chip>
            </div>
             <p v-else class="text-secondary">No interests listed.</p>
        </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'SkillsSection',
  props: ['skills', 'interests']
}
</script>
