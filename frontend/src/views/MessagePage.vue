<template>
  <v-container>
    <h2>Chat with {{ user?.name }}</h2>
    <!-- Add your chat component here -->
  </v-container>
</template>

<script>
// import api from '@/services/api'

export default {
  name: 'MessagePage',
  data() {
    return { user: null }
  },
//   async created() {
//     const userId = this.$route.params.userId
//     const response = await api.getProfile(userId)
//     this.user = response.data
//   }
}
</script>
