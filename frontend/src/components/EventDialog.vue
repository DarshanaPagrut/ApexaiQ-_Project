<template>
  <v-dialog v-model="dialog" max-width="720px" persistent>
    <v-card>
      <v-img :src="event.banner || placeholder" height="200px"></v-img>

      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="headline">{{ event.title }}</div>
          <div class="text--secondary">{{ niceDate }}</div>
        </div>
        <v-chip small outlined>{{ event.type }}</v-chip>
      </v-card-title>

      <v-card-text>
        <div class="mb-3">{{ event.description }}</div>

        <v-row>
          <v-col cols="12" sm="6">
            Location: <strong>{{ event.location }}</strong>
          </v-col>
          <v-col cols="12" sm="6">
            Seats:
            <strong>{{ event.attendees.length }} / {{ event.capacity || '∞' }}</strong>
          </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <div v-if="event.attendees && event.attendees.length">
          <div class="subtitle-2 mb-2">Attendees</div>
          <v-avatar
            v-for="(a, i) in event.attendees.slice(0, 6)"
            :key="i"
            size="32"
            class="mr-2"
          >
            <img :src="avatarPlaceholder" />
          </v-avatar>
          <div class="text-caption mt-2">
            {{ event.attendees.length }} registered
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Close</v-btn>
        <v-btn color="primary" v-if="canRsvp" @click="$emit('confirm-rsvp', event)">Register</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EventDialog",
  props: {
    value: Boolean,
    event: { type: Object, default: () => ({}) },
    role: { type: String, default: "student" },
  },
  computed: {
    niceDate() {
      return this.event.date ? new Date(this.event.date).toLocaleString() : "";
    },
    placeholder() {
      return "https://via.placeholder.com/1200x400?text=Banner";
    },
    avatarPlaceholder() {
      return "https://via.placeholder.com/40";
    },
    canRsvp() {
      return ["student", "alumni"].includes(this.role);
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit("input", false);
      this.$emit("close");
    },
  },
};
</script>
