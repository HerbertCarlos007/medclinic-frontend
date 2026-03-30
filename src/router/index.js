import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/LoginComponent.vue'
import PatientComponent from '../components/PatientComponent.vue'
import DoctorComponent from '../components/DoctorComponent.vue'
import UserComponent from '../components/UserComponent.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },

    {
        path: '/login',
        name: 'login',
        component: LoginComponent
    },

    {
        path: '/patient',
        name: 'patient',
        component: PatientComponent
    },

    {
        path: '/doctor',
        name: 'doctor',
        component: DoctorComponent
    },

      {
        path: '/user',
        name: 'user',
        component: UserComponent
    },


]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router