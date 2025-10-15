// src/store/modules/theme.js
const state = () => ({
  dark: JSON.parse(localStorage.getItem('alumnilink_theme_dark')) || false
})

const getters = {
  isDark: (s) => s.dark
}

const mutations = {
  SET_DARK(state, val) {
    state.dark = !!val
    localStorage.setItem('alumnilink_theme_dark', JSON.stringify(state.dark))
  },
  TOGGLE_DARK(state) {
    state.dark = !state.dark
    localStorage.setItem('alumnilink_theme_dark', JSON.stringify(state.dark))
  }
}

const actions = {
  setDark({ commit }, val) {
    commit('SET_DARK', val)
    // emit event so root (App.vue) or plugin can react; we will use root watcher
  },
  toggleDark({ commit }) {
    commit('TOGGLE_DARK')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
