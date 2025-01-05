import axiosInstance from '../axiosapi/axiosInstance';

const API_URL = '/jours-feries';

// Fonction pour récupérer tous les jours fériés
export const getAllJoursFeries = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des jours fériés:', error);
    throw error;
  }
};

// Fonction pour ajouter un jour férié
export const createJourFerie = async (jourFerie) => {
  try {
    const response = await axiosInstance.post(API_URL, jourFerie);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un jour férié:", error);
    throw error;
  }
};

// Fonction pour mettre à jour un jour férié
export const updateJourFerie = async (id, jourFerie) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, jourFerie);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du jour férié avec id ${id}:`,
      error
    );
    throw error;
  }
};

// Fonction pour supprimer un jour férié
export const deleteJourFerie = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du jour férié avec id ${id}:`,
      error
    );
    throw error;
  }
};

// Fonction pour récupérer un jour férié par son id
export const getJourFerieById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du jour férié avec id ${id}:`,
      error
    );
    throw error;
  }
};

// Exportation de toutes les fonctions dans un objet
export const JourFerieService = {
  getAllJoursFeries,
  createJourFerie,
  updateJourFerie,
  deleteJourFerie,
  getJourFerieById,
};
