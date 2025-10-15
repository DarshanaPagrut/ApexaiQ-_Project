<template>
  <v-card class="my-4 pa-5" id="achievements">
    <h3 class="text-h6 font-weight-medium text-primary mb-3">Achievements</h3>
    <v-list v-if="achievements && achievements.length" dense>
        <v-list-item v-for="(achievement, i) in achievements" :key="i">
            <v-list-item-icon>
                <v-icon color="warning">mdi-trophy-variant-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ achievement.title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
    <p v-else class="text-secondary">No achievements listed yet.</p>
  </v-card>
</template>

<script>
export default {
  name: 'AchievementsSection',
  props: ['achievements']
}
</script>
