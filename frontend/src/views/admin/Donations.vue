<template>
  <v-container fluid>
    <h1 class="text-h4 font-weight-bold mb-4">Donations & Funding</h1>

    <!-- Stats Cards -->
    <v-row>
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card :color="stat.color" dark class="rounded-lg">
          <v-card-text class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="subtitle-1">{{ stat.title }}</div>
            </div>
            <v-icon size="48">{{ stat.icon }}</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
     <v-row class="my-6">
        <v-col>
            <v-btn color="primary" class="mr-4" @click="campaignDialog = true; editingCampaign = false; selectedCampaign = {}">
                <v-icon left>mdi-plus</v-icon>
                Create New Campaign
            </v-btn>
            <v-btn outlined color="warning">
                <v-icon left>mdi-bell-ring</v-icon>
                Approve Donations
            </v-btn>
        </v-col>
    </v-row>


    <!-- Manage Campaigns Table -->
    <v-card class="mt-6 rounded-lg">
      <v-card-title class="font-weight-bold">
        Manage Campaigns
      </v-card-title>
      <v-data-table :headers="campaignHeaders" :items="campaigns" class="elevation-1">
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.goal="{ item }">₹{{ item.goal.toLocaleString() }}</template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.raised="{ item }">
            ₹{{ item.raised.toLocaleString() }}
            <v-progress-linear :value="(item.raised / item.goal) * 100" color="success" height="6" rounded class="mt-1"></v-progress-linear>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.raised >= item.goal ? 'success' : 'primary'" small>
            {{ item.raised >= item.goal ? 'Closed' : 'Active' }}
          </v-chip>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editCampaign(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2">mdi-close-circle</v-icon>
          <v-icon small>mdi-eye</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Approve Donations Table -->
    <v-card class="mt-6 rounded-lg">
         <v-card-title class="font-weight-bold">
            View & Approve Donations
        </v-card-title>
        <v-data-table :headers="donationHeaders" :items="donations" class="elevation-1">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.amount="{ item }">₹{{ item.amount.toLocaleString() }}</template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.date="{ item }">{{ new Date(item.date).toLocaleDateString() }}</template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.status="{ item }">
                 <v-chip :color="getStatusColor(item.status)" small>{{ item.status }}</v-chip>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
                <v-btn v-if="item.status === 'Pending'" x-small color="success" class="mr-2" @click="approve(item.id)">Approve</v-btn>
                <v-btn v-if="item.status === 'Pending'" x-small color="error" @click="reject(item.id)">Reject</v-btn>
                <v-btn v-if="item.status === 'Completed'" x-small color="info" disabled>Completed</v-btn>
            </template>
        </v-data-table>
    </v-card>

     <!-- Create/Edit Campaign Modal -->
    <v-dialog v-model="campaignDialog" max-width="600px" persistent>
      <v-card class="rounded-lg">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{ editingCampaign ? 'Edit' : 'Create' }} Campaign</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="selectedCampaign.title" label="Campaign Name" outlined dense></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="selectedCampaign.description" label="Short Description" outlined dense rows="3"></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="selectedCampaign.goal" label="Goal Amount (₹)" type="number" outlined dense prepend-inner-icon="mdi-currency-inr"></v-text-field>
              </v-col>
               <v-col cols="12" sm="6">
                 <v-text-field label="Start Date" type="date" outlined dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-text-field label="End Date" type="date" outlined dense></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text @click="campaignDialog = false">Cancel</v-btn>
          <v-btn color="primary" class="font-weight-bold rounded-lg" @click="saveCampaign">Save Campaign</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AdminDonations',
  data() {
    return {
      campaignDialog: false,
      editingCampaign: false,
      selectedCampaign: {},
      campaignHeaders: [
        { text: 'Campaign Name', value: 'title' },
        { text: 'Goal Amount', value: 'goal' },
        { text: 'Raised Amount', value: 'raised' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      donationHeaders: [
        { text: 'Donor Name', value: 'name'},
        { text: 'Amount', value: 'amount' },
        { text: 'Campaign', value: 'campaignName'},
        { text: 'Payment Status', value: 'status'},
        { text: 'Date', value: 'date'},
        { text: 'Actions', value: 'actions', sortable: false}
      ]
    };
  },
  computed: {
    ...mapGetters('donations', { campaigns: 'allCampaigns', donations: 'allDonations'}),
    stats() {
        const totalDonations = this.donations.reduce((sum, d) => d.status === 'Completed' ? sum + d.amount : sum, 0);
        const activeCampaigns = this.campaigns.filter(c => c.raised < c.goal).length;
        const pendingContributions = this.donations.filter(d => d.status === 'Pending').length;
        return [
            { title: 'Total Donations', value: `₹${(totalDonations / 1000).toFixed(1)}k`, icon: 'mdi-cash-multiple', color: 'info' },
            { title: 'Active Campaigns', value: activeCampaigns, icon: 'mdi-bullhorn', color: 'primary' },
            { title: 'Pending Contributions', value: pendingContributions, icon: 'mdi-clock-alert-outline', color: 'warning' },
            { title: 'Allocated Funds', value: '₹1.2L', icon: 'mdi-check-decagram', color: 'success' },
        ]
    }
  },
  methods: {
      ...mapActions('donations', ['createCampaign', 'updateCampaign', 'approveDonation', 'rejectDonation']),
      editCampaign(campaign) {
          this.selectedCampaign = { ...campaign };
          this.editingCampaign = true;
          this.campaignDialog = true;
      },
      saveCampaign() {
          if (this.editingCampaign) {
              this.updateCampaign(this.selectedCampaign);
          } else {
              this.createCampaign(this.selectedCampaign);
          }
          this.campaignDialog = false;
      },
      getStatusColor(status){
          if(status === 'Completed') return 'success';
          if(status === 'Pending') return 'warning';
          if(status === 'Rejected') return 'error';
          return 'grey';
      },
      approve(id) {
          this.approveDonation(id);
      },
      reject(id) {
          this.rejectDonation(id);
      }
  }
};
</script>
