import api from './api';

async function createPatient(patientData) {
    try {
        const response = await api.post('patient', patientData);
        return response.data;
    } catch (error) {
        console.error('Patient creation error:', error);
    }
}

async function getPatients(clinicId) {
    try {
        const response = await api.get(`patient/clinic/${clinicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

export default {
    createPatient,
    getPatients
}
