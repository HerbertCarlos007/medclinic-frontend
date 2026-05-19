import api from "./api";

async function getAppointmentsByDoctor(doctorId, date) {
    try {
        const response = await api.get(`appointment/${doctorId}`, {
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

export default {
    getAppointmentsByDoctor,
    createAppointment
}
