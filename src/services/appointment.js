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

export default {
    getAppointmentsByDoctor
}