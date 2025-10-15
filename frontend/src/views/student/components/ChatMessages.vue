<!-- src/components/ChatMessages.vue -->
<template>
  <v-card-text class="overflow-y-auto px-4" style="min-height: 300px" ref="messagesWrap">
    <div v-if="!selectedChat" class="text-center pa-8">
      <div class="text-h6 font-weight-medium">Start a conversation that could change your path.</div>
      <div class="caption grey--text">Select a chat from the left to begin.</div>
    </div>

    <div v-else>
      <div class="my-4 caption text-center">New Message</div>

      <div v-for="m in selectedChat.messages" :key="m.id" class="mb-3">
        <div
          :class="[
            'd-flex',
            m.role === 'alumni' ? 'justify-end' : 'justify-start'
          ]"
        >
          <v-card
            :class="['pa-3', 'ma-1']"
            :elevation="1"
            style="max-width:70%"
            :color="m.role === 'student' ? '#e4ebe0' : '#c2e2f5'"
            tile
          >
            <div class="body-2">{{ m.text }}</div>
            <div class="caption text-right grey--text mt-2">{{ m.time }}</div>
          </v-card>
        </div>
      </div>
    </div>
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ChatMessages',
  computed: {
    ...mapGetters(['selectedChat'])
  },
  watch: {
    selectedChat: {
      handler() {
        this.$nextTick(() => this.scrollToBottom())
      },
      immediate: true
    }
  },
  methods: {
    scrollToBottom() {
      const el = this.$refs.messagesWrap
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }
  }
}
</script>
