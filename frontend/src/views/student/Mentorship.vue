<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Groups Chats</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
          <v-container fluid class="pa-0 fill-height">
    <chat-layout />
    </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ChatLayout from './layouts/ChatLayout.vue'

export default {
  name: "StudentMentorship",
  components: {
    ChatLayout
  }
};
</script>
