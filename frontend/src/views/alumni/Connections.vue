<template>
  <v-container fluid class="pa-4 pa-md-6" style="background-color: #f7f9fb; min-height: 100%;">
    <!-- 1️⃣ Layout Header Area -->
    <v-row justify="center">
      <v-col cols="12">
        <div class="text-center mb-6">
          <h1 class="text-h4 font-weight-bold text--primary mb-2">
            Connect & Collaborate
          </h1>
          <p class="text-subtitle-1 grey--text text--darken-1">
            Find peers, explore career paths, and grow your professional network.
          </p>
          <v-text-field
            v-model="search"
            placeholder="Search by name, branch, company, or skill..."
            solo
            outlined
            flat
            prepend-inner-icon="mdi-magnify"
            hide-details
            class="mx-auto"
            style="max-width: 700px;"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>

    <!-- 2️⃣ Modern Toggle for Directories -->
    <v-row justify="center" class="mb-6">
      <v-col cols="auto">
        <v-btn-toggle
          v-model="activeDirectory"
          mandatory
          borderless
          rounded
          class="elevation-2"
        >
          <v-btn
            value="alumni"
            :class="{ 'gradient-active': activeDirectory === 'alumni' }"
            class="px-6 py-5 text-none"
          >
            <v-icon left>mdi-account-tie</v-icon>
            Alumni Directory
          </v-btn>
          <v-btn
            value="student"
            :class="{ 'gradient-active': activeDirectory === 'student' }"
            class="px-6 py-5 text-none"
          >
            <v-icon left>mdi-school</v-icon>
            Student Directory
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Directory Content -->
    <v-card class="pa-4 pa-md-6 rounded-lg elevation-2">
      <!-- 4️⃣ Filters Section -->
      <v-expansion-panels flat class="mb-4">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon left>mdi-filter-variant</v-icon>
              Filters
              <v-chip v-if="activeFiltersCount > 0" small color="primary" class="ml-2">
                {{ activeFiltersCount }} applied
              </v-chip>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row dense>
              <v-col cols="12" md="3" sm="6">
                <v-select v-model="filters.branch" :items="branches" label="Branch" outlined dense clearable></v-select>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <v-select v-model="filters.gradYear" :items="batches" :label="activeDirectory === 'alumni' ? 'Graduation Year' : 'Year of Study'" outlined dense clearable></v-select>
              </v-col>
               <v-col v-if="activeDirectory === 'alumni'" cols="12" md="3" sm="6">
                <v-select v-model="filters.industry" :items="industries" label="Industry" outlined dense clearable></v-select>
              </v-col>
              <v-col v-if="activeDirectory === 'alumni'" cols="12" md="3" sm="6">
                <v-select v-model="filters.location" :items="locations" label="Location" outlined dense clearable></v-select>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-combobox v-model="filters.skills" :items="skills" label="Skills" multiple small-chips deletable-chips outlined dense></v-combobox>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-combobox v-model="filters.interests" :items="interests" label="Interests" multiple small-chips deletable-chips outlined dense></v-combobox>
              </v-col>
               <v-col v-if="activeDirectory === 'alumni'" cols="12" md="4" sm="6">
                <v-select v-model="filters.careerPath" :items="paths" label="Career Path" outlined dense clearable></v-select>
              </v-col>
            </v-row>
             <v-row>
              <v-col class="d-flex justify-end">
                  <v-btn text color="error" @click="clearAllFilters">Clear All</v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <v-divider class="mb-4"></v-divider>

      <!-- 5️⃣ Enhanced Table -->
      <v-fade-transition mode="out-in">
        <div :key="activeDirectory">
          <v-data-table
            :headers="activeDirectory === 'alumni' ? alumniHeaders : studentHeaders"
            :items="filteredUsers"
            :search="search"
            class="elevation-1 striped-table"
            item-key="id"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar size="36" color="primary" class="white--text font-weight-bold mr-3">
                  {{ item.name.charAt(0) }}
                </v-avatar>
                <div class="font-weight-bold">{{ item.name }}</div>
              </div>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.skills="{ item }">
              <v-chip v-for="skill in item.skills.slice(0, 2)" :key="skill" small class="ma-1">{{ skill }}</v-chip>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
             <template v-slot:item.interests="{ item }">
              <v-chip v-for="interest in item.interests.slice(0, 2)" :key="interest" small class="ma-1">{{ interest }}</v-chip>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <v-btn small outlined color="primary" class="text-none mr-2" @click="goToProfile(item.id)">
                <v-icon left small>mdi-account</v-icon>
                Profile
              </v-btn>
              <v-btn small class="text-none" color="primary" style="background: linear-gradient(135deg, #00D4B4, #00FFAA);" dark @click="connect(item.id)">
                <v-icon left small>mdi-send</v-icon>
                Connect
              </v-btn>
            </template>
            
            <template v-slot:no-data>
              <div class="text-center py-8">
                <v-icon large color="grey lighten-1" class="mb-3">mdi-magnify-close</v-icon>
                <p>No results found — try adjusting your filters!</p>
              </div>
            </template>

          </v-data-table>
        </div>
      </v-fade-transition>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "AlumniConnections",
  data() {
    return {
      search: "",
      activeDirectory: 'alumni',
      filters: {
        branch: null,
        gradYear: null,
        skills: [],
        interests: [],
        careerPath: null,
        industry: null,
        location: null,
      },
      branches: ["IT", "CSE", "ENTC", "Mechanical", "Civil"],
      batches: ["2020", "2021", "2022", "2023", "2024", "2025", '1st Year', '2nd Year', '3rd Year', '4th Year'],
      skills: ["Python", "ML", "React", "Java", "Spring Boot", "Cloud", "DevOps", "Data Analysis", "Web Dev", "AI"],
      interests: ["AI", "Cloud", "Backend", "System Design", "Consulting", "Finance", "Automation", "Research", "Open Source"],
      paths: ["GATE", "Corporate", "Government", "Entrepreneur", "Postgraduation", "Army"],
      industries: ["Tech", "Finance", "Health", "Education", "Other"],
      locations: ["Mumbai", "Pune", "Delhi", "Bangalore", "Remote"],
      alumni: [
        { id: 1, name: "Aditi Sharma", email: "aditi@example.com", company: "TCS", gradYear: "2021", branch: "IT", skills: ["Python", "ML"], interests: ["AI", "Cloud"], careerPath: "Corporate", location: "Pune", industry: "Tech" },
        { id: 2, name: "Rohit Mehta", email: "rohit@example.com", company: "Infosys", gradYear: "2022", branch: "CSE", skills: ["Java", "Spring Boot"], interests: ["Backend", "System Design"], careerPath: "Corporate", location: "Bangalore", industry: "Tech" },
        { id: 3, name: "Priya Deshmukh", email: "priya@example.com", company: "Deloitte", gradYear: "2021", branch: "ENTC", skills: ["Excel", "Data Analysis"], interests: ["Consulting", "Finance"], careerPath: "Corporate", location: "Pune", industry: "Finance" },
        { id: 4, name: "Vivek Patil", email: "vivek@example.com", company: "Accenture", gradYear: "2023", branch: "IT", skills: ["Cloud", "DevOps"], interests: ["Automation"], careerPath: "Corporate", location: "Delhi", industry: "Tech" },
      ],
      students: [
        { id: 5, name: 'Darshana Pagrut', email: "darshana@example.com", year: '3rd Year', branch: 'CSE', skills: ['Web Dev', 'AI'], interests: ['Research', 'Open Source'], activities: ['Hackathons', 'Mozilla Club'] },
        { id: 6, name: 'Siddhesh Jadhav', email: "siddhesh@example.com", year: '2nd Year', branch: 'CSE', skills: ['Web Dev'], interests: ['Open Source'], activities: ['Coding Club'] },
        { id: 7, name: 'Meera Patil', email: "meera@example.com", year: '3rd Year', branch: 'ENTC', skills: ['AI', 'ML'], interests: ['Research'], activities: ['Tech Events'] }
      ],
      alumniHeaders: [
        { text: "Name", value: "name", width: '18%' },
        { text: "Company", value: "company" },
        { text: "Grad Year", value: "gradYear" },
        { text: "Branch", value: "branch" },
        { text: "Industry", value: "industry" },
        { text: "Skills", value: "skills" },
        { text: "Interests", value: "interests" },
        { text: "Career Path", value: "careerPath" },
        { text: "Actions", value: "actions", sortable: false, align: 'center', width: '210px'  },
      ],
      studentHeaders: [
        { text: "Name", value: "name", width: '25%' },
        { text: "Year", value: "year" },
        { text: "Branch", value: "branch" },
        { text: "Skills", value: "skills" },
        { text: "Interests", value: "interests" },
         { text: "Activities", value: "activities" },
        { text: "Actions", value: "actions", sortable: false, align: 'center', width: '210px' },
      ],
    };
  },
  computed: {
    activeUsers() {
      return this.activeDirectory === 'alumni' ? this.alumni : this.students;
    },
    activeFiltersCount() {
        let count = 0;
        if (this.filters.branch) count++;
        if (this.filters.gradYear) count++;
        if (this.filters.careerPath) count++;
        if (this.filters.industry) count++;
        if (this.filters.location) count++;
        count += this.filters.skills.length;
        count += this.filters.interests.length;
        return count;
    },
    filteredUsers() {
      return this.activeUsers.filter(user => {
        const searchLower = this.search.toLowerCase();
        
        const matchesSearch = !this.search ||
          user.name.toLowerCase().includes(searchLower) ||
          (user.company && user.company.toLowerCase().includes(searchLower)) ||
          user.branch.toLowerCase().includes(searchLower) ||
          user.skills.some(skill => skill.toLowerCase().includes(searchLower));

        const yearField = this.activeDirectory === 'alumni' ? 'gradYear' : 'year';
        const matchesBranch = !this.filters.branch || user.branch === this.filters.branch;
        const matchesYear = !this.filters.gradYear || user[yearField] === this.filters.gradYear;
        const matchesSkills = this.filters.skills.length === 0 || this.filters.skills.every(skill => user.skills.includes(skill));
        const matchesInterests = this.filters.interests.length === 0 || this.filters.interests.every(interest => user.interests.includes(interest));
        const matchesCareerPath = !this.filters.careerPath || user.careerPath === this.filters.careerPath;
        const matchesIndustry = !this.filters.industry || user.industry === this.filters.industry;
        const matchesLocation = !this.filters.location || user.location === this.filters.location;

        if (this.activeDirectory === 'alumni') {
          return matchesSearch && matchesBranch && matchesYear && matchesSkills && matchesInterests && matchesCareerPath && matchesIndustry && matchesLocation;
        }
        
        return matchesSearch && matchesBranch && matchesYear && matchesSkills && matchesInterests;
      });
    },
  },
  methods: {
    clearAllFilters() {
      this.filters = {
        branch: null,
        gradYear: null,
        skills: [],
        interests: [],
        careerPath: null,
        industry: null,
        location: null,
      };
    },
    goToProfile(userId) {
      this.$router.push({ name: 'UserProfile', params: { userId } });
    },
    connect(userId) {
      console.log(`Connecting with user ${userId}`);
      // Implement connection logic, e.g., navigate to chat
      this.$router.push({ name: 'MessagePage', params: { userId } });
    },
  },
};
</script>

<style scoped>
.gradient-active {
  background: linear-gradient(135deg, #0092FF, #00D4B4);
  color: white !important;
}

.v-btn-toggle .v-btn:not(.v-btn--active) {
  background-color: white;
}

.striped-table ::v-deep tbody tr:nth-of-type(odd) {
  background-color: #f7f9fb;
}

.striped-table ::v-deep tbody tr:hover {
  background-color: #e8f0fe; /* A light blue for hover */
}

.striped-table ::v-deep .v-data-table-header th {
  background-color: #f1f3f5;
  font-weight: bold;
  color: #333;
}

.striped-table ::v-deep td {
  border-bottom: 1px solid #e0e0e0;
}
</style>

