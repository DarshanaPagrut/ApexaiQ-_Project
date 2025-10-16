<template>
  <v-container>
    <v-row>
      <!-- Left Sidebar Column (Desktop) -->
      <v-col v-if="$vuetify.breakpoint.mdAndUp" md="3">
        <v-card class="sticky-sidebar pa-4 rounded-lg elevation-2">
          <v-list dense nav>
            <v-list-item-group v-model="activeSection" color="primary">
              <v-list-item
                v-for="section in sections"
                :key="section.id"
                @click="scrollToSection(section.id)"
                class="mb-1"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon>{{ section.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ section.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-divider class="my-4"></v-divider>
          <div class="text-center">
            <h3 class="text-h6 font-weight-bold mb-4">Profile Completion</h3>
            <v-progress-circular :value="profileCompletion" size="120" width="10" color="primary">
              <span class="text-h5 font-weight-bold">{{ profileCompletion }}%</span>
            </v-progress-circular>
          </div>
        </v-card>
      </v-col>

      <!-- Right Main Content Column -->
      <v-col cols="12" md="9">
        <!-- Header -->
        <v-card id="personal-info" class="pa-4 rounded-lg elevation-2 mb-6">
          <v-row align="center">
            <v-col cols="12" sm="auto" class="text-center text-sm-left">
              <v-avatar size="100" color="primary" class="elevation-3">
                <v-img v-if="user.avatarUrl" :src="user.avatarUrl"></v-img>
                <span v-else class="white--text text-h4">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
              </v-avatar>
            </v-col>
            <v-col>
              <h1 class="text-h4 font-weight-bold">{{ user.firstName }} {{ user.lastName }}</h1>
              <p class="text-h6 grey--text text--darken-1 mb-2">{{ user.role | capitalize }}</p>
              <div>
                 <v-chip small color="success" class="mr-2">
                  <v-icon left small>mdi-check-circle</v-icon>
                  Verified
                </v-chip>
                <v-chip small color="primary" outlined>
                  <v-icon left small>mdi-email</v-icon>
                  {{ user.email }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="auto" class="text-center text-sm-right mt-4 mt-sm-0">
               <v-btn color="primary" outlined class="text-none mr-2">
                <v-icon left>mdi-linkedin</v-icon>
                Sync LinkedIn
              </v-btn>
              <v-btn color="primary" class="text-none" @click="editMode = !editMode">
                <v-icon left>{{ editMode ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
                {{ editMode ? 'Save Profile' : 'Edit Profile' }}
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <v-row>
             <v-col cols="12" md="4" class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                <span><strong>College ID:</strong> {{ user.collegeId }}</span>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                <span><strong>Year:</strong> {{ user.yearOfStudy }}</span>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-book-education</v-icon>
                <span><strong>Branch:</strong> {{ user.branch }}</span>
              </v-col>
          </v-row>
        </v-card>
        
        <!-- Mobile Navigation -->
        <v-card v-if="$vuetify.breakpoint.smAndDown" class="sticky-mobile-nav rounded-lg elevation-2 mb-6">
          <v-slide-group show-arrows>
            <v-slide-item v-for="section in sections" :key="section.id">
              <v-btn text @click="scrollToSection(section.id)" class="mx-1">
                <v-icon left>{{ section.icon }}</v-icon>
                {{ section.title }}
              </v-btn>
            </v-slide-item>
          </v-slide-group>
        </v-card>

        <!-- About Section -->
        <v-card id="about" class="pa-5 rounded-lg elevation-2 mb-6">
          <h2 class="text-h5 font-weight-bold mb-3 d-flex align-center"><v-icon color="primary" class="mr-3">mdi-information-outline</v-icon>About Me</h2>
          <v-divider class="mb-4"></v-divider>
          <p class="text-body-1">{{ profile.description }}</p>
        </v-card>

        <!-- Education Section -->
        <EducationSection id="education" :education="profile.education" class="elevation-2 rounded-lg mb-6" />
        
        <!-- Skills & Interests Section -->
        <SkillsSection id="skills" :skills="profile.skills" :interests="profile.interests" class="elevation-2 rounded-lg mb-6" />

        <!-- Achievements Section -->
        <AchievementsSection id="achievements" :achievements="profile.achievements" class="elevation-2 rounded-lg mb-6" />

        <!-- Projects & Internships Section -->
        <ProjectsSection id="projects" :projects="profile.projects" :internships="profile.internships" class="elevation-2 rounded-lg mb-6" />

        <!-- Co-curricular Section -->
        <CocurricularSection id="cocurricular" :activities="profile.cocurricular" class="elevation-2 rounded-lg mb-6" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EducationSection from '@/components/profile/EducationSection.vue';
import SkillsSection from '@/components/profile/SkillsSection.vue';
import AchievementsSection from '@/components/profile/AchievementsSection.vue';
import ProjectsSection from '@/components/profile/ProjectsSection.vue';
import CocurricularSection from '@/components/profile/CocurricularSection.vue';

export default {
  name: "StudentProfile",
  components: {
    EducationSection,
    SkillsSection,
    AchievementsSection,
    ProjectsSection,
    CocurricularSection,
  },
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  data() {
    return {
      editMode: false,
      activeSection: 0,
      sections: [
        { id: "personal-info", title: "Personal Info", icon: "mdi-account" },
        { id: "about", title: "About", icon: "mdi-information-outline" },
        { id: "education", title: "Education", icon: "mdi-school" },
        { id: "skills", title: "Skills", icon: "mdi-lightbulb-on-outline" },
        { id: "achievements", title: "Achievements", icon: "mdi-trophy-variant-outline" },
        { id: "projects", title: "Projects & Internships", icon: "mdi-briefcase-outline" },
        { id: "cocurricular", title: "Activities", icon: "mdi-basketball" },
      ],
      user: {
        id: "1",
        firstName: "Rahul",
        lastName: "Sharma",
        email: "rahul.sharma@college.edu",
        yearOfStudy: 3,
        branch: "Computer Science",
        collegeId: "CS2022001",
        linkedinUrl: "https://linkedin.com/in/rahulsharma",
        role: "student",
        avatarUrl: ""
      },
      profile: {
        description: "Passionate computer science student with a keen interest in AI and Machine Learning. Love building innovative solutions to real-world problems.",
        education: [ { id: "1", institution: "ABC University", degree: "Bachelor of Technology", field: "Computer Science", year: "2022-2026", startDate: "2022-08", endDate: "2026-06", current: true } ],
        skills: ["Python", "JavaScript", "Vue.js", "Node.js", "Machine Learning"],
        interests: ["Artificial Intelligence", "Web Development", "Open Source"],
        achievements: [{id: "1", title: "Hackathon Winner - Smart India Hackathon 2024"}, {id: "2", title: "Dean's List for Academic Excellence"}],
        projects: [{id: "1", title: "Alumni-Student Connect Platform", description: "A full-stack web application to bridge the gap between alumni and current students.", technologies: ["Vue.js", "Vuetify", "Node.js", "PostgreSQL"], url: "https://github.com"}],
        internships: [{id: "1", company: "Tech Solutions Inc.", role: "Summer Intern", description: "Worked on developing new features for their flagship product.", location: "Pune, India", startDate: "June 2024", endDate: "Aug 2024"}],
        cocurricular: [{id: "1", name: "Coordinator, College Tech Fest"}, {id:"2", name:"Member, AI Research Club"}],
      }
    };
  },
  computed: {
    profileCompletion() {
      const totalSections = 7;
      let filled = 0;
      if (this.profile.description) filled++;
      if (this.profile.education.length > 0) filled++;
      if (this.profile.skills.length > 0) filled++;
      if (this.profile.achievements.length > 0) filled++;
      if (this.profile.projects.length > 0) filled++;
      if (this.profile.internships.length > 0) filled++;
      if (this.profile.cocurricular.length > 0) filled++;
      return Math.round((filled / totalSections) * 100);
    }
  },
  methods: {
    scrollToSection(id) {
      // The 80px offset accounts for the main app bar and some breathing room.
      this.$vuetify.goTo(`#${id}`, {
        duration: 500,
        offset: 80, 
        easing: 'easeInOutCubic',
      });
    }
  }
};
</script>

<style scoped>
.sticky-sidebar {
  position: sticky;
  top: 80px; /* 64px for app-bar + 16px margin */
}
.sticky-mobile-nav {
  position: sticky;
  top: 70px; /* 64px for app-bar + a little space */
  z-index: 2;
}
</style>

