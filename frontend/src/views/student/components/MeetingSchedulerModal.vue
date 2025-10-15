<!-- src/components/MeetingSchedulerModal.vue -->
<template>
  <v-dialog v-model="show" width="600">
    <v-card>
      <v-card-title>
        <span class="headline">Schedule a One-to-One Mentorship Session</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu ref="dateMenu" v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="date" label="Date" readonly v-on="on" />
                </template>
                <v-date-picker v-model="date" @input="dateMenu = false" no-title />
              </v-menu>
            </v-col>

            <v-col cols="12" sm="6">
              <v-menu ref="timeMenu" v-model="timeMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="time" label="Time" readonly v-on="on" />
                </template>
                <v-time-picker v-model="time" @input="timeMenu = false" full-width />
              </v-menu>
            </v-col>
          </v-row>

          <v-select v-model="duration" :items="durations" label="Duration" dense />
          <v-text-field v-model="topic" label="Topic / Agenda" dense />
          <v-textarea v-model="notes" rows="3" label="Notes" dense />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="generateLink">Generate Google Meet Link</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MeetingSchedulerModal',
  props: ['chat'],
  data() {
    return {
      show: false,
      valid: false,
      dateMenu: false,
      timeMenu: false,
      date: null,
      time: null,
      duration: '30 mins',
      durations: ['15 mins', '30 mins', '45 mins', '60 mins'],
      topic: '',
      notes: ''
    }
  },
  methods: {
    open() {
      this.show = true
    },
    close() {
      this.show = false
    },
    generateLink() {
      // basic client-side generation for demo
      const link = `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}`
      // store meeting in chat thread
      if (this.chat) {
        this.$store.commit('SEND_MESSAGE', {
          chatId: this.chat.id,
          message: {
            id: `${Date.now()}`,
            from: 'System',
            role: 'system',
            text: `Meeting scheduled on ${this.date} ${this.time} (${this.duration}). Link: ${link}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true
          }
        })
      }
      this.$store.commit('ADD_NOTIFICATION', { text: `Your meeting link has been generated`, time: new Date() })
      this.show = false
      // optionally auto-add to calendar: integrate with user's calendar APIs
    }
  }
}
</script>
