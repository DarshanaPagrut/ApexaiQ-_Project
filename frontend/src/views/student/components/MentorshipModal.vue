<!-- src/components/MentorshipModal.vue -->
<template>
  <div>
    <v-dialog v-model="openDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Mentorship Request</v-card-title>
        <v-card-text>
          <div v-if="chat">
            <div class="subtitle-1">{{ chat.name }} wants to connect</div>
            <div class="caption grey--text mb-3">{{ chat.messages && chat.messages[0] ? chat.messages[0].text : '' }}</div>

            <v-textarea v-model="note" label="Optional message to mentee" rows="3" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="openDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="accept">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'MentorshipModal',
  props: {
    chat: Object
  },
  data() {
    return {
      openDialog: false,
      note: ''
    }
  },
  methods: {
    open() {
      this.openDialog = true
    },
    accept() {
      if (!this.chat) return
      this.$store.dispatch('acceptMentorship', this.chat.id)
      this.openDialog = false
    }
  }
}
</script>
