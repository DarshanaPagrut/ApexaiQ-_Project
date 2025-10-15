<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Settings</h1>
        <v-card class="pa-6 rounded-lg elevation-2">
          <v-icon size="48" color="primary" class="mb-4">
            mdi-cog
          </v-icon>
          <h2 class="text-h5 mb-3">Hello, this is Settings!</h2>
          <p class="text-body-1 grey--text">
            Customize your account preferences, privacy settings, and notification options.
          </p>
          
          <v-divider class="my-4" />
          
          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                :input-value="$store.state.darkMode"
                @change="$store.commit('TOGGLE_DARK_MODE')"
                label="Dark Mode"
                color="primary"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'UserSettings'
}
</script>