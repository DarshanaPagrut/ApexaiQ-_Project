<template>
  <v-dialog v-model="dialog" max-width="420px">
    <v-card>
      <v-card-title class="headline">Confirm RSVP</v-card-title>

      <v-card-text>
        You are about to register for <strong>{{ event.title }}</strong> on
        <strong>{{ date }}</strong>.
        <div class="mt-3 text-caption">
          Seats: {{ event.attendees.length }} / {{ event.capacity || "∞" }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Cancel</v-btn>
        <v-btn color="primary" @click="$emit('confirm', event)">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmRsvpModal",
  props: {
    open: Boolean,
    event: { type: Object, default: () => ({}) },
  },
  computed: {
    dialog: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("update:open", val);
      },
    },
    date() {
      return this.event && this.event.date
        ? new Date(this.event.date).toLocaleString()
        : "";
    },
  },
};
</script>
