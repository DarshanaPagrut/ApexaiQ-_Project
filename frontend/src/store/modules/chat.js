import { v4 as uuidv4 } from 'uuid' // ✅ Correct import syntax

const chatModule = {
  namespaced: true,

  state: {
    user: {
      id: 'me',
      name: 'Darshana Pagrut',
      avatar: 'DP'
    },
    chats: [
      {
        id: uuidv4(),
        name: 'Aditi Sharma',
        avatar: 'AS',
        lastMessage: 'Looking forward to the session!',
        lastSeen: '10:42 AM',
        unread: 1,
        messages: [
          { id: uuidv4(), from: 'Aditi Sharma', role: 'student', text: 'Hi! Can we discuss AI?', time: '10:40 AM', read: false },
          { id: uuidv4(), from: 'me', role: 'alumni', text: 'Sure — what topic?', time: '10:41 AM', read: true }
        ],
        mentorshipRequest: false
      },
      {
        id: uuidv4(),
        name: 'Rahul Mehta',
        avatar: 'RM',
        lastMessage: 'Thanks for the help!',
        lastSeen: 'Yesterday',
        unread: 0,
        messages: [],
        mentorshipRequest: true
      }
    ],
    selectedChatId: null,
    notifications: []
  },

  getters: {
    selectedChat(state) {
      return state.chats.find(c => c.id === state.selectedChatId) || null
    },
    chats(state) {
      return state.chats
    }
  },

  mutations: {
    SELECT_CHAT(state, chatId) {
      state.selectedChatId = chatId
      const chat = state.chats.find(c => c.id === chatId)
      if (chat) chat.unread = 0
    },
    SEND_MESSAGE(state, { chatId, message }) {
      const chat = state.chats.find(c => c.id === chatId)
      if (!chat) return
      chat.messages.push(message)
      chat.lastMessage = message.text
      chat.lastSeen = message.time
    },
    RECEIVE_MESSAGE(state, { chatId, message }) {
      const chat = state.chats.find(c => c.id === chatId)
      if (!chat) return
      chat.messages.push(message)
      chat.lastMessage = message.text
      chat.unread = (chat.unread || 0) + 1
    },
    ADD_CHAT(state, chat) {
      state.chats.unshift(chat)
    },
    TOGGLE_MENTORSHIP(state, { chatId, value }) {
      const chat = state.chats.find(c => c.id === chatId)
      if (chat) chat.mentorshipRequest = value
    },
    ADD_NOTIFICATION(state, note) {
      state.notifications.push(note)
    }
  },

  actions: {
    selectChat({ commit }, chatId) {
      commit('SELECT_CHAT', chatId)
    },

    sendMessage({ commit, state }, { chatId, text }) {
      const message = {
        id: uuidv4(), // ✅ Use UUID for message ID
        from: state.user.name,
        role: 'alumni',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      }
      commit('SEND_MESSAGE', { chatId, message })
    },

    receiveMessage({ commit }, { chatId, text, from = 'Student' }) {
      const message = {
        id: uuidv4(), // ✅ Use UUID for message ID
        from,
        role: 'student',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      }
      commit('RECEIVE_MESSAGE', { chatId, message })
    },

    acceptMentorship({ commit }, chatId) {
      commit('TOGGLE_MENTORSHIP', { chatId, value: false })
      commit('ADD_NOTIFICATION', { id: uuidv4(), text: 'Mentorship accepted', time: new Date() })
    },

    addNewChat({ commit }, { name, avatar }) {
      const newChat = {
        id: uuidv4(),
        name,
        avatar,
        lastMessage: '',
        lastSeen: '',
        unread: 0,
        messages: [],
        mentorshipRequest: false
      }
      commit('ADD_CHAT', newChat)
      return newChat.id
    }
  }
}

export default chatModule
