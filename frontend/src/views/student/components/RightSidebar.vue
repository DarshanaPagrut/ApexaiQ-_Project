<!-- src/components/RightSidebar.vue -->
<template>
  <v-card outlined class="pa-3">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <div class="subtitle-1 font-weight-medium">{{ selectedChat?.name || 'Profile' }}</div>
        <div class="caption grey--text">{{ selectedChat ? (selectedChat.role || 'Alumni / Student') : '' }}</div>
      </div>
      <v-avatar size="48">{{ selectedChat?.avatar || 'U' }}</v-avatar>
    </div>

    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="caption grey--text">Branch</v-list-item-title>
          <v-list-item-subtitle>{{ selectedChatBranch }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="caption grey--text">Year</v-list-item-title>
          <v-list-item-subtitle>{{ selectedChatYear }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="caption grey--text">Company</v-list-item-title>
          <v-list-item-subtitle>{{ selectedChatCompany }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="caption grey--text">Skills</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip small class="ma-1" v-for="(s,i) in selectedChatSkills" :key="i">{{ s }}</v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="my-3" />

    <v-btn block outlined @click="openScheduler">🗓 Request a Meeting</v-btn>
    <v-btn block class="mt-2" color="primary" @click="generateLink">🔗 Generate Meeting Link</v-btn>
    <v-btn block class="mt-2" text @click="openResources">🗂 Shared Resources</v-btn>

    <mentorship-modal :chat="selectedChat" />
    <meeting-scheduler-modal ref="scheduler" :chat="selectedChat" />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import MentorshipModal from './MentorshipModal.vue'
import MeetingSchedulerModal from './MeetingSchedulerModal.vue'

export default {
  name: 'RightSidebar',
  components: { MentorshipModal, MeetingSchedulerModal },
  computed: {
    ...mapGetters(['selectedChat']),
    selectedChatBranch() { return (this.selectedChat && this.selectedChat.branch) || '—' },
    selectedChatYear() { return (this.selectedChat && this.selectedChat.year) || '—' },
    selectedChatCompany() { return (this.selectedChat && this.selectedChat.company) || '—' },
    selectedChatSkills() { return (this.selectedChat && this.selectedChat.skills) || ['AI', 'Career Guidance'] }
  },
  methods: {
    openScheduler() {
      this.$refs.scheduler && this.$refs.scheduler.open()
    },
    generateLink() {
      // simple generation logic; replace with backend integration
      const link = `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}`
      this.$store.commit('ADD_NOTIFICATION', { text: `Meeting link generated: ${link}`, time: new Date() })
      this.$toast && this.$toast.success('Meeting link generated')
      // optionally add message to chat
      if (this.selectedChat) {
        this.$store.commit('SEND_MESSAGE', {
          chatId: this.selectedChat.id,
          message: { id: `${Date.now()}`, from: 'System', role: 'system', text: `Meeting link: ${link}`, time: new Date().toLocaleTimeString(), read: true }
        })
      }
    },
    openResources() {
      // open resources drawer or new page
      this.$router.push({ name: 'Resources', params: { chatId: this.selectedChat && this.selectedChat.id } }).catch(()=>{})
    }
  }
}
</script>
