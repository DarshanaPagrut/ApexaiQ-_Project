<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!-- Page Header -->
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Events & Campaigns</h1>
            <div class="subtitle-2 grey--text">
              Manage and monitor all events, workshops, and campaigns
            </div>
          </div>
          <v-btn color="primary" dark class="elevation-2" @click="openCreate">
            <v-icon left>mdi-plus</v-icon>
            New Event
          </v-btn>
        </div>

        <!-- Main Card -->
        <v-card class="pa-6 rounded-lg elevation-3">
          <v-row>
            <!-- Event Table -->
            <v-col cols="12" md="8">
              <v-data-table
                :headers="headers"
                :items="events"
                item-key="id"
                dense
                class="rounded-lg elevation-1"
              ><!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.date="{ item }">
                  {{ new Date(item.date).toLocaleString() }}
                </template>
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.attendees="{ item }">
                  <v-chip small color="deep-purple lighten-5" text-color="deep-purple accent-4">
                    {{ item.attendees ? item.attendees.length : 0 }}
                  </v-chip>
                </template>
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.actions="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon small color="primary" v-on="on" @click="edit(item)">
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon small color="error" v-on="on" @click="del(item)">
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon small color="success" v-on="on" @click="view(item)">
                        <v-icon small>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>View</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>

            <!-- Analytics Section -->
            <v-col cols="12" md="4">
              <v-card class="pa-4 rounded-lg elevation-2">
                <div class="subtitle-1 font-weight-medium mb-4 text-center">
                  Event Analytics
                </div>

                <v-row>
                  <v-col cols="6">
                    <v-sheet class="pa-4 text-center rounded-lg elevation-1 grey lighten-4">
                      <v-icon color="indigo" large>mdi-calendar-multiselect</v-icon>
                      <div class="mt-2 caption text-uppercase grey--text">
                        Total Events
                      </div>
                      <div class="text-h6 font-weight-bold">{{ events.length }}</div>
                    </v-sheet>
                  </v-col>
                  <v-col cols="6">
                    <v-sheet class="pa-4 text-center rounded-lg elevation-1 grey lighten-4">
                      <v-icon color="green" large>mdi-calendar-clock</v-icon>
                      <div class="mt-2 caption text-uppercase grey--text">
                        Upcoming
                      </div>
                      <div class="text-h6 font-weight-bold">{{ upcomingEvents.length }}</div>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- Event Form Dialog -->
          <v-dialog v-model="formOpen" max-width="700px" persistent>
            <v-card class="rounded-lg">
              <v-card-title class="font-weight-bold text-h6">
                {{ editing ? 'Edit Event' : 'Create New Event' }}
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.title"
                      label="Event Title"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="form.type"
                      :items="['Workshop', 'Event', 'Campaign']"
                      label="Type"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="form.description"
                      label="Description"
                      rows="3"
                      outlined
                      dense
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.date"
                      label="Date & Time (ISO format)"
                      outlined
                      dense
                      placeholder="2025-10-20T15:00:00"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.location"
                      label="Location"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="form.capacity"
                      label="Capacity"
                      type="number"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="d-flex justify-end">
                <v-btn text @click="formOpen = false">Cancel</v-btn>
                <v-btn color="primary" dark @click="save">
                  <v-icon left>mdi-content-save</v-icon> Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AdminEvents",

  data() {
    return {
      formOpen: false,
      editing: false,
      form: {},
      headers: [
        { text: "Title", value: "title" },
        { text: "Date", value: "date" },
        { text: "Type", value: "type" },
        { text: "Attendees", value: "attendees" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  computed: {
    events() {
      return this.$store.getters["events/all"] || [];
    },
    upcomingEvents() {
      return this.$store.getters["events/upcoming"] || [];
    },
  },

  created() {
    this.$store.dispatch("events/fetchAll");
  },

  methods: {
    openCreate() {
      this.editing = false;
      this.form = {
        title: "",
        description: "",
        date: "",
        type: "Workshop",
        location: "",
        capacity: 100,
        attendees: [],
      };
      this.formOpen = true;
    },
    edit(item) {
      this.editing = true;
      this.form = Object.assign({}, item);
      this.formOpen = true;
    },
    save() {
      if (this.editing) {
        this.$store.commit("events/updateEvent", this.form);
      } else {
        this.form.id = "e" + Date.now();
        this.$store.commit("events/addEvent", this.form);
      }
      this.persistEvents();
      this.formOpen = false;
    },
    del(item) {
      this.$store.commit("events/removeEvent", item.id);
      this.persistEvents();
    },
    view(item) {
      this.$root.$emit("open-event", item);
    },
    persistEvents() {
      // Save to localStorage for permanence
      localStorage.setItem("events", JSON.stringify(this.events));
    },
  },
};
</script>
