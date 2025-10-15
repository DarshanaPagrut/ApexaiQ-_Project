// src/plugins/vuetify.js
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.css' 
import 'font-awesome/css/font-awesome.min.css' 

Vue.use(Vuetify)

const light = {
  primary: '#0092FF',
  secondary: '#00D4B4',
  accent: '#00FFAA',
  background: '#F9FBFD',
  surface: '#FFFFFF',
  info: '#0092FF',
  success: '#00D68F',
  warning: '#FFB300',
  error: '#E53935',
  'text-primary': '#1B1F23',
  'text-secondary': '#4E5A66'
}

const dark = {
  primary: '#3AAFD6',
  secondary: '#00D4B4',
  accent: '#00FFAA',
  background: '#0F1724',
  surface: '#0B1220',
  info: '#3AAFD6',
  success: '#00D68F',
  warning: '#FFB300',
  error: '#E53935',
  'text-primary': '#E6EEF6',
  'text-secondary': '#A7B6C6'
}

export default new Vuetify({
  icons: {
    iconfont: 'mdi' // or 'fa'
  },
  theme: {
    options: { customProperties: true }, // makes CSS variables like --v-primary available
    themes: {
      light,
      dark
    },
    dark: false // initial: controlled by Vuex/app state
  },
  breakpoint: {
    scrollBarWidth: 16,
    thresholds: {
      xs: 340,
      sm: 540,
      md: 840,
      lg: 1280
    }
  }
})
