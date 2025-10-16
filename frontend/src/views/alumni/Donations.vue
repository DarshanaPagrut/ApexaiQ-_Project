<template>
  <v-container fluid>
    <!-- Hero Banner -->
    <v-card class="mb-6 rounded-lg pa-8 white--text" style="background: linear-gradient(135deg, #0092FF, #00D4B4, #00FFAA);">
      <v-row align="center">
        <v-col cols="12" md="8">
          <h1 class="text-h4 font-weight-bold">Support your College & Alumni Network</h1>
          <p class="mt-2 body-1">Your contributions help us fund scholarships, improve infrastructure, and host memorable events.</p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right">
          <v-btn x-large dark class="elevation-4 primary-gradient-button font-weight-bold" @click="scrollToCampaigns">
            Donate Now
            <v-icon right>mdi-arrow-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Featured Campaign -->
    <v-card v-if="featuredCampaign" class="mb-8 rounded-lg" outlined>
        <v-row no-gutters>
            <v-col cols="12" md="6">
                <v-img :src="featuredCampaign.image" height="100%" class="rounded-l-lg"></v-img>
            </v-col>
            <v-col cols="12" md="6">
                <v-card-text class="pa-8">
                    <v-chip color="amber" text-color="black" small class="font-weight-bold mb-4">
                        <v-icon left small>mdi-star</v-icon>
                        Featured Campaign
                    </v-chip>
                    <h2 class="text-h4 font-weight-bold mb-2">{{ featuredCampaign.title }}</h2>
                    <p class="body-1 grey--text text--darken-2">{{ featuredCampaign.description }}</p>
                     <div class="d-flex justify-space-between mb-1">
                        <span class="font-weight-bold text-h5 primary--text">₹{{ featuredCampaign.raised.toLocaleString() }}</span>
                        <span class="grey--text text--darken-1 align-self-end"> raised of ₹{{ featuredCampaign.goal.toLocaleString() }}</span>
                    </div>
                    <v-progress-linear :value="(featuredCampaign.raised / featuredCampaign.goal) * 100" color="amber" height="14" rounded>
                        <strong class="black--text">{{ Math.ceil((featuredCampaign.raised / featuredCampaign.goal) * 100) }}%</strong>
                    </v-progress-linear>
                    <v-btn x-large dark class="font-weight-bold rounded-lg accent-gradient-button mt-6" @click="openDonationModal(featuredCampaign)">
                        <v-icon left>mdi-gift</v-icon>
                        Contribute Now
                    </v-btn>
                </v-card-text>
            </v-col>
        </v-row>
    </v-card>

    <!-- Impact Stats -->
    <div class="mb-12">
      <h2 class="text-h5 font-weight-bold mb-4 text-center">Our Collective Impact</h2>
       <v-row>
        <v-col v-for="stat in impactStats" :key="stat.label" cols="12" sm="4">
          <v-card class="text-center pa-6 rounded-lg" outlined>
            <v-icon large :color="stat.color" class="mb-2">{{ stat.icon }}</v-icon>
            <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
            <div class="body-1 grey--text text--darken-1">{{ stat.label }}</div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Donation Campaigns List -->
    <div ref="campaignsSection" class="mb-12">
      <h2 class="text-h5 font-weight-bold mb-4">All Campaigns</h2>
      <v-row>
        <v-col v-for="campaign in campaigns" :key="campaign.id" cols="12" md="4">
          <v-hover v-slot="{ hover }">
            <v-card :elevation="hover ? 12 : 4" class="rounded-lg d-flex flex-column fill-height campaign-card" :class="{ 'hover-effect': hover }">
              <v-img :src="campaign.image" height="200px" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
                <v-card-title class="font-weight-bold" v-text="campaign.title"></v-card-title>
              </v-img>

              <v-card-text class="flex-grow-1 pt-4">
                <p class="mb-4">{{ campaign.description }}</p>
                <div>
                  <div class="d-flex justify-space-between mb-1">
                    <span class="font-weight-bold text-h6 primary--text">₹{{ campaign.raised.toLocaleString() }}</span>
                    <span class="grey--text text--darken-1 align-self-end"> raised of ₹{{ campaign.goal.toLocaleString() }}</span>
                  </div>
                  <v-progress-linear :value="(campaign.raised / campaign.goal) * 100" color="success" height="12" rounded>
                     <template v-slot:default="{ value }">
                      <strong class="white--text">{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </div>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-btn block x-large dark class="font-weight-bold rounded-lg accent-gradient-button" @click="openDonationModal(campaign)">
                  <v-icon left>mdi-gift</v-icon>
                  Donate
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <!-- My Donation History -->
    <div class="mt-12">
      <h2 class="text-h5 font-weight-bold mb-4">My Donation History</h2>
      <v-card class="rounded-lg" outlined>
        <v-data-table
          :headers="historyHeaders"
          :items="userDonations"
          :items-per-page="5"
          class="elevation-0"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.amount="{ item }">
            <span class="font-weight-bold">₹{{ item.amount.toLocaleString() }}</span>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.date="{ item }">
            {{ new Date(item.date).toLocaleDateString() }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.actions="{ item }">
            <v-btn small outlined color="primary" @click="viewReceipt(item)">
              <v-icon left small>mdi-receipt</v-icon>
              View Receipt
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- New Section: Social Proof & Suggestions -->
    <v-row>
        <!-- Recent Donations -->
        <v-col cols="12" md="7">
            <h2 class="text-h5 font-weight-bold mb-4">Recent Donations</h2>
            <v-card class="rounded-lg pa-2" outlined>
                <v-list>
                    <v-list-item v-for="donation in recentDonations" :key="donation.id">
                        <v-list-item-avatar color="primary" class="white--text font-weight-bold">
                            {{ donation.avatar }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium">{{ donation.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                Donated to "{{ donation.campaign }}"
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <span class="font-weight-bold success--text text--darken-1">₹{{ donation.amount.toLocaleString() }}</span>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>
             <h2 class="text-h5 font-weight-bold mb-4 mt-8">Top Donors</h2>
             <v-card class="rounded-lg pa-2" outlined>
                <v-list>
                    <v-list-item v-for="(donor, index) in topDonors" :key="donor.id">
                         <v-list-item-icon class="mr-4">
                            <v-icon :color="getTrophyColor(index)">mdi-trophy</v-icon>
                        </v-list-item-icon>
                        <v-list-item-avatar color="secondary" class="white--text font-weight-bold">
                            {{ donor.avatar }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-medium">{{ donor.name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <span class="font-weight-bold primary--text">₹{{ donor.amount.toLocaleString() }}</span>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>
        

        <!-- Suggest a Campaign -->
        <v-col cols="12" md="5">
             <h2 class="text-h5 font-weight-bold mb-4">Have an Idea?</h2>
            <v-card class="rounded-lg pa-6 text-center" outlined>
                <v-icon large color="accent" class="mb-4">mdi-lightbulb-on-outline</v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">Suggest a Campaign</h3>
                <p class="body-1 grey--text text--darken-2">
                    Got a great idea for a fundraiser? Let us know and we might feature it!
                </p>
                <v-text-field v-model="suggestion.title" label="Campaign Idea" outlined dense></v-text-field>
                <v-textarea v-model="suggestion.details" label="A brief description" outlined dense rows="3"></v-textarea>
                <v-btn color="accent" dark class="font-weight-bold" @click="submitSuggestion">Submit Idea</v-btn>
            </v-card>
        </v-col>
    </v-row>

    <!-- FAQ Section -->
    <div class="mt-12">
        <h2 class="text-h5 font-weight-bold mb-4 text-center">Frequently Asked Questions</h2>
        <v-expansion-panels accordion flat>
            <v-expansion-panel v-for="faq in faqs" :key="faq.question">
                <v-expansion-panel-header class="font-weight-bold">{{ faq.question }}</v-expansion-panel-header>
                <v-expansion-panel-content class="body-1 grey--text text--darken-2">
                    {{ faq.answer }}
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>

    <!-- Donation Modal -->
    <v-dialog v-model="donationModal" max-width="500px" persistent transition="slide-y-transition">
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 font-weight-bold primary--text">
          Donate to "{{ selectedCampaign.title }}"
        </v-card-title>
        <v-card-text>
          <p>{{ selectedCampaign.description }}</p>
          <v-text-field v-model.number="donationAmount" label="Amount (₹)" type="number" outlined dense prepend-inner-icon="mdi-currency-inr" class="text-h6"></v-text-field>
          <div class="font-weight-medium mb-2">Payment Method</div>
           <v-btn-toggle v-model="paymentMethod" mandatory class="d-flex" color="primary">
              <v-btn value="card" class="flex-grow-1"><v-icon left>mdi-credit-card</v-icon> Card</v-btn>
              <v-btn value="upi" class="flex-grow-1"><v-icon left>mdi-arrow-up-bold-box-outline</v-icon> UPI</v-btn>
              <v-btn value="netbanking" class="flex-grow-1"><v-icon left>mdi-bank</v-icon> Netbanking</v-btn>
            </v-btn-toggle>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn text @click="donationModal = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" large class="font-weight-bold rounded-lg" @click="processDonation" :disabled="!donationAmount > 0">
            Confirm & Donate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="4000" color="success" top right transition="slide-y-transition">
      <v-icon left>mdi-check-circle</v-icon>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AlumniDonations',
  data() {
    return {
      donationModal: false,
      selectedCampaign: {},
      donationAmount: null,
      paymentMethod: 'card',
      snackbar: false,
      snackbarText: '',
      suggestion: {
        title: '',
        details: ''
      }
    };
  },
  computed: {
    ...mapState('donations', ['campaigns', 'recentDonations', 'topDonors', 'faqs', 'featuredCampaignId', 'impactStats']),
    ...mapState(['user']),
    featuredCampaign() {
        return this.campaigns.find(c => c.id === this.featuredCampaignId);
    }
  },
  methods: {
    ...mapActions('donations', ['makeDonation']),
    scrollToCampaigns() {
      this.$vuetify.goTo(this.$refs.campaignsSection, {
        duration: 500,
        offset: 20,
        easing: 'easeInOutCubic',
      });
    },
    openDonationModal(campaign) {
      this.selectedCampaign = campaign;
      this.donationAmount = null;
      this.paymentMethod = 'card';
      this.donationModal = true;
    },
    processDonation() {
      const donationData = {
        amount: Number(this.donationAmount),
        campaignId: this.selectedCampaign.id,
        campaignName: this.selectedCampaign.title,
        name: this.user ? this.user.name : 'Anonymous',
        paymentMethod: this.paymentMethod,
      };

      this.makeDonation(donationData).then((newDonation) => {
        this.donationModal = false;
        this.snackbarText = 'Thank you for your generous donation!';
        this.snackbar = true;
        this.$router.push({ name: 'DonationReceipt', params: { id: newDonation.id } });
      });
    },
    getTrophyColor(index) {
        if (index === 0) return 'amber';
        if (index === 1) return 'blue-grey lighten-2';
        if (index === 2) return 'brown lighten-1';
        return 'grey';
    },
    submitSuggestion() {
        if(this.suggestion.title && this.suggestion.details) {
            console.log('Suggestion Submitted:', this.suggestion);
            this.snackbarText = 'Thank you for your suggestion!';
            this.snackbar = true;
            this.suggestion.title = '';
            this.suggestion.details = '';
        }
    }
  },
};
</script>

<style>
.primary-gradient-button {
  background: linear-gradient(45deg, #0092FF, #0076cc);
}

.accent-gradient-button {
  background: linear-gradient(45deg, #00D4B4, #00FFAA);
}

.campaign-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.hover-effect {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23) !important;
}

</style>

