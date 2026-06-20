import api from "./api";

async function getAppointmentsByDoctor(doctorId, date) {
    try {
        const response = await api.get(`appointment/doctor/${doctorId}`, {
            params: {
                date: date
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

async function getAllAppointments(clinicId, date) {
    try {
        const response = await api.get(`appointment/clinic/${clinicId}`, {
            params: {
                date: date
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}


async function createAppointment(appointmentData) {
    try {
        const response = await api.post('appointment', appointmentData);
        return response.data;
    } catch (error) {
        console.error('Appointment creation error:', error);
    }
}

async function getDoctorTodayAppointments(clinicId) {
    try {
        const response = await api.get(`appointment/${clinicId}/today`);
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

async function getAppointmentById(appointmentId, clinicId) {
    try {
        const response = await api.get(`appointment/${appointmentId}/clinic/${clinicId}`);         
        return response.data;
    } catch (error) {
        console.error('Error fetching appointment:', error);
    }
}

export default {
    getAppointmentsByDoctor,
    createAppointment,
    getAllAppointments,
    getDoctorTodayAppointments,
    getAppointmentById
}
