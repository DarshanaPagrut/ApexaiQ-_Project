const defaultState = {
    personalInfo: {},
    description: '',
    educationHistory: [],
    skills: [],
    interests: [],
    achievements: [],
    projects: [],
    internships: [],
    cocurricular: [],
    profileCompletion: 0,
    isComplete: false
};

const profile = {
    namespaced: true,
    state: { ...defaultState },
    mutations: {
        SET_PROFILE_DATA(state, data) {
            Object.assign(state, data);
            state.isComplete = state.profileCompletion === 100;
        },
        UPDATE_PROFILE_SECTION(state, { section, data }) {
            state[section] = data;
        },
        CALCULATE_COMPLETION(state) {
            let completedSections = 0;
            const totalSections = 7; // description, education, skills, interests, achievements, projects, cocurricular
            if (state.description) completedSections++;
            if (state.educationHistory.length > 0) completedSections++;
            if (state.skills.length > 0) completedSections++;
            if (state.interests.length > 0) completedSections++;
            if (state.achievements.length > 0) completedSections++;
            if (state.projects.length > 0 || state.internships.length > 0) completedSections++;
            if (state.cocurricular.length > 0) completedSections++;

            state.profileCompletion = Math.round((completedSections / totalSections) * 100);
            state.isComplete = state.profileCompletion === 100;
        },
        RESET_PROFILE(state) {
            Object.assign(state, defaultState);
        }
    },
    actions: {
        saveProfile({ commit, state }) {
            commit('CALCULATE_COMPLETION');
            localStorage.setItem('userProfile', JSON.stringify(state));
        },
        loadProfile({ commit, rootState }) {
            const user = rootState.user;
            if (user) {
                const profileData = localStorage.getItem('userProfile');
                if (profileData) {
                    commit('SET_PROFILE_DATA', JSON.parse(profileData));
                } else {
                    commit('SET_PROFILE_DATA', { ...defaultState, personalInfo: user });
                }
            }
        },
        updateAndSaveSection({ commit, dispatch }, { section, data }) {
            commit('UPDATE_PROFILE_SECTION', { section, data });
            dispatch('saveProfile');
        }
    },
    getters: {
        isProfileComplete: state => state.isComplete,
        getProfile: state => state,
    }
};

export default profile;
