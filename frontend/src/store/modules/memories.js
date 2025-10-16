// frontend/src/store/modules/memories.js

const state = () => ({
  memories: [
    {
      id: 1,
      title: 'Convocation Day',
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      event: 'Convocation',
      year: 2022,
      department: 'Computer Engineering',
      description: 'The proudest moment for the class of 2022. A day filled with joy, pride, and a touch of nostalgia as we bid farewell to our college lives and stepped into the future.',
      likes: 125,
      liked: false,
      comments: [
        { id: 1, author: 'Priya Sharma', text: 'Such a memorable day! ✨', avatar: 'PS' },
        { id: 2, author: 'Rahul Deshmukh', text: 'I can see myself in the crowd! Good times.', avatar: 'RD' },
      ],
      postedBy: 'Admin',
      date: '2022-08-15',
    },
    {
      id: 2,
      title: 'Annual Tech Fest "Innovate"',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      event: 'Tech Fest',
      year: 2021,
      department: 'Information Technology',
      description: 'The energy was electric at Innovate 2021! A showcase of brilliant projects and a testament to the innovative spirit of our students.',
      likes: 98,
      liked: false,
      comments: [],
      postedBy: 'Admin',
      date: '2021-03-20',
    },
     {
      id: 3,
      title: 'Sports Day Finals',
      image: 'https://images.pexels.com/photos/163452/basketball-dribble-game-ball-163452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      event: 'Sports Day',
      year: 2022,
      department: 'Mechanical Engineering',
      description: 'The thrilling conclusion to our annual Sports Day. The competition was fierce, but the sportsmanship was even stronger.',
      likes: 210,
      liked: true,
      comments: [
         { id: 1, author: 'Ananya Kulkarni', text: 'That final match was intense!', avatar: 'AK' },
      ],
      postedBy: 'Admin',
      date: '2022-01-25',
    },
    {
      id: 4,
      title: 'Cultural Night "AURA"',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      event: 'Cultural Fest',
      year: 2020,
      department: 'Electronics Engineering',
      description: 'A night of spectacular performances, music, and dance that brought the entire campus together.',
      likes: 150,
      liked: false,
      comments: [],
      postedBy: 'Admin',
      date: '2020-02-10',
    }
  ],
  featuredIds: [3, 1], // IDs of memories to be featured
});

const getters = {
  allMemories: (state) => state.memories,
  featuredMemories: (state) => state.memories.filter(m => state.featuredIds.includes(m.id)),
  eventTypes: (state) => [...new Set(state.memories.map(m => m.event))],
  years: (state) => [...new Set(state.memories.map(m => m.year))].sort((a, b) => b - a),
};

const mutations = {
  TOGGLE_LIKE(state, memoryId) {
    const memory = state.memories.find(m => m.id === memoryId);
    if (memory) {
      if (memory.liked) {
        memory.likes--;
      } else {
        memory.likes++;
      }
      memory.liked = !memory.liked;
    }
  },
  ADD_COMMENT(state, { memoryId, comment }) {
    const memory = state.memories.find(m => m.id === memoryId);
    if (memory) {
      memory.comments.push(comment);
    }
  },
};

const actions = {
  toggleLike({ commit }, memoryId) {
    commit('TOGGLE_LIKE', memoryId);
  },
  addComment({ commit }, payload) {
    const comment = {
      id: Date.now(),
      author: 'You', // In a real app, this would come from the logged-in user
      text: payload.commentText,
      avatar: 'U'
    };
    commit('ADD_COMMENT', { memoryId: payload.memoryId, comment });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
