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
          <v-btn block color="accent" depressed class="text-none" @click="requestsDialog = true">
            <v-icon left>mdi-inbox</v-icon>
            View Requests
             <v-badge :content="pendingRequests" color="error" inline class="ml-2"></v-badge>
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
        lg="9"
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
           <v-btn color="accent" depressed class="text-none mr-2" @click="scheduleDialog = true">
              <v-icon left>mdi-calendar-clock</v-icon>
              Schedule Meeting
          </v-btn>
          <v-btn icon @click="viewProfile"><v-icon>mdi-account-circle-outline</v-icon></v-btn>
        </v-sheet>
        
        <!-- Messages Area -->
        <div class="flex-grow-1 pa-4 overflow-y-auto" ref="messageContainer">
          <div v-for="message in selectedConversation.messages" :key="message.id" class="d-flex mb-4" :class="message.senderId === currentUserId ? 'justify-end' : 'justify-start'">
            <v-hover v-slot="{ hover }">
              <div class="message-wrapper">
                <div :class="['pa-3', 'message-bubble', message.senderId === currentUserId ? 'primary white--text rounded-lg rounded-br-0' : 'grey lighten-3 black--text rounded-lg rounded-bl-0']">
                  <div class="text-body-1">{{ message.content }}</div>
                  <div class="text-caption mt-1 text-right" style="opacity: 0.7">{{ formatMessageTime(message.timestamp) }}</div>
                </div>
                <v-fade-transition>
                  <div v-if="hover" class="message-actions">
                    <v-btn icon x-small @click="replyToMessage(message)"><v-icon small>mdi-reply</v-icon></v-btn>
                    <v-btn icon x-small @click="copyMessage(message)"><v-icon small>mdi-content-copy</v-icon></v-btn>
                    <v-btn v-if="message.senderId === currentUserId" icon x-small @click="deleteMessage(message)"><v-icon small>mdi-delete</v-icon></v-btn>
                  </div>
                </v-fade-transition>
              </div>
            </v-hover>
          </div>
        </div>
        
        <!-- Message Input -->
        <v-sheet class="pa-2">
          <input type="file" ref="fileInput" @change="onFileSelected" style="display: none;" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx">
          <v-card outlined rounded="lg">
             <div v-if="replyingTo" class="reply-indicator pa-2">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption grey--text">Replying to</div>
                  <div class="text-body-2 text-truncate">{{ replyingTo.content }}</div>
                </div>
                <v-btn icon x-small @click="replyingTo = null"><v-icon>mdi-close</v-icon></v-btn>
              </div>
            </div>
            <div class="pa-2">
              <div class="d-flex align-center">
                <v-menu top offset-y>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn icon text v-bind="attrs" v-on="on"><v-icon>mdi-paperclip</v-icon></v-btn>
                  </template>
                  <v-list>
                      <v-list-item @click="attachFile('image')">
                          <v-list-item-icon><v-icon color="info">mdi-image</v-icon></v-list-item-icon>
                          <v-list-item-title>Image</v-list-item-title>
                      </v-list-item>
                        <v-list-item @click="attachFile('document')">
                          <v-list-item-icon><v-icon color="warning">mdi-file-document</v-icon></v-list-item-icon>
                          <v-list-item-title>Document</v-list-item-title>
                      </v-list-item>
                  </v-list>
                </v-menu>
                <v-text-field v-model="messageInput" placeholder="Type your message..." solo flat hide-details @keyup.enter="sendMessage"></v-text-field>
                <v-btn icon color="primary" @click="sendMessage" :disabled="!messageInput.trim()">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-sheet>
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
    
    <!-- DIALOGS -->
    <v-dialog v-model="requestsDialog" max-width="700">
        <v-card class="rounded-xl">
            <v-card-title class="pa-6 d-flex align-center">
                <v-icon color="primary" class="mr-3" size="32">mdi-inbox</v-icon>
                <span class="text-h5 font-weight-bold">Connection Requests</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-list>
                    <template v-for="(request, index) in connectionRequests">
                        <v-list-item :key="request.id" class="pa-4">
                              <v-list-item-avatar color="primary" size="50">
                                <span class="white--text">{{ request.senderInfo.firstName[0] }}</span>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold mb-1">{{ request.senderInfo.firstName }} {{ request.senderInfo.lastName }}</v-list-item-title>
                                <v-list-item-subtitle class="mb-2">
                                    <v-chip x-small :color="request.type === 'mentorship' ? 'accent' : 'info'">
                                        {{ request.type === 'mentorship' ? 'Mentorship Request' : 'Connection Request' }}
                                    </v-chip>
                                </v-list-item-subtitle>
                                <v-list-item-subtitle v-if="request.message" class="mb-3 font-italic">"{{ request.message }}"</v-list-item-subtitle>
                                <div class="d-flex">
                                    <v-btn color="success" depressed small class="text-none mr-2" @click="acceptRequest(request)"><v-icon left small>mdi-check</v-icon>Accept</v-btn>
                                    <v-btn color="error" outlined small class="text-none mr-2" @click="rejectRequest(request)"><v-icon left small>mdi-close</v-icon>Reject</v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn text small class="text-none" @click="viewRequestSenderProfile(request)">View Profile</v-btn>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                          <v-divider :key="'divider-' + request.id" v-if="index < connectionRequests.length - 1"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
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

<script>
export default {
  name: 'MessageComponent',
  data() {
    return {
      searchQuery: '',
      chatTab: 0, 
      selectedConversation: null,
      selectedConversationIndex: null,
      messageInput: '',
      currentUserId: 'alumni_1',
      requestsDialog: false,
      scheduleDialog: false,
      replyingTo: null,
      conversations: [
        {
          id: '1',
          userId: 'student_1',
          userName: 'Priya Desai',
          userRole: 'student',
          lastMessage: 'Thanks for connecting! Happy to help with any questions.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
          unreadCount: 2,
          connectionType: 'mentorship',
          messages: [
            { id: 'msg1', senderId: 'student_1', content: 'Hi! I saw your profile and would love your guidance.', timestamp: new Date(Date.now() - 1000 * 60 * 30), type: 'text'},
            { id: 'msg2', senderId: 'alumni_1', content: 'Of course, happy to help!', timestamp: new Date(Date.now() - 1000 * 60 * 25), type: 'text' },
            { id: 'msg3', senderId: 'student_1', content: 'Thanks for connecting! Happy to help with any questions.', timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'text'}
          ]
        },
        {
          id: '2',
          userId: 'student_2',
          userName: 'Amit Kumar',
          userRole: 'student',
          lastMessage: 'Hey, are you attending the tech fest?',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
          unreadCount: 0,
          connectionType: 'connection',
           messages: [
            { id: 'msg4', senderId: 'student_2', content: 'Hey, are you attending the tech fest?', timestamp: new Date(Date.now() - 1000 * 60 * 30), type: 'text'}
          ]
        },
      ],
      connectionRequests: [
        { id: '1', senderId: '5', receiverId: '1', type: 'mentorship', status: 'pending', message: 'I am really interested in learning about AI/ML and would love your guidance.', timestamp: new Date(), senderInfo: { id: '5', firstName: 'Sneha', lastName: 'Patel', email: 'sneha@college.edu', role: 'student', collegeId: 'CS2023045', profileComplete: true } },
        { id: '2', senderId: '6', receiverId: '1', type: 'connection', status: 'pending', message: 'Would love to connect and collaborate on projects!', timestamp: new Date(), senderInfo: { id: '6', firstName: 'Rohan', lastName: 'Singh', email: 'rohan@college.edu', role: 'student', collegeId: 'CS2023012', profileComplete: true } }
      ]
    };
  },
  computed: {
    pendingRequests() {
      return this.connectionRequests.filter(r => r.status === 'pending').length;
    },
    filteredConversations() {
      let filtered = this.conversations;
      if (this.chatTab === 1) { 
        filtered = filtered.filter(c => c.connectionType === 'mentorship');
      }
      if (this.searchQuery) {
        filtered = filtered.filter(c =>
          c.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return filtered;
    }
  },
  methods: {
    selectConversation(conversation, index) {
      this.selectedConversation = conversation;
      this.selectedConversationIndex = index;
      if(conversation) conversation.unreadCount = 0;
    },
    sendMessage() {
      if (!this.messageInput.trim() || !this.selectedConversation) return;
      const newMessage = {
        id: Date.now().toString(),
        senderId: this.currentUserId,
        content: this.messageInput,
        timestamp: new Date(),
        type: 'text',
        replyTo: this.replyingTo ? this.replyingTo.id : null
      };
      this.selectedConversation.messages.push(newMessage);
      this.selectedConversation.lastMessage = this.messageInput;
      this.selectedConversation.lastMessageTime = new Date();
      this.messageInput = '';
      this.replyingTo = null;

      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if(container) container.scrollTop = container.scrollHeight;
      });
    },
    replyToMessage(message) {
      this.replyingTo = message;
    },
    copyMessage(message) {
      navigator.clipboard.writeText(message.content);
    },
    deleteMessage(messageToDelete) {
      const messages = this.selectedConversation.messages;
      const index = messages.findIndex(message => message.id === messageToDelete.id);
      if (index > -1) {
        messages.splice(index, 1);
      }
    },
    attachFile(type) {
      this.$refs.fileInput.click();
      console.log('Attaching file type:', type);
    },
     onFileSelected(event) {
      const file = event.target.files[0];
      if (!file || !this.selectedConversation) return;

      const newMessage = {
        id: Date.now().toString(),
        senderId: this.currentUserId,
        content: file.name,
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'document',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file) // For preview
      };
      this.selectedConversation.messages.push(newMessage);
       this.selectedConversation.lastMessage = file.name;
       this.selectedConversation.lastMessageTime = new Date();
    },
    acceptRequest(request) {
      console.log('Accepting request:', request);
      request.status = 'accepted';
    },
    rejectRequest(request) {
      console.log('Rejecting request:', request);
      request.status = 'rejected';
    },
    viewRequestSenderProfile(request) {
      console.log('Viewing profile:', request.senderInfo);
    },
    viewProfile() {
      if(this.selectedConversation) {
        this.$router.push(`/alumni/profile/${this.selectedConversation.userId}`);
      }
    },
    generateMeetingLink() {
      console.log('Generating Google Meet link...');
      this.scheduleDialog = false;
    },
    formatTime(date) {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (minutes < 1) return 'now';
      if (minutes < 60) return `${minutes}m`;
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      return `${days}d`;
    },
    formatMessageTime(date) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style>
.border-right {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.fill-height {
  height: calc(100vh - 70px); /* Full viewport height minus app bar */
}

.message-wrapper {
  position: relative;
  display: inline-block;
}

.message-actions {
  position: absolute;
  top: -16px;
  right: 10px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  padding: 2px;
}
.reply-indicator {
  background: rgba(0, 146, 255, 0.1);
  border-left: 3px solid #0092FF;
}

</style>

