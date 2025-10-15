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
            <div class="headline">Events</div>
            <div class="caption">Explore upcoming events and register.</div>
            </div>
            </v-row>


            <event-list role="alumni"></event-list>
            </v-container>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EventList from '@/components/EventList.vue'
export default { name: 'AlumniEvents', components: { EventList }, created(){ this.$store.dispatch('events/fetchAll') } }
</script>