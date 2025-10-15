<!-- src/components/ChatHeader.vue -->
<template>
  <v-toolbar flat dense class="px-4">
    <v-avatar size="40" class="mr-3">{{ selectedChat?.avatar || 'U' }}</v-avatar>

    <div class="d-flex flex-column">
      <div class="subtitle-1 font-weight-medium">{{ selectedChat?.name || 'Select a chat' }}</div>
      <div class="caption grey--text">
        <span v-if="onlineStatus === 'online'">🟢 Online</span>
        <span v-else>🕓 Last seen: {{ selectedChat?.lastSeen || '—' }}</span>
      </div>
    </div>

    <v-spacer />

    <v-btn icon title="Schedule Meeting" @click="$emit('open-scheduler')">
      <v-icon>fas fa-calendar-plus</v-icon>
    </v-btn>

    <v-btn icon @click="$emit('view-profile')" title="View Profile">
      <v-icon>fas fa-user</v-icon>
    </v-btn>

    <v-btn icon @click="$emit('shared-files')" title="Shared Files">
      <v-icon>fas fa-paperclip</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ChatHeader',
  computed: {
    ...mapGetters(['selectedChat']),
    onlineStatus() {
      // placeholder; could be dynamic from presence system
      return Math.random() > 0.5 ? 'online' : 'offline'
    }
  }
}
</script>
