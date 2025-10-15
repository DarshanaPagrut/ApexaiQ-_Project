<template>
  <v-container fluid>
    <!-- Search and View Controls -->
    <v-row class="align-center mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search students by name, branch, skills, or activities..."
          dense outlined
        />
      </v-col>

      <v-col cols="12" md="6" class="text-right">
        <v-btn-toggle v-model="view" borderless>
          <v-btn small value="card"><v-icon left>mdi-view-grid</v-icon> Card View</v-btn>
          <v-btn small value="table"><v-icon left>mdi-table</v-icon> Table View</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-3">
      <v-col cols="12" sm="6" md="3" v-for="(filter, key) in filters" :key="key">
        <v-select
          :items="filter.options"
          v-model="filter.selected"
          :label="filter.label"
          dense outlined clearable
        />
      </v-col>
    </v-row>

    <!-- Active Filters -->
    <v-row v-if="activeFilters.length" class="mb-4">
      <v-chip-group column>
        <v-chip
          v-for="(item, index) in activeFilters"
          :key="index"
          close
          color="blue lighten-4"
          @click:close="removeFilter(item)"
        >
          {{ item }}
        </v-chip>
      </v-chip-group>
    </v-row>

    <!-- Results Per Page Selector -->
    <v-row class="justify-end mb-2">
      <v-col cols="12" md="3" class="text-right">
        <v-select
          v-model="resultsPerPage"
          :items="[3, 6, 9, 12]"
          label="Results per page"
          dense outlined hide-details
        />
      </v-col>
    </v-row>

    <!-- Card View -->
    <v-row v-if="view === 'card'">
      <v-col cols="12" sm="6" md="4" v-for="(student, index) in paginatedStudents" :key="index">
        <v-card class="pa-4 elevation-3 rounded-xl hoverable">
          <v-avatar size="56" color="primary lighten-4" class="mb-3">
            <span class="white--text text-h6">{{ initials(student.name) }}</span>
          </v-avatar>

          <div class="font-weight-medium text-subtitle-1">{{ student.name }}</div>
          <div class="grey--text mb-2">{{ student.year }} | {{ student.branch }}</div>

          <div class="mb-2">
            <v-chip
              v-for="(skill, i) in student.skills"
              :key="i"
              small
              class="mr-1 mb-1"
              color="blue lighten-4"
            >
              {{ skill }}
            </v-chip>
          </div>

          <div class="grey--text text-body-2 mb-1">🎯 {{ student.interests.join(', ') }}</div>
          <div class="grey--text text-body-2 mb-3">🏅 {{ student.activities.join(', ') }}</div>

          <v-btn small color="primary" outlined class="mr-2">
            <v-icon left>mdi-account-plus</v-icon> Connect
          </v-btn>
          <v-btn small color="primary">
            <v-icon left>mdi-account-circle</v-icon> Profile
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="!paginatedStudents.length">
        <p class="text-center grey--text mt-6">No matches found. Try adjusting filters.</p>
      </v-col>
    </v-row>

    <!-- Table View -->
    <v-simple-table v-if="view === 'table'">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Year</th>
          <th>Branch</th>
          <th>Skills</th>
          <th>Interests</th>
          <th>Activities</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, index) in paginatedStudents" :key="index">
          <td>{{ s.name }}</td>
          <td>{{ s.year }}</td>
          <td>{{ s.branch }}</td>
          <td>{{ s.skills.join(', ') }}</td>
          <td>{{ s.interests.join(', ') }}</td>
          <td>{{ s.activities.join(', ') }}</td>
          <td>
            <v-btn icon small color="primary"><v-icon>mdi-account-plus</v-icon></v-btn>
            <v-btn icon small color="primary"><v-icon>mdi-account-circle</v-icon></v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Pagination -->
    <v-row justify="center" class="mt-4">
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        total-visible="5"
      ></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StudentSection',
  data() {
    return {
      search: '',
      view: 'card',
      resultsPerPage: 6,
      page: 1,
      filters: {
        year: { label: 'Year', options: ['1st Year', '2nd Year', '3rd Year', '4th Year'], selected: null },
        branch: { label: 'Branch', options: ['CSE', 'IT', 'ECE'], selected: null },
        skills: { label: 'Skills', options: ['Web Dev', 'AI', 'ML'], selected: null }
      },
      students: [
        {
          name: 'Darshana Pagrut',
          year: '3rd Year',
          branch: 'CSE',
          skills: ['Web Dev', 'AI'],
          interests: ['Research', 'Open Source'],
          activities: ['Hackathons', 'Mozilla Club']
        },
        {
          name: 'Aditi Sharma',
          year: '4th Year',
          branch: 'IT',
          skills: ['ML', 'Python'],
          interests: ['AI Research'],
          activities: ['Hackathons']
        },
        {
          name: 'Siddhesh Jadhav',
          year: '2nd Year',
          branch: 'CSE',
          skills: ['Web Dev'],
          interests: ['Open Source'],
          activities: ['Coding Club']
        },
        {
          name: 'Meera Patil',
          year: '3rd Year',
          branch: 'ECE',
          skills: ['AI', 'ML'],
          interests: ['Research'],
          activities: ['Tech Events']
        }
      ]
    }
  },
  computed: {
    activeFilters() {
      return Object.values(this.filters)
        .filter(f => f.selected)
        .map(f => f.selected)
    },
    filteredStudents() {
      let result = this.students.filter(s =>
        s.name.toLowerCase().includes(this.search.toLowerCase())
      )
      for (const key in this.filters) {
        const value = this.filters[key].selected
        if (value) {
          result = result.filter(s =>
            s[key] === value ||
            s.skills.includes(value) ||
            s.activities.includes(value)
          )
        }
      }
      return result
    },
    paginatedStudents() {
      const start = (this.page - 1) * this.resultsPerPage
      const end = start + this.resultsPerPage
      return this.filteredStudents.slice(start, end)
    },
    pageCount() {
      return Math.ceil(this.filteredStudents.length / this.resultsPerPage)
    }
  },
  methods: {
    removeFilter(item) {
      for (const key in this.filters) {
        if (this.filters[key].selected === item) this.filters[key].selected = null
      }
    },
    initials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  }
}
</script>
