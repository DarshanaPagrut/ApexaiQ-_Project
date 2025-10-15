<template>
<div>
<v-row class="px-3 py-2" align="center">
<v-text-field v-model="search" dense solo hide-details prepend-inner-icon="mdi-magnify" placeholder="Search events" class="flex-grow-1"></v-text-field>


<v-select v-model="category" :items="categories" dense hide-details class="ml-3" style="max-width:180px"></v-select>


<v-btn-toggle v-model="viewMode" class="ml-3" dense>
<v-btn value="grid">Grid</v-btn>
<v-btn value="list">List</v-btn>
</v-btn-toggle>
</v-row>


<v-row class="px-3" v-if="viewMode==='grid'">
<v-col v-for="ev in filtered" :key="ev.id" cols="12" sm="6" md="4">
<event-card :event="ev" :role="role" @view="openDetails" @rsvp="startRsvp"></event-card>
</v-col>
</v-row>


<v-list two-line v-else>
<v-list-item v-for="ev in filtered" :key="ev.id" @click="openDetails(ev)" class="cursor-pointer">
<v-list-item-content>
<v-list-item-title>{{ ev.title }}</v-list-item-title>
<v-list-item-subtitle>{{ new Date(ev.date).toLocaleString() }} — {{ ev.location }}</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-action>
<v-btn text small @click.stop="$emit('rsvp', ev)">RSVP</v-btn>
</v-list-item-action>
</v-list-item>
</v-list>


<event-dialog :value="dialog" :event="selected" :role="role" @close="dialog=false" @confirm-rsvp="startRsvp"></event-dialog>
<confirm-rsvp-modal :open="confirmOpen" :event="selected" @cancel="confirmOpen=false" @confirm="doRsvp"></confirm-rsvp-modal>
</div>
</template>


<script>
import EventCard from './EventCard.vue'
import EventDialog from './EventDialog.vue'
import ConfirmRsvpModal from './ConfirmRsvpModal.vue'
import { mapGetters } from 'vuex'


export default {
name: 'EventList',
components: { EventCard, EventDialog, ConfirmRsvpModal },
props: { role: { type: String, default: 'student' } },
data(){ return { search: '', category: 'all', categories: ['all','workshop','campaign','networking'], viewMode: 'grid', dialog: false, selected: null, confirmOpen: false } },
computed: { ...mapGetters('events', ['all','upcoming','byCategory']), filtered(){
const q = this.search.toLowerCase()
const list = this.byCategory(this.category)
return list.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
}
},
methods: {
openDetails(ev){ this.selected = ev; this.dialog = true },
startRsvp(ev){ this.selected = ev; this.confirmOpen = true },
doRsvp(ev){
// dispatch rsvp action
this.$store.dispatch('events/rsvp', { eventId: ev.id, user: this.$store.state.auth.user })
.then(()=>{ this.$root.$emit('notify', { type: 'success', text: 'Registered successfully' }); this.confirmOpen=false; this.dialog=false })
.catch(err=> this.$root.$emit('notify', { type: 'error', text: err.message }))
}
}
}
</script>