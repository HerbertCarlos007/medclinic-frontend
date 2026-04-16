import api from "./api";

async function createDoctor(doctorData) {
    try {
        const response = await api.post('doctor', doctorData);
        return response.data;
    } catch (error) {
        console.error('Doctor creation error:', error);
    }
}

async function getDoctors(clinicId) {
    try {
        const response = await api.get(`doctor/clinic/${clinicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

export default {
    createDoctor, getDoctors
}
