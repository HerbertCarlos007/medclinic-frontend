import api from "./api";

async function createMedicalRecord(data) {
  const response = await api.post(
    '/medical-record/complete',
    data
  );

  return response.data;
}


export default {
    createMedicalRecord
}
