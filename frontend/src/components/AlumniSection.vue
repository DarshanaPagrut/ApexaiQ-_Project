<template>
  <v-container fluid>
    <!-- Search and View Controls -->
    <v-row class="align-center mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search by name, company, role, or skill..."
          dense outlined
        />
      </v-col>

      <v-col cols="12" md="6" class="text-right">
        <v-btn-toggle v-model="view" borderless>
          <v-btn small value="card">
            <v-icon left>mdi-view-grid</v-icon> Card View
          </v-btn>
          <v-btn small value="table">
            <v-icon left>mdi-table</v-icon> Table View
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Filter Dropdowns -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3" v-for="(filter, key) in filters" :key="key">
        <v-select
          :items="filter.options"
          v-model="filter.selected"
          :label="filter.label"
          dense outlined clearable
        />
      </v-col>
    </v-row>

    <!-- Active Filter Chips -->
    <v-row v-if="activeFilters.length" class="mb-4">
      <v-chip-group column>
        <v-chip
          v-for="(item, index) in activeFilters"
          :key="index"
          close
          @click:close="removeFilter(item)"
          color="blue lighten-4"
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
      <v-col cols="12" sm="6" md="4" v-for="(alumni, index) in paginatedAlumni" :key="index">
        <v-card class="pa-4 elevation-3 rounded-xl hoverable">
          <v-avatar size="56" color="primary lighten-4" class="mb-3">
            <span class="white--text text-h6">{{ initials(alumni.name) }}</span>
          </v-avatar>

          <div class="font-weight-medium text-subtitle-1">{{ alumni.name }}</div>
          <div class="grey--text">{{ alumni.company }} | {{ alumni.industry }}</div>
          <div class="grey--text mb-2">{{ alumni.location }}</div>
          <div class="text-body-2 mb-2">
            🎓 {{ alumni.branch }} | Batch of {{ alumni.gradYear }}
          </div>

          <div class="mb-3">
            <v-chip
              v-for="(skill, i) in alumni.skills"
              :key="i"
              small
              class="mr-1 mb-1"
              color="blue lighten-4"
            >
              {{ skill }}
            </v-chip>
          </div>

          <v-btn small color="primary" class="mr-2" outlined>
            <v-icon left>mdi-account-plus</v-icon> Connect
          </v-btn>
          <v-btn small color="primary">
            <v-icon left>mdi-account-circle</v-icon> Profile
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="!paginatedAlumni.length">
        <p class="text-center grey--text mt-6">
          No matches found. Try adjusting filters.
        </p>
      </v-col>
    </v-row>

    <!-- Table View -->
    <v-simple-table v-if="view === 'table'">
      <thead>
        <tr>
          <th>Alumni Name</th>
          <th>Company</th>
          <th>Grad Year</th>
          <th>Branch</th>
          <th>Industry</th>
          <th>Location</th>
          <th>Skills</th>
          <th>Interests</th>
          <th>Career Path</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(a, index) in paginatedAlumni" :key="index">
          <td>{{ a.name }}</td>
          <td>{{ a.company }}</td>
          <td>{{ a.gradYear }}</td>
          <td>{{ a.branch }}</td>
          <td>{{ a.industry }}</td>
          <td>{{ a.location }}</td>
          <td>{{ a.skills.join(', ') }}</td>
          <td>{{ a.interests.join(', ') }}</td>
          <td>{{ a.careerPath }}</td>
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
  name: 'AlumniSection',
  data() {
    return {
      search: '',
      view: 'card',
      resultsPerPage: 6,
      page: 1,
      filters: {
        branch: { label: 'Branch', options: ['IT', 'CSE', 'ECE'], selected: null },
        gradYear: { label: 'Graduation Year', options: ['2021', '2022', '2023'], selected: null },
        industry: { label: 'Industry', options: ['Tech', 'Finance', 'Education'], selected: null },
        location: { label: 'Location', options: ['Pune', 'Mumbai', 'Delhi'], selected: null }
      },
      alumniList: [
        {
          name: 'Aditi Sharma',
          company: 'TCS',
          gradYear: '2021',
          branch: 'IT',
          industry: 'Tech',
          location: 'Pune',
          skills: ['Python', 'ML'],
          interests: ['AI', 'Cloud'],
          careerPath: 'Data Science'
        },
        {
          name: 'Rohan Mehta',
          company: 'Infosys',
          gradYear: '2022',
          branch: 'CSE',
          industry: 'Tech',
          location: 'Mumbai',
          skills: ['Java', 'Spring Boot'],
          interests: ['Backend', 'System Design'],
          careerPath: 'Software Engineer'
        },
        {
          name: 'Priya Deshmukh',
          company: 'Deloitte',
          gradYear: '2021',
          branch: 'ECE',
          industry: 'Finance',
          location: 'Pune',
          skills: ['Excel', 'Data Analysis'],
          interests: ['Consulting', 'Finance'],
          careerPath: 'Business Analyst'
        },
        {
          name: 'Vivek Patil',
          company: 'Accenture',
          gradYear: '2023',
          branch: 'IT',
          industry: 'Tech',
          location: 'Delhi',
          skills: ['Cloud', 'DevOps'],
          interests: ['Automation'],
          careerPath: 'Cloud Engineer'
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
    filteredAlumni() {
      let result = this.alumniList.filter(a =>
        a.name.toLowerCase().includes(this.search.toLowerCase())
      )
      for (const key in this.filters) {
        const value = this.filters[key].selected
        if (value) result = result.filter(a => a[key] === value)
      }
      return result
    },
    paginatedAlumni() {
      const start = (this.page - 1) * this.resultsPerPage
      const end = start + this.resultsPerPage
      return this.filteredAlumni.slice(start, end)
    },
    pageCount() {
      return Math.ceil(this.filteredAlumni.length / this.resultsPerPage)
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
