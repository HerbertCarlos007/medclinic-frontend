import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/LoginComponent.vue'
import PatientComponent from '../components/PatientComponent.vue'
import DoctorComponent from '../components/DoctorComponent.vue'
import UserComponent from '../components/UserComponent.vue'
import MedicalRecordComponent from '../components/MedicalRecordComponent.vue'
import ScheduleComponent from '../components/ScheduleComponent.vue'
import ClinicComponent from '../components/ClinicComponent.vue'
import AppointmentsComponent from '../components/AppointmentsComponent.vue'

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
        path: '/appointments',
        name: 'appointments',
        component: AppointmentsComponent
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

     {
        path: '/medical-record',
        name: 'medical',
        component: MedicalRecordComponent
    },

     {
        path: '/schedule',
        name: 'schedule',
        component: ScheduleComponent
    },

      {
        path: '/clinic',
        name: 'clinic',
        component: ClinicComponent
    },
    

]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router