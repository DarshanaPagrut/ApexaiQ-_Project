<!-- src/components/LeftSidebar.vue -->
<template>
  <v-card outlined class="pa-3">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center">
        <v-btn icon @click="toggleCollapse" class="mr-2">
          <v-icon>{{ collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left' }}</v-icon>
        </v-btn>
        <div>
          <div class="subtitle-1 font-weight-medium">Your Network</div>
          <div class="caption grey--text">Chats & Requests</div>
        </div>
      </div>
      <v-text-field
        dense
        hide-details
        solo
        flat
        placeholder="Search by name or message..."
        append-icon="fas fa-search"
        v-model="query"
      />
    </div>

    <v-tabs v-model="tab" background-color="transparent" dense>
      <v-tab value="chats"><v-icon left class="mr-1">fas fa-comments</v-icon>Chats</v-tab>
      <v-tab value="requests"><v-icon left class="mr-1">fas fa-user-friends</v-icon>Requests</v-tab>
      <v-tab value="connections"><v-icon left class="mr-1">fas fa-link</v-icon>Connections</v-tab>
    </v-tabs>

    <v-divider class="my-2" />

    <v-list dense>
      <template v-if="tab === 'chats'">
        <v-list-item
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="selectChat(chat.id)"
          class="pointer"
        >
          <v-list-item-avatar>
            <v-avatar size="40">{{ chat.avatar }}</v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">{{ chat.name }}</v-list-item-title>
            <v-list-item-subtitle class="caption text-truncate">{{ chat.lastMessage }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <div class="text-right">
              <div class="caption grey--text">{{ chat.lastSeen }}</div>
              <v-badge v-if="chat.unread" color="blue" dot />
            </div>
          </v-list-item-action>
        </v-list-item>
      </template>

      <template v-if="tab === 'requests'">
        <v-card
          v-for="c in requestChats"
          :key="c.id"
          class="mb-3 pa-3"
          outlined
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="subtitle-2 font-weight-medium">{{ c.name }} requested mentorship</div>
              <div class="caption grey--text">{{ c.messages && c.messages[0] ? c.messages[0].text : 'No message' }}</div>
            </div>
            <div class="d-flex">
              <v-btn small text @click="reject(c.id)">Reject</v-btn>
              <v-btn small class="ml-2" color="primary" @click="accept(c.id)">Accept</v-btn>
            </div>
          </div>
        </v-card>
      </template>

      <template v-if="tab === 'connections'">
        <v-list-item v-for="c in chats" :key="c.id">
          <v-list-item-avatar><v-avatar size="36">{{ c.avatar }}</v-avatar></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2">{{ c.name }}</v-list-item-title>
            <v-list-item-subtitle class="caption grey--text">{{ c.lastMessage }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LeftSidebar',
  data() {
    return {
      collapsed: false,
      query: '',
      tab: 'chats'
    }
  },
  computed: {
    ...mapState(['chats']),
    filteredChats() {
      if (!this.query) return this.chats
      return this.chats.filter(c =>
        c.name.toLowerCase().includes(this.query.toLowerCase()) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(this.query.toLowerCase()))
      )
    },
    requestChats() {
      return this.chats.filter(c => c.mentorshipRequest)
    }
  },
  methods: {
    ...mapActions(['selectChat', 'acceptMentorship']),
    toggleCollapse() {
      this.collapsed = !this.collapsed
      // optional: emit to parent to reduce width, here handled by layout breakpoints
    },
    selectChat (id) {
      this.$store.dispatch('selectChat', id)
    },
    accept(id) {
      this.$store.dispatch('acceptMentorship', id)
      this.$toast && this.$toast.success('Mentorship accepted') // optional toast lib
    },
    reject(id) {
      this.$store.commit('TOGGLE_MENTORSHIP', { chatId: id, value: false })
      this.$store.commit('ADD_NOTIFICATION', { text: 'Mentorship request rejected', time: new Date() })
    }
  }
}
</script>
