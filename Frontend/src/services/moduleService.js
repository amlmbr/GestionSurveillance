import axiosInstance from '../axiosapi/axiosInstance';

const API_URL = '/modules';

// Fonction pour récupérer tous les modules
export const getModules = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Retourne les données des modules
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    throw error; // Relance l'erreur pour la gérer plus haut
  }
};

// Fonction pour récupérer un module par son id
export const getModuleById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Retourne les données du module trouvé
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du module avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour ajouter un module
export const addModule = async (module) => {
  try {
    const response = await axiosInstance.post(API_URL, module);
    return response.data; // Retourne les données du module créé
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un module:", error);
    throw error; // Relance l'erreur
  }
};

// Fonction pour mettre à jour un module
export const updateModule = async (id, module) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, module);
    return response.data; // Retourne les données mises à jour du module
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du module avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour supprimer un module
export const deleteModule = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Retourne la réponse de la suppression
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du module avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};
