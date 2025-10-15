<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" app dense height="70" class="elevation-2">
      <v-container fluid class="d-flex align-center">
        <v-toolbar-title class="white--text font-weight-bold text-h5">
          <v-icon left color="white">mdi-account-circle</v-icon>
          My Profile
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn color="accent" dark class="text-none mr-4" @click="syncLinkedIn">
          <v-icon left>mdi-linkedin</v-icon>
          Sync LinkedIn
        </v-btn>

        <v-btn outlined color="white" class="text-none" @click="toggleEditMode">
          <v-icon left>{{ editMode ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          {{ editMode ? 'Save Profile' : 'Edit Profile' }}
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer app permanent width="250" color="grey lighten-5" class="elevation-1">
      <v-list dense class="py-4">
        <template v-for="section in sections">
          <v-list-item
            :key="section.id"
            :value="section.id"
            :class="{'primary--text': activeSection === section.id}"
            class="mx-2 mb-1 rounded-lg"
            @click="scrollToSection(section.id)"
          >
            <v-list-item-icon>
              <v-icon :color="activeSection === section.id ? 'primary' : 'grey'">{{ section.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ section.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <v-divider></v-divider>

      <div class="pa-4">
        <v-card color="primary" flat class="pa-4 rounded-lg text-center">
          <v-progress-circular
            :value="profileCompletion"
            size="80"
            width="8"
            color="accent"
          >
            <span class="white--text font-weight-bold text-h6">{{ profileCompletion }}%</span>
          </v-progress-circular>
          <p class="white--text mt-2 mb-0">Profile Complete</p>
        </v-card>
      </div>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-content>
      <v-container fluid class="pa-8">

        <!-- Personal Info -->
        <div id="personal-info" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <div class="d-flex align-start mb-6">
                <v-avatar size="120" color="primary" class="mr-6">
                  <v-img v-if="user.avatarUrl" :src="user.avatarUrl"></v-img>
                  <span v-else class="white--text text-h3">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
                </v-avatar>

                <div class="flex-grow-1">
                  <h2 class="text-h3 font-weight-bold mb-2">{{ user.firstName }} {{ user.lastName }}</h2>
                  <p class="text-h6 grey--text text--darken-1 mb-2">{{ user.role === 'student' ? 'Student' : 'Alumni' }}</p>

                  <v-chip color="success" small class="mr-2 white--text">
                    <v-icon left small>mdi-check-circle</v-icon>
                    Verified
                  </v-chip>

                  <v-chip color="info" small class="white--text">
                    <v-icon left small>mdi-email</v-icon>
                    {{ user.email }}
                  </v-chip>
                </div>
              </div>

              <v-divider class="my-6"></v-divider>

              <v-row>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center py-2">
                    <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                    <span class="text-body-1"><strong>College ID:</strong> {{ user.collegeId }}</span>
                  </div>
                </v-col>

                <v-col cols="12" md="6" v-if="user.yearOfStudy">
                  <div class="d-flex align-center py-2">
                    <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                    <span class="text-body-1"><strong>Year:</strong> {{ user.yearOfStudy }}</span>
                  </div>
                </v-col>

                <v-col cols="12" md="6" v-if="user.branch">
                  <div class="d-flex align-center py-2">
                    <v-icon color="primary" class="mr-2">mdi-book-education</v-icon>
                    <span class="text-body-1"><strong>Branch:</strong> {{ user.branch }}</span>
                  </div>
                </v-col>

                <v-col cols="12" md="6" v-if="user.linkedinUrl">
                  <div class="d-flex align-center py-2">
                    <v-icon color="primary" class="mr-2">mdi-linkedin</v-icon>
                    <a :href="user.linkedinUrl" target="_blank" class="primary--text">LinkedIn Profile</a>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- About -->
        <div id="about" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <h3 class="text-h4 font-weight-bold mb-4 d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
                About
              </h3>

              <v-textarea
                v-if="editMode"
                v-model="profile.description"
                outlined
                color="primary"
                rows="4"
              ></v-textarea>

              <p v-else class="text-body-1 mb-0">
                {{ profile.description || 'No description added yet.' }}
              </p>
            </v-card-text>
          </v-card>
        </div>

        <!-- Education -->
        <div id="education" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h4 font-weight-bold d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                  Education
                </h3>
                <v-btn v-if="editMode" color="primary" small icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-timeline dense align-top>
                <v-timeline-item
                  v-for="edu in profile.education"
                  :key="edu.id"
                  color="primary"
                  small
                >
                  <v-card class="elevation-1 mb-4">
                    <v-card-text>
                      <h4 class="text-h6 font-weight-bold">{{ edu.degree }}</h4>
                      <p class="text-body-1 mb-1">{{ edu.institution }}</p>
                      <p class="text-body-2 grey--text text--darken-1">
                        {{ edu.field }} • {{ edu.startDate }} - {{ edu.current ? 'Present' : edu.endDate }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </div>

        <!-- Skills -->
        <div id="skills" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <h3 class="text-h4 font-weight-bold mb-4 d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-lightbulb</v-icon>
                Skills & Interests
              </h3>

              <h4 class="text-h6 font-weight-bold mb-3">Skills</h4>
              <div class="mb-6">
                <template v-if="profile.skills.length">
                  <v-chip
                    v-for="skill in profile.skills"
                    :key="skill"
                    color="primary"
                    class="mr-2 mb-2 white--text"
                    :close="editMode"
                  >
                    {{ skill }}
                  </v-chip>
                </template>
                <v-chip v-else outlined>No skills added</v-chip>
              </div>

              <h4 class="text-h6 font-weight-bold mb-3">Interests</h4>
              <div>
                <template v-if="profile.interests.length">
                  <v-chip
                    v-for="interest in profile.interests"
                    :key="interest"
                    color="secondary"
                    class="mr-2 mb-2 white--text"
                    :close="editMode"
                  >
                    {{ interest }}
                  </v-chip>
                </template>
                <v-chip v-else outlined>No interests added</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Achievements -->
        <div id="achievements" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h4 font-weight-bold d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-trophy</v-icon>
                  Achievements
                </h3>
                <v-btn v-if="editMode" color="primary" small icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-row>
                <v-col v-for="achievement in profile.achievements" :key="achievement.id" cols="12" md="6">
                  <v-card color="success lighten-4" class="h-100 elevation-1">
                    <v-card-text>
                      <div class="d-flex align-start">
                        <v-icon color="success" class="mr-3">mdi-medal</v-icon>
                        <div>
                          <h4 class="text-h6 font-weight-bold mb-1">{{ achievement.title }}</h4>
                          <p class="text-body-2 mb-2">{{ achievement.description }}</p>
                          <p class="text-caption grey--text text--darken-1">{{ achievement.date }}</p>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Projects -->
        <div id="projects" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h4 font-weight-bold d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
                  Projects
                </h3>
                <v-btn v-if="editMode" color="primary" small icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-row>
                <v-col v-for="project in profile.projects" :key="project.id" cols="12" md="6">
                  <v-card outlined class="h-100">
                    <v-card-text>
                      <h4 class="text-h6 font-weight-bold mb-2">{{ project.title }}</h4>
                      <p class="text-body-2 mb-3">{{ project.description }}</p>
                      <div class="mb-2">
                        <v-chip
                          v-for="tech in project.technologies"
                          :key="tech"
                          small
                          class="mr-1 mb-1"
                          color="primary lighten-5"
                        >
                          {{ tech }}
                        </v-chip>
                      </div>
                      <a v-if="project.url" :href="project.url" target="_blank" class="primary--text">
                        <v-icon small>mdi-link</v-icon> View Project
                      </a>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Internships -->
        <div id="internships" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h4 font-weight-bold d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-briefcase</v-icon>
                  Internships
                </h3>
                <v-btn v-if="editMode" color="primary" small icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-timeline dense align-top>
                <v-timeline-item
                  v-for="internship in profile.internships"
                  :key="internship.id"
                  color="secondary"
                  small
                >
                  <v-card color="secondary lighten-5" class="mb-4 elevation-1">
                    <v-card-text>
                      <h4 class="text-h6 font-weight-bold">{{ internship.role }}</h4>
                      <p class="text-body-1 mb-1">{{ internship.company }}</p>
                      <p class="text-body-2 mb-2">{{ internship.description }}</p>
                      <p class="text-caption grey--text text--darken-1">
                        {{ internship.location }} • {{ internship.startDate }} - {{ internship.endDate }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </div>

        <!-- Activities -->
        <div id="activities" class="mb-8">
          <v-card class="rounded-xl elevation-3">
            <v-card-text class="pa-8">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h4 font-weight-bold d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-run</v-icon>
                  Co-curricular Activities
                </h3>
                <v-btn v-if="editMode" color="primary" small icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-row>
                <v-col v-for="activity in profile.activities" :key="activity.id" cols="12" md="4">
                  <v-card outlined class="h-100">
                    <v-card-text>
                      <v-icon color="accent" class="mb-2">mdi-star</v-icon>
                      <h4 class="text-h6 font-weight-bold mb-1">{{ activity.title }}</h4>
                      <p class="text-body-2 mb-2">{{ activity.description }}</p>
                      <p class="text-caption grey--text text--darken-1">
                        {{ activity.organization }} • {{ activity.date }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "ProfilePage",
  data() {
    return {
      editMode: false,
      activeSection: "personal-info",
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
        profileComplete: true,
        avatarUrl: ""
      },
      profile: {
        description:
          "Passionate computer science student with a keen interest in AI and Machine Learning. Love building innovative solutions to real-world problems.",
        education: [
          {
            id: "1",
            institution: "ABC University",
            degree: "Bachelor of Technology",
            field: "Computer Science",
            startDate: "2022-08",
            endDate: "2026-06",
            current: true
          }
        ],
        skills: ["Python", "JavaScript", "React", "Node.js", "Machine Learning", "Data Analysis"],
        interests: ["Artificial Intelligence", "Web Development", "Open Source", "Photography"],
        achievements: [
          {
            id: "1",
            title: "Hackathon Winner",
            description: "First place at National Tech Hackathon 2024",
            date: "2024-03"
          },
          {
            id: "2",
            title: "Research Paper Published",
            description: "Published paper on ML applications in IEEE conference",
            date: "2024-01"
          }
        ],
        projects: [
          {
            id: "1",
            title: "AI Chatbot Platform",
            description: "Built an intelligent chatbot using NLP and transformer models",
            technologies: ["Python", "TensorFlow", "Flask"],
            startDate: "2024-01",
            url: "https://github.com/user/project"
          }
        ],
        internships: [
          {
            id: "1",
            company: "Tech Corp",
            role: "Software Engineering Intern",
            description: "Developed full-stack features for main product",
            startDate: "2023-06",
            endDate: "2023-08",
            location: "Bangalore, India"
          }
        ],
        activities: [
          {
            id: "1",
            title: "Coding Club Leader",
            organization: "University Coding Club",
            description: "Led weekly coding sessions for 100+ students",
            date: "2023-09"
          }
        ]
      },
      sections: [
        { id: "personal-info", title: "Personal Info", icon: "mdi-account" },
        { id: "about", title: "About", icon: "mdi-information-outline" },
        { id: "education", title: "Education", icon: "mdi-school" },
        { id: "skills", title: "Skills", icon: "mdi-lightbulb" },
        { id: "achievements", title: "Achievements", icon: "mdi-trophy" },
        { id: "projects", title: "Projects", icon: "mdi-code-braces" },
        { id: "internships", title: "Internships", icon: "mdi-briefcase" },
        { id: "activities", title: "Activities", icon: "mdi-run" }
      ]
    };
  },
  computed: {
    profileCompletion() {
      const totalSections = 7;
      let filled = 0;
      if (this.profile.description) filled++;
      if (this.profile.education.length) filled++;
      if (this.profile.skills.length) filled++;
      if (this.profile.achievements.length) filled++;
      if (this.profile.projects.length) filled++;
      if (this.profile.internships.length) filled++;
      if (this.profile.activities.length) filled++;
      return Math.round((filled / totalSections) * 100);
    }
  },
  methods: {
    scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        this.activeSection = id;
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    syncLinkedIn() {
      alert("LinkedIn sync feature coming soon!");
    }
  }
};
</script>
