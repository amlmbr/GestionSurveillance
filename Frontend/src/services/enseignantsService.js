import axiosInstance from '../axiosapi/axiosInstance';

const API_URL = '/enseignants';

// Fonction pour récupérer tous les enseignants
export const getEnseignants = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Retourne les données des enseignants
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error);
    throw error; // Relance l'erreur pour la gérer plus tard
  }
};

export const removeFromDepartment = async (enseignantId) => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/${enseignantId}/removeDepartment`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du département:', error);
    throw error;
  }
};

// Fonction pour ajouter un enseignant
export const addEnseignant = async (enseignant) => {
  try {
    const response = await axiosInstance.post(API_URL, enseignant);
    return response.data; // Retourne les données de l'enseignant créé
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un enseignant:", error);
    throw error; // Relance l'erreur
  }
};

// Fonction pour mettre à jour un enseignant
export const updateEnseignant = async (id, enseignant) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, enseignant);
    return response.data; // Retourne les données mises à jour de l'enseignant
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'enseignant avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour supprimer un enseignant
export const deleteEnseignant = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Retourne la réponse de la suppression
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'enseignant avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour récupérer un enseignant par son id
export const getEnseignantById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Retourne les données de l'enseignant trouvé
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'enseignant avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};
