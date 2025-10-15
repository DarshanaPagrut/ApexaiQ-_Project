<template>
<v-card class="d-flex flex-column" elevation="2">
<v-img :src="event.banner || placeholder" height="160px" class="rounded-top"></v-img>


<v-card-title class="py-2 d-flex justify-space-between align-center">
<div>
<div class="font-weight-medium">{{ event.title }}</div>
<div class="text--secondary text-caption">{{ formattedDate }}</div>
</div>
<v-chip small outlined class="ml-2">{{ event.type }}</v-chip>
</v-card-title>


<v-card-text class="py-2">
<div class="text-truncate-2">{{ event.description }}</div>
<div class="mt-2 text-caption">Location: {{ event.location }}</div>
</v-card-text>


<v-card-actions class="mt-auto px-3 pb-3">
<v-btn text small @click="$emit('view', event)">View</v-btn>
<v-spacer></v-spacer>
<v-btn color="primary" small @click="$emit('rsvp', event)" v-if="canRsvp">RSVP</v-btn>
</v-card-actions>
</v-card>
</template>


<script>
export default {
name: 'EventCard',
props: { event: { type: Object, required: true }, role: { type: String, default: 'student' } },
computed: {
formattedDate(){
return new Date(this.event.date).toLocaleString()
},
placeholder(){ return 'https://via.placeholder.com/800x400?text=Event+Banner' },
canRsvp(){ return ['student','alumni'].includes(this.role) }
}
}
</script>