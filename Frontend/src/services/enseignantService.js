import axiosInstance from '../axiosapi/axiosInstance';

const API_URL = '/enseignants';

export const getEnseignants = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error);
    throw error;
  }
};

// export const addEnseignant = async (enseignant, departementId) => {
//   console.log(departementId)
//    try {
//      // Ajoutez le departementId directement dans l'URL
//      const response = await axiosInstance.post(`${API_URL}?departementId=${departementId}`, enseignant);
//      return response.data;
//    } catch (error) {
//      console.error("Erreur lors de l'ajout d'un enseignant:", error);
//      // Ajoutez plus de logs pour comprendre l'erreur
//      console.error('Error details:', error.response?.data);
//      console.error('Error status:', error.response?.status);
//      throw error;
//    }
// };


export const updateEnseignant = async (id, enseignant) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, enseignant);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'enseignant ${id}:`,
      error
    );
    throw error;
  }
};

export const deleteEnseignant = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'enseignant ${id}:`,
      error
    );
    throw error;
  }
};

export const getEnseignantById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'enseignant ${id}:`,
      error
    );
    throw error;
  }
};
