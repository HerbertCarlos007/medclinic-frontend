import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/LoginComponent.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },

    {
        path: '/login',
        name: 'login',
        component: LoginComponent
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router