import axiosInstance from "../axiosapi/axiosInstance";

const StatistiquesService = {
  getCounts: async (id) => {
    try {
      const response = await axiosInstance.get(`/statistics/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },
  getEnseignantsParDepartement: async () => {
    try {
      const response = await axiosInstance.get(
        `departements/enseignants-par-departement`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },
  getDispensePourcent: async () => {
    try {
      const response = await axiosInstance.get(`enseignants/percentages`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },
};
export default StatistiquesService;
