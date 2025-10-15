<!-- src/layouts/ChatLayout.vue -->
<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <!-- LEFT -->
        <v-col cols="12" md="3" class="pa-2">
          <left-sidebar />
        </v-col>

        <!-- MIDDLE -->
        <v-col cols="12" md="6" class="pa-2">
          <v-card class="d-flex flex-column" height="100%">
            <chat-header />
            <chat-messages class="flex-grow-1" />
            <message-input />
          </v-card>
        </v-col>

        <!-- RIGHT -->
        <v-col cols="12" md="3" class="pa-2">
          <right-sidebar />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import LeftSidebar from '../components/LeftSidebar.vue'
import ChatHeader from '../components/ChatHeader.vue'
import ChatMessages from '../components/ChatMessages.vue'
import MessageInput from '../components/MessageInput.vue'
import RightSidebar from '../components/RightSidebar.vue'

export default {
  name: 'ChatLayout',
  components: {
    LeftSidebar,
    ChatHeader,
    ChatMessages,
    MessageInput,
    RightSidebar
  }
}
</script>
