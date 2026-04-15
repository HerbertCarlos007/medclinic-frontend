import api from "./api";

async function createUser(userData) {
    try {
        const response = await api.post('user', userData);
        return response.data;
    } catch (error) {
        console.error('User creation error:', error);
    }
}

async function getUsers(clinicId) {
    try {
        const response = await api.get(`user/clinic/${clinicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export default {
    createUser,
    getUsers
}
