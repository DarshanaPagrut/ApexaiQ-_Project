<!-- src/components/MessageInput.vue -->
<template>
  <v-card-actions class="pa-3">
    <v-btn icon @click="triggerFile">
      <v-icon>fas fa-paperclip</v-icon>
    </v-btn>

    <input type="file" ref="file" style="display:none" @change="onFile" />

    <v-text-field
      v-model="message"
      dense
      clearable
      placeholder="Type your message..."
      outlined
      class="flex-grow-1"
      @keyup.enter.native="send"
    >
      <template v-slot:append-outer>
        <v-btn icon @click="openEmoji">
          <v-icon>fas fa-smile</v-icon>
        </v-btn>
        <v-btn color="primary" @click="send">
          <v-icon left>fas fa-paper-plane</v-icon>
          Send
        </v-btn>
      </template>
    </v-text-field>
  </v-card-actions>
</template>

<script>
export default {
  name: 'MessageInput',
  data() {
    return {
      message: ''
    }
  },
  methods: {
    triggerFile() {
      this.$refs.file.click()
    },
    onFile(e) {
      const file = e.target.files[0]
      if (!file) return
      // handle file preview/upload here and add to chat as message with attachment
      this.$emit('file-uploaded', file)
    },
    openEmoji() {
      // open emoji picker (implement/plug a library if desired)
      const emoji = '😊'
      this.message += emoji
    },
    send() {
      if (!this.message.trim()) return
      this.$store.dispatch('sendMessage', { chatId: this.$store.state.selectedChatId, text: this.message })
      this.message = ''
    }
  }
}
</script>
