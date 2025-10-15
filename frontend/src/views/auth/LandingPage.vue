<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <!-- 🌐 Navbar -->
    <v-app-bar app flat class="bg-white dark:bg-surface elevation-2">
      <v-container class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-school</v-icon>
          <span class="text-h6 font-weight-bold text-gradient">AlumniLink</span>
        </div>

        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text class="text-subtitle-2" @click="scrollTo('features')">Features</v-btn>
          <v-btn text class="text-subtitle-2" @click="scrollTo('about')">About</v-btn>
          <v-btn text class="text-subtitle-2" @click="scrollTo('testimonials')">Testimonials</v-btn>
          <v-btn text class="text-subtitle-2" @click="scrollTo('contact')">Contact</v-btn>

          <!-- 🌙 Theme Toggle -->
          <v-btn icon @click="toggleTheme" class="ml-2">
            <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>

          <!-- 🔐 Auth Buttons -->
          <v-btn outlined color="primary" class="ml-2">Login</v-btn>
          <v-btn class="ml-2 text-white bg-gradient">Sign Up</v-btn>
        </v-toolbar-items>
      </v-container>
    </v-app-bar>

    <!-- 🌈 Hero Section -->
    <section class="d-flex flex-column align-center justify-center text-center py-16 px-4 bg-gradient text-white">
      <v-container>
        <h1 class="display-2 font-weight-bold mb-4">
          Where College Bonds<br />Build Careers
        </h1>
        <p class="text-h6 font-italic mb-8">
          Connecting generations of excellence, one bond at a time.
        </p>

        <div class="d-flex flex-column flex-sm-row justify-center align-center">
          <v-btn large class="text-white bg-gradient mr-sm-4 mb-4">
            Apply Now to Start Your Transformation
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn large variant="outlined" color="white">Learn More</v-btn>
        </div>

        <v-row class="mt-12" justify="center">
          <v-col v-for="(stat, i) in stats" :key="i" cols="6" sm="3" class="text-center">
            <div class="text-h4 font-weight-bold">{{ stat.number }}</div>
            <div>{{ stat.label }}</div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 💡 Features -->
    <section id="features" class="py-12">
      <v-container>
        <div class="text-center mb-10">
          <h2 class="display-1 font-weight-bold text-primary mb-3">
            Why Join <span class="text-gradient">AlumniLink?</span>
          </h2>
          <p class="subtitle-1 text-grey-darken-1">
            Discover the transformative power of staying connected with your alma mater community.
          </p>
        </div>

        <v-row>
          <v-col
            v-for="(feature, i) in features"
            :key="i"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="pa-6 transition-smooth hover-scale-sm elevation-2">
              <v-icon :color="feature.color" size="36" class="mb-4">{{ feature.icon }}</v-icon>
              <h3 class="subtitle-1 font-weight-bold mb-2">{{ feature.title }}</h3>
              <p class="text-grey-darken-1">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 👩‍🎓 About -->
    <section id="about" class="py-12 bg-white dark:bg-surface">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h2 class="display-1 font-weight-bold text-primary mb-4">
              Transform Your Career with <span class="text-gradient">Alumni Power</span>
            </h2>
            <p class="subtitle-1 text-grey-darken-1 mb-6">
              AlumniLink bridges generations of talent — empowering students to learn from those who’ve walked the path before them and helping alumni give back while staying connected.
            </p>
            <v-row>
              <v-col cols="12" sm="4" class="d-flex align-center">
                <v-icon color="success" class="mr-2">mdi-trending-up</v-icon>
                Career Growth
              </v-col>
              <v-col cols="12" sm="4" class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                Strong Network
              </v-col>
              <v-col cols="12" sm="4" class="d-flex align-center">
                <v-icon color="error" class="mr-2">mdi-heart</v-icon>
                Give Back
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6">
            <v-img
              src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800"
              class="rounded-xl elevation-10"
              height="350"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 💬 Testimonials -->
    <section id="testimonials" class="py-12 bg-grey-lighten-5 dark:bg-grey-darken-4">
      <v-container>
        <div class="text-center mb-10">
          <h2 class="display-1 font-weight-bold text-primary mb-3">
            Success <span class="text-gradient">Stories</span>
          </h2>
          <p class="subtitle-1 text-grey-darken-1">
            Hear from our community members about their transformative experiences.
          </p>
        </div>

        <v-row>
          <v-col
            v-for="(t, i) in testimonials"
            :key="i"
            cols="12"
            md="4"
          >
            <v-card class="pa-6 elevation-2 transition-smooth hover-scale-sm">
              <div class="d-flex align-center mb-4">
                <v-avatar size="60" class="mr-3">
                  <v-img :src="t.image" />
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ t.name }}</div>
                  <div class="caption text-grey-darken-1">{{ t.role }}</div>
                  <div class="caption text-primary">{{ t.year }}</div>
                </div>
              </div>
              <p class="text-grey-darken-2">"{{ t.quote }}"</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 🚀 CTA Section -->
    <section id="contact" class="py-12 text-center text-white bg-gradient">
      <v-container>
        <h2 class="display-1 font-weight-bold mb-4">Ready to Transform Your Future?</h2>
        <p class="subtitle-1 mb-8">
          Join thousands of students and alumni building meaningful connections and advancing their careers.
        </p>
        <v-btn large class="text-white bg-gradient">
          Get Started Today
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-container>
    </section>

    <!-- ⚓ Footer -->
    <v-footer class="bg-primary text-white pa-10">
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2">mdi-school</v-icon>
              <span class="font-weight-bold text-h6">AlumniLink</span>
            </div>
            <p>Connecting generations of excellence, one bond at a time.</p>
          </v-col>
          <v-col cols="6" sm="3">
            <h4 class="subtitle-1 font-weight-bold mb-2">Quick Links</h4>
            <ul class="pl-0">
              <li><a class="text-white text-decoration-none opacity-80" href="#features">Features</a></li>
              <li><a class="text-white text-decoration-none opacity-80" href="#about">About Us</a></li>
              <li><a class="text-white text-decoration-none opacity-80" href="#testimonials">Testimonials</a></li>
              <li><a class="text-white text-decoration-none opacity-80" href="#contact">Contact</a></li>
            </ul>
          </v-col>
        </v-row>
        <v-divider class="my-6 opacity-30"></v-divider>
        <div class="text-center">&copy; 2025 AlumniLink. Where College Bonds Build Careers.</div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LandingPage',
  computed: {
    ...mapGetters('theme', ['isDark'])
  },
  methods: {
    ...mapActions('theme', ['toggleDark']),
    toggleTheme() {
      this.toggleDark()
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  },
  data() {
    return {
      stats: [
        { number: '5000+', label: 'Active Alumni' },
        { number: '1200+', label: 'Students Connected' },
        { number: '500+', label: 'Mentorship Matches' },
        { number: '150+', label: 'Events Hosted' }
      ],
      features: [
        { icon: 'mdi-network', title: 'Mentorship Programs', description: 'Connect with experienced alumni who guide your career path.', color: 'primary' },
        { icon: 'mdi-account-group', title: 'Alumni Network', description: 'Access a vibrant community of successful alumni.', color: 'secondary' },
        { icon: 'mdi-calendar', title: 'Exclusive Events', description: 'Join networking sessions, workshops, and career fairs.', color: 'accent' },
        { icon: 'mdi-briefcase', title: 'Career Opportunities', description: 'Discover jobs, internships, and career advice.', color: 'primary' }
      ],
      testimonials: [
        {
          name: 'Priya Sharma',
          role: 'Software Engineer at Google',
          year: 'Class of 2019',
          quote: 'AlumniLink connected me with mentors who transformed my career trajectory.',
          image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
        },
        {
          name: 'Rahul Deshmukh',
          role: 'Product Manager at Microsoft',
          year: 'Class of 2017',
          quote: 'Being part of this community helped me stay connected and give back.',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
        },
        {
          name: 'Ananya Kulkarni',
          role: 'Data Scientist at Amazon',
          year: 'Class of 2020',
          quote: 'The networking events opened doors I never knew existed.',
          image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200'
        }
      ]
    }
  }
}
</script>
