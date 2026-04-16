import api from "./api";

async function getSpecialities(clinidId) {
    try {
        const response = await api.get(`specialty/clinic/${clinidId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching specialties:', error);
    }
}

export default {
    getSpecialities
}