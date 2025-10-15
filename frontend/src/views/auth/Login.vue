<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" no-gutters class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card 
          class="mx-auto elevation-8 rounded-lg" 
          max-width="400"
        >
          <v-card-title class="justify-center pt-8 pb-4">
            <div class="text-center">
              <v-icon size="48" color="primary" class="mb-4">
                mdi-school
              </v-icon>
              <h1 class="primary--text text-h4 font-weight-bold">
                AlumniLink
              </h1>
              <p class="grey--text text-body-2 mt-2">
                Connecting graduates, building futures
              </p>
            </div>
          </v-card-title>
          
          <v-card-text class="px-8 pb-8">
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
                outlined
                dense
                class="mb-4"
                required
              />
              
              <v-text-field
                v-model="form.password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                outlined
                dense
                class="mb-4"
                required
              />
              
              <v-checkbox
                v-model="form.rememberMe"
                label="Remember me"
                dense
                class="mt-0"
              />
              
              <v-btn
                :loading="loading"
                :disabled="!valid"
                type="submit"
                color="primary"
                block
                large
                class="mb-4 rounded-lg"
              >
                Login
              </v-btn>
              
              <div class="text-center">
                <v-btn
                  text
                  small
                  color="primary"
                  class="text-decoration-underline mb-2"
                >
                  Forgot Password?
                </v-btn>
                <br>
                <span class="text-caption grey--text">
                  Don't have an account?
                </span>
                <v-btn
                  text
                  small
                  color="primary"
                  @click="$router.push('/register')"
                  class="text-decoration-underline ml-1"
                >
                  Register here
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters'
      ]
    }
  },
  methods: {
    async handleLogin() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          // Simulate login - determine role based on email domain or hardcoded for demo
          let role = 'student' // default
          if (this.form.email.includes('admin')) role = 'admin'
          else if (this.form.email.includes('alumni')) role = 'alumni'
          
          const userData = {
            email: this.form.email,
            role: role,
            name: this.form.email.split('@')[0]
          }
          
          await this.$store.dispatch('login', userData)
          
          // Redirect based on role
          if (role === 'admin') {
            this.$router.push('/admin/dashboard')
          } else if (role === 'alumni') {
            this.$router.push('/alumni/dashboard')
          } else {
            this.$router.push('/student/dashboard')
          }
        } catch (error) {
          console.error('Login failed:', error)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>