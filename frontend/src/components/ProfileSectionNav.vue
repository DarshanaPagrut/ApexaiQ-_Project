<template>
    <v-card class="mt-4 pa-2 rounded-pill elevation-1">
        <v-slide-group show-arrows>
            <v-slide-item v-for="section in sections" :key="section.id">
                <v-btn class="mx-2 text-capitalize" rounded text @click="$emit('scroll-to', section.id)">
                    <v-icon left>{{ section.icon }}</v-icon>
                    {{ section.title }}
                </v-btn>
            </v-slide-item>
        </v-slide-group>
    </v-card>
</template>

<script>
export default {
    name: 'ProfileSectionNav',
    data: () => ({
        sections: [
            { id: 'description', title: 'About', icon: 'mdi-information-outline' },
            { id: 'education', title: 'Education', icon: 'mdi-school-outline' },
            { id: 'skills', title: 'Skills & Interests', icon: 'mdi-lightbulb-on-outline' },
            { id: 'achievements', title: 'Achievements', icon: 'mdi-trophy-outline' },
            { id: 'projects', title: 'Projects & Internships', icon: 'mdi-briefcase-outline' },
            { id: 'cocurricular', title: 'Co-curricular', icon: 'mdi-basketball' },
        ]
    })
}
</script>
