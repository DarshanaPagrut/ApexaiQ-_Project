import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

// Auth Components

import LoginPage from '../views/auth/Login.vue'
import RegisterPage from '../views/auth/Register.vue'

// Layout Components
import AdminLayout from '../layouts/AdminLayout.vue'
import AlumniLayout from '../layouts/AlumniLayout.vue'
import StudentLayout from '../layouts/StudentLayout.vue'

// Admin Views
import AdminDashboard from '../views/admin/Dashboard.vue'
import AlumniManagement from '../views/admin/AlumniManagement.vue'
import AdminDirectory from '../views/admin/Directory.vue'
import AdminEvents from '../views/admin/Events.vue'
import MentorshipManagement from '../views/admin/MentorshipManagement.vue'
import AdminAnalytics from '../views/admin/Analytics.vue'

// Alumni Views
import AlumniDashboard from '../views/alumni/Dashboard.vue'
import AlumniConnections from '../views/alumni/Connections.vue'
import AlumniEvents from '../views/alumni/Events.vue'
import AlumniMentorship from '../views/alumni/Mentorship.vue'
import AlumniMemories from '../views/alumni/Memories.vue'
import AlumniGroups from '../views/alumni/Groups.vue'

// Student Views
import StudentDashboard from '../views/student/Dashboard.vue'
import StudentDirectory from '../views/student/Directory.vue'
import StudentEvents from '../views/student/Events.vue'
import StudentMentorship from '../views/student/Mentorship.vue'

// Common Views
import ProfilePage from '../views/common/Profile.vue'
import UserSettings from '../views/common/Settings.vue'
import UserHelp from '../views/common/Help.vue'

import UserProfile from '@/views/UserProfile.vue'
import MessagePage from '@/views/MessagePage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
    
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'alumni-management',
        name: 'AlumniManagement',
        component: AlumniManagement
      },
      {
        path: 'directory',
        name: 'AdminDirectory',
        component: AdminDirectory
      },
      {
        path: 'events',
        name: 'AdminEvents',
        component: AdminEvents
      },
      {
        path: 'mentorship',
        name: 'MentorshipManagement',
        component: MentorshipManagement
      },
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: AdminAnalytics
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: ProfilePage
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: UserSettings
      },
      {
        path: 'help',
        name: 'AdminHelp',
        component: UserHelp
      }
    ]
  },
  // Alumni Routes
  {
    path: '/alumni',
    component: AlumniLayout,
    meta: { requiresAuth: true, role: 'alumni' },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'AlumniDashboard',
        component: AlumniDashboard
      },
      {
        path: 'connections',
        name: 'AlumniConnections',
        component: AlumniConnections
      },
      {
        path: 'events',
        name: 'AlumniEvents',
        component: AlumniEvents
      },
      {
        path: 'mentorship',
        name: 'AlumniMentorship',
        component: AlumniMentorship
      },
      {
        path: 'memories',
        name: 'AlumniMemories',
        component: AlumniMemories
      },
      {
        path: 'groups',
        name: 'AlumniGroups',
        component: AlumniGroups
      },
      {
        path: 'profile',
        name: 'AlumniProfile',
        component: ProfilePage
      },
      {
        path: 'settings',
        name: 'AlumniSettings',
        component: UserSettings
      },
      {
        path: 'help',
        name: 'AlumniHelp',
        component: UserHelp
      }
    ]
  },
  // Student Routes
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard
      },
      {
        path: 'directory',
        name: 'StudentDirectory',
        component: StudentDirectory
      },
      {
        path: 'events',
        name: 'StudentEvents',
        component: StudentEvents
      },
      {
        path: 'mentorship',
        name: 'StudentMentorship',
        component: StudentMentorship
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: ProfilePage
      },
      {
        path: 'settings',
        name: 'StudentSettings',
        component: UserSettings
      },
      {
        path: 'help',
        name: 'StudentHelp',
        component: UserHelp
      },
      
    ]
  },
  {
    path: '/profile/:userId',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/message/:userId',
    name: 'MessagePage',
    component: MessagePage,
    meta: { requiresAuth: true }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const userRole = store.getters.userRole

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') next('/admin/dashboard')
    else if (userRole === 'alumni') next('/alumni/dashboard')
    else if (userRole === 'student') next('/student/dashboard')
  } else if (to.meta.role && to.meta.role !== userRole) {
    // Redirect to appropriate dashboard if wrong role
    if (userRole === 'admin') next('/admin/dashboard')
    else if (userRole === 'alumni') next('/alumni/dashboard')
    else if (userRole === 'student') next('/student/dashboard')
  } else {
    next()
  }
})

export default router