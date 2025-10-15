import Vue from 'vue'
import Vuex from 'vuex'
import { events } from './events'
import theme from './modules/theme'
import chat from './modules/chat';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAuthenticated: false,
    darkMode: false,
    sidebarCollapsed: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    LOGOUT(state) {
      state.user = null
      state.isAuthenticated = false
    },
    TOGGLE_DARK_MODE(state) {
      state.darkMode = !state.darkMode
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    }
  },
  actions: {
    login({ commit }, userData) {
      // Simulate login - in real app, this would be an API call
      const user = {
        ...userData,
        id: Date.now()
      }
      commit('SET_USER', user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    },
    logout({ commit }) {
      commit('LOGOUT')
      localStorage.removeItem('user')
    },
    initializeAuth({ commit }) {
      const user = localStorage.getItem('user')
      if (user) {
        commit('SET_USER', JSON.parse(user))
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    userRole: state => state.user?.role || null
  },
  modules: {
    chat,
    events,
    theme
  }
})