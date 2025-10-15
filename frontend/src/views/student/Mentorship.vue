<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Events & RSVP</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <!-- 
        COLUMN 1: Conversations List
        - Always visible on mdAndUp screens.
        - On mobile (smAndDown), it's hidden once a conversation is selected.
      -->
      <v-col
        v-if="!selectedConversation || !$vuetify.breakpoint.smAndDown"
        cols="12"
        md="4"
        lg="3"
        class="d-flex flex-column fill-height border-right"
      >
        <div class="pa-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search conversations..."
            solo
            dense
            prepend-inner-icon="mdi-magnify"
            hide-details
            rounded
            class="mb-4"
          ></v-text-field>
          <v-tabs v-model="chatTab" color="primary" grow>
            <v-tab><v-icon left>mdi-message</v-icon>All</v-tab>
            <v-tab><v-icon left>mdi-school</v-icon>Mentorship</v-tab>
          </v-tabs>
        </div>
        <v-divider />
        <v-list class="overflow-y-auto pa-2 flex-grow-1">
          <v-list-item-group v-model="selectedConversationIndex" color="primary">
            <v-list-item
              v-for="(conversation, index) in filteredConversations"
              :key="conversation.id"
              @click="selectConversation(conversation, index)"
              class="mb-1"
            >
              <v-list-item-avatar size="50">
                <v-badge
                  :content="conversation.unreadCount"
                  :value="conversation.unreadCount > 0"
                  color="error"
                  offset-x="15"
                  offset-y="15"
                >
                  <v-avatar :color="conversation.userAvatar ? '' : 'primary'" size="50">
                    <v-img v-if="conversation.userAvatar" :src="conversation.userAvatar"></v-img>
                    <span v-else class="white--text text-h6">{{ conversation.userName[0] }}</span>
                  </v-avatar>
                </v-badge>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold mb-1">
                  {{ conversation.userName }}
                   <v-chip v-if="conversation.connectionType === 'mentorship'" x-small color="accent" class="ml-2">Mentor</v-chip>
                </v-list-item-title>
                <v-list-item-subtitle class="text-truncate">{{ conversation.lastMessage }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action-text>{{ formatTime(conversation.lastMessageTime) }}</v-list-item-action-text>
            </v-list-item>
          </v-list-item-group>
        </v-list>
         <div class="pa-4">
          <v-btn block color="primary" depressed rounded class="text-none">
            <v-icon left>mdi-plus</v-icon>
            New Connection
          </v-btn>
        </div>
      </v-col>

      <!-- 
        COLUMN 2: Chat Interface
        - Hidden on mobile until a conversation is selected.
      -->
      <v-col
        v-if="selectedConversation"
        cols="12"
        md="8"
        :lg="rightDrawer && $vuetify.breakpoint.lgAndUp ? 6 : 9"
        class="d-flex flex-column fill-height"
      >
        <!-- Chat Header -->
        <v-sheet class="pa-3 elevation-1 d-flex align-center">
          <v-btn v-if="$vuetify.breakpoint.smAndDown" icon @click="selectedConversation = null" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-avatar :color="selectedConversation.userAvatar ? '' : 'primary'" size="40" class="mr-3">
            <v-img v-if="selectedConversation.userAvatar" :src="selectedConversation.userAvatar"></v-img>
            <span v-else class="white--text">{{ selectedConversation.userName[0] }}</span>
          </v-avatar>
          <div>
            <h3 class="text-body-1 font-weight-bold">{{ selectedConversation.userName }}</h3>
            <div class="text-caption success--text">
              <v-icon x-small color="success">mdi-circle</v-icon> Online
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="scheduleDialog = true"><v-icon>mdi-calendar-clock</v-icon></v-btn>
          <v-btn icon @click="rightDrawer = !rightDrawer">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </v-sheet>
        
        <!-- Messages Area -->
        <div class="flex-grow-1 pa-4 overflow-y-auto" ref="messageContainer">
           <div v-for="message in messages" :key="message.id" class="d-flex mb-4" :class="message.senderId === currentUserId ? 'justify-end' : 'justify-start'">
              <div :class="['pa-3', message.senderId === currentUserId ? 'primary white--text rounded-lg rounded-br-0' : 'grey lighten-3 black--text rounded-lg rounded-bl-0']" style="max-width: 80%; word-wrap: break-word;">
                  <div class="text-body-1">{{ message.content }}</div>
                  <div class="text-caption mt-1 text-right" style="opacity: 0.7">{{ formatMessageTime(message.timestamp) }}</div>
              </div>
          </div>
        </div>
        
        <!-- Message Input -->
        <v-sheet class="pa-2">
          <v-card outlined rounded="lg">
            <div class="pa-2">
              <div class="d-flex align-center">
                <v-btn icon text><v-icon>mdi-paperclip</v-icon></v-btn>
                <v-text-field v-model="messageInput" placeholder="Type your message..." solo flat hide-details @keyup.enter="sendMessage"></v-text-field>
                <v-btn icon color="primary" @click="sendMessage" :disabled="!messageInput.trim()">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-sheet>
      </v-col>

       <!-- 
        COLUMN 3: Details Panel
        - Only visible on lgAndUp screens as a permanent drawer.
      -->
      <v-col
        v-if="rightDrawer && $vuetify.breakpoint.lgAndUp && selectedConversation"
        lg="3"
        class="d-flex flex-column fill-height border-left"
      >
         <div class="pa-4">
          <div class="text-center mb-4">
            <v-avatar :color="selectedConversation.userAvatar ? '' : 'primary'" size="80" class="mb-3">
              <v-img v-if="selectedConversation.userAvatar" :src="selectedConversation.userAvatar"></v-img>
              <span v-else class="white--text text-h4">{{ selectedConversation.userName[0] }}</span>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold">{{ selectedConversation.userName }}</h3>
            <v-chip small :color="selectedConversation.userRole === 'alumni' ? 'secondary' : 'info'" class="mt-2">
              {{ selectedConversation.userRole === 'alumni' ? 'Alumni' : 'Student' }}
            </v-chip>
          </div>
          <v-btn block color="primary" outlined class="text-none mb-4" @click="viewProfile">
            <v-icon left>mdi-account</v-icon> View Profile
          </v-btn>
          <v-card flat color="blue lighten-5" class="pa-3 rounded-lg">
            <div class="text-body-2">
              <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-email</v-icon><span class="text-caption">student@college.edu</span></div>
              <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-phone</v-icon><span class="text-caption">+91 98765 43210</span></div>
              <div class="d-flex align-center"><v-icon small class="mr-2">mdi-map-marker</v-icon><span class="text-caption">Mumbai, India</span></div>
            </div>
          </v-card>
        </div>
      </v-col>
      
      <!-- EMPTY STATE: Shown on larger screens when no chat is selected -->
      <v-col
        v-if="!selectedConversation && !$vuetify.breakpoint.smAndDown"
        md="8" lg="9"
        class="d-flex flex-column align-center justify-center text-center grey lighten-4"
      >
        <v-icon size="120" color="grey lighten-1">mdi-message-outline</v-icon>
        <h2 class="text-h4 font-weight-bold mt-6 mb-2">Select a Conversation</h2>
        <p class="text-body-1 grey--text text--darken-1">Choose a conversation from the left to start chatting.</p>
      </v-col>
    </v-row>

    <!-- RIGHT DRAWER: Temporary overlay for mobile/tablet -->
    <v-navigation-drawer v-if="$vuetify.breakpoint.mdAndDown" v-model="rightDrawer" right fixed temporary :width="280">
        <div class="pa-4" v-if="selectedConversation">
          <div class="text-center mb-4">
            <v-avatar :color="selectedConversation.userAvatar ? '' : 'primary'" size="80" class="mb-3">
              <v-img v-if="selectedConversation.userAvatar" :src="selectedConversation.userAvatar"></v-img>
              <span v-else class="white--text text-h4">{{ selectedConversation.userName[0] }}</span>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold">{{ selectedConversation.userName }}</h3>
            <v-chip small :color="selectedConversation.userRole === 'alumni' ? 'secondary' : 'info'" class="mt-2">
              {{ selectedConversation.userRole === 'alumni' ? 'Alumni' : 'Student' }}
            </v-chip>
          </div>
          <v-btn block color="primary" outlined class="text-none mb-4" @click="viewProfile">
            <v-icon left>mdi-account</v-icon> View Profile
          </v-btn>
          <v-card flat color="blue lighten-5" class="pa-3 rounded-lg">
            <div class="text-body-2">
              <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-email</v-icon><span class="text-caption">student@college.edu</span></div>
              <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-phone</v-icon><span class="text-caption">+91 98765 43210</span></div>
              <div class="d-flex align-center"><v-icon small class="mr-2">mdi-map-marker</v-icon><span class="text-caption">Mumbai, India</span></div>
            </div>
          </v-card>
        </div>
    </v-navigation-drawer>
    
    <!-- DIALOGS -->
    <v-dialog v-model="scheduleDialog" max-width="500">
        <v-card class="rounded-xl">
            <v-card-title class="pa-6">
                <v-icon color="primary" class="mr-3">mdi-calendar-clock</v-icon>
                <span class="text-h5 font-weight-bold">Schedule Meeting</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
                <v-text-field label="Meeting Title" outlined color="primary" class="mb-4"></v-text-field>
                <v-text-field label="Date" type="date" outlined color="primary" class="mb-4"></v-text-field>
                <v-text-field label="Time" type="time" outlined color="primary" class="mb-4"></v-text-field>
                <v-textarea label="Description (Optional)" outlined color="primary" rows="3"></v-textarea>
            </v-card-text>
            <v-card-actions class="pa-6 pt-0">
                <v-spacer></v-spacer>
                <v-btn text @click="scheduleDialog = false">Cancel</v-btn>
                <v-btn color="primary" depressed @click="generateMeetingLink"><v-icon left>mdi-video</v-icon>Generate Google Meet Link</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>
</v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
export default {
  name: 'StudentMentorship',
  data() {
    return {
      rightDrawer: this.$vuetify.breakpoint.lgAndUp,
      searchQuery: '',
      chatTab: 0,
      selectedConversation: null,
      selectedConversationIndex: null,
      messageInput: '',
      currentUserId: '1',
      scheduleDialog: false,
      conversations: [
        { id: '1', userId: '2', userName: 'Priya Desai', userRole: 'alumni', lastMessage: 'Thanks for connecting! Happy to help.', lastMessageTime: new Date(Date.now() - 3e5), unreadCount: 2, connectionType: 'mentorship' },
        { id: '2', userId: '3', userName: 'Amit Kumar', userRole: 'student', lastMessage: 'Hey, are you attending the tech fest?', lastMessageTime: new Date(Date.now() - 18e5), unreadCount: 0, connectionType: 'connection'},
        { id: '3', userId: '4', userName: 'Dr. Rajesh Mehta', userRole: 'alumni', lastMessage: 'I can review your resume this weekend.', lastMessageTime: new Date(Date.now() - 72e5), unreadCount: 1, connectionType: 'mentorship'}
      ],
      messages: [
        { id: '1', senderId: '2', content: 'Hi! I saw your profile and would love to mentor you.', timestamp: new Date(Date.now() - 18e5)},
        { id: '2', senderId: '1', content: 'Thank you so much! I would really appreciate that.', timestamp: new Date(Date.now() - 15e5)},
        { id: '6', senderId: '2', content: 'Happy to help with any questions.', timestamp: new Date(Date.now() - 3e5)}
      ]
    };
  },
  computed: {
     filteredConversations() {
      let filtered = this.conversations;
      if (this.chatTab === 1) { // 0 is 'All', 1 is 'Mentorship'
        filtered = filtered.filter(c => c.connectionType === 'mentorship');
      }
      if (this.searchQuery) {
        filtered = filtered.filter(c => c.userName.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }
      return filtered;
    }
  },
  methods: {
    selectConversation(conversation, index) {
      this.selectedConversation = conversation;
      this.selectedConversationIndex = index;
      if (conversation) conversation.unreadCount = 0;
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.rightDrawer = false;
      }
    },
    formatTime(date) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    },
     formatMessageTime(date) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    sendMessage() {
        if (!this.messageInput.trim()) return;
        this.messages.push({
            id: Date.now().toString(),
            senderId: this.currentUserId,
            content: this.messageInput,
            timestamp: new Date()
        });
        this.messageInput = '';
        this.$nextTick(() => {
            const container = this.$refs.messageContainer;
            if (container) container.scrollTop = container.scrollHeight;
        });
    },
    viewProfile() {
      if (!this.selectedConversation) return;
      this.$router.push(`/student/profile/${this.selectedConversation.userId}`);
    },
    generateMeetingLink() {
      console.log('Generating Google Meet link...');
      this.scheduleDialog = false;
    }
  },
  watch: {
    '$vuetify.breakpoint.lgAndUp'(isLgAndUp) {
      // Automatically show the right drawer on large screens if a chat is selected
      if (isLgAndUp && this.selectedConversation) {
        this.rightDrawer = true;
      } else if (!isLgAndUp) {
        this.rightDrawer = false;
      }
    }
  }
};
</script>

<style scoped>
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.border-left {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
.fill-height {
  height: calc(100vh - 64px); /* Full viewport height minus navbar */
}
</style>

