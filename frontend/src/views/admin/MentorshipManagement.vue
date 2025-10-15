<template>
  <v-container fluid>
    <!-- Top Toolbar -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" md="6">
        <h2>Mentorship Management</h2>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search Mentor/Mentee..."
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab key="active">Active Mentorships</v-tab>
      <v-tab key="pending">Pending Requests</v-tab>
      <v-tab key="completed">Completed</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- Active Mentorships -->
      <v-tab-item key="active">
        <v-row class="mt-4" dense>
          <v-col
            v-for="mentorship in filteredActiveMentorships"
            :key="mentorship.id"
            cols="12" sm="6" md="4"
          >
            <v-card class="pa-3" elevation="2">
              <v-card-title>
                {{ mentorship.mentee }}
                <v-spacer></v-spacer>
                <v-btn icon small @click="openScheduleDialog(mentorship)">
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-subtitle>
                Mentor: {{ mentorship.mentor }}
              </v-card-subtitle>
              <v-card-text>
                <v-progress-linear
                  :value="mentorship.progress"
                  height="8"
                  color="green"
                  rounded
                  class="mb-2"
                ></v-progress-linear>
                <div class="text-caption">
                  Next Session: {{ mentorship.nextSession }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn small color="primary" @click="reassignMentor(mentorship)">Reassign Mentor</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>

      <!-- Pending Requests -->
      <v-tab-item key="pending">
        <v-row class="mt-4" dense>
          <v-col
            v-for="request in filteredPendingRequests"
            :key="request.id"
            cols="12" sm="6" md="4"
          >
            <v-card class="pa-3" elevation="2">
              <v-card-title>{{ request.mentee }}</v-card-title>
              <v-card-subtitle>
                {{ request.branch }} - Year {{ request.year }}
              </v-card-subtitle>
              <v-card-text>
                "{{ request.message }}"
              </v-card-text>
              <v-card-actions>
                <v-btn color="success" small @click="approveRequest(request)">Approve</v-btn>
                <v-btn color="error" small @click="declineRequest(request)">Decline</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>

      <!-- Completed Mentorships -->
      <v-tab-item key="completed">
        <v-row class="mt-4" dense>
          <v-col
            v-for="mentorship in filteredCompletedMentorships"
            :key="mentorship.id"
            cols="12" sm="6" md="4"
          >
            <v-card class="pa-3" elevation="2">
              <v-card-title>{{ mentorship.mentee }}</v-card-title>
              <v-card-subtitle>
                Mentor: {{ mentorship.mentor }}
              </v-card-subtitle>
              <v-card-text>
                Progress: {{ mentorship.progress }}%
              </v-card-text>
              <v-card-actions>
                <v-btn small color="primary" @click="viewFeedback(mentorship)">View Feedback</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>

    <!-- Schedule / Update Meeting Dialog -->
    <v-dialog v-model="scheduleDialog" max-width="500px">
      <v-card>
        <v-card-title>Schedule Mentorship Meeting</v-card-title>
        <v-card-text>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="selectedDate"
                label="Select Date & Time"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="selectedDate" @input="menu = false"></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="scheduleDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="saveSchedule">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "MentorshipManagement",
  data() {
    return {
      tab: 0,
      search: "",
      scheduleDialog: false,
      selectedMentorship: null,
      selectedDate: null,
      menu: false,
      // Dummy Data
      activeMentorships: [
        { id: 1, mentee: "Alice Johnson", mentor: "Prof. Smith", progress: 50, nextSession: "2025-10-12" },
        { id: 2, mentee: "Bob Lee", mentor: "Dr. Kumar", progress: 70, nextSession: "2025-10-15" },
      ],
      pendingRequests: [
        { id: 1, mentee: "Charlie Brown", branch: "CSE", year: 3, message: "Looking for guidance on career path." },
        { id: 2, mentee: "Diana Prince", branch: "ECE", year: 2, message: "Need mentor for internship prep." },
      ],
      completedMentorships: [
        { id: 1, mentee: "Eve Adams", mentor: "Dr. Sharma", progress: 100 },
      ],
    };
  },
  computed: {
    filteredActiveMentorships() {
      return this.activeMentorships.filter(m =>
        m.mentee.toLowerCase().includes(this.search.toLowerCase()) ||
        m.mentor.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    filteredPendingRequests() {
      return this.pendingRequests.filter(r =>
        r.mentee.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    filteredCompletedMentorships() {
      return this.completedMentorships.filter(m =>
        m.mentee.toLowerCase().includes(this.search.toLowerCase()) ||
        m.mentor.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    approveRequest(request) {
      const newMentorship = {
        id: Date.now(),
        mentee: request.mentee,
        mentor: "Unassigned",
        progress: 0,
        nextSession: "TBD",
      };
      this.activeMentorships.push(newMentorship);
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
      this.$toast && this.$toast.success("Request Approved");
    },
    declineRequest(request) {
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
      this.$toast && this.$toast.error("Request Declined");
    },
    reassignMentor(mentorship) {
      const newMentor = prompt("Enter new mentor name:", mentorship.mentor);
      if (newMentor) mentorship.mentor = newMentor;
    },
    openScheduleDialog(mentorship) {
      this.selectedMentorship = mentorship;
      this.selectedDate = mentorship.nextSession;
      this.scheduleDialog = true;
    },
    saveSchedule() {
      if (this.selectedMentorship) this.selectedMentorship.nextSession = this.selectedDate;
      this.scheduleDialog = false;
    },
    viewFeedback(mentorship) {
      alert(`Feedback for ${mentorship.mentee} by ${mentorship.mentor}`);
    },
  },
};
</script>

<style scoped>
h2 {
  font-weight: 600;
}
</style>
