import axiosInstance from "../axiosapi/axiosInstance";

const API_URL = "/departements";

// Récupérer tous les départements
export const getDepartements = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des départements:", error);
    throw error;
  }
};

// Ajouter un département
export const addDepartement = async (departement) => {
  try {
    const response = await axiosInstance.post(API_URL, departement);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un département:", error);
    throw error;
  }
};

//ajout de enseigant a un departement
export const addEnseignant = async (enseignant, departementId) => {
  console.log(departementId);
  try {
    // Ajoutez le departementId directement dans l'URL
    const response = await axiosInstance.post(
      `${API_URL}/${departementId}/enseignants`,
      enseignant
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un enseignant:", error);
    // Ajoutez plus de logs pour comprendre l'erreur
    console.error("Error details:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

// Mettre à jour un département
export const updateDepartement = async (id, departement) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, departement);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du département ${id}:`, error);
    throw error;
  }
};

// Ajouter cette fonction aux exports existants
export const getDepartementById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du département ${id}:`,
      error
    );
    throw error;
  }
};

// Supprimer un département
export const deleteDepartement = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du département ${id}:`, error);
    throw error;
  }
};

// Récupérer les enseignants d'un département
export const getEnseignantsByDepartement = async (departementId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/${departementId}/enseignants`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des enseignants du département ${departementId}:`,
      error
    );
    throw error;
  }
};

export const removeEnseignantFromDepartement = async (
  enseignantId,
  departementId
) => {
  try {
console.log(
  'FROM SERVICE ----> le id de lenseignat : ' +
    enseignantId +
    '--le id de depatement : ' +
    departementId
);    const response = await axiosInstance.patch(
      `${API_URL}/${departementId}/enseignants/${enseignantId}/remove`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du département:', error);
    throw error;
  }
};

// Récupérer toutes les options d'un département
export const getOptionsByDepartement = async (departementId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/${departementId}/options`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des options du département ${departementId}:`,
      error
    );
    throw error;
  }
};
