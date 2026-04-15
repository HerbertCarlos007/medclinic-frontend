import api from "./api";

async function login(loginData) {
    try {
        const response = await api.post('user/login', loginData)
        return response.data
  
    } catch (error) {
        console.error('Login error:', error)
    }
}

export default {
    login
}
