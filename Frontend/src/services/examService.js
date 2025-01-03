import axiosInstance from "../axiosapi/axiosInstance";

const ExamService = {
  getExams: (sessionId, date, horaire) => {
    return axiosInstance
      .get(`/api/examens/${sessionId}/${date}/${horaire}`)
      .then((response) => response.data);
  },

  createExam: async (examData) => {
    try {
      const response = await axiosInstance.post("/api/examens", examData);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },

  updateExam: async (id, examData) => {
    try {
      const response = await axiosInstance.put(`/api/examens/${id}`, examData);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },

  deleteExam: async (id) => {
    try {
      await axiosInstance.delete(`/api/examens/${id}`);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },
};

export default ExamService;
