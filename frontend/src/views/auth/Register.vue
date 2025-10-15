<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" no-gutters class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="mx-auto elevation-8 rounded-lg" max-width="500">
          <v-card-title class="justify-center pt-6 pb-1">
            <div class="text-center">
              <v-icon size="40" color="primary" class="mb-1">mdi-school</v-icon>
              <h1 class="primary--text text-h5 font-weight-bold">Join AlumniLink</h1>
            </div>
          </v-card-title>

          <v-card-text class="px-8 pb-8">
            <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
              <!-- Role Selection -->
              <v-select
                v-model="selectedRole"
                :items="roles"
                item-text="label"
                item-value="value"
                label="Select Role"
                outlined
                dense
                prepend-icon="mdi-account-group"
                class="mb-4"
                required
              />

              <!-- Dynamic Form Fields -->
              <div v-show="selectedRole">
                <!-- Name Row -->
                <v-row dense class="mb-3">
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.firstName"
                      :rules="nameRules"
                      label="First Name"
                      prepend-icon="mdi-account"
                      outlined
                      dense
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.lastName"
                      :rules="nameRules"
                      label="Last Name"
                      prepend-icon="mdi-account"
                      outlined
                      dense
                      required
                    />
                  </v-col>
                </v-row>

                <!-- Email -->
                <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  label="Email"
                  type="email"
                  prepend-icon="mdi-email"
                  outlined
                  dense
                  class="mb-3"
                  required
                />

                <!-- Password Row -->
                <v-row dense class="mb-3">
                  <v-col cols="6">
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
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.confirmPassword"
                      :rules="confirmPasswordRules"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      label="Confirm Password"
                      prepend-icon="mdi-lock-check"
                      :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showConfirmPassword = !showConfirmPassword"
                      outlined
                      dense
                      required
                    />
                  </v-col>
                </v-row>

                <!-- Alumni specific fields -->
                <template v-if="selectedRole === 'alumni'">
                  <v-select
                    v-model="form.graduationYear"
                    :items="alumniYears"
                    :rules="yearRules"
                    label="Graduation Year / Batch"
                    prepend-icon="mdi-calendar"
                    outlined
                    dense
                    class="mb-3"
                    required
                  />
                  <v-select
                    v-model="form.branch"
                    :items="branches"
                    :rules="branchRules"
                    label="Branch / Department"
                    prepend-icon="mdi-school"
                    outlined
                    dense
                    class="mb-3"
                    required
                  />
                </template>

                <!-- Student specific fields -->
                <template v-if="selectedRole === 'student'">
                  <v-select
                    v-model="form.yearOfStudy"
                    :items="studentYears"
                    :rules="yearRules"
                    label="Year of Study / Batch"
                    prepend-icon="mdi-calendar"
                    outlined
                    dense
                    class="mb-3"
                    required
                  />
                  <v-select
                    v-model="form.branch"
                    :items="branches"
                    :rules="branchRules"
                    label="Branch / Department"
                    prepend-icon="mdi-school"
                    outlined
                    dense
                    class="mb-3"
                    required
                  />
                  <v-text-field
                    v-model="form.collegeId"
                    label="College ID (optional)"
                    prepend-icon="mdi-card-account-details"
                    outlined
                    dense
                    class="mb-3"
                  />
                  <v-text-field
                    v-model="form.linkedinUrl"
                    label="LinkedIn Profile URL (optional)"
                    prepend-icon="mdi-linkedin"
                    outlined
                    dense
                    class="mb-3"
                  >
                    <template #append-outer>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-icon small color="grey" v-bind="attrs" v-on="on">mdi-information</v-icon>
                        </template>
                        <span>Connect LinkedIn to keep career info updated automatically</span>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                  
                </template>

                <!-- Submit Button -->
                <v-btn
                  :loading="loading"
                  :disabled="!valid"
                  type="submit"
                  color="primary"
                  block
                  large
                  class="mb-3 rounded-lg"
                >
                  Register
                </v-btn>

                <!-- LinkedIn Button -->
                <v-btn
                  v-if="selectedRole === 'alumni' || selectedRole === 'student'"
                  outlined
                  color="primary"
                  block
                  large
                  class="mb-4 rounded-lg"
                >
                  <v-icon left>mdi-linkedin</v-icon>
                  Register with LinkedIn
                </v-btn>

                <!-- Login Link -->
                <div class="text-center">
                  <span class="text-caption grey--text">Already have an account?</span>
                  <v-btn
                    text
                    small
                    color="primary"
                    @click="$router.push('/login')"
                    class="text-decoration-underline ml-1"
                  >
                    Login
                  </v-btn>
                </div>
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
  name: 'RegisterPage',
  data() {
  return {
    valid: false,
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    selectedRole: '',
    form: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      graduationYear: '',
      yearOfStudy: '',
      branch: '',
      linkedinUrl: '',
      collegeId: ''
    },
    roles: [
      { label: 'Alumni', value: 'alumni' },
      { label: 'Student', value: 'student' }
    ],
    alumniYears:[
      '1999',
      '2000',
      '2001',
      '2002',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
      '2023',
      '2024'
    ],
    studentYears:[
      '1st',
      '2nd',
      '3rd',
      'Final'
    ],
    branches: [
      'Computer Engineering',
      'Information Technology',
      'Electronics Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electronics and Telecommunication Engineering',
      'Aerospace Engineering',
      'Chemical Engineering',
      'Biomedical Engineering'
    ],
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length >= 2) || 'Name must be at least 2 characters'
    ],
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be at least 8 characters',
      v => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v) || 'Password must contain uppercase, lowercase and number'
    ],
    yearRules: [
      v => !!v || 'Year is required'
    ],
    branchRules: [
      v => !!v || 'Branch is required'
    ]
  }
},
  computed: {
    confirmPasswordRules() {
      return [
        v => !!v || 'Please confirm your password',
        v => v === this.form.password || 'Passwords do not match'
      ]
    }
  },
  methods: {
    async handleRegister() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const userData = {
            ...this.form,
            role: this.selectedRole
          }
          
          await this.$store.dispatch('login', userData)
          
          // Redirect based on role
          if (this.selectedRole === 'alumni') {
            this.$router.push('/alumni/dashboard')
          } else {
            this.$router.push('/student/dashboard')
          }
        } catch (error) {
          console.error('Registration failed:', error)
        } finally {
          this.loading = false
        }
      }
    }
  },
  watch: {
    selectedRole() {
      // Reset form when role changes
      Object.keys(this.form).forEach(key => {
        if (key !== 'email' && key !== 'fullName') {
          this.form[key] = ''
        }
      })
    }
  }
}
</script>
