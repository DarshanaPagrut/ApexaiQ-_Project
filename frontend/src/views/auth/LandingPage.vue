<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar app flat color="white" class="elevation-2">
      <v-container class="d-flex align-center py-1">
        <v-toolbar-title class="d-flex align-center cursor-pointer" @click="$router.push('/')">
          <v-icon color="primary" large>mdi-school</v-icon>
          <span class="ml-2 font-weight-bold text-h5 primary--text">AlumniLink</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="hidden-sm-and-down">
          <v-btn text class="font-weight-bold" @click="scrollTo('features')">Features</v-btn>
          <v-btn text class="font-weight-bold" @click="scrollTo('about')">About</v-btn>
          <v-btn text class="font-weight-bold" @click="scrollTo('testimonials')">Testimonials</v-btn>
          <v-btn text class="font-weight-bold" @click="scrollTo('contact')">Contact</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" class="font-weight-bold mr-2" to="/login">Login</v-btn>
        <v-btn color="primary" class="font-weight-bold" to="/register">Register</v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-5">
      <!-- Hero Section -->
      <section class="hero-section text-center d-flex align-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8">
              <h1 class="text-h2 font-weight-bold white--text mb-4" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                Where College Bonds Build Careers
              </h1>
              <p class="text-h5 white--text font-weight-light mb-8" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                Connecting generations of excellence, one bond at a time.
              </p>
              <div>
                <v-btn x-large color="primary" class="ma-2 font-weight-bold" to="/register">
                  Get Started
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
                <v-btn x-large outlined color="white" class="ma-2 font-weight-bold" @click="scrollTo('features')">
                  Learn More
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-16">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h4 font-weight-bold mb-3">Why Join AlumniLink?</h2>
            <p class="text-h6 font-weight-light grey--text text--darken-2">
              Discover the power of your alumni network.
            </p>
          </div>
          <v-row>
            <v-col v-for="(feature, i) in features" :key="i" cols="12" sm="6" md="3">
              <v-card class="text-center pa-6 elevation-4 rounded-lg fill-height">
                <v-icon :color="feature.color" size="48" class="mb-4">{{ feature.icon }}</v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
                <p class="body-1 grey--text text--darken-1">{{ feature.description }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
      
      <!-- Testimonials -->
      <section id="testimonials" class="py-16 grey lighten-4">
        <v-container>
           <div class="text-center mb-12">
            <h2 class="text-h4 font-weight-bold mb-3">Success Stories</h2>
            <p class="text-h6 font-weight-light grey--text text--darken-2">
              Hear from our community members.
            </p>
          </div>
          <v-row>
            <v-col v-for="(t, i) in testimonials" :key="i" cols="12" md="4">
              <v-card class="pa-6 elevation-4 rounded-lg fill-height">
                <v-list-item>
                  <v-list-item-avatar size="60">
                    <v-img :src="t.image"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">{{ t.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ t.role }} - {{ t.year }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-card-text class="body-1 py-4">"{{ t.quote }}"</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- CTA Section -->
      <section id="contact" class="py-16 primary text-center white--text">
        <v-container>
          <h2 class="text-h4 font-weight-bold mb-4">Ready to Transform Your Future?</h2>
          <p class="text-h6 font-weight-light mb-8">
            Join thousands of students and alumni building meaningful connections.
          </p>
          <v-btn x-large color="white" class="primary--text font-weight-bold" to="/register">
            Get Started Today
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-container>
      </section>
    </v-main>

    <!-- Footer -->
    <v-footer class="blue-grey darken-4 white--text py-8">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-4">AlumniLink</h3>
            <p>Connecting generations of excellence, one bond at a time.</p>
          </v-col>
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-4">Quick Links</h3>
            <ul class="list-unstyled">
              <li><a href="#features" class="white--text text-decoration-none">Features</a></li>
              <li><a href="#about" class="white--text text-decoration-none">About</a></li>
              <li><a href="#testimonials" class="white--text text-decoration-none">Testimonials</a></li>
              <li><a href="#contact" class="white--text text-decoration-none">Contact</a></li>
            </ul>
          </v-col>
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-4">Connect With Us</h3>
            <v-btn icon class="white--text"><v-icon>mdi-facebook</v-icon></v-btn>
            <v-btn icon class="white--text"><v-icon>mdi-twitter</v-icon></v-btn>
            <v-btn icon class="white--text"><v-icon>mdi-linkedin</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <div class="text-center">&copy; {{ new Date().getFullYear() }} AlumniLink. All Rights Reserved.</div>
      </v-container>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  data() {
    return {
      features: [
        { icon: 'mdi-account-group-outline', title: 'Mentorship Programs', description: 'Connect with experienced alumni who can guide your career path.', color: 'primary' },
        { icon: 'mdi-briefcase-outline', title: 'Career Opportunities', description: 'Discover exclusive job postings, internships, and career advice.', color: 'accent' },
        { icon: 'mdi-calendar-multiselect', title: 'Exclusive Events', description: 'Join networking sessions, workshops, and reunions.', color: 'secondary' },
        { icon: 'mdi-lightbulb-on-outline', title: 'Knowledge Sharing', description: 'Stay updated with industry trends and insights from fellow alumni.', color: 'primary' }
      ],
      testimonials: [
        {
          name: 'Priya Sharma',
          role: 'Software Engineer at Google',
          year: 'Class of 2019',
          quote: 'AlumniLink connected me with mentors who transformed my career trajectory. I am forever grateful for the guidance I received.',
          image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
        },
        {
          name: 'Rahul Deshmukh',
          role: 'Product Manager at Microsoft',
          year: 'Class of 2017',
          quote: 'Being part of this community helped me stay connected with my roots and give back to the next generation of students.',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
        },
        {
          name: 'Ananya Kulkarni',
          role: 'Data Scientist at Amazon',
          year: 'Class of 2020',
          quote: 'The networking events organized through the platform opened doors for me that I never knew existed. Highly recommended!',
          image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200'
        }
      ]
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') no-repeat center center;
  background-size: cover;
  min-height: 80vh;
}
.list-unstyled {
  list-style: none;
  padding: 0;
}
</style>
