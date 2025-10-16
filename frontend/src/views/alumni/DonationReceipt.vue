<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="rounded-lg elevation-3" max-width="600" width="100%">
      <div class="pa-2 gradient-top-border"></div>
      <v-card-title class="d-flex flex-column align-center text-center pa-6">
        <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
        <h2 class="text-h4 font-weight-bold">Donation Receipt</h2>
      </v-card-title>
      <v-card-text v-if="donation" class="pa-6">
        <v-row>
          <v-col cols="12" class="text-center mb-4">
              <p class="text-body-1">"Thank you for your contribution to AlumniLink!"</p>
          </v-col>
          <v-col cols="6" class="text-right pr-4 font-weight-bold grey--text text--darken-2">Donor Name:</v-col>
          <v-col cols="6" class="pl-4">{{ donation.name }}</v-col>

          <v-col cols="6" class="text-right pr-4 font-weight-bold grey--text text--darken-2">Campaign Name:</v-col>
          <v-col cols="6" class="pl-4">{{ donation.campaignName }}</v-col>
          
          <v-col cols="6" class="text-right pr-4 font-weight-bold grey--text text--darken-2">Donation Amount:</v-col>
          <v-col cols="6" class="pl-4 text-h6 primary--text font-weight-bold">₹{{ donation.amount.toLocaleString() }}</v-col>

          <v-col cols="6" class="text-right pr-4 font-weight-bold grey--text text--darken-2">Payment Method:</v-col>
          <v-col cols="6" class="pl-4">{{ donation.paymentMethod }}</v-col>

          <v-col cols="6" class="text-right pr-4 font-weight-bold grey--text text--darken-2">Transaction ID:</v-col>
          <v-col cols="6" class="pl-4">{{ donation.id }}</v-col>

          <v-col cols="6" class="text-right pr-4 font-weight-bold grey--text text--darken-2">Date & Time:</v-col>
          <v-col cols="6" class="pl-4">{{ new Date(donation.date).toLocaleString() }}</v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else class="text-center pa-8">
        <p>Loading receipt details...</p>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-btn text @click="$router.push('/alumni/donations')">Back to Donations</v-btn>
        <v-spacer></v-spacer>
        <v-btn dark class="font-weight-bold rounded-lg" style="background: linear-gradient(45deg, #00D4B4, #00FFAA);">
            <v-icon left>mdi-download</v-icon>
            Download PDF
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DonationReceipt',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('donations', ['getDonationById']),
    donation() {
      return this.getDonationById(this.id);
    }
  },
};
</script>

<style>
.gradient-top-border {
  border-top: 4px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(135deg, #0092FF, #00D4B4, #00FFAA);
}
</style>
