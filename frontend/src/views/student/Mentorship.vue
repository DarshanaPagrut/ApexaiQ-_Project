
<template>
  <v-app>
    <v-app-bar color="primary" elevation="3" height="70" dark>
      <v-container fluid class="d-flex align-center px-6">
        <v-toolbar-title class="text-h5 font-weight-bold">
          <v-icon left size="32">mdi-message-text</v-icon>
          Messages
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip color="accent" class="mr-4">
          <v-icon left small>mdi-bell</v-icon>
          {{ pendingRequests }} New Requests
        </v-chip>
        <v-btn icon>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      v-model="leftDrawer"
      :width="320"
      permanent
      app
      class="border-right"
    >
      <div class="pa-4">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search conversations..."
          solo
          dense
          prepend-inner-icon="mdi-magnify"
          hide-details
          rounded="lg"
          class="mb-4"
        ></v-text-field>

        <v-tabs v-model="chatTab" color="primary" grow class="mb-4">
          <v-tab>
            <v-icon left>mdi-message</v-icon>
            All
          </v-tab>
          <v-tab>
            <v-icon left>mdi-school</v-icon>
            Mentorship
          </v-tab>
        </v-tabs>
      </div>

      <v-divider></v-divider>

      <v-list class="pa-2">
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
                <v-chip
                  v-if="conversation.connectionType === 'mentorship'"
                  x-small
                  color="accent"
                  class="ml-2"
                >
                  Mentor
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                {{ conversation.lastMessage }}
              </v-list-item-subtitle>
            </v-list-item-content>

             <v-list-item-action-text>
                {{ formatTime(conversation.lastMessageTime) }}
             </v-list-item-action-text>

          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn block color="primary" depressed rounded="lg" class="text-none">
            <v-icon left>mdi-plus</v-icon>
            New Connection
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="grey lighten-4">
      <v-container fluid class="fill-height pa-0">
        <div v-if="!selectedConversation" class="d-flex flex-column align-center justify-center fill-height text-center mx-auto">
          <v-icon size="120" color="grey lighten-1">mdi-message-outline</v-icon>
          <h2 class="text-h4 font-weight-bold mt-6 mb-2">No Conversation Selected</h2>
          <p class="text-body-1 grey--text text--darken-1">Choose a conversation from the left to start chatting</p>
        </div>

        <div v-else class="d-flex flex-column fill-height" style="width: 100%;">
          <v-sheet class="pa-4 elevation-2">
             <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                    <v-avatar :color="selectedConversation.userAvatar ? '' : 'primary'" size="50" class="mr-4">
                        <v-img v-if="selectedConversation.userAvatar" :src="selectedConversation.userAvatar"></v-img>
                        <span v-else class="white--text text-h6">{{ selectedConversation.userName[0] }}</span>
                    </v-avatar>
                    <div>
                        <h3 class="text-h6 font-weight-bold">{{ selectedConversation.userName }}</h3>
                        <div class="d-flex align-center">
                            <v-chip x-small :color="selectedConversation.userRole === 'alumni' ? 'secondary' : 'info'" class="mr-2">
                                {{ selectedConversation.userRole === 'alumni' ? 'Alumni' : 'Student' }}
                            </v-chip>
                            <span class="text-caption success--text">
                                <v-icon x-small color="success">mdi-circle</v-icon>
                                Online
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <v-btn color="accent" depressed class="text-none mr-2" @click="scheduleDialog = true">
                        <v-icon left>mdi-calendar-clock</v-icon>
                        Schedule Meeting
                    </v-btn>
                    <v-btn icon text><v-icon>mdi-phone</v-icon></v-btn>
                    <v-btn icon text><v-icon>mdi-video</v-icon></v-btn>
                    <v-btn icon text><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </div>
            </div>
          </v-sheet>

          <div class="flex-grow-1 pa-6 overflow-y-auto" ref="messageContainer">
              <div v-for="message in messages" :key="message.id" class="d-flex mb-4" :class="message.senderId === currentUserId ? 'justify-end' : 'justify-start'">
                <v-hover v-slot="{ hover }">
                    <div class="d-flex flex-column" style="position: relative;">
                        <div
                            :class="['pa-3', message.senderId === currentUserId ? 'primary white--text rounded-lg rounded-br-0' : 'white grey--text text--darken-3 rounded-lg rounded-bl-0']"
                            style="max-width: 400px; word-wrap: break-word;"
                        >
                            <div v-if="message.senderId !== currentUserId" class="text-caption font-weight-bold mb-1 primary--text">
                                {{ selectedConversation.userName }}
                            </div>

                            <div v-if="message.type === 'text'" class="text-body-1">
                                {{ message.content }}
                            </div>

                             <v-card v-else-if="message.type === 'file' || message.type === 'document'" flat :color="message.senderId === currentUserId ? 'primary lighten-2' : 'grey lighten-3'">
                                <div class="d-flex align-center pa-2">
                                    <v-icon :color="message.senderId === currentUserId ? 'white' : 'primary'" size="32" class="mr-3">
                                        mdi-file-document
                                    </v-icon>
                                    <div class="flex-grow-1">
                                        <div class="text-body-2 font-weight-bold">{{ message.fileName }}</div>
                                        <div class="text-caption">Click to download</div>
                                    </div>
                                </div>
                            </v-card>

                            <v-img v-else-if="message.type === 'image'" :src="message.fileUrl" max-width="300" class="rounded-lg mb-2"></v-img>

                            <div class="text-caption mt-1" :class="message.senderId === currentUserId ? 'text-right' : 'text-left'" style="opacity: 0.7">
                                {{ formatMessageTime(message.timestamp) }}
                            </div>
                        </div>

                         <v-fade-transition>
                            <div v-if="hover" class="d-flex rounded-pill white elevation-4" style="position: absolute; top: -16px; right: 10px; gap: 4px;">
                                <v-btn icon x-small text @click="replyToMessage(message)"><v-icon small>mdi-reply</v-icon></v-btn>
                                <v-btn icon x-small text @click="copyMessage(message)"><v-icon small>mdi-content-copy</v-icon></v-btn>
                                <v-btn v-if="message.senderId === currentUserId" icon x-small text @click="deleteMessage(message)"><v-icon small>mdi-delete</v-icon></v-btn>
                            </div>
                        </v-fade-transition>
                    </div>
                </v-hover>
            </div>
          </div>


          <v-sheet class="pa-4">
              <v-card outlined rounded="lg">
                  <div class="pa-3">
                      <div v-if="replyingTo" class="mb-2 pa-2 rounded blue lighten-5" style="border-left: 3px solid #1976D2;">
                          <div class="d-flex align-center justify-space-between">
                              <div>
                                  <div class="text-caption grey--text">Replying to</div>
                                  <div class="text-body-2 text-truncate">{{ replyingTo.content }}</div>
                              </div>
                              <v-btn icon x-small @click="replyingTo = null"><v-icon>mdi-close</v-icon></v-btn>
                          </div>
                      </div>

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
                                   <v-list-item @click="attachFile('file')">
                                      <v-list-item-icon><v-icon color="success">mdi-file</v-icon></v-list-item-icon>
                                      <v-list-item-title>File</v-list-item-title>
                                  </v-list-item>
                              </v-list>
                          </v-menu>

                          <v-btn icon text><v-icon>mdi-emoticon-happy</v-icon></v-btn>
                          <v-text-field
                              v-model="messageInput"
                              placeholder="Type your message..."
                              solo
                              flat
                              hide-details
                              class="flex-grow-1 mx-2"
                              @keyup.enter="sendMessage"
                          ></v-text-field>
                          <v-btn icon color="primary" depressed :disabled="!messageInput.trim()" @click="sendMessage">
                              <v-icon>mdi-send</v-icon>
                          </v-btn>
                      </div>
                  </div>
              </v-card>
          </v-sheet>
        </div>
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :width="280" permanent app right class="border-left">
      <div class="pa-4">
        <v-btn block color="accent" depressed class="text-none mb-4" @click="requestsDialog = true">
          <v-badge :content="pendingRequests" color="error" inline>
            <v-icon left>mdi-inbox</v-icon>
            View Requests
          </v-badge>
        </v-btn>

        <v-divider class="my-4"></v-divider>

        <div v-if="selectedConversation">
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
            <v-icon left>mdi-account</v-icon>
            View Profile
          </v-btn>

          <v-card flat color="info lighten-4" class="pa-3 rounded-lg">
            <div class="text-body-2">
                <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-email</v-icon><span class="text-caption">student@college.edu</span></div>
                <div class="d-flex align-center mb-2"><v-icon small class="mr-2">mdi-phone</v-icon><span class="text-caption">+91 98765 43210</span></div>
                <div class="d-flex align-center"><v-icon small class="mr-2">mdi-map-marker</v-icon><span class="text-caption">Mumbai, India</span></div>
            </div>
          </v-card>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Dialogs -->
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
  </v-app>
</template>


<script>
export default {
  name: 'StudentMentorship',
  data() {
    return {
      leftDrawer: true,
      rightDrawer: true,
      searchQuery: '',
      chatTab: 0, // In Vuetify 2, tabs are index-based
      selectedConversation: null,
      selectedConversationIndex: null,
      messageInput: '',
      currentUserId: '1',
      hoveredMessage: null,
      replyingTo: null,
      requestsDialog: false,
      scheduleDialog: false,
      conversations: [
        {
          id: '1',
          userId: '2',
          userName: 'Priya Desai',
          userRole: 'alumni',
          lastMessage: 'Thanks for connecting! Happy to help with any questions.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
          unreadCount: 2,
          connectionType: 'mentorship'
        },
        {
          id: '2',
          userId: '3',
          userName: 'Amit Kumar',
          userRole: 'student',
          lastMessage: 'Hey, are you attending the tech fest?',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
          unreadCount: 0,
          connectionType: 'connection'
        },
        {
          id: '3',
          userId: '4',
          userName: 'Dr. Rajesh Mehta',
          userRole: 'alumni',
          lastMessage: 'I can review your resume this weekend',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
          unreadCount: 1,
          connectionType: 'mentorship'
        }
      ],
      messages: [
        { id: '1', senderId: '2', receiverId: '1', content: 'Hi! I saw your profile and would love to mentor you in web development.', timestamp: new Date(Date.now() - 1000 * 60 * 30), type: 'text', read: true },
        { id: '2', senderId: '1', receiverId: '2', content: 'Thank you so much! I would really appreciate your guidance.', timestamp: new Date(Date.now() - 1000 * 60 * 25), type: 'text', read: true },
        { id: '3', senderId: '2', receiverId: '1', content: 'Great! Let me share some resources with you.', timestamp: new Date(Date.now() - 1000 * 60 * 20), type: 'text', read: true },
        { id: '4', senderId: '2', receiverId: '1', content: 'Web Development Roadmap 2024.pdf', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'document', fileName: 'Web Development Roadmap 2024.pdf', read: true },
        { id: '5', senderId: '1', receiverId: '2', content: 'This is really helpful! Can we schedule a meeting to discuss my project?', timestamp: new Date(Date.now() - 1000 * 60 * 10), type: 'text', read: true },
        { id: '6', senderId: '2', receiverId: '1', content: 'Thanks for connecting! Happy to help with any questions.', timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'text', read: true }
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

      if (this.chatTab === 1) { // 0 is 'All', 1 is 'Mentorship'
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
      conversation.unreadCount = 0;
    },
    sendMessage() {
      if (!this.messageInput.trim() || !this.selectedConversation) return;

      const newMessage = {
        id: Date.now().toString(),
        senderId: this.currentUserId,
        receiverId: this.selectedConversation.userId,
        content: this.messageInput,
        timestamp: new Date(),
        type: 'text',
        read: false
      };

      this.messages.push(newMessage);
      this.messageInput = '';
      this.replyingTo = null;
    },
    replyToMessage(message) {
      this.replyingTo = message;
    },
    copyMessage(message) {
      navigator.clipboard.writeText(message.content).catch(err => {
        console.error('Could not copy text: ', err);
      });
    },
    deleteMessage(message) {
      const index = this.messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    },
    attachFile(type) {
      console.log('Attaching file type:', type);
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
      console.log('Viewing profile:', this.selectedConversation);
    },
    generateMeetingLink() {
      console.log('Generating Google Meet link...');
      this.scheduleDialog.value = false;
    },
    formatTime(date) {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return 'now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    },
    formatMessageTime(date) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style>
/* Adding border helper classes as they are not in Vuetify 2 by default */
.border-right {
    border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.border-left {
    border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>
