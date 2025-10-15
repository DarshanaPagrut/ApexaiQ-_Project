<template>
  <v-container fluid class="pa-4">
    <!-- 🔍 Search + View Toggle -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search Alumni..."
        outlined dense
        hide-details
        class="mr-2"
      ></v-text-field>

      <v-btn-toggle v-model="view" mandatory class="ml-2">
        <v-btn value="card" small>
          <v-icon left small>mdi-view-grid</v-icon> Card
        </v-btn>
        <v-btn value="table" small>
          <v-icon left small>mdi-table</v-icon> Table
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <!-- 🎚 Filters -->
    <v-card flat class="pa-4 mb-4">
      <v-row dense>
        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.role"
            :items="roles"
            label="Role"
            outlined dense
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.branch"
            :items="branches"
            label="Branch"
            outlined dense
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.batch"
            :items="batches"
            label="Graduation Year"
            outlined dense
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.industry"
            :items="industries"
            label="Industry"
            outlined dense
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.location"
            :items="locations"
            label="Location"
            outlined dense
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.path"
            :items="paths"
            label="Career Path"
            outlined dense
          ></v-select>
        </v-col>
      </v-row>

      <!-- 🏷️ Active Filter Chips -->
      <v-row v-if="activeFilters.length" class="mt-3">
        <v-col cols="12">
          <div class="d-flex flex-wrap align-center">
            <v-chip
              v-for="(filter, index) in activeFilters"
              :key="index"
              close
              outlined
              color="primary"
              small
              class="ma-1"
              @click:close="removeFilter(filter.key)"
            >
              <v-icon left small>mdi-filter</v-icon>
              {{ filter.label }}: {{ filter.value }}
            </v-chip>
            <v-btn
              small
              text
              color="red darken-1"
              class="ml-2"
              @click="clearAllFilters"
            >
              <v-icon left small>mdi-close-circle</v-icon> Clear All
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- 📊 Results -->
    <v-slide-y-transition>
      <div v-if="filteredUsers.length > 0">
        <!-- Card View -->
        <v-row v-if="view === 'card'" dense>
          <v-col
            v-for="(user, index) in filteredUsers"
            :key="index"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card class="pa-3 elevation-2">
              <v-row no-gutters align="center">
                <v-avatar size="48" color="primary" class="mr-3">
                  <span class="white--text subtitle-2">
                    {{ user.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </v-avatar>
                <div>
                  <div class="subtitle-1 font-weight-bold">{{ user.name }}</div>
                  <div class="caption grey--text">{{ user.branch }} • {{ user.batch }}</div>
                </div>
              </v-row>

              <v-divider class="my-2"></v-divider>

              <div class="caption mb-1">
                <v-icon small class="mr-1">mdi-office-building</v-icon>
                {{ user.company }}
              </div>

              <div class="caption mb-1">
                <v-icon small class="mr-1">mdi-briefcase</v-icon>
                {{ user.industry }}
              </div>

              <div class="caption mb-2">
                <v-icon small class="mr-1">mdi-map-marker</v-icon>
                {{ user.location }}
              </div>

              <v-chip
                v-for="(skill, i) in user.skills.slice(0, 2)"
                :key="i"
                small
                class="ma-1"
                color="blue lighten-4"
              >
                {{ skill }}
              </v-chip>

              <v-card-actions>
                <v-btn outlined small color="primary" class="ma-1">
                  <v-icon left small>mdi-message</v-icon> Connect
                </v-btn>
                <v-btn outlined small color="primary" class="ma-1">
                  <v-icon left small>mdi-account</v-icon> Profile
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Table View -->
        <v-data-table
          v-else
          :headers="headers"
          :items="filteredUsers"
          class="elevation-2"
          dense
        >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.name="{ item }">
            <v-avatar size="36" color="blue lighten-3" class="mr-2">
              <span class="white--text subtitle-2">
                {{ item.name.split(' ').map(n => n[0]).join('') }}
              </span>
            </v-avatar>
            {{ item.name }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.skills="{ item }">
            <v-chip
              v-for="(skill, index) in item.skills.slice(0, 2)"
              :key="index"
              small
              class="ma-1"
            >
              {{ skill }}
            </v-chip>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:[`item.actions`]="{ item }">
    <v-btn
      small
      outlined
      color="primary"
      class="ma-1"
      @click="goToMessage(item.id)"
    >
      <v-icon left small>mdi-message</v-icon> Connect
    </v-btn>

    <v-btn
      small
      outlined
      color="primary"
      class="ma-1"
      @click="goToProfile(item.id)"
    >
      <v-icon left small>mdi-account</v-icon> Profile
    </v-btn>
  </template>
        </v-data-table>
      </div>

      <!-- ❌ No Data -->
      <v-alert
        v-else
        type="warning"
        border="left"
        colored-border
        class="mt-4"
      >
        No alumni found matching the selected filters.
      </v-alert>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: "DirectoryBase",
  props: {
    role: {
      type: String,
      default: "Alumni",
    },
  },
  data() {
    return {
      search: "",
      view: "card",
      filters: {
        role: "",
        branch: "",
        batch: "",
        industry: "",
        location: "",
        path: "",
      },
      roles: ["Admin", "Alumni", "Student", "Student + Alumni"],
      branches: ["IT", "CSE", "ENTC", "Mechanical", "Civil"],
      batches: ["2020", "2021", "2022", "2023", "2024", "2025"],
      industries: ["Tech", "Finance", "Health", "Education", "Other"],
      locations: ["Mumbai", "Pune", "Delhi", "Bangalore", "Remote"],
      paths: ["GATE", "Corporate", "Government", "Entrepreneur", "Postgraduation", "Army"],
      users: [
        {
          name: "Aditi Sharma",
          company: "TCS",
          batch: "2021",
          branch: "IT",
          skills: ["Python", "ML", "React"],
          role: "Alumni",
          industry: "Tech",
          location: "Pune",
          path: "Corporate",
        },
        {
          name: "Rohit Mehta",
          company: "Infosys",
          batch: "2022",
          branch: "CSE",
          skills: ["Java", "Spring Boot"],
          role: "Student + Alumni",
          industry: "Tech",
          location: "Bangalore",
          path: "Postgraduation",
        },
      ],
      headers: [
        { text: "Name", value: "name" },
        { text: "Company", value: "company" },
        { text: "Year", value: "batch" },
        { text: "Branch", value: "branch" },
        { text: "Industry", value: "industry" },
        { text: "Location", value: "location" },
        { text: "Skills", value: "skills" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((u) => {
        const matchSearch =
          this.search === "" ||
          u.name.toLowerCase().includes(this.search.toLowerCase()) ||
          u.company.toLowerCase().includes(this.search.toLowerCase());
        const matchFilters = Object.keys(this.filters).every((key) => {
          const val = this.filters[key];
          if (!val) return true;
          return String(u[key]).toLowerCase() === String(val).toLowerCase();
        });
        return matchSearch && matchFilters;
      });
    },
    activeFilters() {
      return Object.keys(this.filters)
        .filter((key) => this.filters[key])
        .map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: this.filters[key],
        }));
    },
  },
  methods: {
    removeFilter(key) {
      this.filters[key] = "";
    },
    clearAllFilters() {
      Object.keys(this.filters).forEach((key) => {
        this.filters[key] = "";
      });
    },
    goToMessage(userId) {
    // Navigate to message page for this user
    this.$router.push({ name: 'MessagePage', params: { userId } })
  },

  goToProfile(userId) {
    // Navigate to profile page for this user
    this.$router.push({ name: 'UserProfile', params: { userId } })
  },
  },
};
</script>
