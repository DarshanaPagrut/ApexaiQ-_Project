<template>
  <v-card class="my-4 pa-5" id="cocurricular">
    <h3 class="text-h6 font-weight-medium text-primary mb-3">Co-curricular Activities</h3>
     <v-list v-if="activities && activities.length" dense>
        <v-list-item v-for="(activity, i) in activities" :key="i">
            <v-list-item-icon>
                <v-icon>mdi-star-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ activity.name }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
    <p v-else class="text-secondary">No co-curricular activities listed.</p>
  </v-card>
</template>

<script>
export default {
  name: 'CocurricularSection',
  props: ['activities']
}
</script>
