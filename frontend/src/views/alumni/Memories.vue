<template>
  <v-container fluid>
    <h1 class="text-h4 font-weight-bold mb-4">Memories Lane</h1>

    <!-- Featured Memories Carousel -->
    <v-card class="mb-8 rounded-lg" outlined>
      <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
        <v-carousel-item v-for="memory in featuredMemories" :key="memory.id" :src="memory.image" @click="openMemoryModal(memory)">
          <v-row class="fill-height ma-0" align="end" justify="center">
            <div class="carousel-title-container pa-4">
              <div class="text-h5 font-weight-bold white--text">{{ memory.title }}</div>
              <div class="white--text">{{ memory.event }} - {{ memory.year }}</div>
            </div>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <!-- Filter Bar -->
    <v-card class="pa-4 mb-8 rounded-lg" outlined>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search by title, event, or keyword..." dense outlined hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select v-model="filterYear" :items="years" label="Year" dense outlined hide-details clearable></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select v-model="filterEvent" :items="eventTypes" label="Event Type" dense outlined hide-details clearable></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Gallery Grid -->
    <v-row>
      <v-col v-for="memory in filteredMemories" :key="memory.id" cols="12" sm="6" md="4">
        <v-hover v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 4" class="rounded-lg memory-card" @click="openMemoryModal(memory)">
            <v-img :src="memory.image" height="250px" class="align-end white--text" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)">
              <v-card-title class="font-weight-bold">{{ memory.title }}</v-card-title>
              <v-card-subtitle class="pb-2 white--text">{{ memory.event }} - {{ memory.year }}</v-card-subtitle>
            </v-img>
            <v-card-actions class="pa-2">
              <v-btn icon small>
                <v-icon :color="memory.liked ? 'red' : 'grey'">mdi-heart</v-icon>
              </v-btn>
              <span class="text-caption grey--text">{{ memory.likes }}</span>
              <v-btn icon small class="ml-2">
                <v-icon>mdi-comment-outline</v-icon>
              </v-btn>
              <span class="text-caption grey--text">{{ memory.comments.length }}</span>
              <v-spacer></v-spacer>
              <v-btn icon small>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Memory Modal View -->
    <v-dialog v-model="dialog" max-width="900px" @click:outside="closeMemoryModal">
      <v-card v-if="selectedMemory" class="rounded-lg">
        <v-card-title class="d-flex justify-space-between">
          <span class="text-h5 font-weight-bold">{{ selectedMemory.title }}</span>
           <v-btn icon @click="closeMemoryModal"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="7">
              <v-img :src="selectedMemory.image" max-height="500"></v-img>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <div class="pa-4 flex-grow-1 overflow-y-auto">
                <p class="font-weight-bold">{{ selectedMemory.event }} - {{ selectedMemory.year }}</p>
                <p class="body-1">{{ selectedMemory.description }}</p>
                <p class="caption grey--text">Posted by {{ selectedMemory.postedBy }} on {{ new Date(selectedMemory.date).toLocaleDateString() }}</p>

                <v-divider class="my-4"></v-divider>
                
                <h3 class="font-weight-bold mb-2">Comments ({{ selectedMemory.comments.length }})</h3>
                <v-list dense>
                  <v-list-item v-for="comment in selectedMemory.comments" :key="comment.id">
                    <v-list-item-avatar color="primary" size="30">
                      <span class="white--text text-caption">{{ comment.author.slice(0, 2) }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">{{ comment.author }}</v-list-item-title>
                      <v-list-item-subtitle>{{ comment.text }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>

              <div class="pa-4">
                <v-textarea v-model="newComment" label="Add a comment..." rows="2" outlined dense hide-details class="mb-2"></v-textarea>
                <v-btn block color="primary" @click="addComment" :disabled="!newComment">Post Comment</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
         <v-card-actions class="pa-4">
            <div class="like-container">
              <v-btn icon :color="selectedMemory && selectedMemory.liked ? 'red' : 'grey'" @click="toggleLike" class="like-btn">
                  <v-icon>mdi-heart</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{ selectedMemory ? selectedMemory.likes : 0 }}</span>
              <div v-if="showHeartAnimation" class="floating-heart">❤️</div>
            </div>
            <v-spacer></v-spacer>
            <v-btn text color="primary"><v-icon left>mdi-share-variant</v-icon> Share</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'AlumniMemories',
  data() {
    return {
      dialog: false,
      selectedMemory: null,
      search: '',
      filterYear: null,
      filterEvent: null,
      newComment: '',
      showHeartAnimation: false,
    };
  },
  computed: {
    ...mapState('memories', ['memories']),
    ...mapGetters('memories', ['featuredMemories', 'eventTypes', 'years']),
    filteredMemories() {
      return this.memories.filter(memory => {
        const searchMatch = !this.search || 
          memory.title.toLowerCase().includes(this.search.toLowerCase()) ||
          memory.event.toLowerCase().includes(this.search.toLowerCase()) ||
          memory.description.toLowerCase().includes(this.search.toLowerCase());
        
        const yearMatch = !this.filterYear || memory.year === this.filterYear;
        const eventMatch = !this.filterEvent || memory.event === this.filterEvent;

        return searchMatch && yearMatch && eventMatch;
      });
    },
  },
  methods: {
    ...mapActions('memories', ['toggleLike', 'addComment']),
    openMemoryModal(memory) {
      this.selectedMemory = memory;
      this.dialog = true;
    },
    closeMemoryModal() {
        this.dialog = false;
        // Delay clearing to prevent content from disappearing during transition
        setTimeout(() => {
            this.selectedMemory = null;
            this.newComment = '';
        }, 300);
    },
    addComment() {
      if (!this.newComment.trim() || !this.selectedMemory) return;
      this.$store.dispatch('memories/addComment', {
        memoryId: this.selectedMemory.id,
        commentText: this.newComment,
      });
      this.newComment = '';
    },
    toggleLike() {
        if (!this.selectedMemory) return;
        
        if (!this.selectedMemory.liked) {
            this.showHeartAnimation = true;
            setTimeout(() => {
                this.showHeartAnimation = false;
            }, 1000);
        }
        
        this.$store.dispatch('memories/toggleLike', this.selectedMemory.id);
    },
  },
};
</script>

<style scoped>
.memory-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}
.memory-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
.carousel-title-container {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  width: 100%;
}

.like-container {
  position: relative;
  display: flex;
  align-items: center;
}

.floating-heart {
  position: absolute;
  top: -30px;
  left: 5px;
  font-size: 24px;
  animation: float-up 1s ease-out forwards;
  opacity: 0;
}

@keyframes float-up {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(1.5);
    opacity: 0;
  }
}
</style>
