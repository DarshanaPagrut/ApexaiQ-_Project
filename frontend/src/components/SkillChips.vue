<template>
  <v-chip-group multiple>
    <v-chip
      v-for="(skill, index) in skills"
      :key="index"
      class="ma-2"
      color="#73C8D2"
      text-color="white"
    >
      {{ skill }}
    </v-chip>
  </v-chip-group>
</template>

<script>
export default {
  name: 'SkillChips',
  props: {
    skills: Array
  }
}
</script>
