const state = () => ({
  campaigns: [
    {
      id: 1,
      title: 'Scholarship Fund',
      description: 'Help deserving students pursue their dreams by contributing to our scholarship fund.',
      goal: 500000,
      raised: 250000,
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 2,
      title: 'New Library Books',
      description: 'Our library needs an upgrade. Your donation will help us purchase new books and resources for students.',
      goal: 300000,
      raised: 120000,
      image: 'https://images.pexels.com/photos/2078475/pexels-photo-2078475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 3,
      title: 'Annual Alumni Meet',
      description: 'Help us organize a memorable annual alumni meet to foster connections and relive old memories.',
      goal: 200000,
      raised: 150000,
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ],
  // This will represent the logged-in user's donation history for the demo
  userDonations: [
    { id: 'txn_1634386800000', transactionId: 'txn_1634386800000', name: 'Rohan Sharma', amount: 5000, campaign: 'Scholarship Fund', campaignId: 1, date: '2025-10-15T10:30:00Z', paymentMethod: 'UPI' },
    { id: 'txn_1634214000000', transactionId: 'txn_1634214000000', name: 'Rohan Sharma', amount: 2500, campaign: 'New Library Books', campaignId: 2, date: '2025-10-14T09:00:00Z', paymentMethod: 'Card' }
  ],
  recentDonations: [
    { id: 1, name: 'Rohan Sharma', amount: 5000, campaign: 'Scholarship Fund', avatar: 'RS' },
    { id: 2, name: 'Priya Mehta', amount: 2500, campaign: 'New Library Books', avatar: 'PM' },
    { id: 3, name: 'Anil Kumar', amount: 10000, campaign: 'Scholarship Fund', avatar: 'AK' },
    { id: 4, name: 'Sunita Patil', amount: 1000, campaign: 'Annual Alumni Meet', avatar: 'SP' }
  ],
  topDonors: [
    { id: 1, name: 'Vikram Singh', amount: 50000, avatar: 'VS' },
    { id: 2, name: 'Neha Gupta', amount: 25000, avatar: 'NG' },
    { id: 3, name: 'Amit Desai', amount: 15000, avatar: 'AD' }
  ],
  faqs: [
    { question: 'Are my donations tax-deductible?', answer: 'Yes, all donations made through the AlumniLink platform are eligible for tax deductions under section 80G of the Income Tax Act. A receipt will be generated for you.' },
    { question: 'How are the funds used?', answer: 'Funds are allocated directly to the campaigns you donate to. The college administration oversees the usage to ensure transparency and that the funds are used for their intended purpose, such as scholarships, infrastructure, or events.' },
    { question: 'Can I create my own campaign?', answer: 'Currently, only admins can create campaigns. However, you can suggest a campaign to the alumni association for consideration.' },
    { question: 'Who can I contact for more information?', answer: 'For any queries regarding donations, please reach out to the alumni office at donations@alumnilink.edu.' }
  ],
  featuredCampaignId: 1,
  impactStats: [
      { label: 'Scholarships Funded', value: '128', icon: 'mdi-school', color: 'primary' },
      { label: 'Students Supported', value: '300+', icon: 'mdi-account-group', color: 'success' },
      { label: 'Events Organized', value: '42', icon: 'mdi-calendar-star', color: 'amber' }
  ]
});

const mutations = {
  ADD_DONATION(state, donation) {
    state.userDonations.unshift(donation); // Add to the history
    const campaign = state.campaigns.find(c => c.id === donation.campaignId);
    if (campaign) {
      campaign.raised += donation.amount;
    }
  },
};

const actions = {
  makeDonation({ commit, rootState }, donationData) {
    const newDonation = {
      ...donationData,
      id: `txn_${Date.now()}`,
      transactionId: `txn_${Date.now()}`,
      name: rootState.user ? rootState.user.name : 'Anonymous',
      date: new Date().toISOString(),
    };
    commit('ADD_DONATION', newDonation);
    return Promise.resolve(newDonation);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

