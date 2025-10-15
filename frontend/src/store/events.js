// Vuex module to manage events + RSVPs (Vue 2)
export const events = {
namespaced: true,
state: () => ({
list: [], // all events
loading: false,
}),
getters: {
all: (s) => s.list,
upcoming: (s) => s.list.filter(e => new Date(e.date) >= new Date()),
byCategory: (s) => (cat) => (cat === 'all' ? s.list : s.list.filter(e => e.category === cat)),
},
mutations: {
setList(state, payload) { state.list = payload },
addEvent(state, ev) { state.list.unshift(ev) },
updateEvent(state, ev) { const idx = state.list.findIndex(x => x.id === ev.id); if(idx>-1) state.list.splice(idx,1,ev) },
removeEvent(state, id) { state.list = state.list.filter(e=>e.id!==id) },
setLoading(state, v){ state.loading = v }
},
actions: {
// NOTE: For now these simulate API calls. Replace with real API.
fetchAll({ commit }){
commit('setLoading', true)
// mock data
const sample = [
{ id: 'e1', title: 'Career Talk: Building Your Resume', date: '2025-10-20T15:00:00', category: 'workshop', type: 'Workshop', location: 'Auditorium', description: 'Learn resume tips.', capacity: 120, attendees: [], banner: '', visibility: ['student','alumni'] },
{ id: 'e2', title: 'Alumni Meetup & Networking', date: '2025-11-05T18:00:00', category: 'networking', type: 'Event', location: 'Lobby', description: 'Reconnect with batchmates.', capacity: 200, attendees: [], banner: '', visibility: ['alumni'] },
{ id: 'e3', title: 'Fundraiser for Library', date: '2025-12-01T10:00:00', category: 'campaign', type: 'Campaign', location: 'Online', description: 'Support library expansion.', capacity: 1000, attendees: [], banner: '', visibility: ['alumni','student'] }
]
return new Promise(res => setTimeout(()=>{ commit('setList', sample); commit('setLoading', false); res() }, 300))
},
rsvp({ commit, state }, { eventId, user }){
// simple RSVP logic: push user id into attendees
const ev = state.list.find(e=>e.id===eventId)
if(!ev) return Promise.reject(new Error('Event not found'))
if(ev.attendees.includes(user.id)) return Promise.reject(new Error('Already registered'))
if(ev.capacity && ev.attendees.length >= ev.capacity) return Promise.reject(new Error('Event full'))
const updated = { ...ev, attendees: [...ev.attendees, user.id] }
commit('updateEvent', updated)
return Promise.resolve(updated)
}
}
}