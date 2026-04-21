import api from './api';

async function createPatient(patientData) {
    try {
        const response = await api.post('patient', patientData);
        return response.data;
    } catch (error) {
        console.error('Patient creation error:', error);
    }
}

export default {
    createPatient
}